"use client";

import { useRef, useState } from "react";
import ResumePreview from "@/components/resume/ResumePreview";
import { ResumeData } from "@/lib/resume/types";

interface Props {
  resume: ResumeData;
}

export default function FloatingResume({ resume }: Props) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    setTilt({ x: px * 4, y: py * -4 });
  }

  function resetTilt() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div className="portfolio-stage">

      <div className="portfolio-ring" aria-hidden="true" />

      <div
        ref={cardRef}
        className="portfolio-card-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        }}
      >
        <div className="portfolio-card">
          <ResumePreview resume={resume} />
        </div>
      </div>

      <div className="portfolio-platform" aria-hidden="true" />

    </div>
  );
}