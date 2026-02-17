import { PixelRenderer, SpanielSmashGame } from "./game.js";

const canvas = document.getElementById("game") as HTMLCanvasElement | null;
if (!canvas) {
  throw new Error("Missing #game canvas");
}

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Canvas 2d context unavailable");
}

class SkiMusic {
  private audioCtx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nextNoteTime = 0;
  private scheduler: number | null = null;
  private lcgState = 1;
  private muted = false;
  private bossMode = false;
  private celebrationTimers: number[] = [];

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      this.stopBackground();
      return;
    }

    if (this.audioCtx?.state === "suspended") {
      void this.audioCtx.resume();
    }
    this.applyMixLevel();
  }

  public setBossMode(active: boolean): void {
    if (this.bossMode === active) {
      return;
    }
    this.bossMode = active;
    this.applyMixLevel();
    this.resetSequence();
  }

  public start(): void {
    if (this.muted) {
      return;
    }
    if (!window.AudioContext) {
      return;
    }

    if (!this.audioCtx) {
      this.audioCtx = new window.AudioContext();
      this.master = this.audioCtx.createGain();
      this.master.connect(this.audioCtx.destination);
      this.applyMixLevel();
      this.resetSequence();
    }

    if (this.scheduler === null) {
      this.scheduler = window.setInterval(() => this.scheduleNotes(), 100);
    }

    if (this.audioCtx.state === "suspended") {
      void this.audioCtx.resume();
    }
  }

  public stopBackground(delayMs = 0): void {
    if (this.scheduler !== null) {
      window.clearInterval(this.scheduler);
      this.scheduler = null;
    }

    if (this.audioCtx?.state === "running") {
      const stop = (): void => {
        if (this.audioCtx?.state === "running") {
          void this.audioCtx.suspend();
        }
      };
      if (delayMs > 0) {
        window.setTimeout(stop, delayMs);
      } else {
        stop();
      }
    }
  }

  public stopCelebration(): void {
    for (const timer of this.celebrationTimers) {
      window.clearTimeout(timer);
    }
    this.celebrationTimers = [];
  }

  public resetSequence(): void {
    this.lcgState = this.bossMode ? 17 : 1;
    if (this.audioCtx) {
      this.nextNoteTime = this.audioCtx.currentTime + 0.02;
    }
  }


  public howl(): void {
    if (!window.AudioContext || this.muted) {
      return;
    }

    if (!this.audioCtx) {
      this.audioCtx = new window.AudioContext();
      this.master = this.audioCtx.createGain();
      this.master.gain.value = 0.04;
      this.master.connect(this.audioCtx.destination);
      this.resetSequence();
    }

    if (this.audioCtx.state === "suspended") {
      void this.audioCtx.resume();
    }

    if (!this.master || !this.audioCtx) {
      return;
    }

    const at = this.audioCtx.currentTime + 0.005;
    this.playHowl(240, 140, at, 0.24, 0.24);
    this.playHowl(320, 190, at + 0.06, 0.18, 0.16);
  }

  public smash(): void {
    this.howl();
  }

  public bark(): void {
    if (!window.AudioContext || this.muted) {
      return;
    }

    if (!this.audioCtx) {
      this.audioCtx = new window.AudioContext();
      this.master = this.audioCtx.createGain();
      this.master.gain.value = 0.04;
      this.master.connect(this.audioCtx.destination);
      this.resetSequence();
    }

    if (this.audioCtx.state === "suspended") {
      void this.audioCtx.resume();
    }

    if (!this.master || !this.audioCtx) {
      return;
    }

    const at = this.audioCtx.currentTime + 0.01;
    const barkNotes = [350, 300, 255];
    for (let burst = 0; burst < 2; burst += 1) {
      barkNotes.forEach((freq, index) => {
        this.playNote(freq, at + burst * 0.16 + index * 0.042, 0.04, "square", 0.25);
      });
    }
  }

  public celebrateVictory(): void {
    if (!window.AudioContext || this.muted) {
      return;
    }
    this.start();
    if (!this.master || !this.audioCtx) {
      return;
    }

    this.stopCelebration();
    const now = this.audioCtx.currentTime + 0.02;
    const motif = [523.25, 659.25, 783.99, 1046.5];
    motif.forEach((note, index) => {
      this.playNote(note, now + index * 0.12, 0.24, "triangle", 0.34);
      this.playNote(note * 1.5, now + index * 0.12 + 0.02, 0.2, "square", 0.2);
    });
    for (let burst = 0; burst < 6; burst += 1) {
      const timer = window.setTimeout(() => {
        this.howl();
      }, 260 + burst * 190);
      this.celebrationTimers.push(timer);
    }
  }

  private scheduleNotes(): void {
    if (!this.audioCtx || !this.master) {
      return;
    }

    const lookAhead = this.audioCtx.currentTime + (this.bossMode ? 0.24 : 0.3);
    const step = this.bossMode ? 0.092 : 0.14;
    const duration = this.bossMode ? 0.105 : 0.13;
    const wave: OscillatorType = this.bossMode ? "sawtooth" : "square";
    const peak = this.bossMode ? 0.28 : 0.22;
    while (this.nextNoteTime < lookAhead) {
      const note = this.generateNote(this.bossMode);
      this.playNote(note, this.nextNoteTime, duration, wave, peak);
      if (this.bossMode && (this.lcgState % 3 === 0)) {
        this.playNote(Math.max(90, note * 0.5), this.nextNoteTime + 0.028, 0.08, "triangle", 0.2);
      }
      this.nextNoteTime += step;
    }
  }

  private generateNote(bossMode = false): number {
    this.lcgState = (this.lcgState * 48271) % 2147483647;
    const r = this.lcgState / 2147483647;
    const scale = bossMode ? [0, 1, 3, 5, 6, 8, 10, 12] : [0, 3, 5, 7, 10, 12, 15, 17];
    const root = bossMode ? 174 : 220;
    const octave = bossMode ? (r > 0.62 ? 2 : r > 0.26 ? 1 : 0) : (r > 0.72 ? 2 : r > 0.45 ? 1 : 0);
    const degree = scale[Math.floor(r * scale.length)];
    return root * 2 ** ((degree + octave * 12) / 12);
  }

  private applyMixLevel(): void {
    if (!this.master) {
      return;
    }
    this.master.gain.value = this.bossMode ? 0.05 : 0.03;
  }

  private playNote(freq: number, at: number, duration: number, wave: OscillatorType, peak: number): void {
    if (!this.audioCtx || !this.master) {
      return;
    }
    const osc = this.audioCtx.createOscillator();
    osc.type = wave;
    osc.frequency.setValueAtTime(Math.round(freq), at);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);

    osc.connect(gain);
    gain.connect(this.master);
    osc.start(at);
    osc.stop(at + duration + 0.02);
  }

  private playHowl(startFreq: number, endFreq: number, at: number, duration: number, peak: number): void {
    if (!this.audioCtx || !this.master) {
      return;
    }
    const osc = this.audioCtx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(Math.round(startFreq), at);
    osc.frequency.exponentialRampToValueAtTime(Math.max(50, Math.round(endFreq)), at + duration);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(peak, at + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);

    osc.connect(gain);
    gain.connect(this.master);
    osc.start(at);
    osc.stop(at + duration + 0.03);
  }
}

