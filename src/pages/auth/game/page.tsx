import { useRef, useEffect } from "react";
import { Application, Sprite, Assets, Container, TilingSprite } from "pixi.js";
// import { renderSpirit } from "./_scripts";
import { bindKey, unbindKeyCombo } from "@rwh/keystrokes";
import {
  StageWidth,
  StageHeight,
  CellSize,
  Map,
  TypeTextureMap,
  StageWidthCells,
  StageHeightCells,
} from "@/constant";
import { isOutOfBound } from "./_utils";

export default function Game() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const app = new Application({ width: StageWidth, height: StageHeight });

  let character: Sprite;

  useEffect(() => {
    wrapRef.current?.appendChild(app.view as HTMLCanvasElement);

    Assets.load("/spritesheet.json").then((sheet) => {
      // map
      const land = new TilingSprite(
        sheet.textures[TypeTextureMap[0]],
        StageWidth,
        StageHeight
      );
      app.stage.addChild(land);
      const container = new Container();
      app.stage.addChild(container);

      for (let i = 0; i < StageHeightCells; i++) {
        for (let j = 0; j < StageWidthCells; j++) {
          if (Map[i][j] > 0) {
            const TextureName = TypeTextureMap[Map[i][j]];
            const Texture = sheet.textures[TextureName];
            const sprite = new Sprite(Texture);
            sprite.x = j * CellSize;
            sprite.y = i * CellSize;
            container.addChild(sprite);
          }
        }
      }
      // character
      const TextureRight = sheet.textures["tile_0026"];
      character = new Sprite(TextureRight);
      app.stage.addChild(character);
    });

    bindKey("ArrowUp", () => {
      const newVal = character.y - CellSize;
      if (!isOutOfBound(character.x, newVal)) {
        character.y = newVal;
      }
    });
    bindKey("ArrowRight", () => {
      const newVal = character.x + CellSize;
      if (!isOutOfBound(newVal, character.y)) {
        character.x = newVal;
      }
    });
    bindKey("ArrowDown", () => {
      const newVal = character.y + CellSize;
      if (!isOutOfBound(character.x, newVal)) {
        character.y = newVal;
      }
    });
    bindKey("ArrowLeft", () => {
      const newVal = character.x - CellSize;
      if (!isOutOfBound(newVal, character.y)) {
        character.x = newVal;
      }
    });

    return () => {
      unbindKeyCombo("ArrowUp");
      unbindKeyCombo("ArrowRight");
      unbindKeyCombo("ArrowDown");
      unbindKeyCombo("ArrowLeft");
    };
  }, []);

  return <div ref={wrapRef}></div>;
}
