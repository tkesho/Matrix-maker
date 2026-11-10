export type ToolType = 'toggle' | 'pen' | 'eraser' | 'bucket' | 'line' | 'rect';

export type SymmetryMode = 'none' | 'horizontal' | 'vertical' | 'quad';

export interface GridState {
  rows: number;
  cols: number;
  cells: number[][]; // 0 = white/inactive, 1 = black/active
}

export interface ColorTheme {
  id: string;
  name: string;
  activeColor: string; // Black or foreground
  inactiveColor: string; // White or background
  gridLineColor: string;
  previewBg: string;
}

export interface PresetPattern {
  id: string;
  name: string;
  category: 'Classic' | 'Life' | 'Art' | 'Geometric';
  rows: number;
  cols: number;
  description: string;
  cells: number[][];
}

export type ViewTab = 'canvas' | 'presets' | 'automata' | 'code';