const GAME_VERSION = "v1.2.4";

function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
      console.error("Service worker registration failed", error);
    });
  });
}

registerServiceWorker();

const game = new SpanielSmashGame(canvas.width, canvas.height);
const renderer = new PixelRenderer(ctx, canvas.width, canvas.height);
const music = new SkiMusic();
const input = { left: false, right: false, jump: false };
const splashScreen = document.getElementById("splash-screen");
const splashTitle = document.getElementById("splash-title");
const splashCopy = document.getElementById("splash-copy");
const splashButton = document.getElementById("splash-start");
const statusScore = document.getElementById("status-score");
const statusLives = document.getElementById("status-lives");
const statusLevel = document.getElementById("status-level");
const muteToggle = document.getElementById("splash-mute-toggle") as HTMLInputElement | null;


let isPlaying = false;
let gameOverHandled = false;
let lastSpanielSmashCount = 0;
let runStartMs = 0;
let usedSkiSchoolDebugSpawn = false;

const STORAGE_MUTE_KEY = "spaniel-smash-muted";
const initialMuted = window.localStorage.getItem(STORAGE_MUTE_KEY) === "true";
music.setMuted(initialMuted);
if (muteToggle) {
  muteToggle.checked = initialMuted;
  muteToggle.addEventListener("change", () => {
    const muted = muteToggle.checked;
    music.setMuted(muted);
    window.localStorage.setItem(STORAGE_MUTE_KEY, String(muted));
  });
}

function showSplash(mode: "start" | "game-over", finalScore = 0): void {
  if (!splashScreen || !splashTitle || !splashCopy || !splashButton) {
    return;
  }

  splashScreen.classList.remove("hidden");
  if (mode === "start") {
    splashTitle.textContent = `SPANIEL SMASH ${GAME_VERSION}`;
    splashCopy.textContent = "Evil Andy has released the spaniel army to take over the ski slopes. Smash the spaniels to clear the slopes. Arrow keys or tap controls move left/right. Smash spaniels to score, then defeat Andy when the boss phase starts.";
    splashButton.textContent = "START";
    return;
  }

  splashTitle.textContent = `GAME OVER ${GAME_VERSION}`;
  splashCopy.textContent = `Final Score ${finalScore}. Grrr! Hit restart and smash them all again.`;
  splashButton.textContent = "RESTART";
}

function hideSplash(): void {
  splashScreen?.classList.add("hidden");
}

