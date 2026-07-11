"use client";

import { motion } from "framer-motion";
import type { Vertex } from "@/types/gps-calculator";

interface PolygonOverlayProps {
  vertices?: Vertex[];
  liveAreaLabel?: string;
  labelPosition?: { top: string; left: string };
}

const defaultVertices: Vertex[] = [
  { id: "v1", top: "38%", left: "51%" },
  { id: "v2", top: "31%", left: "82%" },
  { id: "v3", top: "56%", left: "94%" },
  { id: "v4", top: "68%", left: "60%" },
];

// Builds an SVG path string (in percentage-based viewBox 0-100) from vertices
function buildPath(vertices: Vertex[]) {
  const toNum = (v: string) => parseFloat(v);
  return (
    vertices
      .map((v, i) => `${i === 0 ? "M" : "L"}${toNum(v.left)},${toNum(v.top)}`)
      .join(" ") + " Z"
  );
}

export default function PolygonOverlay({
  vertices = defaultVertices,
  liveAreaLabel = "12.4 Acres",
  labelPosition = { top: "48%", left: "72%" },
}: PolygonOverlayProps) {
  const path = buildPath(vertices);

  return (
    <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <motion.path
          d={path}
          fill="rgba(13, 99, 27, 0.18)"
          stroke="#0d631b"
          strokeWidth="0.5"
          strokeDasharray="2 1.2"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
        {vertices.map((v) => (
          <circle
            key={v.id}
            cx={parseFloat(v.left)}
            cy={parseFloat(v.top)}
            r="0.9"
            fill="white"
            stroke="#0d631b"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap"
        style={{ top: labelPosition.top, left: labelPosition.left }}
      >
        {liveAreaLabel}
      </motion.div>
    </div>
  );
}
