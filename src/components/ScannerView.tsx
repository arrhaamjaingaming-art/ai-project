import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Printer,
  BotMessageSquare,
  ShieldCheck,
  ChevronRight,
  Eye,
  Crosshair,
} from 'lucide-react';
import { ActiveTab, DiagnosisRecord, LanguageCode } from '../types';
import { SAMPLE_PRESET_LEAVES } from '../data/mockData';
import { t } from '../utils/translations';

interface ScannerViewProps {
  currentLang: LanguageCode;
  selectedCropForScan: string;
  onNavigate: (tab: ActiveTab) => void;
  onSaveDiagnosis: (record: DiagnosisRecord) => void;
  onStartDoctorChatWithContext: (context: string) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  currentLang,
  selectedCropForScan,
  onNavigate,
  onSaveDiagnosis,
  onStartDoctorChatWithContext,
}) => {
  const [selectedCrop, setSelectedCrop] = useState(selectedCropForScan || 'Tomato');
  const [question, setQuestion] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(0);
  const [currentResult, setCurrentResult] = useState<DiagnosisRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCropForScan) {
      setSelectedCrop(selectedCropForScan);
    }
  }, [selectedCropForScan]);

  const cropPills = [
    { name: 'Tomato', icon: '🍅' },
    { name: 'Potato', icon: '🥔' },
    { name: 'Rice', icon: '🌾' },
    { name: 'Wheat', icon: '🌾' },
    { name: 'Maize', icon: '🌽' },
    { name: 'Cotton', icon: '☁️' },
    { name: 'Chilli', icon: '🌶️' },
    { name: 'Onion', icon: '🧅' },
    { name: 'Soybean', icon: '🌱' },
    { name: 'Sugarcane', icon: '🎋' },
    { name: 'Banana', icon: '🍌' },
    { name: 'Other', icon: '🌿' },
  ];

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image (JPG, PNG, or WEBP).');
      return;
    }
    setErrorMessage(null);
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_PRESET_LEAVES[0]) => {
    setSelectedCrop(sample.crop);
    setImagePreview(sample.svgDataUrl);
    setImageFile(null);
    setErrorMessage(null);
    setCurrentResult(null);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      setErrorMessage('Please take or upload a crop photo first.');
      return;
    }

    setIsScanning(true);
    setScanStage(1);
    setErrorMessage(null);
    setCurrentResult(null);

    // Staged progression animation
    const stages = [1, 2, 3, 4];
    for (let i = 0; i < stages.length; i++) {
      await new Promise((r) => setTimeout(r, 450));
      setScanStage(stages[i]);
    }

    try {
      const response = await fetch('/api/scanner/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePreview,
          cropName: selectedCrop,
          question,
          language: currentLang,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newRecord: DiagnosisRecord = {
          id: `diag-${Date.now()}`,
          cropName: selectedCrop,
          diseaseName: data.disease_name || 'Healthy Crop',
          diseaseKey: data.disease_key || 'healthy',
          confidence: data.confidence || 85,
          severity: data.severity || 'moderate',
          isHealthy: Boolean(data.is_healthy),
          date: new Date().toISOString().slice(0, 10),
          description: data.description || '',
          symptoms: data.symptoms || '',
          affectedParts: data.affected_parts || '',
          treatment: data.treatment || '',
          prevention: data.prevention || '',
          alternatives: data.alternatives || [],
          imageSignals: data.image_signals || [],
          imageUrl: imagePreview,
        };

        setCurrentResult(newRecord);
        onSaveDiagnosis(newRecord);

        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      } else {
        setErrorMessage(data.error || 'Failed to complete diagnosis. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Network connection error. Please retry.');
    } finally {
      setIsScanning(false);
      setScanStage(0);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setCurrentResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
            <Camera className="w-6 h-6 text-emerald-600" />
            <span>{t('aiScan', currentLang)}</span>
          </h1>
          <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
            Take or upload a close-up photo of any damaged leaf or stem for instant pathology diagnosis
          </p>
        </div>

        <button
          onClick={() => onNavigate('history')}
          className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50"
        >
          {t('history', currentLang)} →
        </button>
      </div>

      {/* Crop Selector Ribbon */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm space-y-2">
        <label className="text-xs font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
          <span>{t('selectYourCrop', currentLang)}:</span>
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {cropPills.map((pill) => (
            <button
              key={pill.name}
              onClick={() => setSelectedCrop(pill.name)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCrop === pill.name
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100/70'
              }`}
            >
              <span>{pill.icon}</span>
              <span>{pill.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload & Viewfinder Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm space-y-4">
            {/* Viewfinder Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
              }}
              className="relative aspect-4/3 w-full rounded-2xl bg-emerald-950/5 dark:bg-black/30 border-2 border-dashed border-emerald-500/40 overflow-hidden flex flex-col items-center justify-center p-4 text-center group"
            >
              {/* Camera Reticle Brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-500 pointer-events-none"></div>
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-500 pointer-events-none"></div>
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-500 pointer-events-none"></div>
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-500 pointer-events-none"></div>

              {imagePreview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Crop Leaf Preview"
                    className="w-full h-full object-contain rounded-xl"
                  />

                  {/* Sweeping Laser Beam when scanning */}
                  {isScanning && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#22c55e] animate-bounce"></div>
                    </div>
                  )}

                  <button
                    onClick={handleReset}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-w-sm">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                    <Crosshair className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-emerald-950 dark:text-emerald-50">
                      {t('uploadLeaf', currentLang)}
                    </h3>
                    <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80 mt-0.5">
                      Ensure direct natural lighting and focus on visible spots
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{t('takePhoto', currentLang)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-[#142218] border border-emerald-900/20 dark:border-emerald-700/40 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-950 dark:text-emerald-100 font-semibold text-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{t('chooseImage', currentLang)}</span>
                    </button>
                  </div>
                  <span className="block text-[10px] text-emerald-800/50 dark:text-emerald-500/50">
                    Supports JPG, PNG, WEBP (Max 20MB)
                  </span>
                </div>
              )}

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFile(e.target.files[0]);
                }}
              />
            </div>

            {/* Quick Test Sample Leaves (One-Tap presets) */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('sampleImages', currentLang)}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SAMPLE_PRESET_LEAVES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className="p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 border border-emerald-900/10 dark:border-emerald-800/30 text-left transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="aspect-square w-full rounded-lg overflow-hidden bg-black/10 mb-1.5 border border-emerald-900/10">
                      <img src={sample.svgDataUrl} alt={sample.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="font-bold text-[11px] text-emerald-950 dark:text-emerald-100 truncate">
                      {sample.name}
                    </div>
                    <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                      {sample.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional question / notes input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-950 dark:text-emerald-100">
                {t('symptomsLabel', currentLang)}
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Yellowing concentric spots on lower leaves spreading after rains..."
                rows={2}
                className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-[#121c15] border border-emerald-900/15 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100 placeholder:text-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isScanning || !imagePreview}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
                isScanning || !imagePreview
                  ? 'bg-emerald-950/20 text-emerald-900/40 dark:text-emerald-400/40 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-700/30 active:scale-[0.99]'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{t('scanning', currentLang)}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>{t('analyzeWithAi', currentLang)} ({selectedCrop})</span>
                </>
              )}
            </button>

            {/* Progressive Scanning Animation Stages */}
            {isScanning && (
              <div className="p-4 rounded-2xl bg-emerald-950/5 dark:bg-emerald-950/40 border border-emerald-500/20 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <span>Diagnostic Progress</span>
                  <span>{scanStage * 25}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-emerald-200/50 dark:bg-emerald-900/50 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${scanStage * 25}%` }}
                  />
                </div>
                <div className="text-[11px] text-emerald-800/80 dark:text-emerald-400 space-y-1 pt-1 font-medium">
                  <div className={scanStage >= 1 ? 'text-emerald-600 dark:text-emerald-300 font-bold' : 'opacity-40'}>
                    ✓ 1. Preprocessing photo & calibration
                  </div>
                  <div className={scanStage >= 2 ? 'text-emerald-600 dark:text-emerald-300 font-bold' : 'opacity-40'}>
                    ✓ 2. Segmenting leaf lesions & chlorotic margins
                  </div>
                  <div className={scanStage >= 3 ? 'text-emerald-600 dark:text-emerald-300 font-bold' : 'opacity-40'}>
                    ✓ 3. Cross-referencing crop pathology database
                  </div>
                  <div className={scanStage >= 4 ? 'text-emerald-600 dark:text-emerald-300 font-bold' : 'opacity-40'}>
                    ✓ 4. Formulating actionable organic & chemical treatment
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Plantix-Style Diagnosis Result Card */}
        <div className="lg:col-span-6" ref={resultRef}>
          {currentResult ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-200">
              {/* Header Actions */}
              <div className="flex items-center justify-between pb-3 border-b border-emerald-900/10 dark:border-emerald-800/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Diagnosis Report
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                    {currentResult.cropName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-lg border border-emerald-900/10 dark:border-emerald-800/30 hover:bg-emerald-50 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-1 cursor-pointer"
                    title="Print"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded-lg border border-emerald-900/10 dark:border-emerald-800/30 hover:bg-emerald-50 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{t('newScan', currentLang)}</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl flex items-start gap-3.5 ${
                  currentResult.isHealthy
                    ? 'bg-gradient-to-br from-green-500/15 to-emerald-500/10 border border-green-500/30 text-green-950 dark:text-green-50'
                    : 'bg-gradient-to-br from-red-500/15 to-amber-500/10 border border-red-500/30 text-red-950 dark:text-red-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold ${
                    currentResult.isHealthy ? 'bg-green-600' : 'bg-red-600'
                  }`}
                >
                  {currentResult.isHealthy ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold leading-snug">
                    {currentResult.diseaseName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        currentResult.isHealthy
                          ? 'bg-green-200 dark:bg-green-950 text-green-900 dark:text-green-200'
                          : 'bg-red-200 dark:bg-red-950 text-red-900 dark:text-red-200'
                      }`}
                    >
                      {currentResult.isHealthy ? '100% HEALTHY' : `SEVERITY: ${currentResult.severity.toUpperCase()}`}
                    </span>
                    <span className="text-[10px] text-emerald-800/80 dark:text-emerald-300 font-semibold">
                      Pathology Verified · {currentResult.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Confidence Gauge */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-100">
                  <span>{t('confidence', currentLang)} (Visual Pattern Match)</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {currentResult.confidence}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-emerald-100 dark:bg-emerald-950 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      currentResult.confidence > 80
                        ? 'bg-emerald-500'
                        : currentResult.confidence > 60
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${currentResult.confidence}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-400">
                  Condition Overview
                </h4>
                <p className="text-xs text-emerald-950/90 dark:text-emerald-100 leading-relaxed font-normal">
                  {currentResult.description}
                </p>
              </div>

              {/* Visual Symptoms & Affected Parts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {currentResult.affectedParts && (
                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-800/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                      {t('affectedParts', currentLang)}
                    </span>
                    <span className="font-semibold text-emerald-950 dark:text-emerald-100">
                      {currentResult.affectedParts}
                    </span>
                  </div>
                )}
                {currentResult.symptoms && (
                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-900/10 dark:border-emerald-800/30">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                      {t('symptoms', currentLang)}
                    </span>
                    <span className="font-semibold text-emerald-950 dark:text-emerald-100">
                      {currentResult.symptoms}
                    </span>
                  </div>
                )}
              </div>

              {/* Recommended Treatment (Numbered, Organic & Chemical) */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t('treatment', currentLang)}</span>
                </h4>
                <div className="text-xs text-emerald-950/90 dark:text-emerald-100 whitespace-pre-line leading-relaxed font-normal">
                  {currentResult.treatment}
                </div>
              </div>

              {/* Chemical Safety Notice */}
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/40 dark:border-amber-800/40 text-[11px] text-amber-950 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{t('chemicalSafety', currentLang)}</span>
              </div>

              {/* Prevention Strategy */}
              {currentResult.prevention && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-400">
                    {t('prevention', currentLang)}
                  </h4>
                  <div className="text-xs text-emerald-950/90 dark:text-emerald-100 whitespace-pre-line leading-relaxed">
                    {currentResult.prevention}
                  </div>
                </div>
              )}

              {/* Differential Alternatives */}
              {currentResult.alternatives && currentResult.alternatives.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-emerald-900/10 dark:border-emerald-800/30">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-800/70 dark:text-emerald-400">
                    {t('differential', currentLang)}
                  </h4>
                  <div className="space-y-1.5">
                    {currentResult.alternatives.map((alt) => (
                      <div
                        key={alt.name}
                        className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 text-xs"
                      >
                        <span className="font-semibold text-emerald-950 dark:text-emerald-200">
                          {alt.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-700/70 dark:text-emerald-400/70">
                            {alt.severity}
                          </span>
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 tabular-nums">
                            {alt.confidence}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA to Chat */}
              <div className="pt-2">
                <button
                  onClick={() =>
                    onStartDoctorChatWithContext(
                      `I just scanned my ${currentResult.cropName} and got diagnosed with ${currentResult.diseaseName} (${currentResult.confidence}% confidence). Can you explain how to manage this in detail?`
                    )
                  }
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  <BotMessageSquare className="w-4 h-4 text-emerald-100" />
                  <span>{t('discussWithDoctor', currentLang)}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white/60 dark:bg-[#142218]/60 border border-emerald-900/10 dark:border-emerald-800/30 text-center flex flex-col items-center justify-center min-h-[420px] space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl">
                🌿
              </div>
              <div>
                <h3 className="font-extrabold text-base text-emerald-950 dark:text-emerald-50">
                  Ready to Diagnose Your Crop
                </h3>
                <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80 max-w-sm mt-1">
                  Take a photo or choose from the sample leaves on the left to see the Plantix-inspired diagnosis card with treatment instructions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
