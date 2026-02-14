import { PixelRenderer, SpanielSmashGame } from "./game.js";

const canvas = document.getElementById("game") as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error("Missing #game canvas");
}

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Canvas 2d context unavailable");
}

const game = new SpanielSmashGame(canvas.width, canvas.height);
const renderer = new PixelRenderer(ctx, canvas.width, canvas.height);
const input = { left: false, right: false };

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    input.left = true;
  }
  if (event.key === "ArrowRight") {
    input.right = true;
  }
});
window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") {
    input.left = false;
  }
  if (event.key === "ArrowRight") {
    input.right = false;
  }
});

let lastFrame = performance.now();

function frame(now: number): void {
  const delta = Math.min(33, now - lastFrame);
  lastFrame = now;
  game.step(delta, input);
  renderer.render(game.snapshot());
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
