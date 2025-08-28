"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@studyspot/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@studyspot/ui/components/card";
import { Input } from "@studyspot/ui/components/input";
import { Label } from "@studyspot/ui/components/label";
import { CanvasSyncManager } from "@/components/canvas-sync-manager";
import { Toaster, toast } from "react-hot-toast";
import { useCanvas } from "@/contexts/canvas-context";
import { useUserSchool } from "@/hooks/api/user";
import { useDebounce } from "use-debounce";

export default function ConnectCanvasPage() {
  const [accessToken, setAccessToken] = React.useState("");
  const [isValid, setIsValid] = React.useState<boolean | null>(null);
  const [canvasProfile, setCanvasProfile] = React.useState<any | null>(null);
  const [schoolsMatch, setSchoolsMatch] = React.useState<boolean | null>(null);
  const [debouncedAccessToken] = useDebounce(accessToken, 500);
  const router = useRouter();
  const { data: userSchool, isLoading: isLoadingSchool } = useUserSchool();
  const { setAccessToken: setCanvasToken } = useCanvas();

  // Redirect if school doesn't have Canvas integration
  React.useEffect(() => {
    if (!isLoadingSchool && userSchool) {
      // Treat null as false for canvas_integration
      if (userSchool.canvas_integration !== true) {
        router.push("/courses?onboarding=success");
      }
    }
  }, [userSchool, isLoadingSchool, router]);

  const handleSkip = () => {
    router.push("/courses?onboarding=success");
  };

  const validateToken = React.useCallback(async (token: string) => {
    if (!token) {
      setIsValid(null);
      setCanvasProfile(null);
      setSchoolsMatch(null);
      return;
    }
    const toastId = toast.loading("Validating token...");
    try {
      const response = await fetch("/api/canvas/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token }),
      });
      const data = await response.json();

      if (response.ok && data.valid) {
        setCanvasProfile(data.profile);

        if (userSchool && data.profile && data.profile.primary_email) {
          const canvasSchoolDomain = data.profile.primary_email.split('@')[1];
          
          if (userSchool.domain === canvasSchoolDomain) {
            toast.success("Token is valid and your school matches!", { id: toastId });
            setIsValid(true);
            setSchoolsMatch(true);
            setCanvasToken(token); // Set the token in the context
          } else {
            toast.error(`This token is for a different school. Please use a token from ${userSchool.name}.`, { id: toastId });
            setIsValid(false);
            setSchoolsMatch(false);
          }
        } else {
          toast.error("Could not determine the school from your Canvas token.", { id: toastId });
          setIsValid(false);
          setSchoolsMatch(false);
        }
      } else {
        toast.error("Token is invalid.", { id: toastId });
        setIsValid(false);
        setCanvasProfile(null);
        setSchoolsMatch(null);
      }
    } catch (error) {
      toast.error("Failed to validate token.", { id: toastId });
      setIsValid(false);
      setCanvasProfile(null);
      setSchoolsMatch(null);
    }
  }, [userSchool, setCanvasToken]);

  React.useEffect(() => {
    if (debouncedAccessToken) {
      validateToken(debouncedAccessToken);
    }
  }, [debouncedAccessToken, validateToken]);

  // Show loading state while checking Canvas integration
  if (isLoadingSchool) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render if school doesn't have Canvas integration (will redirect)
  if (userSchool && userSchool.canvas_integration !== true) {
    return null;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Toaster />
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Canvas Integration</CardTitle>
            <CardDescription>
              You can connect StudySpot with your Canvas account for a better
              experience. You can always do this later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step-by-step instructions */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Sign in to Canvas</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to your Canvas account and sign in
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">
                    Go to Account Settings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Navigate to Account → Settings → Approved Integrations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">
                    Create a new access token
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Name it whatever you want, leave the expiration date and
                    time blank, and click Generate
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-sm font-bold">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">
                    Copy and paste the access token
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Copy the generated token and paste it into the box below
                  </p>
                </div>
              </div>
            </div>

            {/* Access token input */}
            <div className="space-y-2">
              <Label htmlFor="access-token">Canvas Access Token</Label>
              <Input
                id="access-token"
                placeholder="Paste your Canvas access token here"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleSkip}>
              Skip for now
            </Button>
            <CanvasSyncManager accessToken={accessToken} disabled={!isValid || !schoolsMatch} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
 