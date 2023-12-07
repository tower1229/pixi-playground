import { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";

export default function Login() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const app = new PIXI.Application({ width: 640, height: 360 });

  useEffect(() => {
    wrapRef.current?.appendChild(app.view);

    // Label showing scene graph hierarchy
    const label = new PIXI.Text(
      "Scene Graph:\n\napp.stage\n  ┗ A\n     ┗ B\n     ┗ C\n  ┗ D",
      { fill: "#ffffff" }
    );
    label.position = { x: 300, y: 100 };
    app.stage.addChild(label);

    // Helper function to create a block of color with a letter
    const letters: { visible: boolean }[] = [];
    function addLetter(letter, parent, color, pos) {
      const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
      bg.width = 100;
      bg.height = 100;
      bg.tint = color;

      const text = new PIXI.Text(letter, { fill: "#ffffff" });
      text.anchor.set(0.5);
      text.position = { x: 50, y: 50 };

      const container = new PIXI.Container();
      container.position = pos;
      container.visible = false;
      container.addChild(bg, text);
      parent.addChild(container);

      letters.push(container);
      return container;
    }

    // Define 4 letters
    let a = addLetter("A", app.stage, 0xff0000, { x: 100, y: 100 });
    let b = addLetter("B", a, 0x00ff00, { x: 20, y: 20 });
    let c = addLetter("C", a, 0x0000ff, { x: 20, y: 40 });
    let d = addLetter("D", app.stage, 0xff8800, { x: 140, y: 100 });

    // Display them over time, in order
    let elapsed = 0.0;
    app.ticker.add((delta) => {
      elapsed += delta / 60.0;
      if (elapsed >= letters.length) {
        elapsed = 0.0;
      }
      for (let i = 0; i < letters.length; i++) {
        letters[i].visible = elapsed >= i;
      }
    });
  }, []);

  return <div ref={wrapRef}></div>;
}
