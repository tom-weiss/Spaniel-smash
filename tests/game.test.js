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

test('player movement uses cooldown and ignores conflicting input across 10 lanes', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0]), 10);
  assert.equal(game.snapshot().playerX, 156.6);

  game.step(16, { left: true, right: false });
  assert.equal(game.snapshot().playerX, 126.6);

  game.step(16, { left: true, right: false });
  assert.equal(game.snapshot().playerX, 126.6);

  game.step(140, { left: false, right: true });
  assert.equal(game.snapshot().playerX, 156.6);

  game.step(160, { left: true, right: true });
  assert.equal(game.snapshot().playerX, 156.6);
});

test('spawnEntity supports tree, rock, skier and spaniel with static obstacle speed lock', () => {
  const treeGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.1]), 10);
  treeGame.step(450, { left: false, right: false });
  const tree = treeGame.snapshot().entities[0];

  const rockGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.3]), 10);
  rockGame.step(450, { left: false, right: false });
  const rock = rockGame.snapshot().entities[0];

  const skierGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.5, 0.4]), 10);
  skierGame.step(450, { left: false, right: false });
  const skier = skierGame.snapshot().entities[0];

  const spanielGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.9, 0.2]), 10);
  spanielGame.step(450, { left: false, right: false });
  const spaniel = spanielGame.snapshot().entities[0];

  assert.equal(tree.type, 'tree');
  assert.equal(rock.type, 'rock');
  assert.equal(skier.type, 'skier');
  assert.equal(spaniel.type, 'spaniel');
  assert.equal(tree.speed, 2.2);
  assert.equal(rock.speed, 2.2);
});

test('non-spaniel collisions reduce lives and can end game', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);

  game.forceSpawn({ type: 'tree', x: 122, y: 560, width: 30, height: 30, speed: 0, lane: 5 });
  game.step(16, { left: false, right: false });
  game.forceSpawn({ type: 'rock', x: 122, y: 560, width: 30, height: 30, speed: 0, lane: 5 });
  game.step(16, { left: false, right: false });
  game.forceSpawn({ type: 'andy', x: 122, y: 560, width: 30, height: 30, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });

  const snap = game.snapshot();
  assert.equal(snap.lives, 0);
  assert.equal(snap.isGameOver, true);
});

test('smashing spaniels scores and triggers witch attack and andy spawn', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.4, 0.1]), 10);

  for (let i = 0; i < 10; i += 1) {
    game.forceSpawn({ type: 'spaniel', x: 122, y: 560, width: 16, height: 16, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
    game.step(16, { left: false, right: false });
  }

  const snap = game.snapshot();
  assert.equal(snap.score, 1000);
  assert.equal(snap.spanielsSmashed, 10);
  assert.equal(snap.speedLevel, 2);

  game.step(450, { left: false, right: false });
  assert.equal(game.snapshot().entities[0].type, 'andy');
});

test('andy tracks player by lane, collision clears witch attack, and existing andy blocks respawn', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.9, 0.3]), 10);
  for (let i = 0; i < 10; i += 1) {
    game.forceSpawn({ type: 'spaniel', x: 122, y: 560, width: 18, height: 18, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
    game.step(16, { left: false, right: false });
  }

  game.forceSpawn({ type: 'andy', x: 10, y: 100, width: 18, height: 18, speed: 0, lane: 1 });
  game.forceSpawn({ type: 'andy', x: 260, y: 100, width: 18, height: 18, speed: 0, lane: 8 });
  game.step(200, { left: false, right: false });

  let andy = game.snapshot().entities.find((entity) => entity.type === 'andy' && entity.lane < 5);
  assert.ok(andy && andy.lane > 1);
  andy = game.snapshot().entities.find((entity) => entity.type === 'andy' && entity.lane > 5);
  assert.ok(andy && andy.lane < 8);

  game.step(450, { left: false, right: false });
  assert.equal(game.snapshot().entities.filter((entity) => entity.type === 'andy').length, 2);

  game.forceSpawn({ type: 'andy', x: 122, y: 560, width: 18, height: 18, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });
  assert.equal(game.snapshot().lives, 2);

  game.step(450, { left: false, right: false });
  assert.ok(game.snapshot().entities.some((entity) => entity.type !== 'andy'));
});

