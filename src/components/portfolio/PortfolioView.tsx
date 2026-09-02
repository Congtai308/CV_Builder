"use client";

import { useState } from "react";
import Link from "next/link";

import PortfolioBackground from "@/components/portfolio/PortfolioBackground";
import FloatingResume from "@/components/portfolio/FloatingResume";
import PDFPreview from "@/components/resume/PDFPreview";
import { ResumeData } from "@/lib/resume/types";
interface Props {
  resume: ResumeData;
}

export default function PortfolioView({ resume }: Props) {
  const [previewMode, setPreviewMode] = useState<"web" | "pdf">("web");

  return (
    <main className="portfolio-page">
      <PortfolioBackground />

      <header className="portfolio-toolbar">
        <div className="portfolio-toolbar-left">
          <Link href="/builder" className="portfolio-cta-inline">
            + Tạo CV
          </Link>

          <Link href="/huong-dan" className="portfolio-guide-link">
            Hướng dẫn
          </Link>
        </div>

        <h1 className="portfolio-brand">PORTFOLIO</h1>

        <div className="portfolio-mode-toggle">
          <button
            className={
              previewMode === "web" ? "portfolio-mode active" : "portfolio-mode"
            }
            onClick={() => setPreviewMode("web")}
          >
            Web Preview
          </button>

          <button
            className={
              previewMode === "pdf" ? "portfolio-mode active" : "portfolio-mode"
            }
            onClick={() => setPreviewMode("pdf")}
          >
            PDF View
          </button>
        </div>
      </header>

      <div className="portfolio-content">
        {previewMode === "web" ? (
          <FloatingResume resume={resume} />
        ) : (
            <PDFPreview resume={resume} />
        )}
      </div>
    </main>
  );
}
