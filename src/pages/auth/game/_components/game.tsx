import { useRef, useEffect, useContext } from "react";
import { DidCtx } from "@/hooks/ctx/Did";
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
import { bindKey, unbindKey } from "@rwh/keystrokes";
import {
  StageWidth,
  StageHeight,
  CellSize,
  Map,
  TypeTextureMap,
  StageWidthCells,
  StageHeightCells,
  TextureType,
  safeMove,
  PlaceOfBirth,
} from "../_utils";
import play from "../_scripts/play";

export const Game = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const app = new Application({ width: StageWidth, height: StageHeight });
  const { did } = useContext(DidCtx);

  let character: Sprite;
  const unbindControl = () => {
    unbindKey("ArrowUp");
    unbindKey("ArrowRight");
    unbindKey("ArrowDown");
    unbindKey("ArrowLeft");
  };

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
      character.x = PlaceOfBirth.x * CellSize;
      character.y = PlaceOfBirth.y * CellSize;
      gameScene.addChild(character);

      // game over
      const gameOverScene = new Container();
      gameOverScene.visible = false;
      app.stage.addChild(gameOverScene);
      let style = new TextStyle({
        fontFamily: "Futura",
        fontSize: 64,
        fill: "white",
      });
      const message = new Text("The End!", style);
      message.x = 180;
      message.y = app.stage.height / 2 - 32;
      gameOverScene.addChild(message);

      // game logic
      const path: { x: number; y: number }[] = [];
      const handleCollide = (
        result: TextureType | undefined,
        position: { x: number; y: number }
      ) => {
        if (!result) {
          path.push({ x: position.x / CellSize, y: position.y / CellSize });
          return true;
        } else if (result === 3) {
          path.push({ x: position.x / CellSize, y: position.y / CellSize });
          gameOverScene.visible = true;
          unbindControl?.();
          console.log(path);
          return true;
        } else {
          return false;
        }
      };
      // todo: AnimatedSprite() gotoAndPlay gotoAndStop
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

    return () => {
      unbindControl?.();
    };
  }, []);

  return (
    <div className="wrap">
      <div className="text-center p-4">Your address: {did?.id}</div>
      <div
        ref={wrapRef}
        className="mx-auto"
        style={{
          width: `${StageWidth}px`,
          height: `${StageHeight}px`,
        }}
      ></div>
    </div>
  );
};
