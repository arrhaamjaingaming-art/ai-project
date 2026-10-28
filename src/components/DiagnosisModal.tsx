import React from 'react';
import { X, CheckCircle2, AlertTriangle, Printer, BotMessageSquare, ShieldCheck } from 'lucide-react';
import { DiagnosisRecord, LanguageCode } from '../types';
import { t } from '../utils/translations';

interface DiagnosisModalProps {
  record: DiagnosisRecord | null;
  onClose: () => void;
  currentLang: LanguageCode;
  onStartDoctorChatWithContext: (context: string) => void;
}

export const DiagnosisModal: React.FC<DiagnosisModalProps> = ({
  record,
  onClose,
  currentLang,
  onStartDoctorChatWithContext,
}) => {
  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/20 dark:border-emerald-800/40 p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/10 dark:border-emerald-800/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Diagnostic Record
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              {record.cropName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-800/60 hover:text-emerald-950 dark:text-emerald-400 hover:bg-emerald-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div
          className={`p-4 rounded-2xl flex items-start gap-3.5 ${
            record.isHealthy
              ? 'bg-green-100/70 border border-green-300 text-green-950 dark:bg-green-950/60 dark:border-green-800 dark:text-green-200'
              : 'bg-red-100/70 border border-red-300 text-red-950 dark:bg-red-950/60 dark:border-red-800 dark:text-red-200'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold ${
              record.isHealthy ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {record.isHealthy ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold">{record.diseaseName}</h2>
            <div className="flex items-center gap-2 text-xs font-semibold mt-1">
              <span>{record.isHealthy ? 'Healthy Plant' : `Severity: ${record.severity.toUpperCase()}`}</span>
              <span>·</span>
              <span>Scanned on {record.date}</span>
            </div>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-100">
            <span>AI Pathological Confidence</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {record.confidence}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${record.confidence}%` }}
            />
          </div>
        </div>

        {/* Photo + Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-black/10 border border-emerald-900/10">
            <img src={record.imageUrl} alt={record.diseaseName} className="w-full h-full object-cover" />
          </div>
          <div className="sm:col-span-2 space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-400">
              Overview
            </h4>
            <p className="text-emerald-950 dark:text-emerald-100 leading-relaxed font-normal">
              {record.description}
            </p>
            {record.symptoms && (
              <div className="pt-1">
                <span className="font-bold text-emerald-900 dark:text-emerald-200">Symptoms: </span>
                <span className="text-emerald-800/80 dark:text-emerald-300">{record.symptoms}</span>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Treatment */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Recommended Treatment Steps</span>
          </h4>
          <div className="text-xs text-emerald-950/90 dark:text-emerald-100 whitespace-pre-line leading-relaxed font-normal">
            {record.treatment}
          </div>
        </div>

        {/* Prevention */}
        {record.prevention && (
          <div className="space-y-1 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-400">
              Prevention Protocol
            </h4>
            <div className="text-emerald-950/90 dark:text-emerald-100 whitespace-pre-line leading-relaxed">
              {record.prevention}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-emerald-900/10 dark:border-emerald-800/30 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#121c15] border border-emerald-900/15 text-xs font-bold text-emerald-900 dark:text-emerald-100 hover:bg-emerald-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onStartDoctorChatWithContext(
                `Can you provide more details on treatment and prevention for ${record.cropName} affected by ${record.diseaseName}?`
              );
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-700/20 cursor-pointer"
          >
            <BotMessageSquare className="w-4 h-4 text-emerald-100" />
            <span>Consult AI Doctor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
