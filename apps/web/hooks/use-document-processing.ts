import { useCallback, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export interface ProcessingFile {
  id: string;
  name: string;
  status: "processing" | "success" | "failed";
  error?: string;
  reason?: string;
  progress?: string; // Current processing step
}

export interface DocumentProcessingState {
  processingFiles: ProcessingFile[];
  isProcessing: boolean;
  hasFinished: boolean;
  toastShown: boolean;
}

export function useDocumentProcessing() {
  const [state, setState] = useState<DocumentProcessingState>({
    processingFiles: [],
    isProcessing: false,
    hasFinished: false,
    toastShown: false,
  });

  const startProcessing = useCallback(
    (files: { id: string; name: string }[]) => {
      setState({
        processingFiles: files.map((file) => ({
          ...file,
          status: "processing",
        })),
        isProcessing: true,
        hasFinished: false,
        toastShown: false,
      });
    },
    [],
  );

  const markFileComplete = useCallback(
    (fileId: string, success: boolean, error?: string, reason?: string) => {
      setState((prev) => {
        const updatedFiles = prev.processingFiles.map((file) =>
          file.id === fileId
            ? {
              ...file,
              status: (success ? "success" : "failed") as "success" | "failed",
              error,
              reason,
              progress: undefined, // Clear progress when complete
            }
            : file
        );

        const remainingProcessing = updatedFiles.filter((f) =>
          f.status === "processing"
        );
        const isStillProcessing = remainingProcessing.length > 0;

        return {
          processingFiles: updatedFiles,
          isProcessing: isStillProcessing,
          hasFinished: prev.hasFinished,
          toastShown: prev.toastShown,
        };
      });
    },
    [],
  );

  const updateFileProgress = useCallback(
    (fileId: string, progress: string) => {
      setState((prev) => ({
        ...prev,
        processingFiles: prev.processingFiles.map((file) =>
          file.id === fileId
            ? { ...file, progress }
            : file
        ),
      }));
    },
    [],
  );

  const finishProcessing = useCallback(() => {
    setState((prev) => {
      // Prevent multiple calls
      if (prev.hasFinished || prev.toastShown) {
        return prev;
      }

      return {
        ...prev,
        isProcessing: false,
        hasFinished: true,
        toastShown: true, // This will trigger the useEffect
      };
    });
  }, []);

  useEffect(() => {
    if (state.isProcessing && state.processingFiles.length > 0 && !state.hasFinished) {
      if (state.processingFiles.length === 1) {
        const file = state.processingFiles[0];
        const message = file.progress 
          ? `${file.name}: ${file.progress}`
          : `Processing ${file.name}`;
        toast.loading(message, {
          id: "processing-files",
          duration: Infinity,
        });
      } else {
        const processingCount = state.processingFiles.filter(f => f.status === "processing").length;
        toast.loading(`Processing ${processingCount} of ${state.processingFiles.length} files`, {
          id: "processing-files",
          duration: Infinity,
        });
      }
    } else if (state.hasFinished) {
      toast.dismiss("processing-files");
      const { processingFiles } = state;
      const totalFiles = processingFiles.length;
      if (totalFiles > 0) {
        const successCount = processingFiles.filter(
          (f) => f.status === "success"
        ).length;
        const failedCount = totalFiles - successCount;

        if (totalFiles === 1) {
          const file = processingFiles[0];
          if (file.status === "success") {
            toast.success(`${file.name} processed successfully`, {
              duration: 4000,
            });
          } else {
            const errorMessage =
              file.reason || file.error || "Processing failed";
            toast.error(`${file.name}: ${errorMessage}`, {
              duration: 6000,
            });
          }
        } else {
          if (failedCount === 0) {
            toast.success(`All ${totalFiles} files processed successfully!`, {
              duration: 4000,
            });
          } else if (successCount === 0) {
            toast.error(`All ${totalFiles} files failed to process`, {
              duration: 6000,
            });
          } else {
            toast(`${successCount} succeeded, ${failedCount} failed`, {
              duration: 5000,
            });
          }
        }
      }
      // Reset state after showing toast
      setState({
        processingFiles: [],
        isProcessing: false,
        hasFinished: false,
        toastShown: false,
      });
    }
  }, [state.isProcessing, state.hasFinished, state.processingFiles]);

  const clearProcessing = useCallback(() => {
    // Dismiss the single processing toast
    toast.dismiss("processing-files");

    setState({
      processingFiles: [],
      isProcessing: false,
      hasFinished: false,
      toastShown: false,
    });
  }, []);

  return {
    state,
    startProcessing,
    markFileComplete,
    updateFileProgress,
    finishProcessing,
    clearProcessing,
  };
}