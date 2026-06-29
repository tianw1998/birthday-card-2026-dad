import { NPCS, PROXIMITY_TILES, TILE } from './config.js';

export function updateNpcs(state) {
  if (state.phase !== 'playing') return;

  const playerFeetX = state.player.x + TILE / 2;
  const playerFeetY = state.player.y + TILE;

  NPCS.forEach(npc => {
    if (state.npcs[npc.id].read) {
      state.npcs[npc.id].showBubble = false;
      return;
    }
    const npcCX = npc.tileX * TILE + TILE / 2;
    const npcCY = npc.tileY * TILE + TILE;
    const distTiles = (Math.abs(playerFeetX - npcCX) + Math.abs(playerFeetY - npcCY)) / TILE;
    state.npcs[npc.id].showBubble = distTiles <= PROXIMITY_TILES;
  });
}