test('moving actors can switch lanes while static obstacles keep lane and stack prevention avoids overlaps', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([
    0.2,
    0.0, 0.9,
    0.0, 0.9,
    0.0,
    0.2,
    0.9
  ]), 10);

  game.forceSpawn({ type: 'tree', x: 122, y: 100, width: 16, height: 16, speed: 2.2, lane: 6 });
  game.forceSpawn({ type: 'skier', x: 122, y: 100, width: 16, height: 16, speed: 2.1, lane: 5, laneSwitchCooldownMs: 0 });
  game.forceSpawn({ type: 'spaniel', x: 122, y: 100, width: 16, height: 16, speed: 2.1, lane: 4, laneSwitchCooldownMs: 0 });
  game.forceSpawn({ type: 'rock', x: 122, y: 100, width: 16, height: 16, speed: 2.2, lane: 5 });

  game.step(200, { left: false, right: false });
  const first = game.snapshot().entities;
  const tree = first.find((entity) => entity.type === 'tree');
  const rock = first.find((entity) => entity.type === 'rock');
  const skier = first.find((entity) => entity.type === 'skier');
  const spaniel = first.find((entity) => entity.type === 'spaniel');

  assert.equal(tree.lane, 6);
  assert.equal(rock.lane, 5);
  assert.notEqual(skier.lane, 6);
  assert.notEqual(spaniel.lane, 5);

  game.forceSpawn({ type: 'tree', x: 122, y: 120, width: 20, height: 20, speed: 2.2, lane: 2 });
  game.forceSpawn({ type: 'rock', x: 122, y: 121, width: 20, height: 20, speed: 2.2, lane: 2 });
  game.step(16, { left: false, right: false });
  const lane2 = game.snapshot().entities.filter((entity) => entity.lane === 2).sort((a, b) => a.y - b.y);
  assert.ok(lane2[1].y - lane2[0].y >= lane2[0].height + 2);
});

test('spawn lane selection can choose nearest left clear lane and infer lane from x', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.45, 0.1]), 5);
  game.forceSpawn({ type: 'tree', x: 130, y: 0, width: 10, height: 10, speed: 2.2 });
  game.forceSpawn({ type: 'rock', x: 190, y: 0, width: 10, height: 10, speed: 2.2, lane: 3 });
  game.step(450, { left: false, right: false });

  const spawned = game.snapshot().entities.at(-1);
  assert.ok(spawned);
  assert.equal(spawned.lane, 1);
});

test('spawn lane selection can choose nearest right clear lane', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.45, 0.1]), 5);
  game.forceSpawn({ type: 'tree', x: 130, y: 0, width: 10, height: 10, speed: 2.2 });
  game.forceSpawn({ type: 'rock', x: 70, y: 0, width: 10, height: 10, speed: 2.2, lane: 1 });
  game.step(450, { left: false, right: false });

  const spawned = game.snapshot().entities.at(-1);
  assert.ok(spawned);
  assert.equal(spawned.lane, 3);
});

test('spawn lane selection falls back to preferred lane when no lane is clear', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.1]), 2);
  game.forceSpawn({ type: 'tree', x: 10, y: 0, width: 10, height: 10, speed: 2.2, lane: 0 });
  game.forceSpawn({ type: 'rock', x: 200, y: 0, width: 10, height: 10, speed: 2.2, lane: 1 });
  game.step(450, { left: false, right: false });

  const spawned = game.snapshot().entities.at(-1);
  assert.ok(spawned);
  assert.equal(spawned.lane, 0);
});

