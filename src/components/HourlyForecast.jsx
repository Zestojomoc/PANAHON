import React, { useRef } from 'react';
import { Clock, Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemperature } from '../utils/temperature';
import { formatHour } from '../utils/dateTime';

export default function HourlyForecast({ hourly = [], unit }) {
  const scrollContainerRef = useRef(null);

  if (!hourly || hourly.length === 0) return null;

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section aria-label="Hourly Forecast" className="glass-panel rounded-3xl p-5 sm:p-6 shadow-xl">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            24-Hour Forecast
          </h3>
        </div>

        {/* Scroll Controls (Desktop) */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll hourly forecast left"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll hourly forecast right"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hourly Timeline */}
      <div
        ref={scrollContainerRef}
        tabIndex={0}
        aria-label="Scrollable hourly forecast list"
        className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 custom-scrollbar focus:outline-none focus:ring-1 focus:ring-sky-500/40 rounded-xl"
      >
        {hourly.map((item, index) => {
          const isNow = index === 0 || item.isNow;
          const timeLabel = formatHour(item.time, isNow);
          const hasRainProb = item.precipitationProbability !== undefined && item.precipitationProbability > 0;

          return (
            <div
              key={item.time || index}
              className={`shrink-0 flex flex-col items-center justify-between py-3 px-3.5 rounded-2xl min-w-[76px] sm:min-w-[84px] transition-all ${
                isNow
                  ? 'bg-sky-500/20 border border-sky-400/40 shadow-lg shadow-sky-500/10'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              {/* Time */}
              <span className={`text-xs font-semibold ${isNow ? 'text-sky-300' : 'text-slate-400'}`}>
                {timeLabel}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5">
                <WeatherIcon
                  code={item.weatherCode}
                  isDay={item.isDay}
                  size={26}
                  animate={isNow}
                />
              </div>

              {/* Temperature */}
              <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                {formatTemperature(item.temperature, unit)}
              </span>

              {/* Rain Chance */}
              <div className="h-4 mt-1 flex items-center">
                {hasRainProb ? (
                  <span className="flex items-center gap-0.5 text-[10px] font-semibold text-sky-400">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{item.precipitationProbability}%</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">•</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
