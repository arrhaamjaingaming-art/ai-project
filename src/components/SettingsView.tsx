import React from 'react';
import { Settings, Globe, Moon, Sun, Check, Cpu, HardDrive, ShieldCheck, User, Database, LogIn, LogOut } from 'lucide-react';
import { LanguageCode } from '../types';
import { LANGUAGES, t } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

interface SettingsViewProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  hasGemini: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentLang,
  onLanguageChange,
  theme,
  onThemeToggle,
  hasGemini,
}) => {
  const { currentUser, userProfile, openLoginDrawer, logout, dbSavedStatus } = useAuth();
  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600" />
          <span>{t('settings', currentLang)} & Preferences</span>
        </h1>
        <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
          Regional localization in 12 languages, visual theme, and agricultural pathology engine status
        </p>
      </div>

      {/* Google Account & Firestore Database Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-900/10 dark:border-emerald-800/30">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="font-extrabold text-sm text-emerald-950 dark:text-white">
                Google Account & Database Synchronization
              </h2>
              <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
                Cloud Firestore database for storing your farmer ID, diagnosis logs, and custom crop fields
              </p>
            </div>
          </div>
          {currentUser && (
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Synced
            </span>
          )}
        </div>

        {currentUser ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-900/10">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Farmer'}
                    className="w-11 h-11 rounded-2xl ring-2 ring-emerald-500 object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                    {(currentUser.displayName || 'F')[0]}
                  </div>
                )}
                <div>
                  <div className="text-sm font-extrabold text-emerald-950 dark:text-emerald-50">
                    {currentUser.displayName || 'Farmer Member'}
                  </div>
                  <div className="text-xs text-emerald-700/80 dark:text-emerald-400 font-medium">
                    {currentUser.email}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-300 font-mono mt-0.5">
                    Doc: {dbSavedStatus || `users/${currentUser.uid}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={openLoginDrawer}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Manage ID & Role
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-dashed border-emerald-300 dark:border-emerald-800/40">
            <div>
              <div className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                Not connected to Google Account
              </div>
              <div className="text-xs text-emerald-700/80 dark:text-emerald-400 mt-0.5">
                Sign in with Google to automatically save your ID in Cloud Firestore and sync records across devices.
              </div>
            </div>
            <button
              onClick={openLoginDrawer}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Open Google Login</span>
            </button>
          </div>
        )}
      </div>

      {/* Language Preference Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/10 dark:border-emerald-800/30">
          <Globe className="w-5 h-5 text-emerald-600" />
          <div>
            <h2 className="font-extrabold text-sm text-emerald-950 dark:text-white">
              Regional Language Localization
            </h2>
            <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
              Select your preferred regional language. Urdu automatically enables Right-to-Left (RTL) layout.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20 font-bold'
                    : 'bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 border-emerald-900/10 dark:border-emerald-800/30 hover:bg-emerald-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold">{lang.native}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0" />}
                </div>
                <span
                  className={`text-[11px] mt-1 ${
                    isSelected ? 'text-emerald-100' : 'text-emerald-700/70 dark:text-emerald-400/70'
                  }`}
                >
                  {lang.name} {lang.isRtl ? '(RTL)' : ''}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Theme Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-emerald-900/10 dark:border-emerald-800/30">
          {theme === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-blue-400" />}
          <div>
            <h2 className="font-extrabold text-sm text-emerald-950 dark:text-white">
              Visual Theme & Contrast
            </h2>
            <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
              Optimized for high-contrast sunlight visibility in open farm fields or dark mode for battery savings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            onClick={() => {
              if (theme !== 'light') onThemeToggle();
            }}
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-900/10'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Light Daylight Theme</span>
          </button>

          <button
            onClick={() => {
              if (theme !== 'dark') onThemeToggle();
            }}
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-900/10'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark Night Theme</span>
          </button>
        </div>
      </div>

      {/* System Diagnostic Status */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm space-y-3">
        <h2 className="font-extrabold text-sm text-emerald-950 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-600" />
          <span>Pathology AI & Diagnostic Engine Status</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-900/10">
            <span className="text-[10px] uppercase font-bold text-emerald-700/70 dark:text-emerald-400 block mb-1">
              AI Vision Engine
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-emerald-950 dark:text-white">
                {hasGemini ? 'Gemini 3.8 Flash Active' : 'Smart Agronomy Engine'}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600/70 block mt-1">
              Supports 50+ crop diseases
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-900/10">
            <span className="text-[10px] uppercase font-bold text-emerald-700/70 dark:text-emerald-400 block mb-1">
              Application Version
            </span>
            <span className="font-bold text-emerald-950 dark:text-white">
              v3.5.0 (Plantix UI Edition)
            </span>
            <span className="text-[10px] text-emerald-600/70 block mt-1">
              Farmer-friendly mobile responsive
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-900/10">
            <span className="text-[10px] uppercase font-bold text-emerald-700/70 dark:text-emerald-400 block mb-1">
              Multilingual Coverage
            </span>
            <span className="font-bold text-emerald-950 dark:text-white">
              12 Regional Languages
            </span>
            <span className="text-[10px] text-emerald-600/70 block mt-1">
              Includes full Urdu RTL support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
