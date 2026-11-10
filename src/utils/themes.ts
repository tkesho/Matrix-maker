import { ColorTheme } from '../types';

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'monochrome',
    name: 'Monochrome',
    activeColor: '#0f172a', // Deep slate/black
    inactiveColor: '#ffffff', // Pure white
    gridLineColor: '#cbd5e1',
    previewBg: '#f8fafc',
  },
  {
    id: 'stark',
    name: 'Stark 1-Bit',
    activeColor: '#000000',
    inactiveColor: '#ffffff',
    gridLineColor: '#e5e7eb',
    previewBg: '#ffffff',
  },
  {
    id: 'blueprint',
    name: 'Blueprint Cyan',
    activeColor: '#0284c7', // Sky cyan
    inactiveColor: '#f0f9ff',
    gridLineColor: '#bae6fd',
    previewBg: '#e0f2fe',
  },
  {
    id: 'terminal',
    name: 'Amber CRT',
    activeColor: '#d97706', // Amber gold
    inactiveColor: '#fffbeb',
    gridLineColor: '#fde68a',
    previewBg: '#fef3c7',
  },
  {
    id: 'matrix',
    name: 'Digital Emerald',
    activeColor: '#059669', // Emerald green
    inactiveColor: '#f0fdf4',
    gridLineColor: '#bbf7d0',
    previewBg: '#dcfce7',
  },
  {
    id: 'night-owl',
    name: 'Midnight Dark',
    activeColor: '#f8fafc',
    inactiveColor: '#1e293b',
    gridLineColor: '#334155',
    previewBg: '#0f172a',
  },
];
