import { PresetPattern } from '../types';

export const PRESET_PATTERNS: PresetPattern[] = [
  {
    id: 'heart-8',
    name: 'Pixel Heart',
    category: 'Art',
    rows: 8,
    cols: 8,
    description: 'Classic 8-bit romantic heart icon',
    cells: [
      [0, 1, 1, 0, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    id: 'space-invader',
    name: 'Space Invader',
    category: 'Art',
    rows: 8,
    cols: 11,
    description: 'Iconic arcade alien sprite',
    cells: [
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
    ],
  },
  {
    id: 'smiley-10',
    name: 'Smiley Face',
    category: 'Art',
    rows: 10,
    cols: 10,
    description: 'Friendly 10x10 pixel emoticon',
    cells: [
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    ],
  },
  {
    id: 'glider-life',
    name: 'Conway Glider & Blinker',
    category: 'Life',
    rows: 16,
    cols: 16,
    description: 'Traveling glider ship and oscillating blinkers',
    cells: (() => {
      const g = Array.from({ length: 16 }, () => Array(16).fill(0));
      // Glider at top left
      g[1][2] = 1;
      g[2][3] = 1;
      g[3][1] = 1;
      g[3][2] = 1;
      g[3][3] = 1;
      // Blinker at bottom right
      g[10][10] = 1;
      g[10][11] = 1;
      g[10][12] = 1;
      // Toad at top right
      g[2][11] = 1;
      g[2][12] = 1;
      g[2][13] = 1;
      g[3][10] = 1;
      g[3][11] = 1;
      g[3][12] = 1;
      return g;
    })(),
  },
  {
    id: 'pulsar-life',
    name: 'Pulsar Oscillator',
    category: 'Life',
    rows: 17,
    cols: 17,
    description: 'Period-3 magnificent life oscillator',
    cells: (() => {
      const g = Array.from({ length: 17 }, () => Array(17).fill(0));
      const rowsToSet = [2, 4, 5, 6, 10, 11, 12, 14];
      const colsToSet = [2, 4, 5, 6, 10, 11, 12, 14];
      const offsets = [4, 5, 6, 10, 11, 12];
      [2, 7, 9, 14].forEach(r => {
        offsets.forEach(c => {
          g[r][c] = 1;
          g[c][r] = 1;
        });
      });
      return g;
    })(),
  },
  {
    id: 'checker-8',
    name: 'Chessboard',
    category: 'Classic',
    rows: 8,
    cols: 8,
    description: 'Standard 8x8 tournament chessboard alternating tiles',
    cells: Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) => ((r + c) % 2 === 0 ? 1 : 0))
    ),
  },
  {
    id: 'diamond-11',
    name: 'Navigational Compass',
    category: 'Geometric',
    rows: 11,
    cols: 11,
    description: 'Symmetric geometric star & diamond compass',
    cells: [
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    ],
  },
  {
    id: 'maze-13',
    name: 'Micro Maze',
    category: 'Geometric',
    rows: 13,
    cols: 13,
    description: 'Labyrinthine paths with entrance and exit',
    cells: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
  },
];
