"use client";

import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRemoveSchool, useClearUserCourses } from "@/hooks/api";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/api/base";
import logger from "@/lib/logger";
import toast from "react-hot-toast";

interface UserButtonProps {
  variant?: "sidebar" | "right-sidebar";
  className?: string;
}

export function UserButton({ variant = "right-sidebar", className }: UserButtonProps) {
  const { openUserProfile, signOut } = useClerk();
  const { user } = useUser();
  const removeSchoolMutation = useRemoveSchool();
  const clearUserCoursesMutation = useClearUserCourses();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignOut = () => {
    signOut();
  };

  const handleManageAccount = () => {
    openUserProfile();
  };

  const handleRemoveSchool = async () => {
    if (removeSchoolMutation.isPending || clearUserCoursesMutation.isPending) {
      return;
    }

    const confirmed = window.confirm(
      variant === "sidebar" 
        ? "Are you sure you want to remove your school selection? You will be redirected to select a new school. Your chats will be preserved and available when you return to this school."
        : "Are you sure you want to switch schools? Your course enrollments will be cleared, but your chats will be preserved and available if you return to this school."
    );

    if (!confirmed) return;

    try {
      if (variant === "right-sidebar") {
        // Clear joined and selected courses from user metadata
        await clearUserCoursesMutation.mutateAsync();
      }

      // Remove the school association from the user
      await removeSchoolMutation.mutateAsync();

      // Clear backend user cache
      if (user?.id) {
        await fetch('/api/user/cache', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        }).catch(() => {
          logger.warn("Failed to clear backend user cache during school removal");
        });
      }

      // Force refresh the user object to get updated metadata
      await user?.reload();

      if (variant === "sidebar") {
        // Invalidate all queries that depend on the school
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryKeys.user.school(),
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.courses.all,
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.chats.all,
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.documents.all,
          }),
        ]);
      } else {
        // Clear the entire react-query cache to ensure no stale data
        await queryClient.clear();
      }

      // Redirect to school selection
      router.push("/onboarding/select-school");
    } catch (error) {
      logger.error({ error }, variant === "sidebar" ? "Error removing school" : "Error switching schools");
      if (variant === "sidebar") {
        alert("Failed to remove school selection. Please try again.");
      } else {
        toast.error("Failed to switch schools. Please try again.");
      }
    }
  };

  if (variant === "sidebar") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="group-data-[collapsible=icon]:justify-center w-full"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  {user?.fullName || ""}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 mb-2" side="top" align="start">
          <DropdownMenuItem onClick={handleManageAccount}>
            Manage Account
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRemoveSchool}>
            Change Schools
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // right-sidebar variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className={`gap-2 ${className || ""}`}>
          <User className="h-4 w-4" />
          {user?.fullName || ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleManageAccount}>
          Manage Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRemoveSchool}>
          Change Schools
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}