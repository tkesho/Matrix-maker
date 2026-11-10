import React from 'react';
import { calculateGridStats } from '../utils/gridOperations';

interface StatsBarProps {
  grid: number[][];
  hoverCoord: { r: number | null; c: number | null };
}

export const StatsBar: React.FC<StatsBarProps> = ({ grid, hoverCoord }) => {
  const stats = calculateGridStats(grid);

  return (
    <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4 py-2 px-1 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 font-mono-numbers">
      {/* Metrics unboxed with typographic separators */}
      <div className="flex flex-wrap items-center gap-2">
        <span>
          Grid: <strong className="text-slate-900 dark:text-slate-100">{stats.rows} &times; {stats.cols}</strong> ({stats.total.toLocaleString()} tiles)
        </span>
        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
        <span>
          Active (Black): <strong className="text-slate-900 dark:text-slate-100">{stats.active.toLocaleString()}</strong> ({stats.percent}%)
        </span>
        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
        <span>
          Inactive (White): <strong className="text-slate-900 dark:text-slate-100">{stats.inactive.toLocaleString()}</strong>
        </span>
      </div>

      {/* Coordinate inspection */}
      <div className="flex items-center gap-2">
        {hoverCoord.r !== null && hoverCoord.c !== null ? (
          <span>
            Cursor: Row <strong className="text-slate-900 dark:text-slate-100">{hoverCoord.r}</strong>, Col <strong className="text-slate-900 dark:text-slate-100">{hoverCoord.c}</strong>
          </span>
        ) : (
          <span>Hover a tile to inspect coordinates</span>
        )}
      </div>
    </div>
  );
};
