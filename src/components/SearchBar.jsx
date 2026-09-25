import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, MapPin, Sparkles } from 'lucide-react';
import { searchLocations } from '../services/geocodingApi';
import { DEFAULT_SUGGESTED_LOCATIONS } from '../utils/storage';

export default function SearchBar({ onSelectLocation, currentLocation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Debounced search when query changes
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      setSearchError(null);
      return;
    }

    setIsLoading(true);
    setSearchError(null);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const matches = await searchLocations(trimmed);
        setResults(matches);
        setSelectedIndex(-1);
      } catch {
        setSearchError('Unable to search locations. Please check connection.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 320);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    const activeList = query.trim().length >= 2 ? results : DEFAULT_SUGGESTED_LOCATIONS;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < activeList.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : activeList.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < activeList.length) {
        handleSelect(activeList[selectedIndex]);
      } else if (results.length > 0) {
        handleSelect(results[0]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelect = (location) => {
    onSelectLocation(location);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-30">
      {/* Search Input Box */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-white/10 group-focus-within:border-sky-500/50 rounded-2xl shadow-xl transition-all">
          <div className="pl-4 pr-2 text-slate-400">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
          </div>

          <input
            ref={inputRef}
            type="text"
            id="location-search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search city, region, or country (e.g. Manila, Antipolo, Tokyo)..."
            aria-label="Search city or location"
            autoComplete="off"
            className="w-full py-3.5 pr-10 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
          />

          <div className="pr-4 flex items-center gap-1.5">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-sky-400" />}

            {query && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search query"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50 max-h-[380px] overflow-y-auto custom-scrollbar">
          {/* Active Search Results */}
          {query.trim().length >= 2 ? (
            <div>
              {searchError && (
                <div className="p-4 text-xs text-rose-400 text-center">
                  {searchError}
                </div>
              )}

              {!isLoading && results.length === 0 && !searchError && (
                <div className="p-6 text-center text-slate-400 text-sm">
                  <p className="font-medium text-slate-300">No matching locations found</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try checking the spelling or searching for a major nearby city.
                  </p>
                </div>
              )}

              {results.length > 0 && (
                <ul className="py-2" role="listbox">
                  {results.map((loc, idx) => {
                    const isSelected = selectedIndex === idx;
                    const isCurrent =
                      currentLocation?.latitude === loc.latitude &&
                      currentLocation?.longitude === loc.longitude;

                    return (
                      <li
                        key={loc.id || `${loc.latitude}_${loc.longitude}_${idx}`}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(loc)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-sky-500/20 text-white' : 'hover:bg-white/5 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                          <div>
                            <div className="font-semibold text-sm flex items-center gap-2">
                              <span>{loc.name}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded border border-sky-500/30">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400">
                              {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                            </div>
                          </div>
                        </div>
                        {loc.countryCode && (
                          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                            {loc.countryCode}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            /* Suggested quick locations when input is clean */
            <div className="p-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Suggested Cities</span>
              </div>
              <ul className="mt-1" role="listbox">
                {DEFAULT_SUGGESTED_LOCATIONS.map((loc, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <li
                      key={loc.id}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(loc)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-sky-500/20 text-white' : 'hover:bg-white/5 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                        <div>
                          <div className="font-medium text-sm">{loc.name}</div>
                          <div className="text-xs text-slate-400">
                            {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
