import { StageWidth, StageHeight, CellSize } from "@/constant";
// 检测坐标系中的点是否越界
export function isOutOfBound(x: number, y: number) {
  return (
    x < 0 || y < 0 || x > StageWidth - CellSize || y > StageHeight - CellSize
  );
}
