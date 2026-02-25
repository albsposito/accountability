export interface BlueprintLayer {
  /** Number of brick units wide (X axis) */
  width: number;
  /** Number of brick units deep (Z axis) */
  depth: number;
  /** X offset in units from left edge (for centering narrower layers) */
  offsetX?: number;
  /** Z offset in units from front edge */
  offsetZ?: number;
  /** Render as thin spire instead of a slab */
  isSpire?: boolean;
  /** Multiple separate blocks in one layer (e.g. castle turrets) */
  segments?: { width: number; depth: number; offsetX: number; offsetZ: number }[];
}

export interface BuildingBlueprint {
  name: string;
  layers: BlueprintLayer[];
}

// Empire State Building — wide base narrowing in steps, thin spire on top
const EMPIRE_STATE: BuildingBlueprint = {
  name: "Empire State",
  layers: [
    { width: 6, depth: 4 },
    { width: 6, depth: 4 },
    { width: 6, depth: 4 },
    { width: 5, depth: 3 },
    { width: 5, depth: 3 },
    { width: 4, depth: 3 },
    { width: 4, depth: 3 },
    { width: 3, depth: 2 },
    { width: 3, depth: 2 },
    { width: 3, depth: 2 },
    { width: 2, depth: 2 },
    { width: 2, depth: 2 },
    { width: 1, depth: 1 },
    { width: 1, depth: 1, isSpire: true },
  ],
};

// Big Ben — rectangular tower, wider clock section near top, pointed cap
const BIG_BEN: BuildingBlueprint = {
  name: "Big Ben",
  layers: [
    { width: 4, depth: 4 },
    { width: 3, depth: 3 },
    { width: 3, depth: 3 },
    { width: 3, depth: 3 },
    { width: 3, depth: 3 },
    { width: 3, depth: 3 },
    { width: 3, depth: 3 },
    { width: 4, depth: 4 },
    { width: 4, depth: 4 },
    { width: 5, depth: 4 },
    { width: 3, depth: 3 },
    { width: 2, depth: 2 },
    { width: 1, depth: 1 },
    { width: 1, depth: 1, isSpire: true },
  ],
};

// Pyramid — each layer narrower than below, staircase profile
const PYRAMID: BuildingBlueprint = {
  name: "Pyramid",
  layers: [
    { width: 7, depth: 7 },
    { width: 6, depth: 6 },
    { width: 5, depth: 5 },
    { width: 5, depth: 5 },
    { width: 4, depth: 4 },
    { width: 3, depth: 3 },
    { width: 3, depth: 3 },
    { width: 2, depth: 2 },
    { width: 1, depth: 1 },
    { width: 1, depth: 1 },
  ],
};

// Pagoda — alternating wider/narrower layers (overhanging roof tiers)
const PAGODA: BuildingBlueprint = {
  name: "Pagoda",
  layers: [
    { width: 5, depth: 4 },
    { width: 4, depth: 3 },
    { width: 4, depth: 3 },
    { width: 6, depth: 4 },
    { width: 3, depth: 3 },
    { width: 3, depth: 3 },
    { width: 5, depth: 4 },
    { width: 3, depth: 2 },
    { width: 3, depth: 2 },
    { width: 5, depth: 3 },
    { width: 2, depth: 2 },
    { width: 4, depth: 3 },
    { width: 1, depth: 1, isSpire: true },
  ],
};

// Castle — wide base, two turrets flanking shorter middle
const CASTLE: BuildingBlueprint = {
  name: "Castle",
  layers: [
    { width: 7, depth: 4 },
    { width: 7, depth: 4 },
    { width: 7, depth: 4 },
    { width: 6, depth: 3 },
    { width: 6, depth: 3 },
    {
      width: 7, depth: 3,
      segments: [
        { width: 2, depth: 3, offsetX: 0, offsetZ: 0 },
        { width: 2, depth: 3, offsetX: 5, offsetZ: 0 },
      ],
    },
    {
      width: 7, depth: 3,
      segments: [
        { width: 2, depth: 3, offsetX: 0, offsetZ: 0 },
        { width: 2, depth: 3, offsetX: 5, offsetZ: 0 },
      ],
    },
    {
      width: 7, depth: 3,
      segments: [
        { width: 2, depth: 3, offsetX: 0, offsetZ: 0 },
        { width: 2, depth: 3, offsetX: 5, offsetZ: 0 },
      ],
    },
    {
      width: 7, depth: 2,
      segments: [
        { width: 1, depth: 2, offsetX: 0.5, offsetZ: 0.5 },
        { width: 1, depth: 2, offsetX: 5.5, offsetZ: 0.5 },
      ],
    },
    {
      width: 7, depth: 1,
      segments: [
        { width: 1, depth: 1, offsetX: 0.5, offsetZ: 0.5 },
        { width: 1, depth: 1, offsetX: 5.5, offsetZ: 0.5 },
      ],
    },
  ],
};

export const BUILDINGS: BuildingBlueprint[] = [
  EMPIRE_STATE,
  BIG_BEN,
  PYRAMID,
  PAGODA,
  CASTLE,
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

export function getBuildingForTask(taskId: string): BuildingBlueprint {
  const index = hashString(taskId) % BUILDINGS.length;
  return BUILDINGS[index];
}
