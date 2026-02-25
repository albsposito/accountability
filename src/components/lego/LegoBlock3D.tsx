"use client";

import { useEffect, useRef, CSSProperties } from "react";
import { motion, useAnimation } from "framer-motion";
import { darken, lighten } from "@/lib/utils";
import type { BlueprintLayer } from "@/lib/buildings";

// One brick unit in pixels
const U = 10;
// Layer height in pixels
const H = 9;
// Stud diameter
const STUD = 5;

interface LegoBlock3DProps {
  layer: BlueprintLayer;
  maxWidth: number;
  maxDepth: number;
  color: string;
  index: number;
  filled: boolean;
  layerHeight?: number;
  style?: CSSProperties;
}

/**
 * Renders a single volumetric 3D slab with front, right, and top faces.
 * The top face contains a grid of studs (width × depth).
 */
function Slab({
  w,
  d,
  color,
  filled,
  tx,
  tz,
  isSpire,
  h = H,
}: {
  w: number; // width in units
  d: number; // depth in units
  color: string;
  filled: boolean;
  tx: number; // X offset in px
  tz: number; // Z offset in px
  isSpire?: boolean;
  h?: number; // layer height override
}) {
  const pw = w * U;
  const pd = d * U;
  const ph = isSpire ? Math.round(h * 1.5) : h;

  if (!filled) {
    return (
      <div
        style={{
          position: "absolute",
          width: pw,
          height: ph,
          left: tx,
          bottom: 0,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front face wireframe */}
        <div
          style={{
            position: "absolute",
            width: pw,
            height: ph,
            border: "1px dashed var(--border)",
            borderRadius: 1,
            background: "var(--block-empty)",
            transform: `translateZ(${pd}px)`,
            backfaceVisibility: "hidden",
          }}
        />
        {/* Right face wireframe */}
        <div
          style={{
            position: "absolute",
            width: pd,
            height: ph,
            right: 0,
            border: "1px dashed var(--border)",
            borderRadius: 1,
            background: "var(--block-empty)",
            transformOrigin: "100% 50%",
            transform: "rotateY(90deg)",
            backfaceVisibility: "hidden",
          }}
        />
        {/* Top face wireframe */}
        <div
          style={{
            position: "absolute",
            width: pw,
            height: pd,
            top: 0,
            border: "1px dashed var(--border)",
            borderRadius: 1,
            background: "var(--block-empty)",
            transformOrigin: "50% 0%",
            transform: "rotateX(90deg)",
            backfaceVisibility: "hidden",
          }}
        />
      </div>
    );
  }

  const frontColor = color;
  const rightColor = darken(color, 0.2);
  const topColor = lighten(color, 0.15);
  const studColor = lighten(color, 0.25);

  // Stud positions on the top face
  const studs: { x: number; y: number }[] = [];
  for (let row = 0; row < d; row++) {
    for (let col = 0; col < w; col++) {
      studs.push({
        x: col * U + U / 2,
        y: row * U + U / 2,
      });
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        width: pw,
        height: ph,
        left: tx,
        bottom: 0,
        transformStyle: "preserve-3d",
      }}
    >
      {/* FRONT face — translated forward along Z by full depth */}
      <div
        style={{
          position: "absolute",
          width: pw,
          height: ph,
          backgroundColor: frontColor,
          borderRadius: 1,
          transform: `translateZ(${pd}px)`,
          backfaceVisibility: "hidden",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.2)",
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent ${U - 0.5}px,
            rgba(0,0,0,0.06) ${U - 0.5}px,
            rgba(0,0,0,0.06) ${U}px
          )`,
        }}
      />

      {/* RIGHT face — hinged on the right edge of the front face */}
      <div
        style={{
          position: "absolute",
          width: pd,
          height: ph,
          right: 0,
          backgroundColor: rightColor,
          borderRadius: 1,
          transformOrigin: "100% 50%",
          transform: "rotateY(90deg)",
          backfaceVisibility: "hidden",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.25)",
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent ${U - 0.5}px,
            rgba(0,0,0,0.06) ${U - 0.5}px,
            rgba(0,0,0,0.06) ${U}px
          )`,
        }}
      />

      {/* TOP face — hinged on the top edge, rotated to lie flat in XZ plane */}
      <div
        style={{
          position: "absolute",
          width: pw,
          height: pd,
          top: 0,
          backgroundColor: topColor,
          borderRadius: 1,
          transformOrigin: "50% 0%",
          transform: "rotateX(90deg)",
          backfaceVisibility: "hidden",
          boxShadow: "inset 0 0 3px rgba(0,0,0,0.06)",
        }}
      >
        {/* Grid of studs across the full W×D surface */}
        {studs.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: STUD,
              height: STUD,
              borderRadius: "50%",
              left: s.x - STUD / 2,
              top: s.y - STUD / 2,
              backgroundColor: studColor,
              boxShadow:
                "inset 0 -1px 1px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function LegoBlock3D({
  layer,
  maxWidth,
  maxDepth,
  color,
  index,
  filled,
  layerHeight,
  style,
}: LegoBlock3DProps) {
  const effectiveH = layerHeight ?? H;
  const controls = useAnimation();
  const prevFilled = useRef(filled);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      if (filled) {
        controls.start({
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: index * 0.06,
          },
        });
      }
    } else if (filled && !prevFilled.current) {
      controls.set({ y: -120, scale: 0.3 });
      controls.start({
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 12,
          mass: 1.2,
        },
      });
    }
    prevFilled.current = filled;
  }, [filled, index, controls]);

  const centerX = ((maxWidth - layer.width) * U) / 2;
  const centerZ = ((maxDepth - layer.depth) * U) / 2;

  const segments = layer.segments;

  return (
    <motion.div
      style={{
        ...style,
        height: layer.isSpire ? Math.round(effectiveH * 1.5) : effectiveH,
        width: maxWidth * U,
        transformStyle: "preserve-3d",
      }}
      initial={filled ? { y: -40, scale: 0.3 } : { scale: 1 }}
      animate={controls}
    >
      {segments ? (
        segments.map((seg, i) => (
          <Slab
            key={i}
            w={seg.width}
            d={seg.depth}
            color={color}
            filled={filled}
            tx={seg.offsetX * U}
            tz={seg.offsetZ * U}
            h={effectiveH}
          />
        ))
      ) : (
        <Slab
          w={layer.width}
          d={layer.depth}
          color={color}
          filled={filled}
          tx={centerX}
          tz={centerZ}
          isSpire={layer.isSpire}
          h={effectiveH}
        />
      )}
    </motion.div>
  );
}
