"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Document } from "@/lib/types/DocumentTypes"; // Adjust path as needed
import { useEffect, useRef, useState } from "react";
import { Document as PdfDocument, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();


interface DocumentCardProps {
  url: string;
  file: Document; // Changed from File to Document
  fileType: string;
}

export function DocumentCard({ url, file, fileType }: DocumentCardProps) {
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  const [pdfWidth, setPdfWidth] = useState<number | null>(null);

  useEffect(() => {
    if (pdfWrapperRef.current) {
      setPdfWidth(pdfWrapperRef.current.clientWidth);
    }
  }, []);

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
          <div 
            ref={pdfWrapperRef}
            className="absolute bottom-[-80px] right-[0px] w-26 h-32 bg-white border border-gray-200 rounded-md shadow-sm rotate-6 opacity-80 z-0 overflow-hidden">
            {pdfWidth && (
              <PdfDocument file={url} loading={null} error="Failed to load PDF.">
                <Page pageNumber={1} width={pdfWidth} />
              </PdfDocument>
            )}
          </div>
        )}
      </Card>
    </a>
  );
}

