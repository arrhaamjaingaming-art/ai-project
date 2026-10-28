import React from 'react';
import { CloudSun, Droplet, Wind, ShieldCheck, AlertTriangle, XCircle, Info, Calendar } from 'lucide-react';
import { LanguageCode, WeatherDay } from '../types';
import { WEATHER_FORECAST } from '../data/mockData';
import { t } from '../utils/translations';

interface WeatherViewProps {
  currentLang: LanguageCode;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ currentLang }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-950 dark:text-emerald-50 flex items-center gap-2">
          <CloudSun className="w-6 h-6 text-emerald-600" />
          <span>{t('weather', currentLang)} & Foliar Spray Advisory</span>
        </h1>
        <p className="text-xs text-emerald-800/70 dark:text-emerald-400/80">
          Field meteorological guidance to optimize fertilizer and fungicide spray efficacy without drift or wash-off
        </p>
      </div>

      {/* 5-Day Weather Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {WEATHER_FORECAST.map((day) => {
          const isOptimal = day.spraySuitability === 'optimal';
          const isModerate = day.spraySuitability === 'moderate';
          return (
            <div
              key={day.date}
              className="p-4 rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-emerald-950 dark:text-white">
                    {day.day}
                  </span>
                  <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400 font-medium">
                    {day.date}
                  </span>
                </div>

                <div className="my-3 text-center">
                  <div className="text-4xl mb-1">{day.icon}</div>
                  <div className="text-xl font-extrabold text-emerald-950 dark:text-white tabular-nums">
                    {day.tempMax}° / <span className="text-sm font-normal text-emerald-700">{day.tempMin}°C</span>
                  </div>
                  <span className="text-xs text-emerald-800/80 dark:text-emerald-300 font-medium">
                    {day.condition}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-emerald-900/10 dark:border-emerald-800/30 text-xs text-emerald-900/80 dark:text-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700/70 dark:text-emerald-400/70">Rain Probability</span>
                    <span className="font-bold tabular-nums">{day.rainChance}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700/70 dark:text-emerald-400/70">Humidity</span>
                    <span className="font-bold tabular-nums">{day.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-700/70 dark:text-emerald-400/70">Wind Speed</span>
                    <span className="font-bold tabular-nums">{day.windSpeed} km/h</span>
                  </div>
                </div>
              </div>

              {/* Spray Tag */}
              <div
                className={`p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 ${
                  isOptimal
                    ? 'bg-green-100 text-green-900 dark:bg-green-950/80 dark:text-green-300'
                    : isModerate
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300'
                    : 'bg-red-100 text-red-900 dark:bg-red-950/80 dark:text-red-300'
                }`}
              >
                {isOptimal ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600 shrink-0" />
                ) : isModerate ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                )}
                <span className="truncate">
                  {isOptimal ? 'Optimal Spray' : isModerate ? 'Spray Caution' : 'Avoid Spraying'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spray Rules & Best Practices */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#142218] border border-emerald-900/10 dark:border-emerald-800/30 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-emerald-950 dark:text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>Foliar Chemical & Bio-Spray Rules for Maximum Absorption</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-emerald-950/90 dark:text-emerald-200">
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-900/10 space-y-1">
            <div className="font-bold text-emerald-900 dark:text-emerald-100">
              1. Wind Speed Index (&lt; 12 km/h)
            </div>
            <p className="leading-relaxed text-emerald-800/80 dark:text-emerald-400/90">
              Strong winds cause severe chemical drift onto non-target areas and rapid droplet evaporation. Spray early morning before thermal wind currents build up.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-900/10 space-y-1">
            <div className="font-bold text-emerald-900 dark:text-emerald-100">
              2. Rain Fastness Window (4 to 6 Hours)
            </div>
            <p className="leading-relaxed text-emerald-800/80 dark:text-emerald-400/90">
              Systemic fungicides and micronutrients require 4 hours of rain-free foliage to be absorbed by leaf stomata. Add a non-ionic surfactant/sticker if rain is forecasted.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-900/10 space-y-1">
            <div className="font-bold text-emerald-900 dark:text-emerald-100">
              3. Temperature & Leaf Burn (&lt; 32°C)
            </div>
            <p className="leading-relaxed text-emerald-800/80 dark:text-emerald-400/90">
              Spraying sulfur or copper compounds during scorching midday sunlight causes phytotoxicity (leaf scorch). Ideal application temperatures are between 18°C and 28°C.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
