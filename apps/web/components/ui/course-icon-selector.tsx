"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  getAvailableCourseIcons, 
  CourseIconName, 
  getCourseIcon 
} from "@/lib/utils/course-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseIconSelectorProps {
  value: CourseIconName | null | undefined;
  onChange: (value: CourseIconName) => void;
  disabled?: boolean;
  className?: string;
}

export function CourseIconSelector({
  value,
  onChange,
  disabled = false,
  className,
}: CourseIconSelectorProps) {
  const availableIcons = getAvailableCourseIcons();
  const CurrentIcon = getCourseIcon(value);

  return (
    <Select
      value={value || "flask"}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue>
          <div className="flex items-center gap-2">
            <CurrentIcon className="h-4 w-4" />
            <span>
              {availableIcons.find(icon => icon.name === (value || "flask"))?.label || "Science"}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableIcons.map(({ name, icon: Icon, label }) => (
          <SelectItem key={name} value={name}>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface CourseIconDisplayProps {
  iconName: string | null | undefined;
  className?: string;
}

export function CourseIconDisplay({ iconName, className }: CourseIconDisplayProps) {
  const Icon = getCourseIcon(iconName);
  return <Icon className={cn("h-4 w-4", className)} />;
}