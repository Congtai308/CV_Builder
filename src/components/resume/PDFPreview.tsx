"use client";

import { useEffect, useState, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import ResumePDF from "./ResumePDF";
import { ResumeData } from "@/lib/resume/types";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  resume: ResumeData;
}

export default function PDFPreview({ resume }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let objectUrl: string;

    async function generate() {
      const blob = await pdf(<ResumePDF resume={resume} />).toBlob();
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }

    generate();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [resume]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pdf-canvas-wrapper" ref={containerRef}>

      {url && containerWidth > 0 && (
        <Document
          file={url}
          loading={<div className="pdf-loading">Đang tạo PDF...</div>}
          error={<div className="pdf-loading">Không thể hiển thị PDF.</div>}
        >
          <Page
            pageNumber={1}
            width={containerWidth}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </Document>
      )}

    </div>
  );
}