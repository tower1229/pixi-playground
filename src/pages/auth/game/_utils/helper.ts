import { StageWidth, StageHeight, CellSize } from "@/constant";
import { Sprite } from "pixi.js";
// 检测坐标系中的点是否越界
export function isOutOfBound(point: { x: number; y: number }) {
  const { x, y } = point;
  return (
    x < 0 || y < 0 || x > StageWidth - CellSize || y > StageHeight - CellSize
  );
}

export const safeMove = (
  point: Sprite,
  direction: "left" | "right" | "up" | "down",
  step?: number
) => {
  const { x, y } = point;
  let newPosition = { x, y };
  switch (direction) {
    case "left":
      newPosition = {
        x: x - (step || 1) * CellSize,
        y,
      };
      break;
    case "right":
      newPosition = {
        x: x + (step || 1) * CellSize,
        y,
      };
      break;
    case "up":
      newPosition = {
        x,
        y: y - (step || 1) * CellSize,
      };
      break;
    case "down":
      newPosition = {
        x,
        y: y + (step || 1) * CellSize,
      };
      break;
    default:
      break;
  }

  if (!isOutOfBound(newPosition)) {
    point.x = newPosition.x;
    point.y = newPosition.y;
  }
};
