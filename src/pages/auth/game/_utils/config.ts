export const StageWidthCells = 10;
export const StageHeightCells = 10;
export const Scale = 1;
export const CellSize = 64 * Scale;
export const StageWidth = StageWidthCells * CellSize;
export const StageHeight = StageHeightCells * CellSize;

export type TextureType = 0 | 1 | 2 | 3 | 4;
export const TypeTextureMap: Record<TextureType, string> = {
  0: "tile_0468.png", // 地面
  1: "tile_0292.png", // 树
  2: "tile_0248.png", // 路障
  3: "tile_0417.png", // 门
  4: "tile_0373.png", // 特殊
};

export const Map: TextureType[][] = [
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, 1, 3],
  [0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [1, 1, 0, 1, 1, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
];

export const PlaceOfBirth = {
  x: 0,
  y: 9,
};
