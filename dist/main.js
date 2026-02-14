import { PixelRenderer, SpanielSmashGame } from "./game.js";
const canvas = document.getElementById("game");
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
const startupBanner = document.getElementById("startup-banner");
const dismissBanner = () => {
    if (!startupBanner) {
        return;
    }
    startupBanner.classList.add("hidden");
};
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
const leftControl = document.getElementById("control-left");
const rightControl = document.getElementById("control-right");
function bindTouchControl(control, key) {
    if (!control) {
        return;
    }
    const activate = (event) => {
        event.preventDefault();
        dismissBanner();
        input[key] = true;
    };
    const deactivate = (event) => {
        event.preventDefault();
        input[key] = false;
    };
    control.addEventListener("pointerdown", activate);
    control.addEventListener("pointerup", deactivate);
    control.addEventListener("pointercancel", deactivate);
    control.addEventListener("pointerleave", deactivate);
}
bindTouchControl(leftControl, "left");
bindTouchControl(rightControl, "right");
window.addEventListener("keydown", dismissBanner, { once: true });
window.addEventListener("pointerdown", dismissBanner, { once: true });
let lastFrame = performance.now();
function frame(now) {
    const delta = Math.min(33, now - lastFrame);
    lastFrame = now;
    game.step(delta, input);
    renderer.render(game.snapshot());
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
