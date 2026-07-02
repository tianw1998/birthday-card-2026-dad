export const TILE = 32;
export const COLS = 10;
export const ROWS = 13;

// 0 = walkable, 1 = obstacle. Portrait layout matching mockup.png.
export const COLLISION = [
  [1,1,1,1,1,1,1,1,1,1], // row 0: void border
  [1,1,1,1,1,1,1,1,1,1], // row 1: wall strip
  [1,1,1,1,1,1,1,1,1,1], // row 2: wall strip + furniture tops
  [1,1,1,1,0,0,1,1,1,1], // row 3: lamp c1, dresser c2-3, bookshelf c6-7, plant c8
  [1,0,0,0,0,0,0,0,1,1], // row 4: open corridor, 哥's chair c8
  [1,1,1,1,1,0,0,0,1,1], // row 5: 媽's chair c1, table c2-4, 哥's chair c8
  [1,1,1,1,1,0,0,0,1,1], // row 6: 媽's chair c1, table c2-4, 弟's chair c8
  [1,1,1,1,1,0,0,0,1,1], // row 7: side table c1, table legs c2-4, 弟's chair c8
  [1,1,0,0,0,0,0,0,1,1], // row 8: side table c1, stool c8
  [1,0,0,0,0,0,0,0,0,1], // row 9: open (rug)
  [1,1,0,1,1,1,1,0,1,1], // row 10: palm c1, sofa c3-5, gifts c6, plant c8
  [1,0,0,1,1,1,0,1,0,1], // row 11: sofa c3-5, door c7
  [1,1,1,1,1,1,1,1,1,1], // row 12: void border
];

// Character art is native 16px-grid (half the 32px furniture grid), so every
// character sprite is drawn at 2x. sitOffset is the hand-tuned pixel nudge
// (at 2x scale) from the chair's tile origin to align the sitter with the seat.
export const NPCS = [
  {
    id: 'mom',
    name: '媽',
    tileX: 1, tileY: 5,
    title: '來自媽媽的祝福 💓',
    sitSheet: 'momSit',
    sitFrame: 0, // faces right, toward the table
    sitOffset: { dx: -10, dy: -2 },
  },
  {
    id: 'brother',
    name: '哥',
    tileX: 8, tileY: 4,
    title: '來自哥哥的祝福 🎁',
    sitSheet: 'brotherSit',
    sitFrame: 12, // faces left, into the room
    sitOffset: { dx: -28, dy: -2 },
  },
  {
    id: 'me',
    name: '弟',
    tileX: 8, tileY: 6,
    title: '來自弟弟的祝福 🎂',
    sitSheet: 'meSit',
    sitFrame: 12, // faces left, into the room
    sitOffset: { dx: -28, dy: -2 },
  },
];

export const PLAYER_START = { tileX: 4, tileY: 8 };

export const MESSAGES = {
  mom: '親口對您說！',
  brother: '親愛的爸爸，感謝您總是為家庭遮風擋雨，做我們最堅強的後盾。祝您生日快樂，天天開心，身體健康，永遠是我們心中最偉大的英雄！',
  me: '在這個重要的日子，格外想念您，您給予的愛與關照、有您相伴的成長回憶也湧上心頭，祝爸爸生日快樂！',
};

export const PROXIMITY_TILES = 1.8;
export const PLAYER_SPEED = 1.5;

// ---- Sprite sheet sources (LimeZu Modern Interiors, free version) ----
export const SPRITE_SHEETS = {
  interiors:   'assets/sprites/interiors.png',
  rooms:       'assets/sprites/rooms.png',
  dadIdle:     'assets/sprites/dad_idle.png',
  dadRun:      'assets/sprites/dad_run.png',
  momSit:      'assets/sprites/mom_sit.png',
  brotherSit:  'assets/sprites/brother_sit.png',
  meSit:       'assets/sprites/me_sit.png',
};

// Dad's idle/run sheets are 24 frames of 16x16, grouped in sixes:
// 0-5 right, 6-11 up, 12-17 left, 18-23 down. Pick one representative
// idle frame and a 2-frame walk cycle per direction.
export const DAD_FRAMES = {
  idle: { right: 0, up: 6, left: 12, down: 18 },
  walk: {
    right: [0, 3],
    up:    [6, 9],
    left:  [12, 15],
    down:  [18, 21],
  },
};

