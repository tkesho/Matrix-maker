import React from 'react';
import { ViewTab } from '../types';
import { Download, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenExport: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenExport,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('canvas');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <span className="w-5 h-5 bg-slate-900 dark:bg-slate-100 rounded-sm flex items-center justify-center text-[10px] text-white dark:text-slate-900 font-mono font-bold">
              #
            </span>
            GridMatrix
          </a>
        </div>

        {/* Zone 2: Navigation Links (Single line, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            onClick={() => onTabChange('canvas')}
            className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
              currentTab === 'canvas'
                ? 'text-slate-900 dark:text-slate-100 font-semibold border-b-2 border-slate-900 dark:border-slate-100'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Canvas & Tools
          </button>
          <button
            onClick={() => onTabChange('presets')}
            className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
              currentTab === 'presets'
                ? 'text-slate-900 dark:text-slate-100 font-semibold border-b-2 border-slate-900 dark:border-slate-100'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Pattern Presets
          </button>
          <button
            onClick={() => onTabChange('automata')}
            className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
              currentTab === 'automata'
                ? 'text-slate-900 dark:text-slate-100 font-semibold border-b-2 border-slate-900 dark:border-slate-100'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Life Automata
          </button>
          <button
            onClick={() => onTabChange('code')}
            className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
              currentTab === 'code'
                ? 'text-slate-900 dark:text-slate-100 font-semibold border-b-2 border-slate-900 dark:border-slate-100'
                : 'hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Code & Export
          </button>
        </nav>

        {/* Zone 3: Primary Action & Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenExport}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Matrix</span>
          </button>
        </div>
      </div>
    </header>
  );
};
