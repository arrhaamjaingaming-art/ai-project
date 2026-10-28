import React, { useState } from 'react';
import { History, Search, Filter, CheckCircle2, AlertTriangle, Printer, X, Eye } from 'lucide-react';
import { DiagnosisRecord, LanguageCode } from '../types';
import { t } from '../utils/translations';

interface HistoryViewProps {
  currentLang: LanguageCode;
  diagnoses: DiagnosisRecord[];
  onViewDiagnosisDetail: (record: DiagnosisRecord) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  currentLang,
  diagnoses,
  onViewDiagnosisDetail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'healthy' | 'diseased'>('all');

  const filtered = diagnoses.filter((d) => {
    const matchesSearch =
      d.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.diseaseName.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'healthy') return matchesSearch && d.isHealthy;
    if (filterType === 'diseased') return matchesSearch && !d.isHealthy;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-600" />
            <span>{t('history', currentLang)}</span>
          </h1>
          <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
            Archived agricultural pathology scans, confidence scores, and past treatments
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 text-xs font-semibold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Export / Print</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop or disease name..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-emerald-50/50 dark:bg-[#121c15] border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100 placeholder:text-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 p-1 rounded-xl border border-emerald-900/10 dark:border-emerald-800/30 text-xs font-medium">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-white dark:bg-[#142218] text-emerald-950 dark:text-emerald-50 font-bold shadow-sm'
                : 'text-emerald-700/80 dark:text-emerald-400'
            }`}
          >
            All ({diagnoses.length})
          </button>
          <button
            onClick={() => setFilterType('diseased')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === 'diseased'
                ? 'bg-white dark:bg-[#142218] text-red-600 font-bold shadow-sm'
                : 'text-emerald-700/80 dark:text-emerald-400'
            }`}
          >
            Diseased
          </button>
          <button
            onClick={() => setFilterType('healthy')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              filterType === 'healthy'
                ? 'bg-white dark:bg-[#142218] text-green-600 font-bold shadow-sm'
                : 'text-emerald-700/80 dark:text-emerald-400'
            }`}
          >
            Healthy
          </button>
        </div>
      </div>

      {/* History Cards Deck */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((record) => (
            <div
              key={record.id}
              onClick={() => onViewDiagnosisDetail(record)}
              className="p-4 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-emerald-500/40"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/10 shrink-0 border border-emerald-900/10">
                  <img src={record.imageUrl} alt={record.diseaseName} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm text-emerald-950 dark:text-white">
                      {record.cropName}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        record.isHealthy
                          ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {record.isHealthy ? 'Healthy' : `Severity: ${record.severity}`}
                    </span>
                    <span className="text-[11px] text-emerald-700/70 dark:text-emerald-400/70">
                      · {record.date}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                    {record.diseaseName}
                  </div>
                  <p className="text-[11px] text-emerald-800/70 dark:text-emerald-400/70 line-clamp-1 max-w-lg">
                    {record.symptoms || record.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-emerald-900/5">
                <div className="text-left sm:text-right">
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {record.confidence}%
                  </span>
                  <span className="block text-[10px] text-emerald-700/60">Confidence</span>
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white/60 dark:bg-[#142218]/60 border border-emerald-900/10 text-emerald-800/70 dark:text-emerald-400">
            <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">No diagnosis records match your filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
