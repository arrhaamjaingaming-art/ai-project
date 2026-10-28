import React, { useState } from 'react';
import {
  Camera,
  BotMessageSquare,
  Search,
  Sprout,
  Activity,
  AlertTriangle,
  HeartPulse,
  CloudSun,
  Lightbulb,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Droplet,
  Wind,
  Database,
  User,
  Check,
} from 'lucide-react';
import { ActiveTab, CropInfo, DiagnosisRecord, LanguageCode, UserCrop, WeatherDay } from '../types';
import { CROPS_DATA, DAILY_TIPS } from '../data/mockData';
import { t } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

interface DashboardViewProps {
  currentLang: LanguageCode;
  onNavigate: (tab: ActiveTab) => void;
  onSelectCropForScan: (cropName: string) => void;
  diagnoses: DiagnosisRecord[];
  userCrops: UserCrop[];
  weatherToday: WeatherDay;
  onViewDiagnosisDetail: (record: DiagnosisRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentLang,
  onNavigate,
  onSelectCropForScan,
  diagnoses,
  userCrops,
  weatherToday,
  onViewDiagnosisDetail,
}) => {
  const { currentUser, userProfile, openLoginDrawer, dbSavedStatus } = useAuth();
  const [cropSearch, setCropSearch] = useState('');

  const filteredCrops = CROPS_DATA.filter((crop) => {
    const term = cropSearch.toLowerCase().trim();
    if (!term) return true;
    const nameMatch = crop.name.toLowerCase().includes(term);
    const localMatch = crop.localNames[currentLang]?.toLowerCase().includes(term);
    const diseaseMatch = crop.commonDiseases.toLowerCase().includes(term);
    return nameMatch || localMatch || diseaseMatch;
  });

  const totalScans = diagnoses.length;
  const diseasedCount = diagnoses.filter((d) => !d.isHealthy).length;
  const healthyCount = diagnoses.filter((d) => d.isHealthy).length;
  const totalCrops = userCrops.length;

  const tipOfTheDay = DAILY_TIPS[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Plantix-Style Hero Diagnosis Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2e17] via-[#14532d] to-[#15803d] text-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-emerald-950/20">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI Crop Doctor · Instant Leaf Diagnosis</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t('diagnoseMyCrop', currentLang)}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            {t('diagnoseSub', currentLang)}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold text-sm shadow-lg shadow-emerald-950/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Camera className="w-5 h-5 text-emerald-950" />
              <span>{t('scanNow', currentLang)}</span>
            </button>

            <button
              onClick={() => onNavigate('chat')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <BotMessageSquare className="w-4 h-4 text-emerald-200" />
              <span>{t('askDoctor', currentLang)}</span>
            </button>
          </div>
        </div>

        {/* Decorative Leaf Graphic with Glowing Reticle */}
        <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-48 h-48 lg:w-56 lg:h-56 rounded-3xl bg-white/10 border-2 border-dashed border-white/30 backdrop-blur-md items-center justify-center flex-col shadow-inner">
          <span className="text-6xl lg:text-7xl drop-shadow-md select-none">🌿</span>
          <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-white text-emerald-800 text-[11px] font-extrabold shadow-md flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pathology AI</span>
          </div>
        </div>
      </section>

      {/* Google Account & Firestore Database Status Card */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121f16] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Cloud Firestore Database
              </span>
              {currentUser ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  ID Saved in DB
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                  Guest Mode
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-900/80 dark:text-emerald-200 mt-0.5">
              {currentUser ? (
                <span>
                  Connected as <strong>{currentUser.displayName || currentUser.email}</strong>. Google Auth UID indexed at{' '}
                  <code className="text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-300">
                    {dbSavedStatus || `users/${currentUser.uid}`}
                  </code>
                </span>
              ) : (
                <span>
                  Sign in with your Google account to save your unique Farmer ID in the database and keep all diagnoses synced.
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={openLoginDrawer}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800/40 text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          {currentUser ? (
            <>
              <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Manage Account & DB IDs</span>
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
              <span>Sign in with Google</span>
            </>
          )}
        </button>
      </section>

      {/* Plantix Interactive Crop Selector Grid */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <span>{t('selectYourCrop', currentLang)}</span>
            </h2>
            <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
              {t('cropSubtitle', currentLang)}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600/60 dark:text-emerald-400/60" />
            <input
              type="text"
              value={cropSearch}
              onChange={(e) => setCropSearch(e.target.value)}
              placeholder="Search Tomato, Rice..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100 placeholder:text-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {filteredCrops.slice(0, 14).map((crop) => {
            const localName = crop.localNames[currentLang];
            return (
              <button
                key={crop.id}
                onClick={() => onSelectCropForScan(crop.name)}
                className="p-3 rounded-2xl bg-white dark:bg-[#142218] hover:bg-emerald-50/80 dark:hover:bg-emerald-950/60 border border-emerald-950/10 dark:border-emerald-800/30 text-left transition-all hover:scale-[1.02] hover:shadow-md hover:border-emerald-500/50 group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="text-3xl mb-1.5">{crop.icon}</div>
                  <div className="font-bold text-xs text-emerald-950 dark:text-emerald-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {crop.name}
                  </div>
                  {localName && (
                    <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-medium truncate">
                      {localName}
                    </div>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-emerald-900/5 dark:border-emerald-800/30 flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Diagnose</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Key Farm Health Metrics Overview */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-400/80">
              {t('totalPlants', currentLang)}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-950 dark:text-white tabular-nums">
              {totalCrops}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Monitored fields</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-400/80">
              {t('totalScans', currentLang)}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-950 dark:text-white tabular-nums">
              {totalScans}
            </div>
            <span className="text-[10px] text-blue-600 font-medium">Scans recorded</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-400/80">
              {t('diseasesFound', currentLang)}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-950 dark:text-white tabular-nums">
              {diseasedCount}
            </div>
            <span className={`text-[10px] font-medium ${diseasedCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {diseasedCount > 0 ? t('requiresAttention', currentLang) : t('allClear', currentLang)}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-400 flex items-center justify-center shrink-0">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-400/80">
              {t('healthyPlants', currentLang)}
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-950 dark:text-white tabular-nums">
              {healthyCount}
            </div>
            <span className="text-[10px] text-green-600 font-medium">Thriving condition</span>
          </div>
        </div>
      </section>

      {/* Analytics Row: Health Donut & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Activity Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-50">
                Weekly Diagnosis Volume
              </h3>
              <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
                Plant inspections conducted over the past 7 days
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Active Monitoring
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-emerald-900/10 dark:border-emerald-800/30">
            {[
              { day: 'Wed', count: 3 },
              { day: 'Thu', count: 5 },
              { day: 'Fri', count: 2 },
              { day: 'Sat', count: 7 },
              { day: 'Sun', count: 4 },
              { day: 'Mon', count: 8 },
              { day: 'Tue', count: 6 },
            ].map((bar, idx) => {
              const heightPct = Math.max(15, (bar.count / 10) * 100);
              const isToday = idx === 6;
              return (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    {bar.count}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                      isToday
                        ? 'bg-gradient-to-t from-emerald-600 to-green-400'
                        : 'bg-emerald-200 dark:bg-emerald-800/60 hover:bg-emerald-300'
                    }`}
                  />
                  <span className="text-[10px] text-emerald-800/70 dark:text-emerald-400/80 font-medium">
                    {bar.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crop Health Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-50">
                Crop Health Distribution
              </h3>
              <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
                Aggregated disease vs healthy field observations
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {Math.round((healthyCount / (totalScans || 1)) * 100)}% Safe
            </span>
          </div>

          <div className="flex items-center justify-center gap-6 py-2">
            {/* SVG Donut */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-emerald-100 dark:text-emerald-950"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeDasharray={`${Math.round((healthyCount / (totalScans || 1)) * 88)}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-emerald-950 dark:text-white tabular-nums">
                  {totalScans}
                </span>
                <span className="block text-[9px] uppercase font-bold text-emerald-700/80 dark:text-emerald-400">
                  Total
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-500"></span>
                <span className="text-emerald-900 dark:text-emerald-200 font-medium">Healthy Crops</span>
                <span className="font-bold tabular-nums ml-auto">{healthyCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-red-500"></span>
                <span className="text-emerald-900 dark:text-emerald-200 font-medium">Blight & Fungi</span>
                <span className="font-bold tabular-nums ml-auto">{diseasedCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-amber-500"></span>
                <span className="text-emerald-900 dark:text-emerald-200 font-medium">Nutrient Stress</span>
                <span className="font-bold tabular-nums ml-auto">1</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-900/10 dark:border-emerald-800/30 text-[11px] text-emerald-700/80 dark:text-emerald-400 flex items-center justify-between">
            <span>Regular weekly scans prevent yield loss by 35%</span>
            <button
              onClick={() => onNavigate('scanner')}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              Scan new leaf →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Scans & Weather Spray Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Diagnoses Deck (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-50">
                {t('recentScans', currentLang)}
              </h3>
              <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
                Latest crop pathology scans with remedies
              </p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>View History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-emerald-900/5 dark:divide-emerald-800/30">
            {diagnoses.slice(0, 4).map((diag) => (
              <div
                key={diag.id}
                onClick={() => onViewDiagnosisDetail(diag)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-emerald-100 dark:bg-emerald-950/80 shrink-0 border border-emerald-900/10">
                    <img src={diag.imageUrl} alt={diag.diseaseName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-emerald-950 dark:text-white">
                        {diag.cropName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          diag.isHealthy
                            ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                        }`}
                      >
                        {diag.isHealthy ? 'Healthy' : `${diag.severity.toUpperCase()} RISK`}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-800/80 dark:text-emerald-300 font-medium truncate max-w-xs sm:max-w-md">
                      {diag.diseaseName}
                    </div>
                    <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60">
                      {diag.date}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 tabular-nums">
                    {diag.confidence}%
                  </span>
                  <span className="block text-[10px] text-emerald-600/70">AI Confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather & Foliar Spray Advisory Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-50 flex items-center gap-1.5">
                <CloudSun className="w-4 h-4 text-emerald-600" />
                <span>{t('weatherGuide', currentLang)}</span>
              </h3>
              <button
                onClick={() => onNavigate('weather')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Forecast →
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/40">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-extrabold text-emerald-950 dark:text-white tabular-nums">
                    {weatherToday.tempMax}°C
                  </div>
                  <div className="text-xs text-emerald-800/80 dark:text-emerald-300 font-medium">
                    {weatherToday.condition}
                  </div>
                </div>
                <div className="text-4xl">{weatherToday.icon}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40 text-[11px] text-emerald-900/80 dark:text-emerald-200">
                <div className="flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-blue-500" />
                  <span>Humidity: {weatherToday.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Wind: {weatherToday.windSpeed} km/h</span>
                </div>
              </div>
            </div>

            {/* Spray Suitability Tag */}
            <div className="mt-3 p-2.5 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/80 border border-emerald-300/50 dark:border-emerald-800/50 flex items-start gap-2 text-xs font-semibold text-emerald-900 dark:text-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{t('sprayOptimal', currentLang)}</span>
            </div>
          </div>

          {/* Daily Agronomy Tip */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>{t('tipOfTheDay', currentLang)}</span>
            </div>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
              {tipOfTheDay.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
