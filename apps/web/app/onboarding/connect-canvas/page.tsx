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

export default function ConnectCanvasPage() {
  const [accessToken, setAccessToken] = React.useState("");
  const router = useRouter();

  const handleSkip = () => {
    // Navigate to courses without Canvas integration
    router.push("/courses?onboarding=success");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Canvas Integration</CardTitle>
            <CardDescription>
              You can connect StudySpot with your Canvas account for a better experience. 
              You can always do this later.
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
                  <h3 className="font-semibold text-sm">Go to Account Settings</h3>
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
                  <h3 className="font-semibold text-sm">Create a new access token</h3>
                  <p className="text-sm text-muted-foreground">
                    Name it whatever you want, leave the expiration date and time blank, and click Generate
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-sm font-bold">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Copy and paste the access token</h3>
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
            <Button 
              variant="secondary"
              onClick={handleSkip}
            >
              Skip for now
            </Button>
            <CanvasSyncManager accessToken={accessToken} />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
 