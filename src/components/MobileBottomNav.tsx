import React from 'react';
import { LayoutDashboard, Sprout, Camera, BotMessageSquare, Settings } from 'lucide-react';
import { ActiveTab, LanguageCode } from '../types';
import { t } from '../utils/translations';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  currentLang: LanguageCode;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onNavigate,
  currentLang,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-[#0e1911]/95 backdrop-blur-md border-t border-emerald-950/10 dark:border-emerald-800/30 px-2 flex items-center justify-around shadow-lg transition-colors">
      {/* Home / Dashboard */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'dashboard'
            ? 'text-emerald-700 dark:text-emerald-400 font-bold'
            : 'text-emerald-950/60 dark:text-emerald-400/60 hover:text-emerald-800 dark:hover:text-emerald-200'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
          {t('dashboard', currentLang)}
        </span>
      </button>

      {/* My Crops */}
      <button
        onClick={() => onNavigate('plants')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'plants'
            ? 'text-emerald-700 dark:text-emerald-400 font-bold'
            : 'text-emerald-950/60 dark:text-emerald-400/60 hover:text-emerald-800 dark:hover:text-emerald-200'
        }`}
      >
        <Sprout className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
          {t('myPlants', currentLang)}
        </span>
      </button>

      {/* Plantix Center Elevated Scan Button */}
      <div className="relative flex flex-col items-center -top-4 px-1">
        <button
          onClick={() => onNavigate('scanner')}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 border-4 border-[#f6f8f5] dark:border-[#0e1911] active:scale-95 transition-transform"
          aria-label={t('aiScan', currentLang)}
        >
          <Camera className="w-6 h-6 animate-pulse" />
        </button>
        <span
          className={`text-[10px] font-extrabold mt-0.5 ${
            activeTab === 'scanner'
              ? 'text-emerald-700 dark:text-emerald-400'
              : 'text-emerald-950 dark:text-emerald-200'
          }`}
        >
          {t('aiScan', currentLang)}
        </span>
      </div>

      {/* AI Doctor Chat */}
      <button
        onClick={() => onNavigate('chat')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'chat'
            ? 'text-emerald-700 dark:text-emerald-400 font-bold'
            : 'text-emerald-950/60 dark:text-emerald-400/60 hover:text-emerald-800 dark:hover:text-emerald-200'
        }`}
      >
        <BotMessageSquare className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
          {t('aiAssistant', currentLang)}
        </span>
      </button>

      {/* Settings */}
      <button
        onClick={() => onNavigate('settings')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'settings'
            ? 'text-emerald-700 dark:text-emerald-400 font-bold'
            : 'text-emerald-950/60 dark:text-emerald-400/60 hover:text-emerald-800 dark:hover:text-emerald-200'
        }`}
      >
        <Settings className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
          {t('settings', currentLang)}
        </span>
      </button>
    </nav>
  );
};
