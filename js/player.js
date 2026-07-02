import { COLLISION, TILE, PLAYER_SPEED, PLAYER_START } from './config.js';

function isSolid(tileX, tileY) {
  if (tileY < 0 || tileY >= COLLISION.length)    return true;
  if (tileX < 0 || tileX >= COLLISION[0].length) return true;
  return COLLISION[tileY][tileX] === 1;
}

// Check 4 corners of player hitbox (12×12 px) centred on feet position
function canMove(feetX, feetY) {
  const HW = 5; // half-width of hitbox
  return [
    [feetX - HW, feetY - HW],
    [feetX + HW, feetY - HW],
    [feetX - HW, feetY],
    [feetX + HW, feetY],
  ].every(([cx, cy]) => !isSolid(Math.floor(cx / TILE), Math.floor(cy / TILE)));
}

export function updatePlayer(state) {
  if (state.phase !== 'playing') return;

  const { dx, dy } = state.joystick;
  if (dx === 0 && dy === 0) return;

  // Track facing direction (dominant axis) for sprite selection
  state.player.dir = Math.abs(dx) >= Math.abs(dy)
    ? (dx > 0 ? 'right' : 'left')
    : (dy > 0 ? 'down' : 'up');

  // Feet centre in world pixels
  const feetX = state.player.x + TILE / 2;
  const feetY = state.player.y + TILE;

  // Try x movement independently (wall sliding)
  const nx = feetX + dx * PLAYER_SPEED;
  if (canMove(nx, feetY)) {
    state.player.x = nx - TILE / 2;
  }

  // Try y movement independently (wall sliding)
  const ny = feetY + dy * PLAYER_SPEED;
  if (canMove(feetX, ny)) {
    state.player.y = ny - TILE;
  }

  // Clamp to map bounds
  state.player.x = Math.max(0, Math.min(state.player.x, (COLLISION[0].length - 1) * TILE));
  state.player.y = Math.max(0, Math.min(state.player.y, (COLLISION.length - 1) * TILE));
}
