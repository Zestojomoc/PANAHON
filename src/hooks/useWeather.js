import { useState, useEffect, useCallback, useRef } from 'react';
import { getWeatherData } from '../services/weatherApi';

/**
 * Hook to manage weather data fetching adhering to Open-Meteo contract
 * @param {Object} location - { latitude, longitude, name, ... }
 * @param {'C' | 'F'} unit - Temperature unit ('C' or 'F')
 */
export function useWeather(location, unit = 'C') {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Keep track of active request to avoid race conditions
  const activeRequestId = useRef(0);

  const fetchWeather = useCallback(async () => {
    if (!location || location.latitude === undefined || location.longitude === undefined) {
      setIsLoading(false);
      return;
    }

    const currentReq = ++activeRequestId.current;
    setIsLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(location, unit);
      
      // Only commit if this was the latest request
      if (currentReq === activeRequestId.current) {
        setWeatherData(data);
        setLastUpdated(new Date());
        setError(null);
      }
    } catch (err) {
      if (currentReq === activeRequestId.current) {
        console.error('[PANAHON useWeather] Fetch error:', err);
        setError(
          navigator.onLine === false
            ? 'You appear to be offline. Please check your internet connection.'
            : 'Unable to retrieve current weather data. Please try again shortly.'
        );
      }
    } finally {
      if (currentReq === activeRequestId.current) {
        setIsLoading(false);
      }
    }
  }, [location?.latitude, location?.longitude, location?.name, unit]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    weatherData,
    isLoading,
    error,
    refetch: fetchWeather,
    lastUpdated,
  };
}
