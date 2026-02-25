"use client";

import LegoBuilding3D from "./LegoBuilding3D";

interface LegoBuildingProps {
  taskId: string;
  startValue: number;
  endValue: number;
  currentValue: number;
  color: string;
}

export default function LegoBuilding(props: LegoBuildingProps) {
  return <LegoBuilding3D {...props} />;
}
