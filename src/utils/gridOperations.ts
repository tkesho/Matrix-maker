import { SymmetryMode } from '../types';

/**
 * Creates an empty 2D matrix of dimensions rows x cols filled with 0 (white)
 */
export function createEmptyGrid(rows: number, cols: number): number[][] {
  const safeRows = Math.max(1, Math.min(100, rows));
  const safeCols = Math.max(1, Math.min(100, cols));
  const grid: number[][] = [];
  for (let r = 0; r < safeRows; r++) {
    grid.push(new Array(safeCols).fill(0));
  }
  return grid;
}

/**
 * Deep clones a 2D matrix
 */
export function cloneGrid(grid: number[][]): number[][] {
  return grid.map(row => [...row]);
}

/**
 * Resizes a grid to new dimensions, anchoring content top-left or centered
 */
export function resizeGrid(
  oldGrid: number[][],
  newRows: number,
  newCols: number,
  anchor: 'top-left' | 'center' = 'top-left'
): number[][] {
  const newGrid = createEmptyGrid(newRows, newCols);
  const oldRows = oldGrid.length;
  const oldCols = oldGrid[0]?.length || 0;

  let rowOffset = 0;
  let colOffset = 0;

  if (anchor === 'center') {
    rowOffset = Math.floor((newRows - oldRows) / 2);
    colOffset = Math.floor((newCols - oldCols) / 2);
  }

  for (let r = 0; r < oldRows; r++) {
    for (let c = 0; c < oldCols; c++) {
      const targetR = r + rowOffset;
      const targetC = c + colOffset;
      if (targetR >= 0 && targetR < newRows && targetC >= 0 && targetC < newCols) {
        newGrid[targetR][targetC] = oldGrid[r][c];
      }
    }
  }

  return newGrid;
}

/**
 * Calculates symmetric target coordinates based on symmetry mode
 */
export function getSymmetricCoords(
  r: number,
  c: number,
  rows: number,
  cols: number,
  symmetry: SymmetryMode
): Array<{ r: number; c: number }> {
  const points = new Map<string, { r: number; c: number }>();
  const addPoint = (row: number, col: number) => {
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      points.set(`${row},${col}`, { r: row, c: col });
    }
  };

  addPoint(r, c);

  if (symmetry === 'horizontal' || symmetry === 'quad') {
    addPoint(r, cols - 1 - c);
  }
  if (symmetry === 'vertical' || symmetry === 'quad') {
    addPoint(rows - 1 - r, c);
  }
  if (symmetry === 'quad') {
    addPoint(rows - 1 - r, cols - 1 - c);
  }

  return Array.from(points.values());
}

/**
 * Flood fill (bucket tool) using Breadth-First Search
 */
export function floodFill(
  grid: number[][],
  startR: number,
  startC: number,
  fillValue: number
): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const targetValue = grid[startR][startC];

  if (targetValue === fillValue) return grid;

  const newGrid = cloneGrid(grid);
  const queue: Array<[number, number]> = [[startR, startC]];
  const visited = new Set<string>();
  visited.add(`${startR},${startC}`);

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (queue.length > 0) {
    const [currR, currC] = queue.shift()!;
    newGrid[currR][currC] = fillValue;

    for (const [dr, dc] of directions) {
      const nextR = currR + dr;
      const nextC = currC + dc;
      const key = `${nextR},${nextC}`;

      if (
        nextR >= 0 &&
        nextR < rows &&
        nextC >= 0 &&
        nextC < cols &&
        !visited.has(key) &&
        newGrid[nextR][nextC] === targetValue
      ) {
        visited.add(key);
        queue.push([nextR, nextC]);
      }
    }
  }

  return newGrid;
}

/**
 * Bresenham's line algorithm between two coordinates
 */
export function getLineCoordinates(
  r0: number,
  c0: number,
  r1: number,
  c1: number
): Array<{ r: number; c: number }> {
  const coords: Array<{ r: number; c: number }> = [];
  const dc = Math.abs(c1 - c0);
  const dr = Math.abs(r1 - r0);
  const sc = c0 < c1 ? 1 : -1;
  const sr = r0 < r1 ? 1 : -1;
  let err = (dc > dr ? dc : -dr) / 2;

  let currentC = c0;
  let currentR = r0;

  while (true) {
    coords.push({ r: currentR, c: currentC });
    if (currentC === c1 && currentR === r1) break;
    const e2 = err;
    if (e2 > -dc) {
      err -= dr;
      currentC += sc;
    }
    if (e2 < dr) {
      err += dc;
      currentR += sr;
    }
  }

  return coords;
}

/**
 * Gets coordinates for a rectangle (outline or filled)
 */
export function getRectangleCoordinates(
  r0: number,
  c0: number,
  r1: number,
  c1: number,
  filled: boolean = false
): Array<{ r: number; c: number }> {
  const minR = Math.min(r0, r1);
  const maxR = Math.max(r0, r1);
  const minC = Math.min(c0, c1);
  const maxC = Math.max(c0, c1);
  const coords: Array<{ r: number; c: number }> = [];

  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      if (filled || r === minR || r === maxR || c === minC || c === maxC) {
        coords.push({ r, c });
      }
    }
  }
  return coords;
}