test('game over prevents updates and offscreen entities are culled', () => {
  const cullGame = new SpanielSmashGame(300, 600, rngFrom([0.9]), 10);
  cullGame.forceSpawn({ type: 'spaniel', x: 122, y: 700, width: 30, height: 30, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  cullGame.step(16, { left: false, right: false });
  assert.equal(cullGame.snapshot().entities.length, 0);

  const endGame = new SpanielSmashGame(300, 600, rngFrom([0.9]), 10);
  endGame.forceSpawn({ type: 'tree', x: 122, y: 560, width: 30, height: 30, speed: 0, lane: 5 });
  endGame.step(16, { left: false, right: false });
  endGame.forceSpawn({ type: 'rock', x: 122, y: 560, width: 30, height: 30, speed: 0, lane: 5 });
  endGame.step(16, { left: false, right: false });
  endGame.forceSpawn({ type: 'andy', x: 122, y: 560, width: 30, height: 30, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  endGame.step(16, { left: false, right: false });

  assert.equal(endGame.snapshot().isGameOver, true);
  const before = endGame.snapshot().entities.length;
  endGame.step(450, { left: false, right: false });
  assert.equal(endGame.snapshot().entities.length, before);
});

test('restart resets gameplay state', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.8]), 10);

  game.forceSpawn({ type: 'spaniel', x: 122, y: 560, width: 30, height: 30, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });
  game.forceSpawn({ type: 'tree', x: 122, y: 560, width: 30, height: 30, speed: 0, lane: 5 });
  game.step(16, { left: false, right: false });

  game.restart();
  const snap = game.snapshot();
  assert.equal(snap.lives, 3);
  assert.equal(snap.score, 0);
  assert.equal(snap.speedLevel, 1);
  assert.equal(snap.spanielsSmashed, 0);
  assert.equal(snap.isGameOver, false);
  assert.equal(snap.entities.length, 0);
  assert.equal(snap.playerX, 156.6);
});

test('snapshot returns copied entity data', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.8, 0.5]), 10);
  game.step(450, { left: false, right: false });

  const snap1 = game.snapshot();
  snap1.entities[0].x = 999;
  const snap2 = game.snapshot();
  assert.notEqual(snap2.entities[0].x, 999);
});


test('andy already in player lane keeps current lane when moving', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.9]), 10);
  game.forceSpawn({ type: 'andy', x: 122, y: 100, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 0 });
  game.step(200, { left: false, right: false });
  const andy = game.snapshot().entities[0];
  assert.equal(andy.lane, 5);
});

test('moving entities cover lane switch fallback and both random directions', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.4, 0.1, 0.6]), 10);
  game.entities.push({ type: 'skier', x: 122, y: 100, width: 20, height: 20, speed: 0, lane: 5 });

  game.step(16, { left: false, right: false });
  assert.equal(game.snapshot().entities[0].lane, 4);

  game.entities[0].laneSwitchCooldownMs = 0;
  game.step(111, { left: false, right: false });
  assert.equal(game.snapshot().entities[0].lane, 5);
});



test('default game uses 20 lanes', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0]));
  assert.equal(game.snapshot().playerX, 153.3);
});

test('pixel renderer paints all hud and game over layers', () => {
  const calls = [];
  const ctx = {
    fillStyle: '',
    strokeStyle: '',
    font: '',
    fillRect: (...args) => calls.push(['fillRect', ...args]),
    fillText: (...args) => calls.push(['fillText', ...args]),
    beginPath: () => calls.push(['beginPath']),
    moveTo: (...args) => calls.push(['moveTo', ...args]),
    lineTo: (...args) => calls.push(['lineTo', ...args]),
    stroke: () => calls.push(['stroke'])
  };

  const renderer = new PixelRenderer(ctx, 300, 600);
  renderer.render({
    lives: 1,
    score: 200,
    speedLevel: 3,
    spanielsSmashed: 12,
    isGameOver: true,
    playerX: 120,
    entities: [
      { type: 'tree', x: 10, y: 10, width: 20, height: 20, speed: 1 },
      { type: 'rock', x: 40, y: 40, width: 20, height: 20, speed: 1 },
      { type: 'skier', x: 70, y: 70, width: 20, height: 20, speed: 1 },
      { type: 'spaniel', x: 100, y: 100, width: 20, height: 20, speed: 1 },
      { type: 'andy', x: 130, y: 130, width: 20, height: 20, speed: 1 }
    ]
  });

  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Score 200')));
  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Final Score 200')));
  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Tap Restart below')));
  assert.ok(calls.some((entry) => entry[0] === 'fillRect'));
});
