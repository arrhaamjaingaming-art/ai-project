import React from 'react';
import {
  LayoutDashboard,
  Camera,
  Sprout,
  BotMessageSquare,
  CloudSun,
  History,
  BellRing,
  Settings,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { ActiveTab, LanguageCode } from '../types';
import { t } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  currentLang: LanguageCode;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  currentLang,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentUser, userProfile, openLoginDrawer } = useAuth();

  const navItems: Array<{
    id: ActiveTab;
    labelKey: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    isPrimary?: boolean;
  }> = [
    { id: 'dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { id: 'scanner', labelKey: 'aiScan', icon: Camera, badge: 'AI', isPrimary: true },
    { id: 'plants', labelKey: 'myPlants', icon: Sprout },
    { id: 'chat', labelKey: 'aiAssistant', icon: BotMessageSquare, badge: 'Doctor' },
    { id: 'weather', labelKey: 'weather', icon: CloudSun },
    { id: 'reminders', labelKey: 'reminders', icon: BellRing },
    { id: 'history', labelKey: 'history', icon: History },
    { id: 'settings', labelKey: 'settings', icon: Settings },
  ];

  const handleItemClick = (id: ActiveTab) => {
    onNavigate(id);
    onCloseMobile();
  };

  const handleOpenAccount = () => {
    openLoginDrawer();
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0e1911] text-emerald-100 flex flex-col border-r border-emerald-900/40 transition-transform duration-200 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        } md:static md:h-[calc(100vh-4rem)] md:z-10`}
      >
        {/* Mobile Header in Drawer */}
        <div className="p-4 border-b border-emerald-900/50 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              🌿
            </div>
            <span className="font-extrabold text-white text-base">Agri Defence</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="text-emerald-400 hover:text-white text-xs font-semibold px-2 py-1"
          >
            Close
          </button>
        </div>

        {/* Section: Main Diagnosis & Care */}
        <div className="p-3">
          <p className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-emerald-500/70">
            Diagnosis & Plant Health
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-950/40'
                      : item.isPrimary
                      ? 'bg-emerald-950/50 hover:bg-emerald-900/40 text-emerald-300 font-semibold border border-emerald-800/40'
                      : 'hover:bg-emerald-900/30 text-emerald-200/90 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-emerald-700/80 text-white'
                          : 'bg-emerald-950/60 text-emerald-400 group-hover:text-emerald-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{t(item.labelKey, currentLang)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-emerald-800 text-emerald-100'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Farmer Card / Google Account Login trigger */}
        <div className="mt-auto p-3 border-t border-emerald-900/40">
          <button
            onClick={handleOpenAccount}
            className="w-full text-left p-3 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-[#14261a] border border-emerald-800/30 hover:border-emerald-600/70 transition-all group cursor-pointer"
            title="Open Google Account & Database ID details"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Farmer'}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-400"
                />
              ) : currentUser ? (
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                  {(currentUser.displayName || 'F')[0]}
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-800/80 flex items-center justify-center text-xs text-emerald-300">
                  👨‍🌾
                </div>
              )}
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-bold text-white truncate flex items-center justify-between">
                  <span>{currentUser?.displayName || 'Kisan Profile'}</span>
                  <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${currentUser ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-600'}`}></span>
                  {currentUser ? 'Firestore ID Saved' : 'Sign in with Google'}
                </div>
              </div>
            </div>
            <div className="text-[11px] text-emerald-300/80 leading-snug">
              {currentUser
                ? `ID: ${currentUser.uid.slice(0, 10)}... (Synced)`
                : 'Click to connect Google account and cloud sync.'}
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};
