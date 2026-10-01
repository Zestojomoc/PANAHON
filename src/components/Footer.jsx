import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5 mt-16 text-center text-xs text-slate-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-400">PANAHON</span>
          <span>—</span>
          <span>Weather, at a glance.</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-400 transition-colors inline-flex items-center gap-1 underline underline-offset-4"
          >
            <span>Weather data by Open-Meteo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
