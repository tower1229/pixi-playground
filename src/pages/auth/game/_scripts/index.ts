import { Assets, AnimatedSprite } from "pixi.js";

export const renderSpirit = async () => {
  // Create the SpriteSheet from data and image
  const spritesheet = await Assets.load("/spritesheet.json");
  console.log(spritesheet);
  // spritesheet is ready to use!
  const playerRight = new AnimatedSprite(spritesheet.animations.playerRight);

  // set the animation speed
  playerRight.animationSpeed = 0.1666;
  // play the animation on a loop
  playerRight.play();
  // add it to the stage to render
  return playerRight;
};
