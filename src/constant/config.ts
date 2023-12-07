export const StageWidthCells = 10;
export const StageHeightCells = 10;
export const CellSize = 16;
export const StageWidth = StageWidthCells * CellSize;
export const StageHeight = StageHeightCells * CellSize;

type TextureType = 0 | 1 | 2 | 3 | 4;
export const TypeTextureMap: Record<TextureType, string> = {
  0: "tile_0468", // 地面
  1: "tile_0292", // 树
  2: "tile_0248", // 路障
  3: "tile_0417", // 门
  4: "tile_0319", // 特殊
};

export const Map: TextureType[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 4],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
];
