import React from 'react';
import { Star, MapPin, ArrowUp, ArrowDown, Clock, Sparkles } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemperature } from '../utils/temperature';
import { formatLocationTime } from '../utils/dateTime';

export default function CurrentWeather({
  location,
  weather,
  unit,
  isFavorite,
  onToggleFavorite,
  timezone,
  onViewSummary,
}) {
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const activeLocation = weather.location || location;
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);
  const locationTimeStr = formatLocationTime(current.time, timezone || activeLocation?.timezone);

  return (
    <section
      aria-label="Current Weather"
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 glass-panel shadow-2xl transition-all duration-300"
    >
      {/* Top Location Bar */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400 shrink-0" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              {activeLocation.name}
            </h2>
          </div>
          <div className="text-sm text-slate-300 mt-1 pl-7 flex flex-wrap items-center gap-2">
            <span>{[activeLocation.region, activeLocation.country].filter(Boolean).join(', ')}</span>
            <span className="text-slate-500">•</span>
            <span className="inline-flex items-center gap-1 text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {locationTimeStr}
            </span>
          </div>
        </div>

        {/* Action Buttons: Summary Shortcut & Favorite */}
        <div className="flex items-center gap-2 shrink-0">
          {onViewSummary && (
            <button
              type="button"
              onClick={onViewSummary}
              aria-label="View weather summary report"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white transition-all active:scale-95 group text-xs font-semibold"
              title="Jump to weather summary report"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Summary</span>
            </button>
          )}

          {/* Favorite / Bookmark Toggle Button */}
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'Remove from saved locations' : 'Save location'}
            aria-pressed={isFavorite}
            className={`p-3 rounded-2xl border transition-all active:scale-95 group ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title={isFavorite ? 'Saved to favorites' : 'Save location'}
          >
            <Star
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isFavorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Hero Temperature & Condition Display */}
      <div className="mt-8 sm:mt-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Big Temperature & Condition */}
        <div className="flex items-baseline gap-4 sm:gap-6">
          <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent select-none leading-none">
            {formatTemperature(current.temperature, unit)}
          </div>
          <div className="flex flex-col justify-end">
            <span className="text-xl sm:text-2xl font-bold text-slate-200">
              {unit === 'F' ? '°F' : '°C'}
            </span>
            <div className="mt-1 text-xs sm:text-sm font-medium text-slate-400">
              Feels like{' '}
              <span className="text-slate-200 font-semibold">
                {formatTemperature(current.feelsLike, unit, true)}
              </span>
            </div>
          </div>
        </div>

        {/* Condition Icon & Label */}
        <div className="flex items-center md:flex-col md:items-end gap-4 md:gap-2">
          <div className="flex items-center gap-3">
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              size={48}
              className="drop-shadow-lg"
            />
            <div className="md:text-right">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {weatherInfo.label}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-[200px] md:max-w-none">
                {weatherInfo.description}
              </p>
            </div>
          </div>

          {/* Today's High / Low tags */}
          <div className="flex items-center gap-3 pt-2 md:pt-1 text-xs sm:text-sm font-medium text-slate-300">
            {current.todayMax !== undefined && (
              <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
                <ArrowUp className="w-3.5 h-3.5 text-rose-400" />
                <span>High: {formatTemperature(current.todayMax, unit)}</span>
              </span>
            )}
            {current.todayMin !== undefined && (
              <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
                <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                <span>Low: {formatTemperature(current.todayMin, unit)}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
