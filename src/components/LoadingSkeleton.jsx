import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading weather forecast">
      {/* Current Weather Skeleton */}
      <div className="rounded-3xl p-6 sm:p-8 md:p-10 glass-panel border border-white/5 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-white/10 rounded-xl" />
            <div className="h-4 w-32 bg-white/5 rounded-lg" />
          </div>
          <div className="h-10 w-10 bg-white/10 rounded-2xl" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <div className="space-y-3">
            <div className="h-20 sm:h-24 w-40 bg-white/10 rounded-2xl" />
            <div className="h-4 w-28 bg-white/5 rounded-lg" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-white/10 rounded-lg" />
              <div className="h-4 w-24 bg-white/5 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Grid Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-36 bg-white/10 rounded-lg ml-1" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 h-24 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="h-3 w-16 bg-white/10 rounded" />
                <div className="h-4 w-4 bg-white/10 rounded-full" />
              </div>
              <div className="space-y-1">
                <div className="h-6 w-20 bg-white/10 rounded" />
                <div className="h-3 w-12 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Timeline Skeleton */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="h-4 w-32 bg-white/10 rounded-lg" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="min-w-[80px] h-28 bg-white/5 rounded-2xl flex flex-col items-center justify-between py-3" />
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-3">
        <div className="h-4 w-32 bg-white/10 rounded-lg" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-white/5 rounded-2xl w-full" />
        ))}
      </div>
    </div>
  );
}
