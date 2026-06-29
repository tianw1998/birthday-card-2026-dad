export const state = {
  phase: 'opening', // 'opening' | 'playing' | 'dialog' | 'ended'
  player: { x: 7 * 32, y: 5 * 32 },
  joystick: { dx: 0, dy: 0 },
  npcs: {
    mom:     { read: false, showBubble: false },
    brother: { read: false, showBubble: false },
    me:      { read: false, showBubble: false },
  },
  activeNpc: null,
  audioOn: true,
};
