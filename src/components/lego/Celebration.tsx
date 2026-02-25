"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CelebrationProps {
  show: boolean;
  color: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  type: "circle" | "square" | "star";
}

const CELEBRATION_COLORS = [
  "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1",
  "#96CEB4", "#FFEAA7", "#DDA0DD", "#98FB98",
];

function generateParticles(baseColor: string): Particle[] {
  const colors = [baseColor, ...CELEBRATION_COLORS];
  return Array.from({ length: 24 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.5;
    const distance = Math.random() * 120 + 60;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotation: Math.random() * 720 - 360,
      scale: Math.random() * 0.6 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: (["circle", "square", "star"] as const)[Math.floor(Math.random() * 3)],
    };
  });
}

function ParticleShape({ type, color }: { type: Particle["type"]; color: string }) {
  if (type === "circle") {
    return <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />;
  }
  if (type === "square") {
    return <div className="w-2 h-2 rounded-[1px]" style={{ backgroundColor: color }} />;
  }
  return (
    <div className="text-sm leading-none" style={{ color }}>
      &#9733;
    </div>
  );
}

export default function Celebration({ show, color }: CelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const keyRef = useRef(0);

  useEffect(() => {
    if (show) {
      keyRef.current += 1;
      setParticles(generateParticles(color));
    }
  }, [show, color]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={keyRef.current}
          className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          {/* Central burst */}
          <motion.div
            className="absolute w-16 h-16 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: [0, 2.5, 0], opacity: [0.8, 0.3, 0] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Trophy */}
          <motion.div
            className="absolute text-3xl"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1.1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.2 }}
          >
            🏆
          </motion.div>

          {/* Confetti particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute"
              initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
              animate={{
                x: p.x,
                y: p.y,
                scale: p.scale,
                rotate: p.rotation,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: Math.random() * 0.2,
              }}
            >
              <ParticleShape type={p.type} color={p.color} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
