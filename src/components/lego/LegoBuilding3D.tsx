"use client";

import { getBuildingForTask, scaleBuildingForSteps } from "@/lib/buildings";
import { calculateBuildingProgress } from "@/lib/constants";
import LegoBlock3D from "./LegoBlock3D";

const U = 10; // must match LegoBlock3D
const DEFAULT_H = 9; // default layer height
const DEFAULT_GAP = 1;
const MAX_BUILDING_HEIGHT = 250; // max pixel height for the stack

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
  const baseBlueprint = getBuildingForTask(taskId);
  const stepCount = endValue - startValue;
  const blueprint = scaleBuildingForSteps(baseBlueprint, stepCount);
  const { filled } = calculateBuildingProgress(
    startValue,
    endValue,
    currentValue,
    blueprint.layers.length
  );

  const maxWidth = Math.max(...blueprint.layers.map((l) => l.width));
  const maxDepth = Math.max(...blueprint.layers.map((l) => l.depth));
  const totalLayers = blueprint.layers.length;

  // Scale layer height so tall buildings fit within MAX_BUILDING_HEIGHT
  const defaultTotal = totalLayers * (DEFAULT_H + DEFAULT_GAP);
  const scale = defaultTotal > MAX_BUILDING_HEIGHT ? MAX_BUILDING_HEIGHT / defaultTotal : 1;
  const layerH = Math.max(3, Math.round(DEFAULT_H * scale));
  const gap = Math.max(0, Math.round(DEFAULT_GAP * scale));

  // Total 2D height the stack occupies before 3D rotation
  const stackHeight = totalLayers * (layerH + gap);

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
          const topOffset = (totalLayers - 1 - i) * (layerH + gap);
          return (
            <LegoBlock3D
              key={i}
              layer={layer}
              maxWidth={maxWidth}
              maxDepth={maxDepth}
              color={color}
              index={i}
              filled={i < filled}
              layerHeight={layerH}
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
