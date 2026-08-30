"use client";

import {
  PDFViewer,
} from "@react-pdf/renderer";

import ResumePDF from "./ResumePDF";

import { ResumeData } from "@/lib/resume/types";

interface Props {
  resume: ResumeData;
}

export default function PDFPreview({
  resume,
}: Props) {
  return (
    <PDFViewer
      width="100%"
      height="100%"
      showToolbar={false}
      style={{
        border: "none",
      }}
    >
      <ResumePDF resume={resume} />
    </PDFViewer>
  );
}