"use client";

import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useClerk } from "@clerk/nextjs";

interface SettingsButtonProps {
  variant?: "sidebar" | "right-sidebar";
  className?: string;
}

export function SettingsButton({ variant = "right-sidebar", className }: SettingsButtonProps) {
  const { openUserProfile } = useClerk();

  const handleManageAccount = () => {
    openUserProfile();
  };

  if (variant === "sidebar") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={handleManageAccount}
          className="group-data-[collapsible=icon]:justify-center"
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">
            Settings
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // right-sidebar variant
  return (
    <Button 
      variant="secondary" 
      size="icon" 
      className={className}
      onClick={handleManageAccount}
    >
      <Settings className="h-4 w-4" />
    </Button>
  );
}