/**
 * Grid operations: Invert all tiles
 */
export function invertGrid(grid: number[][]): number[][] {
  return grid.map(row => row.map(cell => (cell === 1 ? 0 : 1)));
}

/**
 * Grid operations: Randomize with density threshold
 */
export function randomizeGrid(rows: number, cols: number, density: number = 0.3): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(Math.random() < density ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Grid operations: Checkerboard pattern
 */
export function createCheckerboard(rows: number, cols: number): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      row.push((r + c) % 2 === 0 ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Grid operations: Border outline
 */
export function createBorderGrid(rows: number, cols: number): number[][] {
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      const isBorder = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
      row.push(isBorder ? 1 : 0);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Rotate grid 90 degrees clockwise
 */
export function rotateGridClockwise(grid: number[][]): number[][] {
  const oldRows = grid.length;
  const oldCols = grid[0].length;
  const newGrid = createEmptyGrid(oldCols, oldRows);

  for (let r = 0; r < oldRows; r++) {
    for (let c = 0; c < oldCols; c++) {
      newGrid[c][oldRows - 1 - r] = grid[r][c];
    }
  }
  return newGrid;
}

/**
 * Flip grid horizontally
 */
export function flipGridHorizontal(grid: number[][]): number[][] {
  return grid.map(row => [...row].reverse());
}

/**
 * Flip grid vertically
 */
export function flipGridVertical(grid: number[][]): number[][] {
  return [...grid].reverse().map(row => [...row]);
}

/**
 * Step Conway's Game of Life
 */
export function stepGameOfLife(grid: number[][], wrapEdges: boolean = true): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const nextGrid = createEmptyGrid(rows, cols);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let liveNeighbors = 0;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;

          let nr = r + dr;
          let nc = c + dc;

          if (wrapEdges) {
            nr = (nr + rows) % rows;
            nc = (nc + cols) % cols;
          }

          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            if (grid[nr][nc] === 1) liveNeighbors++;
          }
        }
      }

      const isAlive = grid[r][c] === 1;
      if (isAlive && (liveNeighbors === 2 || liveNeighbors === 3)) {
        nextGrid[r][c] = 1;
      } else if (!isAlive && liveNeighbors === 3) {
        nextGrid[r][c] = 1;
      } else {
        nextGrid[r][c] = 0;
      }
    }
  }

  return nextGrid;
}

/**
 * Calculates metrics and statistics for the grid
 */
export function calculateGridStats(grid: number[][]) {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const total = rows * cols;
  let active = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) active++;
    }
  }

  const inactive = total - active;
  const percent = total > 0 ? ((active / total) * 100).toFixed(1) : '0.0';

  return {
    rows,
    cols,
    total,
    active,
    inactive,
    percent,
  };
}

/**
 * Generate full HTML file string equivalent to the standalone prototype
 */
export function generateStandaloneHtml(
  grid: number[][],
  activeColor: string = '#111827',
  inactiveColor: string = '#ffffff'
): string {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const cellsJson = JSON.stringify(grid);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${rows}x${cols} Grid Matrix</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
    body { background-color: #f8fafc; color: #0f172a; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 2rem 1rem; }
    h1 { margin-bottom: 1.5rem; font-size: 1.75rem; font-weight: 700; }
    .grid-container { max-width: 90vw; max-height: 75vh; overflow: auto; padding: 1rem; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .grid { display: grid; grid-template-columns: repeat(${cols}, 36px); grid-template-rows: repeat(${rows}, 36px); gap: 3px; background-color: #e2e8f0; padding: 3px; border-radius: 6px; }
    .tile { width: 36px; height: 36px; background-color: ${inactiveColor}; border: 1px solid #cbd5e1; border-radius: 3px; cursor: pointer; user-select: none; transition: background-color 0.15s; }
    .tile.active { background-color: ${activeColor}; border-color: ${activeColor}; }
    .tile:hover { opacity: 0.85; }
  </style>
</head>
<body>
  <h1>${rows} &times; ${cols} Grid</h1>
  <div class="grid-container">
    <div class="grid" id="grid"></div>
  </div>
  <script>
    const initialCells = ${cellsJson};
    const grid = document.getElementById('grid');
    const fragment = document.createDocumentFragment();

    initialCells.forEach((row, r) => {
      row.forEach((val, c) => {
        const tile = document.createElement('div');
        tile.className = 'tile' + (val === 1 ? ' active' : '');
        fragment.appendChild(tile);
      });
    });
    grid.appendChild(fragment);

    grid.addEventListener('click', (e) => {
      if (e.target.classList.contains('tile')) {
        e.target.classList.toggle('active');
      }
    });
  </script>
</body>
</html>`;
}
