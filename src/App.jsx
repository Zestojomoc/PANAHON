import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherSummary from './components/WeatherSummary';
import WeatherDetails from './components/WeatherDetails';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import SavedLocations from './components/SavedLocations';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorState from './components/ErrorState';
import Footer from './components/Footer';
import WeatherBackground from './components/WeatherBackground';

import { useWeather } from './hooks/useWeather';
import { useLocation } from './hooks/useLocation';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  getLastLocation,
  setLastLocation,
  getStoredUnit,
  setStoredUnit,
} from './utils/storage';

export default function App() {
  // Current active location (saved to localStorage so user returns to where they left off)
  const [currentLocation, setCurrentLocation] = useState(() => getLastLocation());

  // Temperature unit ('C' or 'F')
  const [unit, setUnit] = useState(() => getStoredUnit());

  // Saved favorite locations
  const [savedLocations, setSavedLocations] = useLocalStorage('panahon_saved_locations', []);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Weather data hook for the active location
  const { weatherData, isLoading, error, refetch } = useWeather(currentLocation, unit);

  // Geolocation hook for "Use my location"
  const { getCurrentLocation, isLocating, locationError, clearLocationError } = useLocation();

  // Persist current location changes
  useEffect(() => {
    if (currentLocation) {
      setLastLocation(currentLocation);
    }
  }, [currentLocation]);

  // Unit toggle handler
  const handleToggleUnit = (newUnit) => {
    setUnit(newUnit);
    setStoredUnit(newUnit);
  };

  // Location selection handler
  const handleSelectLocation = (loc) => {
    setCurrentLocation(loc);
    clearLocationError();
  };

  // Browser Geolocation trigger
  const handleUseLocation = () => {
    clearLocationError();
    getCurrentLocation((detectedLocation) => {
      setCurrentLocation(detectedLocation);
    });
  };

  // Saved location toggle
  const isCurrentSaved = savedLocations.some(
    (item) =>
      item.latitude === currentLocation?.latitude &&
      item.longitude === currentLocation?.longitude
  );

  const handleToggleFavorite = () => {
    if (!currentLocation) return;
    if (isCurrentSaved) {
      setSavedLocations((prev) =>
        prev.filter(
          (item) =>
            !(
              item.latitude === currentLocation.latitude &&
              item.longitude === currentLocation.longitude
            )
        )
      );
    } else {
      const newEntry = {
        id: currentLocation.id || `loc_${currentLocation.latitude}_${currentLocation.longitude}`,
        name: currentLocation.name,
        country: currentLocation.country || '',
        admin1: currentLocation.admin1 || '',
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };
      setSavedLocations((prev) => [newEntry, ...prev]);
    }
  };

  const handleRemoveSavedLocation = (loc) => {
    setSavedLocations((prev) =>
      prev.filter(
        (item) =>
          !(item.latitude === loc.latitude && item.longitude === loc.longitude)
      )
    );
  };

  const handleFocusSearch = () => {
    const input = document.getElementById('location-search-input');
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <WeatherBackground
      weatherCode={weatherData?.current?.weatherCode}
      isDay={weatherData?.current?.isDay ?? 1}
    >
      <div className="flex flex-col min-h-screen">
        {/* App Header */}
        <Header
          unit={unit}
          onToggleUnit={handleToggleUnit}
          onUseLocation={handleUseLocation}
          isLocating={isLocating}
          savedCount={savedLocations.length}
          onOpenSavedLocations={() => setIsSavedDrawerOpen(true)}
          isSavedDrawerOpen={isSavedDrawerOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
          {/* Location Error Notification Banner */}
          <AnimatePresence>
            {locationError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-2xl mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{locationError}</span>
                </div>
                <button
                  type="button"
                  onClick={clearLocationError}
                  aria-label="Dismiss message"
                  className="p-1 rounded-lg hover:bg-amber-500/20 text-amber-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prominent Search Bar */}
          <div className="pt-2">
            <SearchBar
              onSelectLocation={handleSelectLocation}
              currentLocation={currentLocation}
            />
          </div>

          {/* Dynamic Content: Loading vs Error vs Weather Views */}
          {isLoading && !weatherData ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={refetch}
              onFocusSearch={handleFocusSearch}
            />
          ) : weatherData ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-6 sm:space-y-8"
            >
              {/* Top Focus: Hero Current Weather Card */}
              <CurrentWeather
                location={currentLocation}
                weather={weatherData}
                unit={unit}
                isFavorite={isCurrentSaved}
                onToggleFavorite={handleToggleFavorite}
                timezone={weatherData.timezone}
                onViewSummary={() => {
                  const el = document.getElementById('weather-summary-report');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />

              {/* Weather Summary Report Card */}
              <div id="weather-summary-report">
                <WeatherSummary weather={weatherData} unit={unit} />
              </div>

              {/* Weather Details & Metrics */}
              <WeatherDetails weather={weatherData} unit={unit} />

              {/* 24-Hour Forecast Timeline */}
              <HourlyForecast hourly={weatherData.hourly} unit={unit} />

              {/* 7-Day Daily Forecast */}
              <DailyForecast daily={weatherData.daily} unit={unit} />
            </motion.div>
          ) : null}
        </main>

        {/* Saved Locations Modal */}
        <SavedLocations
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          savedLocations={savedLocations}
          currentLocation={currentLocation}
          onSelectLocation={handleSelectLocation}
          onRemoveLocation={handleRemoveSavedLocation}
          onSaveCurrent={handleToggleFavorite}
          isCurrentSaved={isCurrentSaved}
        />

        {/* Footer with Open-Meteo Attribution */}
        <Footer />
      </div>
    </WeatherBackground>
  );
}
