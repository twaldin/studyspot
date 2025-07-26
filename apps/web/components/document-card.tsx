"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Document } from "@/lib/types/DocumentTypes"; // Adjust path as needed
import { useEffect, useRef, useState } from "react";

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
    if (typeof window !== 'undefined') {
      import('react-pdf').then((reactPdf) => {
        // Set up worker only on client side to match react-pdf version
        reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${reactPdf.pdfjs.version}/build/pdf.worker.min.mjs`;
        
        setPdfComponents(reactPdf);
      }).catch((error) => {
        console.error('Failed to load react-pdf:', error);
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

export function DocumentCard({ url, file, fileType }: DocumentCardProps) {
  // Fixed width for PDF preview (matches w-32 = 128px)
  const PDF_PREVIEW_WIDTH = 128;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="h-full text-blue-600"
    >
      <Card className="h-full relative overflow-hidden transition-colors hover:bg-accent">
        <CardHeader className="pb-3 relative z-10">
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
  );
}

