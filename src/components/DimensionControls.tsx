import React, { useState } from 'react';
import { RefreshCw, Maximize2, Link2, Link2Off, Grid3X3 } from 'lucide-react';

interface DimensionControlsProps {
  rows: number;
  cols: number;
  onApplyDimensions: (newRows: number, newCols: number, preserveContent: boolean) => void;
}

export const DimensionControls: React.FC<DimensionControlsProps> = ({
  rows,
  cols,
  onApplyDimensions,
}) => {
  const [inputRows, setInputRows] = useState<number>(rows);
  const [inputCols, setInputCols] = useState<number>(cols);
  const [keepAspect, setKeepAspect] = useState<boolean>(rows === cols);
  const [preserveContent, setPreserveContent] = useState<boolean>(true);

  // Sync internal state if external props change (e.g., from preset loaded)
  React.useEffect(() => {
    setInputRows(rows);
    setInputCols(cols);
    if (rows === cols && !keepAspect) {
      // Keep state as is
    }
  }, [rows, cols]);

  const handleRowsChange = (val: number) => {
    const clamped = Math.max(1, Math.min(100, isNaN(val) ? 1 : val));
    setInputRows(clamped);
    if (keepAspect) {
      setInputCols(clamped);
    }
  };

  const handleColsChange = (val: number) => {
    const clamped = Math.max(1, Math.min(100, isNaN(val) ? 1 : val));
    setInputCols(clamped);
    if (keepAspect) {
      setInputRows(clamped);
    }
  };

  const applyPreset = (r: number, c: number) => {
    setInputRows(r);
    setInputCols(c);
    onApplyDimensions(r, c, preserveContent);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onApplyDimensions(inputRows, inputCols, preserveContent);
  };

  const hasChanges = inputRows !== rows || inputCols !== cols;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Dimension inputs */}
        <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="rows-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Rows (N)
            </label>
            <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 overflow-hidden focus-within:ring-2 focus-within:ring-slate-400">
              <button
                type="button"
                onClick={() => handleRowsChange(inputRows - 1)}
                className="px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-bold"
                aria-label="Decrease rows"
              >
                -
              </button>
              <input
                id="rows-input"
                type="number"
                min="1"
                max="100"
                value={inputRows}
                onChange={(e) => handleRowsChange(parseInt(e.target.value, 10))}
                className="w-14 text-center font-mono-numbers text-sm font-semibold bg-transparent border-none text-slate-900 dark:text-slate-100 focus:outline-none py-1"
              />
              <button
                type="button"
                onClick={() => handleRowsChange(inputRows + 1)}
                className="px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-bold"
                aria-label="Increase rows"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = !keepAspect;
              setKeepAspect(next);
              if (next) setInputCols(inputRows);
            }}
            title={keepAspect ? 'Square aspect ratio locked' : 'Unlock aspect ratio'}
            className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
              keepAspect
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {keepAspect ? <Link2 className="w-4 h-4" /> : <Link2Off className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2">
            <label htmlFor="cols-input" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Cols (M)
            </label>
            <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 overflow-hidden focus-within:ring-2 focus-within:ring-slate-400">
              <button
                type="button"
                onClick={() => handleColsChange(inputCols - 1)}
                className="px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-bold"
                aria-label="Decrease columns"
              >
                -
              </button>
              <input
                id="cols-input"
                type="number"
                min="1"
                max="100"
                value={inputCols}
                onChange={(e) => handleColsChange(parseInt(e.target.value, 10))}
                className="w-14 text-center font-mono-numbers text-sm font-semibold bg-transparent border-none text-slate-900 dark:text-slate-100 focus:outline-none py-1"
              />
              <button
                type="button"
                onClick={() => handleColsChange(inputCols + 1)}
                className="px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs font-bold"
                aria-label="Increase columns"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm ${
              hasChanges
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{hasChanges ? 'Apply Dimensions' : 'Regenerate'}</span>
          </button>

          <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={preserveContent}
              onChange={(e) => setPreserveContent(e.target.checked)}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            <span>Keep pattern</span>
          </label>
        </form>

        {/* Quick dimension presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <span className="text-slate-400 dark:text-slate-500 text-xs font-medium mr-1 shrink-0 flex items-center gap-1">
            <Grid3X3 className="w-3.5 h-3.5" />
            Quick:
          </span>
          {[
            { label: '8×8', r: 8, c: 8 },
            { label: '16×16', r: 16, c: 16 },
            { label: '24×24', r: 24, c: 24 },
            { label: '32×32', r: 32, c: 32 },
            { label: '10×20', r: 10, c: 20 },
            { label: '50×50', r: 50, c: 50 },
          ].map((preset) => {
            const isActive = rows === preset.r && cols === preset.c;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset.r, preset.c)}
                className={`px-2.5 py-1 font-mono-numbers rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
