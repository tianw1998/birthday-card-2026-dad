import { state } from './state.js';
import { draw, getView } from './renderer.js';
import { TILE, NPCS } from './config.js';
import { initJoystick } from './joystick.js';
import { updatePlayer } from './player.js';
import { updateNpcs } from './npc.js';
import { initDialog, openDialog } from './dialog.js';
import { initAudio, playBgm, toggleAudio } from './audio.js';
import { initConfetti, startConfetti, resizeConfettiCanvas } from './confetti.js';
import { loadAssets } from './assets.js';

let canvas, ctx;

function resize() {
  const canvasArea = document.getElementById('canvas-area');
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = canvasArea.clientWidth  * dpr;
  canvas.height = canvasArea.clientHeight * dpr;
  canvas.style.width  = canvasArea.clientWidth  + 'px';
  canvas.style.height = canvasArea.clientHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

function loop() {
  updatePlayer(state);
  updateNpcs(state);
  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;
  ctx.clearRect(0, 0, cw, ch);
  draw(ctx, cw, ch, state);
  requestAnimationFrame(loop);
}

window.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');
  resize();
  initConfetti();
  // draw() no-ops on the room until sprites are ready; loadImage() already
  // retries transient failures, so a rejection here means a real 404/bug.
  loadAssets().catch(err => console.error('Asset load failed:', err));
  window.addEventListener('resize', () => {
    resize();
    resizeConfettiCanvas();
  });
  initJoystick(state);

  // Init audio (must happen before user gesture)
  initAudio();

  // Audio toggle button
  document.getElementById('btn-audio').addEventListener('click', () => toggleAudio(state));

  // Opening screen — tap [查收] to start
  document.getElementById('btn-start').addEventListener('click', () => {
    const overlay = document.getElementById('opening-overlay');
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.getElementById('canvas-area').classList.add('fade-in');
      state.phase = 'playing';
      playBgm();
    }, 500);
  });

  // Canvas click: detect bubble taps
  canvas.addEventListener('click', e => {
    if (state.phase !== 'playing') return;
    const rect   = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const { ox, oy, scale } = getView(canvas.clientWidth, canvas.clientHeight);

    NPCS.forEach(npc => {
      if (!state.npcs[npc.id].showBubble) return;
      // Must match the bubble position math in renderer.js's drawNpcs
      const destX = npc.tileX * TILE + npc.sitOffset.dx;
      const destY = npc.tileY * TILE + npc.sitOffset.dy;
      const bx = ox + (destX + 48) * scale;
      const by = oy + (destY - 18) * scale;
      const dist = Math.hypot(clickX - bx, clickY - by);
      if (dist < 32) openDialog(npc.id);
    });
  });

  // Init dialog with end-game callback
  initDialog(() => {
    // Trigger end game — will be wired in Task 13
    document.dispatchEvent(new CustomEvent('allMessagesRead'));
  });

  document.addEventListener('allMessagesRead', () => {
    state.phase = 'ended';
    startConfetti(3000);
    setTimeout(() => {
      document.getElementById('endgame-overlay').classList.remove('hidden');
      // Dad can always replay from here now that [完美收下] is gone.
      document.getElementById('btn-restart').classList.remove('hidden');
    }, 3000);
  });

  document.getElementById('btn-again').addEventListener('click', () => {
    // Reset all NPC read state
    Object.keys(state.npcs).forEach(k => {
      state.npcs[k].read       = false;
      state.npcs[k].showBubble = false;
    });
    document.getElementById('endgame-overlay').classList.add('hidden');
    state.phase = 'playing';
  });

  document.getElementById('btn-restart').addEventListener('click', () => {
    window.location.reload();
  });

  loop();
});
