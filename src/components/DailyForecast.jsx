import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemperature } from '../utils/temperature';
import { formatDay } from '../utils/dateTime';

export default function DailyForecast({ daily = [], unit }) {
  if (!daily || daily.length === 0) return null;

  // Calculate global min and max for range bar normalization
  const allMins = daily.map(d => d.temperatureMin ?? d.minTemp).filter(t => t !== undefined);
  const allMaxs = daily.map(d => d.temperatureMax ?? d.maxTemp).filter(t => t !== undefined);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempSpan = Math.max(globalMax - globalMin, 1);

  return (
    <section aria-label="7-Day Forecast" className="glass-panel rounded-3xl p-5 sm:p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-sky-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          7-Day Forecast
        </h3>
      </div>

      <div className="space-y-2.5">
        {daily.map((day, index) => {
          const { dayName, shortDate } = formatDay(day.date, index);
          const weatherInfo = getWeatherInfo(day.weatherCode, 1);
          const minTemp = day.temperatureMin ?? day.minTemp;
          const maxTemp = day.temperatureMax ?? day.maxTemp;
          const precipProb = day.precipitationProbabilityMax ?? day.precipProbMax;
          const hasRain = precipProb !== undefined && precipProb > 0;

          // Calculate bar offsets for visual temperature range
          const leftPercent = Math.max(0, Math.min(100, ((minTemp - globalMin) / tempSpan) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((maxTemp - globalMin) / tempSpan) * 100));
          const barWidth = Math.max(8, rightPercent - leftPercent);

          return (
            <div
              key={day.date || index}
              className={`p-3 sm:px-4 rounded-2xl flex items-center justify-between gap-3 transition-colors ${
                index === 0
                  ? 'bg-white/[0.06] border border-white/10'
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              {/* Day & Date */}
              <div className="w-24 sm:w-28 shrink-0">
                <div className="font-semibold text-sm text-white flex items-center gap-1.5">
                  <span>{dayName}</span>
                  {index === 0 && (
                    <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded border border-sky-500/20">
                      Now
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400">{shortDate}</div>
              </div>

              {/* Weather Condition & Icon */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <WeatherIcon code={day.weatherCode} isDay={1} size={24} />
                <span className="text-xs sm:text-sm text-slate-300 truncate hidden md:inline">
                  {weatherInfo.label}
                </span>

                {/* Rain Probability Pill */}
                {hasRain && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-lg border border-sky-500/20 shrink-0">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{precipProb}%</span>
                  </span>
                )}
              </div>

              {/* Temperature Range Bar & Values */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Min Temp */}
                <span className="text-xs sm:text-sm font-medium text-slate-400 w-9 text-right">
                  {formatTemperature(minTemp, unit)}
                </span>

                {/* Range Bar (Hidden on tiny screens, visible on sm+) */}
                <div className="hidden sm:block w-20 md:w-28 h-1.5 bg-slate-800 rounded-full relative overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>

                {/* Max Temp */}
                <span className="text-xs sm:text-sm font-bold text-white w-9 text-right">
                  {formatTemperature(maxTemp, unit)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
