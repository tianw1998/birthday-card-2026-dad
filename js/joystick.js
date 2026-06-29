export function initJoystick(state) {
  const base  = document.getElementById('joystick-base');
  const thumb = document.getElementById('joystick-thumb');
  const RADIUS = 24; // max thumb travel from centre (px)

  let active = false;

  function updateThumb(clientX, clientY) {
    const rect = base.getBoundingClientRect();
    const bx = rect.left + rect.width  / 2;
    const by = rect.top  + rect.height / 2;
    const dx = clientX - bx;
    const dy = clientY - by;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clamped = Math.min(dist, RADIUS);
    const angle = Math.atan2(dy, dx);
    const tx = Math.cos(angle) * clamped;
    const ty = Math.sin(angle) * clamped;
    thumb.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
    state.joystick.dx = dist > 6 ? dx / dist : 0;
    state.joystick.dy = dist > 6 ? dy / dist : 0;
  }

  function reset() {
    active = false;
    thumb.style.transform = 'translate(-50%, -50%)';
    state.joystick.dx = 0;
    state.joystick.dy = 0;
  }

  base.addEventListener('touchstart', e => {
    e.preventDefault();
    active = true;
    updateThumb(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  base.addEventListener('touchmove', e => {
    e.preventDefault();
    if (active) updateThumb(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  base.addEventListener('touchend',   reset);
  base.addEventListener('touchcancel', reset);
}
