"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

interface DarkModeButtonProps {
  variant?: "sidebar" | "right-sidebar";
  className?: string;
}

export function DarkModeButton({ variant = "right-sidebar", className }: DarkModeButtonProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (variant === "sidebar") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={toggleTheme}
          className="cursor-pointer group-data-[collapsible=icon]:justify-center"
        >
          {isDark ? (
            <Sun className="h-4 w-4 shrink-0" />
          ) : (
            <Moon className="h-4 w-4 shrink-0" />
          )}
          <span className="group-data-[collapsible=icon]:hidden">
            {isDark ? "Light Mode" : "Dark Mode"}
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
      className={`cursor-pointer ${className}`}
      onClick={toggleTheme}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}