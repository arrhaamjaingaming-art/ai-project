import React, { useState, useEffect } from 'react';
import { ActiveTab, CareReminder, DiagnosisRecord, LanguageCode, UserCrop } from './types';
import { isRtlLanguage } from './utils/translations';
import { INITIAL_DIAGNOSES, INITIAL_REMINDERS, INITIAL_USER_CROPS, WEATHER_FORECAST } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/DashboardView';
import { ScannerView } from './components/ScannerView';
import { ChatView } from './components/ChatView';
import { MyCropsView } from './components/MyCropsView';
import { HistoryView } from './components/HistoryView';
import { WeatherView } from './components/WeatherView';
import { RemindersView } from './components/RemindersView';
import { SettingsView } from './components/SettingsView';
import { DiagnosisModal } from './components/DiagnosisModal';
import { LoginSidePanel } from './components/LoginSidePanel';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    return (localStorage.getItem('agri_lang') as LanguageCode) || 'en';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('agri_theme') as 'light' | 'dark') || 'light';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCropForScan, setSelectedCropForScan] = useState<string>('Tomato');
  const [chatContext, setChatContext] = useState<string | undefined>();
  const [selectedModalRecord, setSelectedModalRecord] = useState<DiagnosisRecord | null>(null);
  const [hasGemini, setHasGemini] = useState<boolean>(true);

  // Stored state
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>(() => {
    const saved = localStorage.getItem('agri_diagnoses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_DIAGNOSES;
  });

  const [userCrops, setUserCrops] = useState<UserCrop[]>(() => {
    const saved = localStorage.getItem('agri_user_crops');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_USER_CROPS;
  });

  const [reminders, setReminders] = useState<CareReminder[]>(() => {
    const saved = localStorage.getItem('agri_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_REMINDERS;
  });

  // Sync theme to HTML root element
  useEffect(() => {
    localStorage.setItem('agri_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync language and RTL direction
  useEffect(() => {
    localStorage.setItem('agri_lang', currentLang);
    const isRtl = isRtlLanguage(currentLang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLang);
  }, [currentLang]);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('agri_diagnoses', JSON.stringify(diagnoses));
  }, [diagnoses]);

  useEffect(() => {
    localStorage.setItem('agri_user_crops', JSON.stringify(userCrops));
  }, [userCrops]);

  useEffect(() => {
    localStorage.setItem('agri_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Check backend health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasGemini === 'boolean') {
          setHasGemini(data.hasGemini);
        }
      })
      .catch(() => {});
  }, []);

  const handleLanguageChange = (lang: LanguageCode) => {
    setCurrentLang(lang);
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectCropForScan = (cropName: string) => {
    setSelectedCropForScan(cropName);
    setActiveTab('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDiagnosis = (newRecord: DiagnosisRecord) => {
    setDiagnoses((prev) => [newRecord, ...prev]);
  };

  const handleStartDoctorChatWithContext = (context: string) => {
    setChatContext(context);
    setActiveTab('chat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCompleted: !r.isCompleted } : r))
    );
  };

  const handleAddReminder = (newRem: CareReminder) => {
    setReminders((prev) => [newRem, ...prev]);
  };

  const handleAddCrop = (newCrop: UserCrop) => {
    setUserCrops((prev) => [newCrop, ...prev]);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#f6f8f5] dark:bg-[#0b130e] text-[#142418] dark:text-[#f0fdf4] transition-colors pb-20 md:pb-6">
        {/* Top Navbar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        onNavigate={setActiveTab}
        reminders={reminders}
        hasGemini={hasGemini}
      />

      {/* Main Content Layout with Responsive Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          activeTab={activeTab}
          onNavigate={setActiveTab}
          currentLang={currentLang}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Viewport View Switcher */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentLang={currentLang}
              onNavigate={setActiveTab}
              onSelectCropForScan={handleSelectCropForScan}
              diagnoses={diagnoses}
              userCrops={userCrops}
              weatherToday={WEATHER_FORECAST[0]}
              onViewDiagnosisDetail={setSelectedModalRecord}
            />
          )}

          {activeTab === 'scanner' && (
            <ScannerView
              currentLang={currentLang}
              selectedCropForScan={selectedCropForScan}
              onNavigate={setActiveTab}
              onSaveDiagnosis={handleSaveDiagnosis}
              onStartDoctorChatWithContext={handleStartDoctorChatWithContext}
            />
          )}

          {activeTab === 'chat' && (
            <ChatView
              currentLang={currentLang}
              onNavigate={setActiveTab}
              initialContext={chatContext}
            />
          )}

          {activeTab === 'plants' && (
            <MyCropsView
              currentLang={currentLang}
              crops={userCrops}
              onAddCrop={handleAddCrop}
              onNavigate={setActiveTab}
              onScanCrop={handleSelectCropForScan}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              currentLang={currentLang}
              diagnoses={diagnoses}
              onViewDiagnosisDetail={setSelectedModalRecord}
            />
          )}

          {activeTab === 'weather' && <WeatherView currentLang={currentLang} />}

          {activeTab === 'reminders' && (
            <RemindersView
              currentLang={currentLang}
              reminders={reminders}
              onToggleReminder={handleToggleReminder}
              onAddReminder={handleAddReminder}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentLang={currentLang}
              onLanguageChange={handleLanguageChange}
              theme={theme}
              onThemeToggle={handleThemeToggle}
              hasGemini={hasGemini}
            />
          )}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (Plantix Style) */}
      <MobileBottomNav
        activeTab={activeTab}
        onNavigate={setActiveTab}
        currentLang={currentLang}
      />

      {/* Diagnosis Detail Modal */}
      <DiagnosisModal
        record={selectedModalRecord}
        onClose={() => setSelectedModalRecord(null)}
        currentLang={currentLang}
        onStartDoctorChatWithContext={handleStartDoctorChatWithContext}
      />

      {/* Google Account & Database Login Side Drawer */}
      <LoginSidePanel
        currentLang={currentLang}
        onNavigate={setActiveTab}
      />
    </div>
  </AuthProvider>
  );
}
