import test from 'node:test';
import assert from 'node:assert/strict';
import { PixelRenderer, SpanielSmashGame } from '../dist/game.js';

function rngFrom(values) {
  let index = 0;
  return () => {
    const value = values[index] !== undefined ? values[index] : 0;
    index += 1;
    return value;
  };
}

test('player movement is lane-limited and avoids side trees', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  for (let i = 0; i < 20; i += 1) {
    game.step(150, { left: true, right: false });
  }
  assert.equal(game.snapshot().playerX, 36.6);

  for (let i = 0; i < 20; i += 1) {
    game.step(150, { left: false, right: true });
  }
  assert.equal(game.snapshot().playerX, 246.6);
});

test('spawned moving obstacles stay in playable lanes', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.99, 0.2, 0.99, 0.2]), 10);
  game.step(450, { left: false, right: false });
  game.step(450, { left: false, right: false });

  const lanes = game.snapshot().entities.map((entity) => entity.lane);
  assert.ok(lanes.every((lane) => lane >= 1 && lane <= 8));
});

test('smashing spaniel produces score, animation effect, and bloodstain obstacle', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'spaniel', x: 122, y: 366, width: 16, height: 16, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });

  const snap = game.snapshot();
  assert.equal(snap.score, 100);
  assert.equal(snap.spanielsSmashed, 1);
  assert.ok(snap.effects.some((effect) => effect.kind === 'spaniel-smash'));
  assert.ok(snap.entities.some((entity) => entity.type === 'bloodstain'));

  game.step(320, { left: false, right: false });
  assert.equal(game.snapshot().effects.length, 0);
});

test('spaniel streak upgrades speed level and can spawn andy', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.4, 0.2, 0.2]), 10);
  for (let i = 0; i < 10; i += 1) {
    game.forceSpawn({ type: 'spaniel', x: 122, y: 366, width: 16, height: 16, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
    game.step(16, { left: false, right: false });
  }

  const snap = game.snapshot();
  assert.equal(snap.score, 1000);
  assert.equal(snap.speedLevel, 2);

  game.step(450, { left: false, right: false });
  assert.ok(game.snapshot().entities.some((entity) => entity.type === 'andy'));
});

test('moving obstacle collisions animate and become static rocks', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'skier', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.forceSpawn({ type: 'tree', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5 });

  game.step(16, { left: false, right: false });
  const collided = game.snapshot();
  const convertedRock = collided.entities.find((entity) => entity.type === 'rock' && entity.crashAnimationMs > 0);
  assert.ok(convertedRock);
  assert.ok(collided.effects.some((effect) => effect.kind === 'obstacle-crash'));

  game.step(320, { left: false, right: false });
  const settledRock = game.snapshot().entities.find((entity) => entity.type === 'rock');
  assert.equal(settledRock.crashAnimationMs, 0);
});

test('non-spaniel collisions remove lives and game over freezes state updates', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'tree', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5 });
  game.step(16, { left: false, right: false });
  game.step(700, { left: false, right: false });
  game.forceSpawn({ type: 'rock', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5 });
  game.step(16, { left: false, right: false });
  game.step(700, { left: false, right: false });
  game.forceSpawn({ type: 'andy', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });

  assert.equal(game.snapshot().isGameOver, true);
  const before = game.snapshot().entities.length;
  game.step(1000, { left: false, right: false });
  assert.equal(game.snapshot().entities.length, before);
});

test('spawn lane fallback chooses nearest clear lane', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.45, 0.1]), 5);
  game.forceSpawn({ type: 'tree', x: 130, y: 0, width: 10, height: 10, speed: 2.2 });
  game.forceSpawn({ type: 'rock', x: 190, y: 0, width: 10, height: 10, speed: 2.2, lane: 3 });
  game.step(450, { left: false, right: false });

  const spawned = game.snapshot().entities.at(-1);
  assert.equal(spawned.lane, 1);
});

test('restart resets game and clears effects', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.8]), 10);
  game.forceSpawn({ type: 'spaniel', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });

  game.restart();
  const snap = game.snapshot();
  assert.equal(snap.score, 0);
  assert.equal(snap.lives, 3);
  assert.equal(snap.effects.length, 0);
  assert.equal(snap.entities.length, 0);
});

test('snapshot returns copied entities and effects', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'spaniel', x: 122, y: 366, width: 16, height: 16, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });

  const snap1 = game.snapshot();
  snap1.entities[0].x = 999;
  snap1.effects[0].x = 999;
  const snap2 = game.snapshot();
  assert.notEqual(snap2.entities[0].x, 999);
  assert.notEqual(snap2.effects[0].x, 999);
});

test('pixel renderer paints HUD, effects, crash panel, and end states', () => {
  const calls = [];
  const ctx = {
    fillStyle: '',
    font: '',
    fillRect: (...args) => calls.push(['fillRect', ...args]),
    fillText: (...args) => calls.push(['fillText', ...args])
  };

  const renderer = new PixelRenderer(ctx, 300, 600);
  renderer.render({
    lives: 1,
    score: 200,
    speedLevel: 3,
    spanielsSmashed: 12,
    isGameOver: true,
    playerX: 120,
    playerY: 366,
    isCrashActive: true,
    sideObstacleOffsetY: 32,
    entities: [
      { type: 'tree', x: 10, y: 10, width: 20, height: 20, speed: 1 },
      { type: 'rock', x: 40, y: 40, width: 20, height: 20, speed: 1, crashAnimationMs: 200 },
      { type: 'skier', x: 70, y: 70, width: 20, height: 20, speed: 1 },
      { type: 'spaniel', x: 100, y: 100, width: 20, height: 20, speed: 1 },
      { type: 'bloodstain', x: 110, y: 90, width: 20, height: 20, speed: 1 },
      { type: 'andy', x: 130, y: 130, width: 20, height: 20, speed: 1 }
    ],
    effects: [{ kind: 'obstacle-crash', x: 90, y: 90, ttlMs: 100, maxTtlMs: 300 }]
  });

  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Score 200')));
  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Final Score 200')));

  renderer.render({
    lives: 2,
    score: 20,
    speedLevel: 1,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 120,
    playerY: 366,
    isCrashActive: true,
    sideObstacleOffsetY: 0,
    entities: [],
    effects: []
  });
  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('CRASHED!')));
  assert.ok(calls.some((entry) => entry[0] === 'fillRect'));
});
