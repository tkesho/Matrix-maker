import React, { useState } from 'react';
import { ColorTheme } from '../types';
import { generateStandaloneHtml } from '../utils/gridOperations';
import {
  X,
  Copy,
  Download,
  Check,
  FileCode,
  Image as ImageIcon,
  FileText,
  Upload,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  grid: number[][];
  theme: ColorTheme;
  onImportGrid: (newGrid: number[][]) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  grid,
  theme,
  onImportGrid,
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'image' | 'data' | 'import'>('html');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(16);
  const [includeGridLines, setIncludeGridLines] = useState<boolean>(true);
  const [importText, setImportText] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {
      // Fallback
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 1. Standalone HTML
  const standaloneHtml = generateStandaloneHtml(grid, theme.activeColor, theme.inactiveColor);

  // 2. SVG string
  const generateSvg = (): string => {
    const cellW = 20;
    const cellH = 20;
    const svgW = cols * cellW;
    const svgH = rows * cellH;

    let rects = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const fill = grid[r][c] === 1 ? theme.activeColor : theme.inactiveColor;
        const stroke = includeGridLines ? `stroke="${theme.gridLineColor}" stroke-width="0.5"` : '';
        rects += `<rect x="${c * cellW}" y="${r * cellH}" width="${cellW}" height="${cellH}" fill="${fill}" ${stroke} />\n`;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="${svgW}" height="${svgH}">\n${rects}</svg>`;
  };

  // 3. PNG Canvas export
  const downloadPng = () => {
    const canvas = document.createElement('canvas');
    const cellPx = scaleFactor;
    canvas.width = cols * cellPx;
    canvas.height = rows * cellPx;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = grid[r][c] === 1 ? theme.activeColor : theme.inactiveColor;
        ctx.fillRect(c * cellPx, r * cellPx, cellPx, cellPx);

        if (includeGridLines) {
          ctx.strokeStyle = theme.gridLineColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(c * cellPx, r * cellPx, cellPx, cellPx);
        }
      }
    }

    const a = document.createElement('a');
    a.download = `grid-${rows}x${cols}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  // 4. Data formats
  const array2DString = JSON.stringify(grid);
  const prettyJson = JSON.stringify({ rows, cols, cells: grid }, null, 2);
  const ascii01 = grid.map((r) => r.join('')).join('\n');
  const asciiHash = grid.map((r) => r.map((c) => (c === 1 ? '#' : '.')).join('')).join('\n');

  // 5. Import parser
  const handleImport = () => {
    setImportError(null);
    try {
      const trimmed = importText.trim();
      if (!trimmed) {
        setImportError('Please paste JSON or ASCII matrix text.');
        return;
      }

      // Try JSON
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        const parsed = JSON.parse(trimmed);
        let cells: number[][] = [];
        if (Array.isArray(parsed)) {
          cells = parsed;
        } else if (parsed && Array.isArray(parsed.cells)) {
          cells = parsed.cells;
        }

        if (cells.length > 0 && Array.isArray(cells[0])) {
          onImportGrid(cells);
          onClose();
          return;
        }
      }

      // Try ASCII lines (0/1 or #/.)
      const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length > 0) {
        const matrix = lines.map((line) =>
          line
            .trim()
            .split('')
            .map((char) => (char === '1' || char === '#' ? 1 : 0))
        );
        onImportGrid(matrix);
        onClose();
        return;
      }

      setImportError('Unrecognized format. Please provide valid 2D array or ASCII lines.');
    } catch (err: unknown) {
      setImportError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Export & Share Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Export standalone HTML, high-resolution PNG, SVG, or raw 2D array formats.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-5 pt-2 gap-2 text-xs">
          {[
            { id: 'html', label: 'Standalone HTML', icon: <FileCode className="w-3.5 h-3.5" /> },
            { id: 'image', label: 'PNG & SVG Image', icon: <ImageIcon className="w-3.5 h-3.5" /> },
            { id: 'data', label: 'Code & 2D Arrays', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'import', label: 'Import Matrix', icon: <Upload className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-2 px-2.5 font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'text-slate-900 dark:text-slate-100 border-b-2 border-slate-900 dark:border-slate-100'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'html' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Download a self-contained, single-file <strong>index.html</strong> with the exact
                CSS Grid structure and JavaScript event delegation. Opens immediately in any web browser without dependencies.
              </p>

              <div className="relative">
                <pre className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-mono-numbers text-slate-800 dark:text-slate-200 max-h-56 overflow-auto">
                  {standaloneHtml}
                </pre>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => downloadFile(standaloneHtml, `grid-${rows}x${cols}.html`, 'text/html')}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download index.html</span>
                </button>
                <button
                  onClick={() => copyToClipboard(standaloneHtml, 'html')}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'html' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'html' ? 'Copied HTML!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'image' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Tile Scale:</span>
                  <select
                    value={scaleFactor}
                    onChange={(e) => setScaleFactor(parseInt(e.target.value, 10))}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md py-1 px-2 text-xs cursor-pointer font-mono-numbers"
                  >
                    <option value={8}>8px (Small)</option>
                    <option value={16}>16px (Medium)</option>
                    <option value={32}>32px (High Res)</option>
                    <option value={64}>64px (Ultra Crisp)</option>
                  </select>
                </div>

                <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeGridLines}
                    onChange={(e) => setIncludeGridLines(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                  />
                  <span>Include Grid Lines</span>
                </label>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    PNG Raster Graphic
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pixel-crisp {cols * scaleFactor} &times; {rows * scaleFactor}px raster file.
                  </p>
                </div>
                <button
                  onClick={downloadPng}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    SVG Scalable Vector Graphic
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Resolution-independent vector code for design tools (Figma, Illustrator).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadFile(generateSvg(), `grid-${rows}x${cols}.svg`, 'image/svg+xml')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download SVG</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(generateSvg(), 'svg')}
                    className="p-1.5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Copy SVG XML"
                  >
                    {copiedKey === 'svg' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    2D Matrix Array (JavaScript / Python / C++)
                  </span>
                  <button
                    onClick={() => copyToClipboard(array2DString, 'array')}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {copiedKey === 'array' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'array' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-mono-numbers text-slate-800 dark:text-slate-200 max-h-24 overflow-auto">
                  {array2DString}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Binary ASCII (0 and 1)
                  </span>
                  <button
                    onClick={() => copyToClipboard(ascii01, 'ascii01')}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {copiedKey === 'ascii01' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'ascii01' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-mono-numbers text-slate-800 dark:text-slate-200 max-h-24 overflow-auto">
                  {ascii01}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Text Matrix (. and #)
                  </span>
                  <button
                    onClick={() => copyToClipboard(asciiHash, 'asciihash')}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {copiedKey === 'asciihash' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'asciihash' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-mono-numbers text-slate-800 dark:text-slate-200 max-h-24 overflow-auto">
                  {asciiHash}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Paste JSON matrix format or binary ASCII lines to reconstruct the canvas:
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={'[[0,1,0],[1,1,1]]\nOR\n010\n111\nOR\n.#.\n###'}
                rows={6}
                className="w-full p-2.5 font-mono-numbers text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />

              {importError && (
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {importError}
                </p>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleImport}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import & Replace Grid</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
