import { FlaskConical, Radical, Box, Music, PartyPopper, LucideIcon } from "lucide-react";

// Available course icon types
export const COURSE_ICON_NAMES = ["flask", "radical", "box", "music", "party"] as const;
export type CourseIconName = typeof COURSE_ICON_NAMES[number];

// Default icon when none is specified or icon is invalid
export const DEFAULT_COURSE_ICON: CourseIconName = "flask";

// Mapping of icon names to Lucide components
export const COURSE_ICONS: Record<CourseIconName, LucideIcon> = {
  flask: FlaskConical,
  radical: Radical,
  box: Box,
  music: Music,
  party: PartyPopper,
};

// Icon metadata for display
export const COURSE_ICON_INFO: Record<CourseIconName, { label: string; keywords: string[] }> = {
  flask: {
    label: "Science",
    keywords: ["chem", "bio", "phys", "lab", "science", "experiment"],
  },
  radical: {
    label: "Mathematics",
    keywords: ["math", "calc", "algebra", "stat", "geometry", "trig"],
  },
  box: {
    label: "Engineering",
    keywords: ["eng", "cs", "comp", "tech", "mech", "civil", "software"],
  },
  music: {
    label: "Arts",
    keywords: ["music", "art", "design", "theater", "dance", "film"],
  },
  party: {
    label: "General",
    keywords: [], // Default/catch-all
  },
};

/**
 * Get the Lucide icon component for a course icon name
 */
export function getCourseIcon(iconName: string | null | undefined): LucideIcon {
  if (!iconName || !isValidCourseIcon(iconName)) {
    return COURSE_ICONS[DEFAULT_COURSE_ICON];
  }
  return COURSE_ICONS[iconName];
}

/**
 * Check if a string is a valid course icon name
 */
export function isValidCourseIcon(iconName: string): iconName is CourseIconName {
  return COURSE_ICON_NAMES.includes(iconName as CourseIconName);
}

/**
 * Suggest an icon based on course code and title
 */
export function suggestCourseIcon(courseCode: string, courseTitle: string): CourseIconName {
  const searchText = `${courseCode} ${courseTitle}`.toLowerCase();
  
  // Check each icon's keywords
  for (const [iconName, info] of Object.entries(COURSE_ICON_INFO)) {
    for (const keyword of info.keywords) {
      if (searchText.includes(keyword)) {
        return iconName as CourseIconName;
      }
    }
  }
  
  // Default to "party" (general) if no match
  return "party";
}

/**
 * Get all available course icons for selection
 */
export function getAvailableCourseIcons(): Array<{ name: CourseIconName; icon: LucideIcon; label: string }> {
  return COURSE_ICON_NAMES.map(name => ({
    name,
    icon: COURSE_ICONS[name],
    label: COURSE_ICON_INFO[name].label,
  }));
}