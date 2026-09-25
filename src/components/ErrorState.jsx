import React from 'react';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';

export default function ErrorState({ message, onRetry, onFocusSearch }) {
  return (
    <div
      role="alert"
      className="rounded-3xl p-8 glass-panel border border-rose-500/20 text-center max-w-lg mx-auto my-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4 text-rose-400">
        <AlertCircle className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">
        Unable to Load Weather
      </h3>

      <p className="text-sm text-slate-300 mt-2 max-w-sm mx-auto">
        {message || 'An unexpected issue occurred while fetching the weather forecast. Please check your internet connection and try again.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}

        {onFocusSearch && (
          <button
            type="button"
            onClick={onFocusSearch}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Search Another City</span>
          </button>
        )}
      </div>
    </div>
  );
}
