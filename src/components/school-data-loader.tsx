"use client";

import * as React from "react";
import { useUserSchool } from "@/hooks/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function SchoolDataLoader({ children }: { children: React.ReactNode }) {
  const { data: school, isLoading, isError } = useUserSchool();
  const { user, isLoaded } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded && user && !school && !isLoading) {
      // If user is loaded, but school is not, and we are not currently loading,
      // it means they need to select a school.
      router.push("/onboarding/select-school");
    }
  }, [isLoaded, user, school, isLoading, router]);

  if (isLoading || !isLoaded || !school) {
    return null;
  }

  return <>{children}</>;
}
