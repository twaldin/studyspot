"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@studyspot/ui/components/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@studyspot/ui/components/alert-dialog";
import { Button } from "@studyspot/ui/components/button";
import { Document } from "@/lib/types/Document";
import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { useDeveloperMode } from "@/contexts/developer-mode-context";
import { useDeleteDocument } from "@/hooks/api/documents";
import toast from "react-hot-toast";

interface DocumentCardProps {
  url: string;
  file: Document; // Changed from File to Document
  fileType: string;
}

// Dynamic PDF component that only loads on client side
function PDFPreview({ url, width }: { url: string; width: number }) {
  const [isClient, setIsClient] = useState(false);
  const [pdfComponents, setPdfComponents] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);

    // Only import react-pdf on client side
    if (typeof window !== "undefined") {
      import("react-pdf").then((reactPdf) => {
        // Set up worker only on client side to match react-pdf version
        reactPdf.pdfjs.GlobalWorkerOptions.workerSrc =
          `//unpkg.com/pdfjs-dist@${reactPdf.pdfjs.version}/build/pdf.worker.min.mjs`;

        setPdfComponents(reactPdf);
      }).catch((error) => {
        console.error("Failed to load react-pdf:", error);
      });
    }
  }, []);

  if (!isClient || !pdfComponents) {
    return (
      <div className="absolute bottom-[-80px] right-[0px] w-26 h-32 bg-gray-100 border border-gray-200 rounded-md shadow-sm rotate-6 opacity-80 z-0 flex items-center justify-center">
        <div className="text-xs text-gray-500">PDF Preview</div>
      </div>
    );
  }

  const { Document: PdfDocument, Page } = pdfComponents;

  return (
    <div className="absolute bottom-[-80px] right-[0px] w-32 h-32 bg-white border border-gray-200 rounded-md shadow-sm rotate-6 opacity-80 z-0 overflow-hidden">
      <PdfDocument file={url} loading={null} error="Failed to load PDF.">
        <Page pageNumber={1} width={width} />
      </PdfDocument>
    </div>
  );
}

// Higher-tier delete button component - using controlled dialog state
function DocumentDeleteButton({ 
  file, 
  isDeveloperModeEnabled 
}: { 
  file: Document;
  isDeveloperModeEnabled: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const deleteDocumentMutation = useDeleteDocument();

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation(); // Stop all event propagation
    console.log('Delete button clicked for:', file.file_name);
    setIsDialogOpen(true);
  };

  const handleDeleteDocument = () => {
    deleteDocumentMutation.mutate(file.id, {
      onSuccess: (result) => {
        toast.success(`Successfully deleted ${result.fileName}`);
        setIsDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to delete document");
        setIsDialogOpen(false);
      },
    });
  };

  if (!isDeveloperModeEnabled) return null;

  return (
    <>
      {/* Simple button without AlertDialogTrigger */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-50 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
        onClick={handleButtonClick}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{ pointerEvents: 'auto' }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Controlled dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{file.file_name}" and all associated content. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDocument}
              disabled={deleteDocumentMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteDocumentMutation.isPending
                ? "Deleting..."
                : "Delete Document"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function DocumentCard({ url, file, fileType }: DocumentCardProps) {
  // Fixed width for PDF preview (matches w-32 = 128px)
  const PDF_PREVIEW_WIDTH = 128;
  const { isDeveloperModeEnabled } = useDeveloperMode();

  return (
    <div className="h-full relative group">
      {/* Top-tier delete button - rendered first, highest priority */}
      <DocumentDeleteButton 
        file={file} 
        isDeveloperModeEnabled={isDeveloperModeEnabled} 
      />
      
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="h-full text-blue-600 block"
      >
        <Card className="h-full relative overflow-hidden transition-colors hover:bg-accent py-3">
          <CardHeader className="pb-6 relative z-10">
            <CardTitle className="text-sm leading-tight">
              {(file.file_name || "Untitled Document").substring(
                0,
                (file.file_name || "Untitled Document").lastIndexOf("."),
              ) || file.file_name || "Untitled Document"}
            </CardTitle>
            <CardDescription className="text-xs">{fileType}</CardDescription>
          </CardHeader>

          {/* Document Preview */}
          {fileType === "pdf" && (
            <PDFPreview url={url} width={PDF_PREVIEW_WIDTH} />
          )}
        </Card>
      </a>
    </div>
  );
}
