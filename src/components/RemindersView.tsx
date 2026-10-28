import React, { useState } from 'react';
import { BellRing, Plus, CheckCircle, Clock, Droplet, Sparkles, X, Calendar } from 'lucide-react';
import { CareReminder, LanguageCode } from '../types';
import { CROPS_DATA } from '../data/mockData';
import { t } from '../utils/translations';

interface RemindersViewProps {
  currentLang: LanguageCode;
  reminders: CareReminder[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: CareReminder) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  currentLang,
  reminders,
  onToggleReminder,
  onAddReminder,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cropName, setCropName] = useState(CROPS_DATA[0].name);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'spray' | 'water' | 'fertilizer' | 'harvest'>('spray');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      id: `rem-${Date.now()}`,
      cropName,
      title: title.trim(),
      type,
      dueDate,
      isCompleted: false,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setNotes('');
    setIsModalOpen(false);
  };

  const pending = reminders.filter((r) => !r.isCompleted);
  const completed = reminders.filter((r) => r.isCompleted);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-emerald-600" />
            <span>{t('reminders', currentLang)} & Field Schedule</span>
          </h1>
          <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
            Never miss critical foliar spray dates, fungicide re-application intervals, or irrigation cycles
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addTask', currentLang)}</span>
        </button>
      </div>

      {/* Pending Tasks Section */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-400">
          Upcoming Field Actions ({pending.length})
        </h2>

        {pending.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pending.map((rem) => (
              <div
                key={rem.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleReminder(rem.id)}
                    className="mt-0.5 w-5 h-5 rounded-lg border-2 border-emerald-500 hover:bg-emerald-100 flex items-center justify-center text-transparent hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-emerald-950 dark:text-white">
                        {rem.cropName}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 uppercase">
                        {rem.type}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-emerald-900 dark:text-emerald-100">
                      {rem.title}
                    </p>
                    {rem.notes && (
                      <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400">
                        {rem.notes}
                      </p>
                    )}
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block pt-0.5">
                      Due: {rem.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-3xl bg-white/60 dark:bg-[#142218]/60 border border-emerald-900/10 text-emerald-800/70 dark:text-emerald-400">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-80" />
            <p className="text-sm font-semibold">All scheduled tasks completed!</p>
          </div>
        )}
      </div>

      {/* Completed Tasks Section */}
      {completed.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-emerald-900/10 dark:border-emerald-800/30">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800/60 dark:text-emerald-500">
            Completed Tasks ({completed.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-75">
            {completed.map((rem) => (
              <div
                key={rem.id}
                className="p-3.5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-900/10 flex items-center justify-between gap-3 line-through text-emerald-800/60 dark:text-emerald-400/60 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => onToggleReminder(rem.id)}
                    className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                  <span>
                    <strong>{rem.cropName}:</strong> {rem.title}
                  </span>
                </div>
                <span className="text-[10px] font-semibold">{rem.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/20 dark:border-emerald-800/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/10 dark:border-emerald-800/30 pb-3">
              <h3 className="font-extrabold text-base text-emerald-950 dark:text-white flex items-center gap-2">
                <BellRing className="w-5 h-5 text-emerald-600" />
                <span>Schedule Care Task</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-emerald-800/60 hover:text-emerald-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-emerald-950 dark:text-emerald-100 block mb-1">
                  Crop Plot
                </label>
                <select
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CROPS_DATA.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-emerald-950 dark:text-emerald-100 block mb-1">
                  Task Category
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['spray', 'water', 'fertilizer', 'harvest'] as const).map((tVal) => (
                    <button
                      key={tVal}
                      type="button"
                      onClick={() => setType(tVal)}
                      className={`py-2 rounded-xl text-center capitalize font-semibold border transition-all ${
                        type === tVal
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-900/10'
                      }`}
                    >
                      {tVal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-emerald-950 dark:text-emerald-100 block mb-1">
                  Task Description / Instruction
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Apply preventive Copper Hydroxide spray"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#121c15] border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-950 dark:text-emerald-100 block mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#121c15] border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-950 dark:text-emerald-100 block mb-1">
                  Dosage / Additional Instructions
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 2.5g per Liter water, spray before 10 AM"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#121c15] border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-emerald-800 dark:text-emerald-300 font-semibold"
                >
                  {t('cancel', currentLang)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-700/20"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
