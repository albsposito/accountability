export const LEGO_COLORS = [
  "#3B82F6", // blue
  "#EF4444", // red
  "#22C55E", // green
  "#F59E0B", // yellow
  "#8B5CF6", // purple
  "#EC4899", // pink
  "#F97316", // orange
  "#06B6D4", // cyan
];

export const MAX_BLOCKS = 20;

export function calculateBlocks(
  startValue: number,
  endValue: number,
  currentValue: number
) {
  const range = endValue - startValue;
  if (range <= 0) return { total: 0, filled: 0 };

  const total = Math.min(range, MAX_BLOCKS);
  const progress = (currentValue - startValue) / range;
  const filled = Math.round(progress * total);

  return { total, filled: Math.max(0, Math.min(total, filled)) };
}

export function calculateBuildingProgress(
  startValue: number,
  endValue: number,
  currentValue: number,
  totalLayers: number
) {
  const range = endValue - startValue;
  if (range <= 0) return { total: totalLayers, filled: 0 };

  const progress = (currentValue - startValue) / range;
  const filled = Math.round(progress * totalLayers);

  return { total: totalLayers, filled: Math.max(0, Math.min(totalLayers, filled)) };
}

export function getProgressPercent(
  startValue: number,
  endValue: number,
  currentValue: number
) {
  const range = endValue - startValue;
  if (range <= 0) return 100;
  return Math.round(((currentValue - startValue) / range) * 100);
}
