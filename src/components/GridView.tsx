import React, { useState, useRef, useCallback } from 'react';
import { ToolType, SymmetryMode, ColorTheme } from '../types';
import {
  cloneGrid,
  getSymmetricCoords,
  floodFill,
  getLineCoordinates,
  getRectangleCoordinates,
} from '../utils/gridOperations';

interface GridViewProps {
  grid: number[][];
  onGridChange: (newGrid: number[][]) => void;
  tool: ToolType;
  symmetry: SymmetryMode;
  cellSize: number;
  showGridLines: boolean;
  showCoordinates: boolean;
  theme: ColorTheme;
  onHoverCoordChange?: (r: number | null, c: number | null) => void;
}

export const GridView: React.FC<GridViewProps> = ({
  grid,
  onGridChange,
  tool,
  symmetry,
  cellSize,
  showGridLines,
  showCoordinates,
  theme,
  onHoverCoordChange,
}) => {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  // Pointer drag state
  const isPointerDownRef = useRef(false);
  const dragModeRef = useRef<number>(1); // For pen/eraser or toggle mode
  const currentGridRef = useRef<number[][]>(grid);
  currentGridRef.current = grid;

  // For shape tools (line, rect)
  const [dragStart, setDragStart] = useState<{ r: number; c: number } | null>(null);
  const [dragCurrent, setDragCurrent] = useState<{ r: number; c: number } | null>(null);

  // Apply cell updates with symmetry
  const applyAt = useCallback(
    (r: number, c: number, targetValue: number, baseGrid: number[][]): number[][] => {
      const symCoords = getSymmetricCoords(r, c, rows, cols, symmetry);
      const next = cloneGrid(baseGrid);
      symCoords.forEach((pt) => {
        next[pt.r][pt.c] = targetValue;
      });
      return next;
    },
    [rows, cols, symmetry]
  );

  // Handle pointer down on a tile
  const handlePointerDown = (r: number, c: number, e: React.PointerEvent) => {
    // Only handle primary button
    if (e.button !== 0) return;

    isPointerDownRef.current = true;

    if (tool === 'bucket') {
      const targetVal = grid[r][c] === 1 ? 0 : 1;
      const filled = floodFill(grid, r, c, targetVal);
      onGridChange(filled);
      return;
    }

    if (tool === 'line' || tool === 'rect') {
      setDragStart({ r, c });
      setDragCurrent({ r, c });
      return;
    }

    // Pen, Eraser, or Toggle
    let targetVal = 1;
    if (tool === 'eraser') {
      targetVal = 0;
    } else if (tool === 'pen') {
      targetVal = 1;
    } else if (tool === 'toggle') {
      targetVal = grid[r][c] === 1 ? 0 : 1;
    }

    dragModeRef.current = targetVal;
    const updated = applyAt(r, c, targetVal, grid);
    onGridChange(updated);
  };

  // Handle pointer enter during drag
  const handlePointerEnter = (r: number, c: number) => {
    onHoverCoordChange?.(r + 1, c + 1);

    if (!isPointerDownRef.current) return;

    if (tool === 'line' || tool === 'rect') {
      setDragCurrent({ r, c });
      return;
    }

    if (tool === 'pen' || tool === 'eraser' || tool === 'toggle') {
      const updated = applyAt(r, c, dragModeRef.current, currentGridRef.current);
      onGridChange(updated);
    }
  };

  // Handle pointer up
  const handlePointerUp = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    // Commit line or rect if active
    if ((tool === 'line' || tool === 'rect') && dragStart && dragCurrent) {
      let coords: Array<{ r: number; c: number }> = [];
      if (tool === 'line') {
        coords = getLineCoordinates(dragStart.r, dragStart.c, dragCurrent.r, dragCurrent.c);
      } else {
        coords = getRectangleCoordinates(dragStart.r, dragStart.c, dragCurrent.r, dragCurrent.c, false);
      }

      let next = cloneGrid(currentGridRef.current);
      coords.forEach(({ r, c }) => {
        const symCoords = getSymmetricCoords(r, c, rows, cols, symmetry);
        symCoords.forEach((pt) => {
          next[pt.r][pt.c] = 1;
        });
      });

      onGridChange(next);
      setDragStart(null);
      setDragCurrent(null);
    }
  };

  // Compute preview overlay coordinates for line/rect
  const previewSet = React.useMemo(() => {
    if (!dragStart || !dragCurrent || (tool !== 'line' && tool !== 'rect')) {
      return new Set<string>();
    }

    let coords: Array<{ r: number; c: number }> = [];
    if (tool === 'line') {
      coords = getLineCoordinates(dragStart.r, dragStart.c, dragCurrent.r, dragCurrent.c);
    } else {
      coords = getRectangleCoordinates(dragStart.r, dragStart.c, dragCurrent.r, dragCurrent.c, false);
    }

    const set = new Set<string>();
    coords.forEach(({ r, c }) => {
      const symCoords = getSymmetricCoords(r, c, rows, cols, symmetry);
      symCoords.forEach((pt) => set.add(`${pt.r},${pt.c}`));
    });

    return set;
  }, [dragStart, dragCurrent, tool, rows, cols, symmetry]);

  return (
    <div
      className="relative w-full overflow-auto max-h-[72vh] flex flex-col items-center p-4 sm:p-6 bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl select-none transition-colors"
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        handlePointerUp();
        onHoverCoordChange?.(null, null);
      }}
    >
      <div className="relative inline-block max-w-full">
        {/* Top coordinate numbers (Columns 1..M) */}
        {showCoordinates && (
          <div
            className="flex mb-1"
            style={{
              marginLeft: showCoordinates ? '28px' : '0',
              width: `${cols * cellSize}px`,
            }}
          >
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={`col-head-${c}`}
                style={{ width: `${cellSize}px` }}
                className="text-[10px] font-mono-numbers text-center text-slate-400 dark:text-slate-500 truncate"
              >
                {c + 1}
              </div>
            ))}
          </div>
        )}

        <div className="flex">
          {/* Left coordinate numbers (Rows 1..N) */}
          {showCoordinates && (
            <div
              className="flex flex-col mr-1 shrink-0"
              style={{
                width: '24px',
                height: `${rows * cellSize}px`,
              }}
            >
              {Array.from({ length: rows }).map((_, r) => (
                <div
                  key={`row-head-${r}`}
                  style={{ height: `${cellSize}px` }}
                  className="text-[10px] font-mono-numbers text-right pr-1 flex items-center justify-end text-slate-400 dark:text-slate-500"
                >
                  {r + 1}
                </div>
              ))}
            </div>
          )}

          {/* The CSS Grid Canvas */}
          <div
            className="grid shadow-sm rounded-sm transition-all"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
              gap: showGridLines ? '1px' : '0px',
              backgroundColor: showGridLines ? theme.gridLineColor : theme.inactiveColor,
              padding: showGridLines ? '1px' : '0px',
            }}
          >
            {grid.map((rowArr, r) =>
              rowArr.map((cellVal, c) => {
                const isPreview = previewSet.has(`${r},${c}`);
                const isCellActive = isPreview ? true : cellVal === 1;

                // Determine symmetry guideline visual
                const isMidCol =
                  (symmetry === 'horizontal' || symmetry === 'quad') &&
                  (c === Math.floor(cols / 2) || (cols % 2 === 0 && c === cols / 2 - 1));
                const isMidRow =
                  (symmetry === 'vertical' || symmetry === 'quad') &&
                  (r === Math.floor(rows / 2) || (rows % 2 === 0 && r === rows / 2 - 1));

                return (
                  <div
                    key={`cell-${r}-${c}`}
                    data-row={r}
                    data-col={c}
                    onPointerDown={(e) => handlePointerDown(r, c, e)}
                    onPointerEnter={() => handlePointerEnter(r, c)}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`,
                      backgroundColor: isCellActive ? theme.activeColor : theme.inactiveColor,
                    }}
                    className={`transition-colors duration-100 cursor-pointer relative group ${
                      isPreview ? 'ring-2 ring-indigo-500 z-10' : ''
                    } hover:brightness-90 active:scale-95`}
                  >
                    {/* Visual subtle symmetry guideline indicator */}
                    {(isMidCol || isMidRow) && (
                      <div
                        className={`absolute inset-0 pointer-events-none opacity-20 border-slate-400 ${
                          isMidCol ? 'border-r' : ''
                        } ${isMidRow ? 'border-b' : ''}`}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