window.addEventListener("keydown", (event) => {
  if (!isPlaying || game.snapshot().isGameOver) {
    return;
  }

  if ((event.key === "p" || event.key === "P")
    && !usedSkiSchoolDebugSpawn
    && performance.now() - runStartMs <= 1000) {
    game.spawnSkiSchoolDebug(4);
    usedSkiSchoolDebugSpawn = true;
    return;
  }

  if (event.key === "ArrowLeft") {
    input.left = true;
  }
  if (event.key === "ArrowRight") {
    input.right = true;
  }
  if (event.key === "ArrowUp" || event.key === " " || event.key === "Spacebar") {
    input.jump = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "ArrowLeft") {
    input.left = false;
  }
  if (event.key === "ArrowRight") {
    input.right = false;
  }
  if (event.key === "ArrowUp" || event.key === " " || event.key === "Spacebar") {
    input.jump = false;
  }
});

const leftControl = document.getElementById("control-left");
const rightControl = document.getElementById("control-right");
const jumpControl = document.getElementById("control-jump");

for (const eventName of ["gesturestart", "gesturechange", "gestureend"]) {
  window.addEventListener(eventName, (event) => {
    event.preventDefault();
  }, { passive: false });
}

let lastTouchEndMs = 0;
window.addEventListener("touchend", (event) => {
  const now = Date.now();
  if (now - lastTouchEndMs < 300) {
    event.preventDefault();
  }
  lastTouchEndMs = now;
}, { passive: false });

window.visualViewport?.addEventListener("resize", () => {
  if (window.visualViewport && window.visualViewport.scale > 1) {
    const meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    if (meta) {
      meta.content = "width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1, user-scalable=no";
    }
  }
});

window.addEventListener("selectstart", (event) => {
  event.preventDefault();
});

function bindTouchControl(control: HTMLElement | null, key: "left" | "right" | "jump"): void {
  if (!control) {
    return;
  }

  const activate = (event: Event): void => {
    event.preventDefault();
    if (!isPlaying || game.snapshot().isGameOver) {
      return;
    }
    input[key] = true;
  };

  const deactivate = (event: Event): void => {
    event.preventDefault();
    input[key] = false;
  };

  const hold = (event: Event): void => {
    event.preventDefault();
    if (!isPlaying || game.snapshot().isGameOver) {
      return;
    }
    input[key] = true;
  };

  control.addEventListener("pointerdown", activate);
  control.addEventListener("pointerup", deactivate);
  control.addEventListener("pointercancel", deactivate);
  control.addEventListener("pointerleave", deactivate);
  control.addEventListener("touchstart", activate, { passive: false });
  control.addEventListener("touchmove", hold, { passive: false });
  control.addEventListener("touchend", deactivate, { passive: false });
  control.addEventListener("touchcancel", deactivate, { passive: false });
  control.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  control.addEventListener("dblclick", (event) => {
    event.preventDefault();
  });
}

bindTouchControl(leftControl, "left");
bindTouchControl(rightControl, "right");
bindTouchControl(jumpControl, "jump");

splashButton?.addEventListener("click", () => {
  if (game.snapshot().isGameOver) {
    game.restart();
    music.stopCelebration();
    music.resetSequence();
  }

  gameOverHandled = false;
  lastSpanielSmashCount = 0;
  input.left = false;
  input.right = false;
  input.jump = false;
  isPlaying = true;
  runStartMs = performance.now();
  usedSkiSchoolDebugSpawn = false;
  music.start();
  hideSplash();
});

showSplash("start");

let lastFrame = performance.now();

function frame(now: number): void {
  const delta = Math.min(33, now - lastFrame);
  lastFrame = now;

  if (isPlaying) {
    game.step(delta, input);
  }

  const snapshot = game.snapshot();
  music.setBossMode(snapshot.isBossActive && !snapshot.isGameOver);
  renderer.render(snapshot);

  if (statusScore) {
    statusScore.textContent = `Score ${snapshot.score}`;
  }
  if (statusLives) {
    statusLives.textContent = `Lives ${snapshot.lives}`;
  }
  if (statusLevel) {
    statusLevel.textContent = `Level ${snapshot.speedLevel}`;
  }
  if (leftControl) {
    leftControl.toggleAttribute("hidden", !isPlaying || snapshot.isGameOver);
  }
  if (rightControl) {
    rightControl.toggleAttribute("hidden", !isPlaying || snapshot.isGameOver);
  }
  if (jumpControl) {
    jumpControl.toggleAttribute("hidden", !isPlaying || snapshot.isGameOver);
  }

  if (snapshot.spanielsSmashed > lastSpanielSmashCount) {
    lastSpanielSmashCount = snapshot.spanielsSmashed;
    music.howl();
  }

  if (snapshot.isVictory && !gameOverHandled) {
    gameOverHandled = true;
    isPlaying = false;
    music.stopBackground();
    music.celebrateVictory();
    if (splashScreen && splashTitle && splashCopy && splashButton) {
      splashScreen.classList.remove("hidden");
      splashTitle.textContent = "CONGRATULATIONS";
      splashCopy.textContent = "You beat Evil Andy. The slopes are clear!";
      splashButton.textContent = "PLAY AGAIN";
    }
  }

  if (snapshot.isGameOver && !snapshot.isVictory && !gameOverHandled) {
    gameOverHandled = true;
    isPlaying = false;
    music.stopBackground();
    music.bark();
    music.stopBackground(260);
    showSplash("game-over", snapshot.score);
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