// Static furniture/decor draw list — each entry is a source rect from a
// sprite sheet blitted to a destination pixel position in the room.
// Coordinates mirror docs/superpowers/plans mockup composition.
const T = TILE;
export const FURNITURE = [
  // north wall decor
  { sheet: 'interiors', sx: 0*T,  sy: 15*T, sw: 2*T, sh: 1*T, dx: 2*T,     dy: 1*T + 14 }, // TV
  { sheet: 'interiors', sx: 9*T,  sy: 24*T, sw: 2*T, sh: 2*T, dx: 4*T,     dy: 1*T + 4 },  // window
  { sheet: 'interiors', sx: 11*T, sy: 53*T, sw: 1*T, sh: 2*T, dx: 1*T + 4, dy: 2*T + 2 },  // red lamp
  { sheet: 'interiors', sx: 3*T,  sy: 59*T, sw: 2*T, sh: 2*T, dx: 2*T,     dy: 2*T },      // dresser
  { sheet: 'interiors', sx: 5*T,  sy: 15*T, sw: 2*T, sh: 3*T, dx: 6*T,     dy: 1*T },      // bookshelf
  // rug (under furniture visually but drawn before furniture placed on it)
  { sheet: 'interiors', sx: 7*T,  sy: 15*T, sw: 4*T, sh: 3*T, dx: 3*T,     dy: 7*T, isRug: true },
  // dining nook (mom)
  { sheet: 'interiors', sx: 12*T, sy: 31*T, sw: 1*T, sh: 2*T, dx: 1*T,     dy: 5*T },      // mom's chair (faces right)
  { sheet: 'interiors', sx: 6*T,  sy: 10*T, sw: 3*T, sh: 3*T, dx: 2*T,     dy: 5*T },      // table
  // right-wall seating (brother + me)
  { sheet: 'interiors', sx: 14*T, sy: 33*T, sw: 1*T, sh: 2*T, dx: 8*T,     dy: 4*T, mirror: true }, // brother's chair
  { sheet: 'interiors', sx: 14*T, sy: 33*T, sw: 1*T, sh: 2*T, dx: 8*T,     dy: 6*T, mirror: true }, // me's chair
  { sheet: 'interiors', sx: 6*T,  sy: 13*T, sw: 1*T, sh: 1*T, dx: 8*T,     dy: 8*T },      // stool/side table
  // side table + bottom decor
  { sheet: 'interiors', sx: 11*T, sy: 10*T, sw: 1*T, sh: 2*T, dx: 1*T,     dy: 7*T },      // side table
  { sheet: 'interiors', sx: 7*T,  sy: 13*T, sw: 3*T, sh: 2*T, dx: 3*T,     dy: 10*T },     // sofa
  { sheet: 'interiors', sx: 7*T,  sy: 8*T,  sw: 1*T, sh: 2*T, dx: 7*T,     dy: 11*T },     // door
];

// Plants/palm use pixel-precise (non-tile-aligned) crops to avoid clipping foliage.
export const PLANTS = [
  { sheet: 'interiors', sx: 298, sy: 1434, sw: 82, sh: 78,  dx: 8*T - 84,  dy: 4*T - 78 }, // tall plant
  { sheet: 'interiors', sx: 384, sy: 1434, sw: 64, sh: 66,  dx: 8*T,       dy: 11*T - 66 }, // small plant
  { sheet: 'interiors', sx: 424, sy: 1400, sw: 64, sh: 62,  dx: 1*T + 4,   dy: 11*T - 62 }, // palm
];

// Table-top spread (hand pixel art, drawn via renderer's px8 helper)
export const CAKE_ROWS = [
  '....Y..Y..Y.....',
  '....O..O..O.....',
  '....Y..Y..Y.....',
  '...KWWWWWWWK....',
  '...KWPWPWPWK....',
  '..KWWWWWWWWWK...',
  '..KWWWWWWWWWK...',
  '..KPpPpPpPpPK...',
  '.KWWWWWWWWWWWK..',
  '.KWWWWWWWWWWWK..',
  '.KKKKKKKKKKKKK..',
];
export const COFFEE_ROWS = [
  '.KKKKK..',
  '.KcccKK.',
  '.KcccKKK',
  '.KcccKKK',
  '.KWWWKK.',
  '..KKK...',
];
export const PIXEL_PALETTE = {
  K: '#3A3444', W: '#FFFAF0', P: '#EEA0AA', p: '#D87D8C',
  Y: '#FFDC78', O: '#FF8C3C', R: '#C84646', r: '#A03030',
  B: '#648CD2', b: '#4664AA', G: '#F0C85A', g: '#C8963C',
  C: '#F5F0E6', c: '#785032',
};
export const GIFTS = [
  { dx: 6*T + 4,  dy: 10*T + 6,  rows: ['..KKKKKKKK..','.KRRGGGGRRK.','.KRRGGGGRRK.','.KKKKKKKKKK.','.KrrGGGGrrK.','.KrrGGGGrrK.','.KrrGGGGrrK.','.KKKKKKKKKK.'] },
  { dx: 6*T + 14, dy: 10*T + 16, rows: ['..KKKKKKKK..','.KBBGGGGBBK.','.KBBGGGGBBK.','.KKKKKKKKKK.','.KbbGGGGbbK.','.KbbGGGGbbK.','.KKKKKKKKKK.'] },
  { dx: 1*T + 8,  dy: 7*T + 18,  rows: ['..KKKKKKK..','.KGGRRGGGK.','.KKKKKKKKK.','.KggRRgggK.','.KggRRgggK.','.KKKKKKKKK.'] },
];
export const TABLE_ITEMS = [
  { sheet: 'interiors', sx: 12*T, sy: 14*T, sw: T, sh: T, dx: 2*T + 2,  dy: 5*T + 4 },  // cake slice
  { sheet: 'interiors', sx: 12*T, sy: 13*T, sw: T, sh: T, dx: 4*T - 6,  dy: 5*T + 4 },  // berry plate
  { sheet: 'interiors', sx: 11*T, sy: 12*T, sw: T, sh: T, dx: 2*T + 2,  dy: 6*T + 2 },  // pancake
];
export const CAKE_POS = { dx: 3*T, dy: 5*T - 10 };
export const COFFEE_POS = [
  { dx: 2*T + 22, dy: 6*T + 4 },
  { dx: 2*T + 40, dy: 6*T + 4 },
];
