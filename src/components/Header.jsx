import React from 'react';
import { LocateFixed, Loader2, Star, Sparkles } from 'lucide-react';

export default function Header({
  unit,
  onToggleUnit,
  onUseLocation,
  isLocating,
  savedCount = 0,
  onOpenSavedLocations,
  isSavedDrawerOpen,
}) {
  return (
    <header className="w-full pt-6 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5">
      {/* Brand & Subtitle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-amber-400 p-[1.5px] shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                KLIMA
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                PH
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Weather, at a glance.
            </p>
          </div>
        </div>

        {/* Mobile controls row for quick unit toggle & saved */}
        <div className="flex md:hidden items-center gap-2">
          {/* Unit Toggle Mobile */}
          <div
            className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl"
            role="group"
            aria-label="Temperature unit selection"
          >
            <button
              type="button"
              onClick={() => onToggleUnit('C')}
              aria-pressed={unit === 'C'}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === 'C'
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={() => onToggleUnit('F')}
              aria-pressed={unit === 'F'}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                unit === 'F'
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          {/* Saved Drawer Button Mobile */}
          <button
            type="button"
            onClick={onOpenSavedLocations}
            aria-label={`View saved locations (${savedCount} saved)`}
            className={`p-2 rounded-xl border transition-all ${
              isSavedDrawerOpen
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Star className={`w-4 h-4 ${savedCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Actions (Desktop & Tablet) */}
      <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
        {/* Use My Location Button */}
        <button
          type="button"
          onClick={onUseLocation}
          disabled={isLocating}
          className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 transition-all text-slate-200 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed group"
          title="Detect and use current device location"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
          )}
          <span>{isLocating ? 'Detecting...' : 'Use my location'}</span>
        </button>

        {/* Saved locations button desktop */}
        <button
          type="button"
          onClick={onOpenSavedLocations}
          className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
            isSavedDrawerOpen
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/20'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
          aria-label={`Saved locations (${savedCount} saved)`}
        >
          <Star className={`w-3.5 h-3.5 ${savedCount > 0 ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
          <span>Saved</span>
          {savedCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {savedCount}
            </span>
          )}
        </button>

        {/* Unit Toggle Desktop */}
        <div
          className="hidden md:flex items-center bg-white/5 border border-white/10 p-1 rounded-xl"
          role="group"
          aria-label="Temperature unit selection"
        >
          <button
            type="button"
            onClick={() => onToggleUnit('C')}
            aria-pressed={unit === 'C'}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              unit === 'C'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            type="button"
            onClick={() => onToggleUnit('F')}
            aria-pressed={unit === 'F'}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              unit === 'F'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
}
