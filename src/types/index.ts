export type LanguageCode =
  | 'en'
  | 'hi'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'mr'
  | 'bn'
  | 'gu'
  | 'pa'
  | 'or'
  | 'ur';

export type ActiveTab =
  | 'dashboard'
  | 'scanner'
  | 'chat'
  | 'plants'
  | 'weather'
  | 'history'
  | 'reminders'
  | 'settings';

export interface CropInfo {
  id: string;
  name: string;
  icon: string;
  category: 'Cereal' | 'Vegetable' | 'Cash Crop' | 'Fruit' | 'Pulse' | 'Oilseed';
  localNames: Partial<Record<LanguageCode, string>>;
  commonDiseases: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Perennial' | 'All Season';
  daysToHarvest: number;
}

export interface DiagnosisRecord {
  id: string;
  cropName: string;
  diseaseName: string;
  diseaseKey: string;
  confidence: number;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  isHealthy: boolean;
  date: string;
  description: string;
  symptoms: string;
  affectedParts: string;
  treatment: string;
  prevention: string;
  alternatives: Array<{ name: string; confidence: number; severity: string }>;
  imageSignals: string[];
  imageUrl: string;
}

export interface UserCrop {
  id: string;
  name: string;
  variety: string;
  category: string;
  icon: string;
  areaAcres: number;
  sowingDate: string;
  healthStatus: 'healthy' | 'diseased' | 'recovering';
  lastScanned?: string;
  notes?: string;
}

export interface CareReminder {
  id: string;
  cropName: string;
  title: string;
  type: 'water' | 'fertilizer' | 'spray' | 'harvest';
  dueDate: string;
  isCompleted: boolean;
  notes?: string;
}

export interface WeatherDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  rainChance: number;
  humidity: number;
  windSpeed: number;
  spraySuitability: 'optimal' | 'moderate' | 'unsuitable';
  sprayAdvice: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'doctor';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  id: string; // Auth UID
  googleId: string; // Google Provider ID
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'farmer' | 'agronomist' | 'gardener';
  language?: string;
  createdAt: string;
  lastLoginAt: string;
}

