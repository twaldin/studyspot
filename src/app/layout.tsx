import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkThemeProvider } from "@/components/clerk-theme-provider";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/lib/providers/query-provider";

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  variable: "--font-crimson-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudySpot UI",
  description: "StudySpot UI Testing Environment",
};

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
              {children}
            </ClerkThemeProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
