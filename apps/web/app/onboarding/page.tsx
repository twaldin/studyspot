"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first step of onboarding
    router.push("/onboarding/select-school");
  }, [router]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to onboarding...</p>
      </div>
    </div>
  );
}
