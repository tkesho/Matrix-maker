import React, { useState } from 'react';
import { PRESET_PATTERNS } from '../utils/presets';
import { PresetPattern } from '../types';
import { ArrowRight, Check } from 'lucide-react';

interface PresetLibraryProps {
  onLoadPreset: (preset: PresetPattern) => void;
  currentRows: number;
  currentCols: number;
}

export const PresetLibrary: React.FC<PresetLibraryProps> = ({
  onLoadPreset,
  currentRows,
  currentCols,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loadedId, setLoadedId] = useState<string | null>(null);

  const categories = ['all', 'Art', 'Life', 'Geometric', 'Classic'];

  const filtered =
    activeCategory === 'all'
      ? PRESET_PATTERNS
      : PRESET_PATTERNS.filter((p) => p.category === activeCategory);

  const handleApply = (preset: PresetPattern) => {
    onLoadPreset(preset);
    setLoadedId(preset.id);
    setTimeout(() => setLoadedId(null), 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Curated Pattern Library
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Load classic pixel sprites, cellular automaton seeds, and geometric matrices.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer capitalize ${
                activeCategory === cat
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((preset) => {
          const isCurrentMatch =
            currentRows === preset.rows && currentCols === preset.cols;
          const isJustLoaded = loadedId === preset.id;

          return (
            <div
              key={preset.id}
              className="border border-slate-200 dark:border-slate-800 rounded-lg p-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between group"
            >
              <div>
                {/* Mini Preview Canvas */}
                <div className="w-full h-28 bg-slate-50 dark:bg-slate-950 rounded-md border border-slate-100 dark:border-slate-800/80 p-2 flex items-center justify-center overflow-hidden mb-3">
                  <div
                    className="grid gap-[1px]"
                    style={{
                      gridTemplateColumns: `repeat(${preset.cols}, 4px)`,
                      gridTemplateRows: `repeat(${preset.rows}, 4px)`,
                    }}
                  >
                    {preset.cells.map((row, r) =>
                      row.map((val, c) => (
                        <div
                          key={`mini-${r}-${c}`}
                          className={`w-1 h-1 rounded-[0.5px] ${
                            val === 1 ? 'bg-slate-900 dark:bg-slate-100' : 'bg-transparent'
                          }`}
                        />
                      ))
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {preset.name}
                  </h3>
                  <span className="font-mono-numbers text-[11px] text-slate-400">
                    {preset.rows}&times;{preset.cols}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 capitalize">
                  {preset.category}
                </span>

                <button
                  onClick={() => handleApply(preset)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    isJustLoaded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {isJustLoaded ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Loaded</span>
                    </>
                  ) : (
                    <>
                      <span>Load Matrix</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
