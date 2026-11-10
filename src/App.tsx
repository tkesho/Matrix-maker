/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { DimensionControls } from './components/DimensionControls';
import { Toolbar } from './components/Toolbar';
import { GridView } from './components/GridView';
import { StatsBar } from './components/StatsBar';
import { PresetLibrary } from './components/PresetLibrary';
import { AutomataControls } from './components/AutomataControls';
import { ExportModal } from './components/ExportModal';
import {
  ToolType,
  SymmetryMode,
  ColorTheme,
  ViewTab,
  PresetPattern,
} from './types';
import { COLOR_THEMES } from './utils/themes';
import {
  createEmptyGrid,
  cloneGrid,
  resizeGrid,
  invertGrid,
  randomizeGrid,
  createCheckerboard,
  createBorderGrid,
  rotateGridClockwise,
  flipGridHorizontal,
  flipGridVertical,
  generateStandaloneHtml,
} from './utils/gridOperations';
import { Code2, Sparkles, Copy, Check, Download } from 'lucide-react';

export default function App() {
  // Grid dimensions
  const [rows, setRows] = useState<number>(8);
  const [cols, setCols] = useState<number>(8);

  // Core grid data: 2D array of 0s and 1s
  const [grid, setGrid] = useState<number[][]>(() => createEmptyGrid(8, 8));

  // History stack for Undo / Redo
  const [history, setHistory] = useState<number[][][]>([]);
  const [redoStack, setRedoStack] = useState<number[][][]>([]);

  // Interaction controls
  const [currentTool, setCurrentTool] = useState<ToolType>('toggle');
  const [symmetry, setSymmetry] = useState<SymmetryMode>('none');
  const [cellSize, setCellSize] = useState<number>(36);
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [showCoordinates, setShowCoordinates] = useState<boolean>(false);
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(COLOR_THEMES[0]);
  const [currentTab, setCurrentTab] = useState<ViewTab>('canvas');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [hoverCoord, setHoverCoord] = useState<{ r: number | null; c: number | null }>({
    r: null,
    c: null,
  });

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Push new state with history tracking
  const pushGridState = useCallback(
    (newGrid: number[][]) => {
      setHistory((prev) => {
        const next = [...prev, cloneGrid(grid)];
        if (next.length > 40) next.shift();
        return next;
      });
      setRedoStack([]);
      setGrid(newGrid);
    },
    [grid]
  );

  // Undo / Redo
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prevGrid = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [cloneGrid(grid), ...prev]);
    setGrid(prevGrid);
    setRows(prevGrid.length);
    setCols(prevGrid[0].length);
  }, [history, grid]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const nextGrid = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setHistory((prev) => [...prev, cloneGrid(grid)]);
    setGrid(nextGrid);
    setRows(nextGrid.length);
    setCols(nextGrid[0].length);
  }, [redoStack, grid]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore inside text inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key.toLowerCase() === 't') {
        setCurrentTool('toggle');
      } else if (e.key.toLowerCase() === 'p') {
        setCurrentTool('pen');
      } else if (e.key.toLowerCase() === 'e') {
        setCurrentTool('eraser');
      } else if (e.key.toLowerCase() === 'b') {
        setCurrentTool('bucket');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Dimension Change handler
  const handleApplyDimensions = (
    newRows: number,
    newCols: number,
    preserveContent: boolean
  ) => {
    let newGrid: number[][];
    if (preserveContent) {
      newGrid = resizeGrid(grid, newRows, newCols, 'top-left');
    } else {
      newGrid = createEmptyGrid(newRows, newCols);
    }
    pushGridState(newGrid);
    setRows(newRows);
    setCols(newCols);
  };

  // Preset loader
  const handleLoadPreset = (preset: PresetPattern) => {
    pushGridState(preset.cells);
    setRows(preset.rows);
    setCols(preset.cols);
    setCurrentTab('canvas');
  };

  // Grid operations
  const handleInvert = () => pushGridState(invertGrid(grid));
  const handleClear = () => pushGridState(createEmptyGrid(rows, cols));
  const handleFillAll = () => {
    const full = Array.from({ length: rows }, () => Array(cols).fill(1));
    pushGridState(full);
  };
  const handleRandomize = () => pushGridState(randomizeGrid(rows, cols, 0.35));
  const handleCheckerboard = () => pushGridState(createCheckerboard(rows, cols));
  const handleBorder = () => pushGridState(createBorderGrid(rows, cols));
  const handleRotate = () => {
    const rotated = rotateGridClockwise(grid);
    pushGridState(rotated);
    setRows(rotated.length);
    setCols(rotated[0].length);
  };
  const handleFlipH = () => pushGridState(flipGridHorizontal(grid));
  const handleFlipV = () => pushGridState(flipGridVertical(grid));

  // Direct code copy in tab
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const codeSnippet = generateStandaloneHtml(grid, currentTheme.activeColor, currentTheme.inactiveColor);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 3-Zone Top Bar Contract */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenExport={() => setIsExportOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
        {/* Dimension Controls Bar */}
        <DimensionControls
          rows={rows}
          cols={cols}
          onApplyDimensions={handleApplyDimensions}
        />

        {/* View Switcher Content */}
        {currentTab === 'canvas' && (
          <div className="flex flex-col gap-4">
            {/* Interactive Toolbar */}
            <Toolbar
              currentTool={currentTool}
              onSelectTool={setCurrentTool}
              symmetry={symmetry}
              onSelectSymmetry={setSymmetry}
              canUndo={history.length > 0}
              canRedo={redoStack.length > 0}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onInvert={handleInvert}
              onClear={handleClear}
              onFillAll={handleFillAll}
              onRandomize={handleRandomize}
              onCheckerboard={handleCheckerboard}
              onBorder={handleBorder}
              onRotate={handleRotate}
              onFlipH={handleFlipH}
              onFlipV={handleFlipV}
              cellSize={cellSize}
              onChangeCellSize={setCellSize}
              showGridLines={showGridLines}
              onToggleGridLines={() => setShowGridLines(!showGridLines)}
              showCoordinates={showCoordinates}
              onToggleCoordinates={() => setShowCoordinates(!showCoordinates)}
              currentTheme={currentTheme}
              onSelectTheme={setCurrentTheme}
            />

            {/* Grid Canvas Viewport */}
            <GridView
              grid={grid}
              onGridChange={pushGridState}
              tool={currentTool}
              symmetry={symmetry}
              cellSize={cellSize}
              showGridLines={showGridLines}
              showCoordinates={showCoordinates}
              theme={currentTheme}
              onHoverCoordChange={(r, c) => setHoverCoord({ r, c })}
            />

            {/* Stats Bar */}
            <StatsBar grid={grid} hoverCoord={hoverCoord} />
          </div>
        )}

        {currentTab === 'presets' && (
          <div className="space-y-4">
            <PresetLibrary
              onLoadPreset={handleLoadPreset}
              currentRows={rows}
              currentCols={cols}
            />
            {/* Quick return button */}
            <div className="flex justify-end">
              <button
                onClick={() => setCurrentTab('canvas')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Back to Grid Canvas
              </button>
            </div>
          </div>
        )}

        {currentTab === 'automata' && (
          <div className="flex flex-col gap-4">
            <AutomataControls grid={grid} onGridChange={setGrid} />

            {/* Live simulation grid view */}
            <GridView
              grid={grid}
              onGridChange={pushGridState}
              tool={currentTool}
              symmetry={symmetry}
              cellSize={Math.max(14, cellSize)}
              showGridLines={showGridLines}
              showCoordinates={showCoordinates}
              theme={currentTheme}
              onHoverCoordChange={(r, c) => setHoverCoord({ r, c })}
            />

            <StatsBar grid={grid} hoverCoord={hoverCoord} />
          </div>
        )}

        {currentTab === 'code' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Standalone index.html Output
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Complete single-file web application matching your exact grid state ({rows}&times;{cols}).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeSnippet);
                    setCopiedSnippet(true);
                    setTimeout(() => setCopiedSnippet(false), 1800);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSnippet ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSnippet ? 'Copied HTML!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([codeSnippet], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `index.html`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download index.html</span>
                </button>
              </div>
            </div>

            <pre className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono-numbers text-slate-800 dark:text-slate-200 max-h-[60vh] overflow-auto">
              {codeSnippet}
            </pre>
          </div>
        )}
      </main>

      {/* Export / Import Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        grid={grid}
        theme={currentTheme}
        onImportGrid={(imported) => {
          pushGridState(imported);
          setRows(imported.length);
          setCols(imported[0].length);
        }}
      />
    </div>
  );
}
