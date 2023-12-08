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
import { safeMove } from "./_utils";
import play from "./_scripts/play";

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
            sprite.width = CellSize;
            sprite.height = CellSize;
            sprite.x = j * CellSize;
            sprite.y = i * CellSize;
            container.addChild(sprite);
          }
        }
      }
      // character
      const TextureRight = sheet.textures["tile_0026.png"];
      const TextureDown = sheet.textures["tile_0024.png"];
      const TextureLeft = sheet.textures["tile_0023.png"];
      const TextureUp = sheet.textures["tile_0025.png"];
      character = new Sprite(TextureRight);
      character.width = CellSize;
      character.height = CellSize;
      app.stage.addChild(character);

      bindKey("ArrowUp", () => {
        character.texture = TextureUp;
        safeMove(character, "up");
      });
      bindKey("ArrowRight", () => {
        character.texture = TextureRight;
        safeMove(character, "right");
      });
      bindKey("ArrowDown", () => {
        character.texture = TextureDown;
        safeMove(character, "down");
      });
      bindKey("ArrowLeft", () => {
        character.texture = TextureLeft;
        safeMove(character, "left");
      });
    });

    //Start the game loop
    const gameLoop = (delta: number) => {
      play(delta);
    };
    app.ticker.add(gameLoop);

    return () => {
      unbindKeyCombo("ArrowUp");
      unbindKeyCombo("ArrowRight");
      unbindKeyCombo("ArrowDown");
      unbindKeyCombo("ArrowLeft");
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="m-auto"
      style={{
        width: `${StageWidth}px`,
        height: `${StageHeight}px`,
      }}
    ></div>
  );
}
