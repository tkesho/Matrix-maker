import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Activity } from 'lucide-react';
import { stepGameOfLife, calculateGridStats } from '../utils/gridOperations';

interface AutomataControlsProps {
  grid: number[][];
  onGridChange: (newGrid: number[][]) => void;
}

export const AutomataControls: React.FC<AutomataControlsProps> = ({
  grid,
  onGridChange,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedFps, setSpeedFps] = useState<number>(6);
  const [generation, setGeneration] = useState<number>(0);
  const [wrapEdges, setWrapEdges] = useState<boolean>(true);

  const gridRef = useRef<number[][]>(grid);
  gridRef.current = grid;

  const wrapEdgesRef = useRef<boolean>(wrapEdges);
  wrapEdgesRef.current = wrapEdges;

  const stats = calculateGridStats(grid);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const next = stepGameOfLife(gridRef.current, wrapEdgesRef.current);
      onGridChange(next);
      setGeneration((prev) => prev + 1);
    }, 1000 / speedFps);

    return () => clearInterval(interval);
  }, [isPlaying, speedFps, onGridChange]);

  const handleStep = () => {
    const next = stepGameOfLife(grid, wrapEdges);
    onGridChange(next);
    setGeneration((prev) => prev + 1);
  };

  const handleResetGen = () => {
    setGeneration(0);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Conway's Game of Life Cellular Automaton
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Black tiles represent living cells. They evolve according to Conway's four rules of life and death.
          </p>
        </div>

        {/* Status indicator unboxed */}
        <div className="flex items-center gap-3 text-xs font-mono-numbers text-slate-600 dark:text-slate-400">
          <span>
            Gen: <strong className="text-slate-900 dark:text-slate-100">{generation}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Population: <strong className="text-slate-900 dark:text-slate-100">{stats.active}</strong>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        {/* Playback buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-sm ${
              isPlaying
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Simulation</span>
              </>
            )}
          </button>

          <button
            onClick={handleStep}
            disabled={isPlaying}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Step +1</span>
          </button>

          <button
            onClick={handleResetGen}
            title="Reset generation counter"
            className="p-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed and Boundary settings */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Speed:</span>
            <input
              type="range"
              min="1"
              max="24"
              value={speedFps}
              onChange={(e) => setSpeedFps(parseInt(e.target.value, 10))}
              className="w-24 accent-slate-900 dark:accent-slate-100 cursor-pointer"
            />
            <span className="font-mono-numbers text-slate-700 dark:text-slate-300 w-12 text-right">
              {speedFps} gen/s
            </span>
          </div>

          <label className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={wrapEdges}
              onChange={(e) => setWrapEdges(e.target.checked)}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
            />
            <span>Toroidal Wrap (Seamless edges)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
