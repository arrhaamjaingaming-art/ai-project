import React, { useState, useRef, useEffect } from 'react';
import { Leaf, Globe, Moon, Sun, Bell, Menu, X, Check, ChevronDown, User, ShieldCheck } from 'lucide-react';
import { LanguageCode, ActiveTab, CareReminder } from '../types';
import { LANGUAGES, t } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  onNavigate: (tab: ActiveTab) => void;
  reminders: CareReminder[];
  hasGemini: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  theme,
  onThemeToggle,
  onMobileMenuToggle,
  isMobileMenuOpen,
  onNavigate,
  reminders,
  hasGemini,
}) => {
  const { currentUser, openLoginDrawer } = useAuth();
  const [langOpen, setLangOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const pendingReminders = reminders.filter((r) => !r.isCompleted);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangMeta = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#121c15]/95 backdrop-blur-md border-b border-emerald-950/10 dark:border-emerald-800/20 px-4 md:px-6 transition-colors">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-xl text-emerald-900 dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base md:text-lg tracking-tight text-emerald-950 dark:text-emerald-50">
                  Agri Defence
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                  Plantix UI
                </span>
              </div>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400 font-medium hidden sm:block">
                AI Crop Doctor & Plant Health
              </p>
            </div>
          </button>
        </div>

        {/* Center: Desktop Quick Nav Badges */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>AI Doctor Online</span>
            <span className="text-emerald-400 dark:text-emerald-600">·</span>
            <span className="text-emerald-700 dark:text-emerald-300 font-medium">
              {hasGemini ? 'Gemini 3.8 Flash' : 'Smart Agronomy Engine'}
            </span>
          </div>
        </div>

        {/* Right: Language, Theme, Notifications */}
        <div className="flex items-center gap-2">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 border border-emerald-200/70 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100 text-xs font-semibold transition-all cursor-pointer"
              title="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium max-w-[85px] sm:max-w-none truncate">
                {currentLangMeta.native}
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#142218] rounded-2xl shadow-xl border border-emerald-900/10 dark:border-emerald-800/40 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-emerald-100 dark:border-emerald-800/40 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                    Choose Regional Language
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    12 Languages
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 p-1 max-h-72 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangOpen(false);
                      }}
                      className={`flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                        currentLang === lang.code
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{lang.native}</div>
                        <div
                          className={`text-[10px] ${
                            currentLang === lang.code
                              ? 'text-emerald-100'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {lang.name}
                        </div>
                      </div>
                      {currentLang === lang.code && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 border border-emerald-200/70 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Reminders / Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 border border-emerald-200/70 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200 transition-colors"
              title="Care Alerts"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingReminders.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-[#121c15]"></span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#142218] rounded-2xl shadow-xl border border-emerald-900/10 dark:border-emerald-800/40 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-800/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                    Care Reminders
                  </span>
                  <button
                    onClick={() => {
                      onNavigate('reminders');
                      setNotifOpen(false);
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                  {pendingReminders.length > 0 ? (
                    pendingReminders.map((rem) => (
                      <div
                        key={rem.id}
                        onClick={() => {
                          onNavigate('reminders');
                          setNotifOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-100">
                          <span>{rem.cropName}</span>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                            {rem.dueDate}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-800/80 dark:text-emerald-300 mt-0.5 line-clamp-2">
                          {rem.title}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="w-8 h-8 mx-auto mb-1 text-emerald-500 opacity-70" />
                      All scheduled crop care tasks completed!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Google Account Profile / Login Button */}
          <button
            onClick={openLoginDrawer}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-700/20 text-xs font-bold transition-all cursor-pointer"
            title={currentUser ? `Google Account: ${currentUser.displayName || currentUser.email}` : 'Sign in with Google Account'}
          >
            {currentUser ? (
              <>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Farmer'}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-white/80"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold">
                    {(currentUser.displayName || 'F')[0]}
                  </div>
                )}
                <span className="hidden sm:inline max-w-[90px] truncate">
                  {currentUser.displayName?.split(' ')[0] || 'Farmer'}
                </span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span className="hidden sm:inline">Google Login</span>
                <span className="sm:hidden text-[11px]">Login</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

