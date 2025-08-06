"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@studyspot/ui/components/dialog"
import { Button } from "@studyspot/ui/components/button"
import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

interface OnboardingSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OnboardingSuccessDialog({
  open,
  onOpenChange,
}: OnboardingSuccessDialogProps) {
  const router = useRouter()

  const handleContinue = () => {
    onOpenChange(false)
    router.push("/courses")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-2xl">
            You're all set!
          </DialogTitle>
          <DialogDescription className="text-center">
            You're about to accelerate your learning.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="font-bold">1</span>
            </div>
            <div>
              <h3 className="font-semibold">Add your courses</h3>
              <p className="text-sm text-muted-foreground">
                Students have likely already populated your courses. If not,
                create them yourself.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="font-bold">2</span>
            </div>
            <div>
              <h3 className="font-semibold">Ask a question</h3>
              <p className="text-sm text-muted-foreground">
                Create a new chat, and ask studyspot about your course or to
                help you understand a challenging topic!
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="primary" onClick={handleContinue} className="w-full">
            Let's Go
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 