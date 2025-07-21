"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ClerkThemeProviderProps {
  children: React.ReactNode;
}

export function ClerkThemeProvider({ children }: ClerkThemeProviderProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return ClerkProvider without theme on server/initial render
    return <ClerkProvider>{children}</ClerkProvider>;
  }

  // Determine if we should use dark theme
  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <ClerkProvider
      appearance={{
        baseTheme: isDark ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  );
} 