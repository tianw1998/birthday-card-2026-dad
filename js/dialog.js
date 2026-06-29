import { MESSAGES, NPCS } from './config.js';
import { state } from './state.js';

let onAllReadCallback = null;

export function initDialog(allReadCallback) {
  onAllReadCallback = allReadCallback;

  document.getElementById('btn-accept').addEventListener('click', () => closeDialog(true));
  document.getElementById('btn-close').addEventListener('click',  () => closeDialog(false));
}

export function openDialog(npcId) {
  const npc = NPCS.find(n => n.id === npcId);
  if (!npc) return;

  state.activeNpc  = npcId;
  state.phase      = 'dialog';

  document.getElementById('dialog-title').textContent = npc.title;
  document.getElementById('dialog-body').textContent  = MESSAGES[npcId];
  document.getElementById('dialog-overlay').classList.remove('hidden');
}

function closeDialog(accepted) {
  document.getElementById('dialog-overlay').classList.add('hidden');
  state.phase = 'playing';

  if (accepted && state.activeNpc) {
    state.npcs[state.activeNpc].read        = true;
    state.npcs[state.activeNpc].showBubble  = false;
  }
  state.activeNpc = null;

  const allRead = Object.values(state.npcs).every(n => n.read);
  if (allRead && onAllReadCallback) onAllReadCallback();
}
