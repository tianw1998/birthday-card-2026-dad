export const TILE = 32;
export const COLS = 15;
export const ROWS = 10;

// 0 = walkable, 1 = obstacle
export const COLLISION = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // row 0: top wall
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // row 1: TV cabinet (full obstacle)
  [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],  // row 2: 竹藤椅 c2, 長桌 c4-10, 木桌電話 c12
  [1,0,0,0,1,1,1,1,1,1,1,0,0,0,1],  // row 3: 長桌 c4-10 still obstacle
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // row 4: walkable
  [1,1,0,0,0,0,0,0,0,0,1,1,1,1,1],  // row 5: 大書櫃 c1, 木頭沙發右 c10-13
  [1,1,0,0,0,0,0,0,0,0,1,1,1,1,1],  // row 6: 大書櫃 c1, 木頭沙發右 c10-13
  [1,1,0,0,1,1,1,1,1,0,1,1,1,1,1],  // row 7: 大書櫃 c1, 木頭沙發下 c4-8, 木桌禮物 c10-13
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],  // row 8: 大書櫃 c1, otherwise walkable
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // row 9: bottom wall
];

export const NPCS = [
  {
    id: 'mom',
    name: '媽',
    tileX: 5, tileY: 6,
    title: '來自媽媽的祝福 💓',
    hairColor: '#3D1A10',   // dark reddish-brown (from photo)
    shirtColor: '#C0392B',  // orange-red jacket (from photo; original #D4A0B0 was wrong)
  },
  {
    id: 'brother',
    name: '哥',
    tileX: 8, tileY: 6,
    title: '來自哥哥的祝福 🎁',
    hairColor: '#1A1A1A',   // near-black (from photo)
    shirtColor: '#A8C8E8',  // light steel-blue school uniform (original #4A90D9 was too dark)
  },
  {
    id: 'me',
    name: '弟',
    tileX: 12, tileY: 4,
    title: '來自弟弟的祝福 🎂',
    hairColor: '#2A2018',   // dark brown-black with slight curl (from photo)
    shirtColor: '#F0F0F0',  // white shirt (original #6BBF6B green was wrong)
  },
];

export const PLAYER_START = { tileX: 7, tileY: 5 };

export const MESSAGES = {
  mom: '親口對您說！',
  brother: '親愛的爸爸，感謝您總是為家庭遮風擋雨，做我們最堅強的後盾。祝您生日快樂，天天開心，身體健康，永遠是我們心中最偉大的英雄！',
  me: '在這個重要的日子，格外想念您，您給予的愛與關照、有您相伴的成長回憶也湧上心頭，祝爸爸生日快樂！',
};

export const PROXIMITY_TILES = 1.8;
export const PLAYER_SPEED = 1.5;
