"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@studyspot/ui/components/dialog";
import { Button } from "@studyspot/ui/components/button";
import { Input } from "@studyspot/ui/components/input";
import { Label } from "@studyspot/ui/components/label";
import { useUserSchool } from "@/hooks/api/user";
import { useDebounce } from "use-debounce";
import { toast } from "react-hot-toast";
import { CanvasCourseSelectionView } from "./canvas-course-selection-view";
import { CanvasCourse } from "@/lib/services/canvas/canvas.service";
import { useSyncCanvasCourses } from "@/hooks/api/canvas";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/api/base";
import { useCanvas } from "@/contexts/canvas-context";
import { useUser } from "@clerk/nextjs";

interface CanvasSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SyncStep = "enterToken" | "selectCourses" | "syncing";

export function CanvasSyncDialog({ open, onOpenChange }: CanvasSyncDialogProps) {
  const [step, setStep] = React.useState<SyncStep>("enterToken");
  const { accessToken: cachedToken, setAccessToken: setCanvasToken } = useCanvas();
  const [accessToken, setAccessToken] = React.useState("");
  const [isValid, setIsValid] = React.useState<boolean | null>(null);
  const [schoolsMatch, setSchoolsMatch] = React.useState<boolean | null>(null);
  const [debouncedAccessToken] = useDebounce(accessToken, 500);
  const { data: userSchool } = useUserSchool();
  const syncMutation = useSyncCanvasCourses();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const finalAccessToken = cachedToken || accessToken;

  React.useEffect(() => {
    if (open && cachedToken) {
      setStep("selectCourses");
    } else if (open) {
      setStep("enterToken");
    }
  }, [open, cachedToken]);

  const validateToken = React.useCallback(async (token: string) => {
    if (!token) {
      setIsValid(null);
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
        if (userSchool && data.profile && data.profile.primary_email) {
          const canvasSchoolDomain = data.profile.primary_email.split('@')[1];
          
          if (userSchool.domain === canvasSchoolDomain) {
            toast.success("Token is valid!", { id: toastId });
            setIsValid(true);
            setSchoolsMatch(true);
            setCanvasToken(token);
            setStep("selectCourses");
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
        setSchoolsMatch(null);
      }
    } catch (error) {
      toast.error("Failed to validate token.", { id: toastId });
      setIsValid(false);
      setSchoolsMatch(null);
    }
  }, [userSchool, setCanvasToken]);

  React.useEffect(() => {
    if (debouncedAccessToken) {
      validateToken(debouncedAccessToken);
    }
  }, [debouncedAccessToken, validateToken]);

  const handleSync = (selectedCourses: { course: CanvasCourse; contentTypes: string[] }[]) => {
    setStep("syncing");
    syncMutation.mutate({ courses: selectedCourses, accessToken: finalAccessToken }, {
      onSuccess: async () => {
        toast.success('Courses synced successfully! Updating your data...');
        await user?.reload();
        await queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
        await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
        await queryClient.refetchQueries({ queryKey: queryKeys.user.all, exact: true });
        await queryClient.refetchQueries({ queryKey: queryKeys.courses.all, exact: true });
        toast.success('Sync complete!');
        onOpenChange(false);
        setStep("enterToken");
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to sync courses. Please try again.');
        setStep("selectCourses");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 'enterToken' ? 'Sync with Canvas' : 'Select Courses'}
          </DialogTitle>
          <DialogDescription>
            {step === 'enterToken'
              ? 'Enter your Canvas access token to sync your courses.'
              : 'Choose which courses and content types you want to sync.'}
          </DialogDescription>
        </DialogHeader>
        {step === "enterToken" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-token">Canvas Access Token</Label>
              <Input
                id="access-token"
                placeholder="Paste your Canvas access token here"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
            </div>
          </div>
        )}
        {step === "selectCourses" && (
          <CanvasCourseSelectionView
            onSync={handleSync}
            isProcessing={step === "syncing"}
            accessToken={finalAccessToken}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
