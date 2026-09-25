import React from 'react';
import { getWeatherInfo, WEATHER_THEMES } from '../utils/weatherCodes';

export default function WeatherBackground({ weatherCode, isDay = 1, children }) {
  const info = getWeatherInfo(weatherCode ?? 0, isDay);
  const theme = info.theme;

  // Curated atmospheric background gradients based on weather & day/night
  const getAtmosphereConfig = () => {
    switch (theme) {
      case WEATHER_THEMES.CLEAR_DAY:
        return {
          bg: 'bg-gradient-to-b from-sky-950 via-slate-950 to-slate-950',
          radialGlow1: 'bg-amber-500/15',
          radialGlow2: 'bg-sky-500/15',
          accentBorder: 'border-amber-500/20',
        };
      case WEATHER_THEMES.PARTLY_CLOUDY_DAY:
        return {
          bg: 'bg-gradient-to-b from-sky-950/80 via-slate-950 to-slate-950',
          radialGlow1: 'bg-amber-400/10',
          radialGlow2: 'bg-cyan-500/10',
          accentBorder: 'border-sky-500/20',
        };
      case WEATHER_THEMES.CLEAR_NIGHT:
        return {
          bg: 'bg-gradient-to-b from-indigo-950 via-slate-950 to-slate-950',
          radialGlow1: 'bg-indigo-600/15',
          radialGlow2: 'bg-purple-900/15',
          accentBorder: 'border-indigo-500/20',
        };
      case WEATHER_THEMES.PARTLY_CLOUDY_NIGHT:
        return {
          bg: 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950',
          radialGlow1: 'bg-indigo-900/15',
          radialGlow2: 'bg-slate-800/20',
          accentBorder: 'border-indigo-500/15',
        };
      case WEATHER_THEMES.CLOUDY:
        return {
          bg: 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950',
          radialGlow1: 'bg-slate-700/15',
          radialGlow2: 'bg-sky-900/10',
          accentBorder: 'border-slate-700/30',
        };
      case WEATHER_THEMES.RAIN:
      case WEATHER_THEMES.HEAVY_RAIN:
        return {
          bg: 'bg-gradient-to-b from-cyan-950 via-slate-950 to-slate-950',
          radialGlow1: 'bg-cyan-600/15',
          radialGlow2: 'bg-blue-800/15',
          accentBorder: 'border-cyan-500/20',
        };
      case WEATHER_THEMES.THUNDERSTORM:
        return {
          bg: 'bg-gradient-to-b from-purple-950/80 via-slate-950 to-slate-950',
          radialGlow1: 'bg-purple-700/20',
          radialGlow2: 'bg-amber-500/10',
          accentBorder: 'border-purple-500/25',
        };
      case WEATHER_THEMES.SNOW:
        return {
          bg: 'bg-gradient-to-b from-cyan-950/60 via-slate-950 to-slate-950',
          radialGlow1: 'bg-cyan-400/15',
          radialGlow2: 'bg-blue-300/10',
          accentBorder: 'border-cyan-400/20',
        };
      case WEATHER_THEMES.FOG:
        return {
          bg: 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950',
          radialGlow1: 'bg-slate-500/10',
          radialGlow2: 'bg-zinc-700/10',
          accentBorder: 'border-slate-600/20',
        };
      default:
        return {
          bg: 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950',
          radialGlow1: 'bg-sky-600/10',
          radialGlow2: 'bg-indigo-900/15',
          accentBorder: 'border-slate-800',
        };
    }
  };

  const atmosphere = getAtmosphereConfig();

  return (
    <div className={`relative min-h-screen ${atmosphere.bg} transition-colors duration-1000 overflow-x-hidden text-slate-100`}>
      {/* Ambient background glow orbs */}
      <div
        aria-hidden="true"
        className={`fixed top-[-10%] right-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full ${atmosphere.radialGlow1} blur-[120px] pointer-events-none transition-all duration-1000`}
      />
      <div
        aria-hidden="true"
        className={`fixed bottom-[10%] left-[-10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full ${atmosphere.radialGlow2} blur-[140px] pointer-events-none transition-all duration-1000`}
      />

      {/* Subtle weather particle hints */}
      {(theme === WEATHER_THEMES.RAIN || theme === WEATHER_THEMES.HEAVY_RAIN) && (
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
          <div className="absolute w-[2px] h-[30px] bg-sky-300 left-[15%] top-[-20px] animate-pulse" />
          <div className="absolute w-[2px] h-[25px] bg-sky-300 left-[45%] top-[-20px] animate-pulse delay-100" />
          <div className="absolute w-[2px] h-[35px] bg-sky-300 left-[75%] top-[-20px] animate-pulse delay-300" />
          <div className="absolute w-[2px] h-[20px] bg-sky-300 left-[85%] top-[-20px] animate-pulse delay-200" />
        </div>
      )}

      {/* App content container */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
