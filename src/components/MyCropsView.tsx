import React, { useState } from 'react';
import { Sprout, Plus, Camera, Calendar, MapPin, HeartPulse, ShieldAlert, Sparkles, X } from 'lucide-react';
import { ActiveTab, LanguageCode, UserCrop } from '../types';
import { CROPS_DATA } from '../data/mockData';
import { t } from '../utils/translations';

interface MyCropsViewProps {
  currentLang: LanguageCode;
  crops: UserCrop[];
  onAddCrop: (crop: UserCrop) => void;
  onNavigate: (tab: ActiveTab) => void;
  onScanCrop: (cropName: string) => void;
}

export const MyCropsView: React.FC<MyCropsViewProps> = ({
  currentLang,
  crops,
  onAddCrop,
  onNavigate,
  onScanCrop,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPresetCrop, setSelectedPresetCrop] = useState(CROPS_DATA[0].name);
  const [variety, setVariety] = useState('');
  const [areaAcres, setAreaAcres] = useState('2.0');
  const [notes, setNotes] = useState('');

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = CROPS_DATA.find((c) => c.name === selectedPresetCrop) || CROPS_DATA[0];
    const newCrop: UserCrop = {
      id: `uc-${Date.now()}`,
      name: preset.name,
      variety: variety || 'Standard Local Hybrid',
      category: preset.category,
      icon: preset.icon,
      areaAcres: parseFloat(areaAcres) || 1.0,
      sowingDate: new Date().toISOString().slice(0, 10),
      healthStatus: 'healthy',
      lastScanned: 'Not scanned yet',
      notes: notes || 'Recently registered plot.',
    };

    onAddCrop(newCrop);
    setIsModalOpen(false);
    setVariety('');
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-600" />
            <span>{t('myPlants', currentLang)}</span>
          </h1>
          <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
            Registered farm plots and continuous disease prevention monitoring
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addCrop', currentLang)}</span>
        </button>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {crops.map((crop) => (
          <div
            key={crop.id}
            className="p-5 rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl p-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-900/10">
                    {crop.icon}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-emerald-950 dark:text-white">
                      {crop.name}
                    </h3>
                    <p className="text-xs text-emerald-800/80 dark:text-emerald-400 font-medium">
                      {crop.variety}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    crop.healthStatus === 'healthy'
                      ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                      : crop.healthStatus === 'recovering'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                  }`}
                >
                  {crop.healthStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-emerald-900/80 dark:text-emerald-200">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Area: {crop.areaAcres} Acres</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sown: {crop.sowingDate}</span>
                </div>
              </div>

              {crop.notes && (
                <p className="text-[11px] text-emerald-800/70 dark:text-emerald-400/70 mt-2 bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded-xl">
                  {crop.notes}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-emerald-900/10 dark:border-emerald-800/30 flex items-center justify-between">
              <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400">
                Last checked: {crop.lastScanned || 'Recent'}
              </span>
              <button
                onClick={() => onScanCrop(crop.name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan Crop</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Crop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/20 dark:border-emerald-800/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/10 dark:border-emerald-800/30 pb-3">
              <h3 className="font-extrabold text-base text-emerald-950 dark:text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                <span>Register New Crop Plot</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-emerald-800/60 hover:text-emerald-950 dark:text-emerald-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCrop} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-emerald-950 dark:text-emerald-100 block mb-1">
                  Select Crop Type
                </label>
                <select
                  value={selectedPresetCrop}
                  onChange={(e) => setSelectedPresetCrop(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CROPS_DATA.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.icon} {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-emerald-950 dark:text-emerald-100 block mb-1">
                  Variety / Seed Hybrid Name
                </label>
                <input
                  type="text"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  placeholder="e.g. Arka Rakshak, Pusa Basmati..."
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#121c15] border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-950 dark:text-emerald-100 block mb-1">
                  Cultivated Area (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={areaAcres}
                  onChange={(e) => setAreaAcres(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#121c15] border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-950 dark:text-emerald-100 block mb-1">
                  Notes (Irrigation, Soil Type)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Clay loam soil, drip irrigation with weekly foliar spray"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#121c15] border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-emerald-800 dark:text-emerald-300 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950"
                >
                  {t('cancel', currentLang)}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-700/20"
                >
                  {t('save', currentLang)} Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
