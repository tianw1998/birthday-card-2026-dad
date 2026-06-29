let bgm = null;

export function initAudio() {
  bgm = new Audio('assets/bgm.mp3');
  bgm.loop   = true;
  bgm.volume = 0.45;
}

export function playBgm() {
  if (bgm) bgm.play().catch(() => {});
}

export function toggleAudio(state) {
  if (!bgm) return;
  state.audioOn = !state.audioOn;
  if (state.audioOn) {
    bgm.play().catch(() => {});
  } else {
    bgm.pause();
  }
  document.getElementById('btn-audio').textContent = state.audioOn ? '🔊' : '🔇';
}
