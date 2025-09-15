"use client";

import React from "react";
import { User } from "lucide-react";
import { Button } from "@studyspot/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@studyspot/ui/components/dropdown-menu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRemoveSchool } from "@/hooks/api";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import logger from "@/lib/logger";
import toast from "react-hot-toast";
import { CacheManager } from "@/lib/utils/cache-manager";

interface UserButtonProps {
  variant?: "sidebar" | "right-sidebar";
  className?: string;
}

export function UserButton({ variant = "right-sidebar", className }: UserButtonProps) {
  const { openUserProfile, signOut } = useClerk();
  const { user } = useUser();
  const removeSchoolMutation = useRemoveSchool();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignOut = () => {
    signOut();
  };

  const handleManageAccount = () => {
    openUserProfile();
  };

  const handleRemoveSchool = async () => {
    if (removeSchoolMutation.isPending) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to switch schools? This will clear all your current data and redirect you to select a new school."
    );

    if (!confirmed) return;

    try {
      logger.info({ userId: user?.id }, "Starting school switch flow");

      // Step 1: Clear ALL caches completely
      await CacheManager.clearAllCaches(user?.id, queryClient);

      // Step 2: Remove school from backend (this also clears courses)
      await removeSchoolMutation.mutateAsync();

      // Step 3: Force user reload to get fresh JWT 
      await user?.reload();
      
      // Step 4: Small delay to ensure reload completes before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Step 5: Navigate to school selection 
      router.push("/onboarding/select-school");

    } catch (error) {
      logger.error({ error }, "Error during school switch");
      toast.error("Failed to switch schools. Please try again.");
    }
  };

  if (variant === "sidebar") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="cursor-pointer group-data-[collapsible=icon]:justify-center w-full"
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
          <DropdownMenuItem onClick={() => router.push('/subscriptions')}>
            Subscription
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRemoveSchool}>
            Change Schools
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open('/terms', '_blank')}>
            Terms and Conditions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open('/privacypolicy', '_blank')}>
            Privacy Policy
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
        <Button variant="secondary" className={`cursor-pointer gap-2 ${className || ""}`}>
          <User className="h-4 w-4" />
          {user?.fullName || ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleManageAccount}>
          Manage Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/subscriptions')}>
          Subscription
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRemoveSchool}>
          Change Schools
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open('/terms', '_blank')}>
          Terms and Conditions
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open('/privacypolicy', '_blank')}>
          Privacy Policy
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}