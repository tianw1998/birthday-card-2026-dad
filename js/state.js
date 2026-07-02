import { PLAYER_START, TILE } from './config.js';

export const state = {
  phase: 'opening', // 'opening' | 'playing' | 'dialog' | 'ended'
  player: { x: PLAYER_START.tileX * TILE, y: PLAYER_START.tileY * TILE, dir: 'down' },
  joystick: { dx: 0, dy: 0 },
  npcs: {
    mom:     { read: false, showBubble: false },
    brother: { read: false, showBubble: false },
    me:      { read: false, showBubble: false },
  },
  activeNpc: null,
  audioOn: true,
};
