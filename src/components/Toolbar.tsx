import React from 'react';
import {
  ToolType,
  SymmetryMode,
  ColorTheme,
} from '../types';
import {
  MousePointerClick,
  Pen,
  Eraser,
  PaintBucket,
  Minus,
  Square,
  Undo2,
  Redo2,
  Sparkles,
  Shuffle,
  Grid2X2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sliders,
  Palette,
  Eye,
  Trash2,
} from 'lucide-react';
import { COLOR_THEMES } from '../utils/themes';

interface ToolbarProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  symmetry: SymmetryMode;
  onSelectSymmetry: (mode: SymmetryMode) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onInvert: () => void;
  onClear: () => void;
  onFillAll: () => void;
  onRandomize: () => void;
  onCheckerboard: () => void;
  onBorder: () => void;
  onRotate: () => void;
  onFlipH: () => void;
  onFlipV: () => void;
  cellSize: number;
  onChangeCellSize: (size: number) => void;
  showGridLines: boolean;
  onToggleGridLines: () => void;
  showCoordinates: boolean;
  onToggleCoordinates: () => void;
  currentTheme: ColorTheme;
  onSelectTheme: (theme: ColorTheme) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentTool,
  onSelectTool,
  symmetry,
  onSelectSymmetry,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onInvert,
  onClear,
  onFillAll,
  onRandomize,
  onCheckerboard,
  onBorder,
  onRotate,
  onFlipH,
  onFlipV,
  cellSize,
  onChangeCellSize,
  showGridLines,
  onToggleGridLines,
  showCoordinates,
  onToggleCoordinates,
  currentTheme,
  onSelectTheme,
}) => {
  const tools: Array<{ id: ToolType; label: string; icon: React.ReactNode }> = [
    { id: 'toggle', label: 'Toggle (Click / Drag to switch)', icon: <MousePointerClick className="w-4 h-4" /> },
    { id: 'pen', label: 'Pen (Draw Active)', icon: <Pen className="w-4 h-4" /> },
    { id: 'eraser', label: 'Eraser (Draw Inactive)', icon: <Eraser className="w-4 h-4" /> },
    { id: 'bucket', label: 'Bucket (Flood Fill)', icon: <PaintBucket className="w-4 h-4" /> },
    { id: 'line', label: 'Line (Drag straight line)', icon: <Minus className="w-4 h-4" /> },
    { id: 'rect', label: 'Rectangle (Drag box)', icon: <Square className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex flex-col gap-3 transition-colors">
      {/* Row 1: Tools, Symmetry, Undo/Redo */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Drawing Tools Segment */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-lg">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              title={tool.label}
              className={`p-2 rounded-md transition-colors cursor-pointer flex items-center justify-center ${
                currentTool === tool.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tool.icon}
            </button>
          ))}
        </div>

        {/* Symmetry Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            Symmetry:
          </span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-lg text-xs">
            {(
              [
                { id: 'none', label: 'None' },
                { id: 'horizontal', label: 'X-Mirror' },
                { id: 'vertical', label: 'Y-Mirror' },
                { id: 'quad', label: '4-Way' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => onSelectSymmetry(s.id)}
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                  symmetry === s.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Grid Operations Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={onInvert}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            <span>Invert</span>
          </button>
          <button
            onClick={onRandomize}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-500" />
            <span>Random</span>
          </button>
          <button
            onClick={onCheckerboard}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Grid2X2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Checker</span>
          </button>
          <button
            onClick={onBorder}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 text-slate-500" />
            <span>Border</span>
          </button>
          <button
            onClick={onRotate}
            title="Rotate 90 degrees clockwise"
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Rotate</span>
          </button>
          <button
            onClick={onFlipH}
            title="Flip Horizontal"
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onFlipV}
            title="Flip Vertical"
            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <FlipVertical className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onFillAll}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Fill All
          </button>
          <button
            onClick={onClear}
            className="px-2.5 py-1.5 rounded-md border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>

        {/* View / Zoom / Grid Toggles */}
        <div className="flex items-center gap-3">
          {/* Cell Size Slider */}
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="range"
              min="12"
              max="52"
              step="2"
              value={cellSize}
              onChange={(e) => onChangeCellSize(parseInt(e.target.value, 10))}
              title={`Tile size: ${cellSize}px`}
              className="w-16 accent-slate-900 dark:accent-slate-100 cursor-pointer"
            />
            <span className="font-mono-numbers text-[11px] text-slate-500 w-7">
              {cellSize}px
            </span>
          </div>

          {/* Grid lines toggle */}
          <button
            onClick={onToggleGridLines}
            className={`px-2 py-1 rounded-md border transition-colors cursor-pointer flex items-center gap-1 ${
              showGridLines
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Toggle grid line boundaries"
          >
            <Grid2X2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lines</span>
          </button>

          {/* Coordinates toggle */}
          <button
            onClick={onToggleCoordinates}
            className={`px-2 py-1 rounded-md border transition-colors cursor-pointer flex items-center gap-1 ${
              showCoordinates
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Show row and column numbers"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Coords</span>
          </button>

          {/* Theme Color Dropdown */}
          <div className="flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentTheme.id}
              onChange={(e) => {
                const found = COLOR_THEMES.find((t) => t.id === e.target.value);
                if (found) onSelectTheme(found);
              }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md py-1 px-1.5 text-xs focus:outline-none cursor-pointer"
            >
              {COLOR_THEMES.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
