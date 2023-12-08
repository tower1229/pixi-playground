import { useRef, useEffect } from "react";
import {
  Application,
  Sprite,
  Assets,
  Container,
  TilingSprite,
  Text,
  TextStyle,
} from "pixi.js";
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
  TextureType,
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
      const gameScene = new Container();
      app.stage.addChild(gameScene);

      // map
      const land = new TilingSprite(
        sheet.textures[TypeTextureMap[0]],
        StageWidth,
        StageHeight
      );
      gameScene.addChild(land);
      const container = new Container();
      gameScene.addChild(container);

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
      gameScene.addChild(character);

      const handleCollide = (result?: TextureType) => {
        console.log(1111, result);
        if (!result) {
          return true;
        } else if (result === 3) {
          return true;
        } else {
          return false;
        }
      };
      // events
      bindKey("ArrowUp", () => {
        character.texture = TextureUp;
        safeMove(character, "up", handleCollide);
      });
      bindKey("ArrowRight", () => {
        character.texture = TextureRight;
        safeMove(character, "right", handleCollide);
      });
      bindKey("ArrowDown", () => {
        character.texture = TextureDown;
        safeMove(character, "down", handleCollide);
      });
      bindKey("ArrowLeft", () => {
        character.texture = TextureLeft;
        safeMove(character, "left", handleCollide);
      });
    });

    //Start the game loop
    const gameLoop = (delta: number) => {
      play(delta, character);
    };
    app.ticker.add(gameLoop);

    const gameOverScene = new Container();
    gameOverScene.visible = false;
    app.stage.addChild(gameOverScene);
    let style = new TextStyle({
      fontFamily: "Futura",
      fontSize: 64,
      fill: "white",
    });
    const message = new Text("The End!", style);
    message.x = 120;
    message.y = app.stage.height / 2 - 32;
    gameOverScene.addChild(message);

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
