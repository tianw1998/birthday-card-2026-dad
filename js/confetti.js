let confettiCanvas = null;
let confettiCtx    = null;
let particles      = [];
let running        = false;

const COLORS = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF9FF3','#FFA502','#FF6348'];

export function initConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  confettiCtx    = confettiCanvas.getContext('2d');
}

export function resizeConfettiCanvas() {
  if (!confettiCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  confettiCanvas.width  = confettiCanvas.offsetWidth  * dpr;
  confettiCanvas.height = confettiCanvas.offsetHeight * dpr;
  confettiCanvas.style.width  = confettiCanvas.offsetWidth  + 'px';
  confettiCanvas.style.height = confettiCanvas.offsetHeight + 'px';
  if (confettiCtx) {
    confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}

function spawnParticles() {
  const w = confettiCanvas.offsetWidth;
  const h = confettiCanvas.offsetHeight;
  particles = [];
  for (let i = 0; i < 90; i++) {
    particles.push({
      x:      Math.random() * w,
      y:      -10 - Math.random() * 120,
      vx:     (Math.random() - 0.5) * 3,
      vy:     2.5 + Math.random() * 3,
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      w:      5 + Math.random() * 6,
      h:      3 + Math.random() * 4,
      rot:    Math.random() * Math.PI * 2,
      rSpeed: (Math.random() - 0.5) * 0.18,
    });
  }
}

function animate() {
  if (!running) {
    confettiCtx.clearRect(0, 0, confettiCanvas.offsetWidth, confettiCanvas.offsetHeight);
    return;
  }
  confettiCtx.clearRect(0, 0, confettiCanvas.offsetWidth, confettiCanvas.offsetHeight);
  const h = confettiCanvas.offsetHeight;
  particles = particles.filter(p => p.y < h + 20);

  particles.forEach(p => {
    p.x   += p.vx;
    p.y   += p.vy;
    p.rot += p.rSpeed;
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  });

  requestAnimationFrame(animate);
}

export function startConfetti(duration = 3000) {
  resizeConfettiCanvas();
  spawnParticles();
  running = true;
  animate();
  setTimeout(() => {
    running = false;
  }, duration);
}
