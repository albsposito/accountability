"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

interface LegoBlockProps {
  color: string;
  index: number;
  filled: boolean;
}

export default function LegoBlock({ color, index, filled }: LegoBlockProps) {
  const controls = useAnimation();
  const prevFilled = useRef(filled);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      if (filled) {
        // Gentle staggered entrance on page load
        controls.start({
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: index * 0.08,
          },
        });
      }
    } else if (filled && !prevFilled.current) {
      // Dramatic drop for newly-filled block
      controls.set({ y: -120, opacity: 0 });
      controls.start({
        y: 0,
        opacity: 1,
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

  return (
    <motion.div
      className="relative w-full"
      style={{ height: 20 }}
      initial={filled ? { y: -40, opacity: 0 } : { opacity: 1 }}
      animate={controls}
    >
      {/* Block body */}
      <div
        className="absolute inset-0 rounded-[2px]"
        style={{
          backgroundColor: filled ? color : "var(--block-empty)",
          boxShadow: filled
            ? `inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.2), 2px 0 0 rgba(0,0,0,0.15)`
            : "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.1)",
          border: filled ? "none" : "1px dashed var(--border)",
        }}
      />

      {/* Studs */}
      {filled && (
        <div className="absolute -top-[3px] left-0 right-0 flex justify-center gap-[6px]">
          {[0, 1].map((stud) => (
            <div
              key={stud}
              className="w-[8px] h-[3px] rounded-t-[2px]"
              style={{
                backgroundColor: color,
                boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.2), 0 -1px 0 rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
