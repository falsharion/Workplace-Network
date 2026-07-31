"use client";

import { CSSProperties } from "react";

interface BlobProps {
  /**
   * Positioning + sizing classes, e.g. "top-10 -left-20" or "-bottom-24 right-0".
   * These are relative to the nearest ancestor with `position: relative`,
   * so make sure the section wrapping this Blob has `relative overflow-hidden`.
   */
  className?: string;
  /** Diameter in pixels */
  size?: number;
  /** Gradient start color (any valid CSS color) */
  colorFrom?: string;
  /** Gradient end color (any valid CSS color) */
  colorTo?: string;
  /** Blur radius in pixels — higher = softer edges */
  blur?: number;
  /** Opacity from 0 to 1 */
  opacity?: number;
  /** How long one float cycle takes, in seconds */
  duration?: number;
  /** Extra inline styles if needed */
  style?: CSSProperties;
}

export function Blob({
  className = "",
  size = 400,
  colorFrom = "#a855f7",
  colorTo = "#6366f1",
  blur = 90,
  opacity = 0.35,
  duration = 14,
  style,
}: BlobProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`blob-float pointer-events-none absolute -z-0 rounded-full ${className}`}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 30% 30%, ${colorFrom}, ${colorTo})`,
          filter: `blur(${blur}px)`,
          opacity,
          animationDuration: `${duration}s`,
          ...style,
        }}
      />
      <style jsx global>{`
        @keyframes blob-float {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(24px, -32px) scale(1.06);
          }
          66% {
            transform: translate(-18px, 22px) scale(0.94);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .blob-float {
          animation-name: blob-float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }
      `}</style>
    </>
  );
}