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
  mom: '爸爸生日快樂！這一年辛苦你了，感謝你一直照顧著我們這個家，希望你天天健康、開心、平安。我們愛你 ♥',
  brother: '老爸生日快樂！從小到大你都默默扛起所有事，願你新的一歲少一點操心，多一點屬於自己的時間，好好休息。',
  me: '爸生日快樂！我們都長大了，現在換我們來照顧你。希望你身體永遠健康，繼續當那個愛講冷笑話的老爸 :)',
};

export const PROXIMITY_TILES = 1.8;
export const PLAYER_SPEED = 2.5;
