import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkThemeProvider } from "@/components/clerk-theme-provider";
import { cn } from "@studyspot/ui/lib/utils";
import { QueryProvider } from "@/lib/providers/query-provider";
import { DeveloperModeProvider } from "@/contexts/developer-mode-context";
import { ConditionalLayout } from "./conditional-layout";
import { CanvasProvider } from "@/contexts/canvas-context";

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  variable: "--font-crimson-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudySpot",
  description: "StudySpot",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

// Remove force-dynamic as it can cause routing issues with OpenNext.js
// Let Next.js automatically determine rendering mode based on usage

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(crimsonText.variable)}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ClerkThemeProvider>
              <DeveloperModeProvider>
                <CanvasProvider>
                  <ConditionalLayout>
                    {children}
                  </ConditionalLayout>
                </CanvasProvider>
              </DeveloperModeProvider>
            </ClerkThemeProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
