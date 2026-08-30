"use client";

import { useEffect, useRef, useState } from "react";

const PARTICLE_COUNT = 28;

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface ClickBurst {
  id: number;
  x: number;
  y: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    duration: 18 + Math.random() * 14,
    delay: Math.random() * -20,
    opacity: 0.15 + Math.random() * 0.35,
  }));
}

export default function PortfolioBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [bursts, setBursts] = useState<ClickBurst[]>([]);
  const frame = useRef<number | undefined>(undefined);
  const burstIdRef = useRef(0);

  useEffect(() => {
    setParticles(generateParticles());
  }, []);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      if (frame.current) cancelAnimationFrame(frame.current);

      frame.current = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setMouse({ x, y });
        setCursorPos({ x: e.clientX, y: e.clientY });
      });
    }

    function handleClick(e: MouseEvent) {
      const id = burstIdRef.current++;

      setBursts((prev) => [
        ...prev,
        { id, x: e.clientX, y: e.clientY },
      ]);

      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 1400);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="portfolio-bg" aria-hidden="true">

      <div
        className="portfolio-cursor-glow"
        style={{
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
        }}
      />

      <div className="portfolio-grid" aria-hidden="true" />

      <div
        className="portfolio-aurora-wrapper"
        style={{
          transform: `translate(${mouse.x * 8}px, ${mouse.y * 6}px)`,
        }}
      >
        <div className="portfolio-aurora portfolio-aurora-1" />
      </div>

      <div
        className="portfolio-aurora-wrapper"
        style={{
          transform: `translate(${mouse.x * -6}px, ${mouse.y * -4}px)`,
        }}
      >
        <div className="portfolio-aurora portfolio-aurora-2" />
      </div>

      <div
        className="portfolio-orb portfolio-orb-blue"
        style={{
          transform: `translate(${mouse.x * 14}px, ${mouse.y * 14}px)`,
        }}
      />

      <div
        className="portfolio-orb portfolio-orb-purple"
        style={{
          transform: `translate(${mouse.x * -10}px, ${mouse.y * -10}px)`,
        }}
      />

      <div className="portfolio-beam portfolio-beam-1" />
      <div className="portfolio-beam portfolio-beam-2" />

      {particles.map((p) => (
        <span
          key={p.id}
          className="portfolio-particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div
        className="portfolio-shard portfolio-shard-1"
        style={{
          transform: `translate(${mouse.x * 20}px, ${mouse.y * 12}px) rotate(18deg)`,
        }}
      />

      <div
        className="portfolio-shard portfolio-shard-2"
        style={{
          transform: `translate(${mouse.x * -16}px, ${mouse.y * -10}px) rotate(-24deg)`,
        }}
      />

      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="portfolio-click-burst"
          style={{
            left: burst.x,
            top: burst.y,
          }}
        />
      ))}

    </div>
  );
}