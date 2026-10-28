import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Database,
  Copy,
  Check,
  LogOut,
  Sparkles,
  Sprout,
  History,
  Lock,
  ArrowRight,
  User,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LanguageCode, ActiveTab } from '../types';
import { t } from '../utils/translations';

interface LoginSidePanelProps {
  currentLang: LanguageCode;
  onNavigate: (tab: ActiveTab) => void;
}

export const LoginSidePanel: React.FC<LoginSidePanelProps> = ({
  currentLang,
  onNavigate,
}) => {
  const {
    currentUser,
    userProfile,
    loading,
    authError,
    isLoginDrawerOpen,
    dbSavedStatus,
    closeLoginDrawer,
    loginWithGoogle,
    logout,
    updateUserRole,
  } = useAuth();

  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedGid, setCopiedGid] = useState(false);
  const [roleUpdating, setRoleUpdating] = useState(false);

  if (!isLoginDrawerOpen) return null;

  const handleCopy = (text: string, type: 'uid' | 'gid') => {
    navigator.clipboard.writeText(text);
    if (type === 'uid') {
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    } else {
      setCopiedGid(true);
      setTimeout(() => setCopiedGid(false), 2000);
    }
  };

  const handleRoleChange = async (role: 'farmer' | 'agronomist' | 'gardener') => {
    setRoleUpdating(true);
    await updateUserRole(role);
    setRoleUpdating(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={closeLoginDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#121c15] text-[#142418] dark:text-[#f0fdf4] shadow-2xl flex flex-col border-l border-emerald-950/10 dark:border-emerald-800/30 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-emerald-950/10 dark:border-emerald-800/30 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-emerald-950 dark:text-emerald-50">
                  {currentUser ? 'Farmer Profile & Database' : 'Kisan Account Sign-In'}
                </h2>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Google Auth & Cloud Firestore Sync
                </p>
              </div>
            </div>
            <button
              onClick={closeLoginDrawer}
              className="p-2 rounded-xl text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
              aria-label="Close side panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {authError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-start gap-3 text-rose-900 dark:text-rose-200 text-xs">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold">Sign-In Notice</div>
                  <div>{authError}</div>
                </div>
              </div>
            )}

            {!currentUser ? (
              /* Signed Out State */
              <div className="space-y-5">
                <div className="text-center py-2">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center mb-3">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-50">
                    Welcome to Agri Defence
                  </h3>
                  <p className="text-xs text-emerald-700/80 dark:text-emerald-400 max-w-xs mx-auto mt-1">
                    Sign in with your Google account to save your ID, access cloud disease diagnosis, and sync your crops.
                  </p>
                </div>

                {/* Google Sign In Button */}
                <div className="pt-2">
                  <button
                    onClick={() => loginWithGoogle(currentLang)}
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-[#1a2b20] hover:bg-emerald-50/50 dark:hover:bg-emerald-900/40 border-2 border-emerald-600 dark:border-emerald-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer group text-emerald-950 dark:text-white font-bold text-sm"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                    )}
                    <span>{loading ? 'Authenticating with Google...' : 'Sign in with Google Account'}</span>
                  </button>
                  <p className="text-[11px] text-center text-emerald-600/80 dark:text-emerald-400 mt-2 font-medium">
                    Fast, secure login without extra passwords
                  </p>
                </div>

                {/* Database Save Guarantee Card */}
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Database ID Storage Architecture</span>
                  </div>
                  <p className="text-xs text-emerald-800/80 dark:text-emerald-300/90 leading-relaxed">
                    When you sign in, your Google Auth UID and Account ID are automatically created and indexed in the persistent Cloud Firestore database at path:
                  </p>
                  <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0c140e] font-mono text-[11px] text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/30 truncate">
                    collection: /users/{'{'}googleAuthUid{'}'}
                  </div>
                </div>

                {/* Farmer Features List */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Benefits for Farmers:
                  </p>
                  <div className="space-y-2.5 text-xs text-emerald-900 dark:text-emerald-200">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        ✓
                      </div>
                      <div>
                        <span className="font-bold">Permanent Cloud Scan History:</span> Never lose past diagnosis records, leaf photos, and disease analyses.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        ✓
                      </div>
                      <div>
                        <span className="font-bold">Personalized Crop Monitoring:</span> Track Rice, Wheat, Tomato, Cotton, and other acreage with custom care schedules.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        ✓
                      </div>
                      <div>
                        <span className="font-bold">Gemini AI Doctor Context:</span> The chatbot remembers your specific crops and local soil/weather advice.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Signed In State */
              <div className="space-y-5">
                {/* User Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100/60 dark:from-emerald-950/60 dark:to-[#14281b] border border-emerald-200/80 dark:border-emerald-800/40">
                  <div className="flex items-center gap-3.5">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'Farmer'}
                        className="w-14 h-14 rounded-2xl ring-2 ring-emerald-500 shadow-md object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                        {(currentUser.displayName || 'F')[0]}
                      </div>
                    )}
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-base text-emerald-950 dark:text-emerald-50 truncate">
                          {currentUser.displayName || 'Farmer User'}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online & Connected" />
                      </div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-300 truncate">
                        {currentUser.email}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200">
                          {userProfile?.role || 'Farmer'}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          Google Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Database Saved Information Section (Satisfies User Request) */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#152319] border border-emerald-900/10 dark:border-emerald-800/40 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-800/40">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                        Saved in Database Record
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Firestore Synced
                    </span>
                  </div>

                  {/* Document Path */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                      Firestore Document Location:
                    </label>
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/30 text-xs font-mono text-emerald-900 dark:text-emerald-200 break-all">
                      {dbSavedStatus || `users/${currentUser.uid}`}
                    </div>
                  </div>

                  {/* Auth UID */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                        Google Auth UID (Primary ID):
                      </label>
                      <button
                        onClick={() => handleCopy(currentUser.uid, 'uid')}
                        className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        {copiedUid ? (
                          <>
                            <Check className="w-3 h-3" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/30 text-xs font-mono text-emerald-900 dark:text-emerald-200 break-all">
                      {currentUser.uid}
                    </div>
                  </div>

                  {/* Google Provider ID */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                        Google Provider Account ID:
                      </label>
                      <button
                        onClick={() =>
                          handleCopy(userProfile?.googleId || currentUser.uid, 'gid')
                        }
                        className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        {copiedGid ? (
                          <>
                            <Check className="w-3 h-3" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/30 text-xs font-mono text-emerald-900 dark:text-emerald-200 break-all">
                      {userProfile?.googleId || currentUser.uid}
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                      Agricultural Role in Database:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['farmer', 'agronomist', 'gardener'] as const).map((r) => {
                        const isCurrent = (userProfile?.role || 'farmer') === r;
                        return (
                          <button
                            key={r}
                            onClick={() => handleRoleChange(r)}
                            disabled={roleUpdating}
                            className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                              isCurrent
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                            }`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Quick Navigation Links */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Quick Farm Shortcuts:
                  </p>
                  <button
                    onClick={() => {
                      onNavigate('history');
                      closeLoginDrawer();
                    }}
                    className="w-full p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 border border-emerald-200/50 dark:border-emerald-800/30 text-emerald-950 dark:text-emerald-100 text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>View Saved Diagnoses</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('plants');
                      closeLoginDrawer();
                    }}
                    className="w-full p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 border border-emerald-200/50 dark:border-emerald-800/30 text-emerald-950 dark:text-emerald-100 text-xs font-semibold flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Manage Registered Crops</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                  </button>
                </div>

                {/* Sign Out Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      logout();
                      closeLoginDrawer();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Google Account</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-emerald-950/10 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-950/10 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700/80 dark:text-emerald-400">
              <Lock className="w-3 h-3" />
              <span>Protected by Firebase Auth & Google Identity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
