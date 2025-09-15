"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@studyspot/ui/components/dialog";
import { Button } from "@studyspot/ui/components/button";
import { Input } from "@studyspot/ui/components/input";
import { Label } from "@studyspot/ui/components/label";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface RequestSchoolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestSchoolDialog({
  open,
  onOpenChange,
}: RequestSchoolDialogProps) {
  const [schoolName, setSchoolName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!schoolName.trim()) {
      toast.error("Please enter a school name.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/school-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schoolName: schoolName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred.");
      }

      toast.success("School request submitted successfully!");
      setSchoolName("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a School</DialogTitle>
          <DialogDescription>
            If you can't find your school, you can request for it to be added.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="school-name" className="text-right">
              School Name
            </Label>
            <Input
              id="school-name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. University of California, Berkeley"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
