"use client";

import { getBuildingForTask } from "@/lib/buildings";
import { calculateBuildingProgress } from "@/lib/constants";
import LegoBlock3D from "./LegoBlock3D";

const U = 10; // must match LegoBlock3D
const H = 9; // layer height, must match LegoBlock3D
const GAP = 1;

interface LegoBuilding3DProps {
  taskId: string;
  startValue: number;
  endValue: number;
  currentValue: number;
  color: string;
}

export default function LegoBuilding3D({
  taskId,
  startValue,
  endValue,
  currentValue,
  color,
}: LegoBuilding3DProps) {
  const blueprint = getBuildingForTask(taskId);
  const { filled } = calculateBuildingProgress(
    startValue,
    endValue,
    currentValue,
    blueprint.layers.length
  );

  const maxWidth = Math.max(...blueprint.layers.map((l) => l.width));
  const maxDepth = Math.max(...blueprint.layers.map((l) => l.depth));
  const totalLayers = blueprint.layers.length;

  // Total 2D height the stack occupies before 3D rotation
  const stackHeight = totalLayers * (H + GAP);

  // The projected size after rotation — give enough room so nothing clips
  const sceneWidth = maxWidth * U + maxDepth * U * 0.7 + 30;
  const sceneHeight = stackHeight + maxDepth * U * 0.5 + 20;

  return (
    <div
      className="shrink-0"
      style={{
        width: sceneWidth,
        height: sceneHeight,
        perspective: 400,
        perspectiveOrigin: "50% 60%",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: "rotateX(-25deg) rotateY(-35deg)",
          position: "relative",
        }}
      >
        {blueprint.layers.map((layer, i) => {
          // Position layers from bottom to top within the scene
          // Use `top` offset from the top of the container instead of `bottom`
          // so the stack grows upward from a stable base
          const topOffset = (totalLayers - 1 - i) * (H + GAP);
          return (
            <LegoBlock3D
              key={i}
              layer={layer}
              maxWidth={maxWidth}
              maxDepth={maxDepth}
              color={color}
              index={i}
              filled={i < filled}
              style={{
                position: "absolute",
                top: topOffset,
                left: (sceneWidth - maxWidth * U) / 2,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
