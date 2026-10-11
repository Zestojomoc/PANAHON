import { useState, useEffect, useCallback, useRef } from 'react';
import { getWeatherData } from '../services/weatherApi';
import { getCachedWeather, setCachedWeather } from '../utils/storage';

/**
 * High-Performance Weather Hook with Stale-While-Revalidate (SWR) caching.
 * Provides 0ms instant startup by hydrating immediately from local storage cache,
 * then silently revalidating meteorological data in the background.
 *
 * @param {Object} location - { latitude, longitude, name, ... }
 * @param {'C' | 'F'} unit - Temperature unit ('C' or 'F')
 */
export function useWeather(location, unit = 'C') {
  // 1. Instant Cache Hydration: Render immediately on frame 1
  const [weatherData, setWeatherData] = useState(() => {
    const cached = getCachedWeather(location, unit);
    return cached?.data ?? null;
  });

  // Only true on a clean cold-start with NO cached data
  const [isLoading, setIsLoading] = useState(() => {
    const cached = getCachedWeather(location, unit);
    return !cached?.data;
  });

  // Subtle background refreshing indicator
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => {
    const cached = getCachedWeather(location, unit);
    return cached?.timestamp ? new Date(cached.timestamp) : null;
  });

  // Keep track of active request to prevent race conditions
  const activeRequestId = useRef(0);

  // Track location or unit changes and immediately hydrate from cache
  const locationKey = location
    ? `${Number(location.latitude).toFixed(3)}_${Number(location.longitude).toFixed(3)}_${unit}`
    : '';
  const [prevLocationKey, setPrevLocationKey] = useState(locationKey);
  if (locationKey !== prevLocationKey) {
    setPrevLocationKey(locationKey);
    const cached = getCachedWeather(location, unit);
    if (cached?.data) {
      setWeatherData(cached.data);
      setLastUpdated(new Date(cached.timestamp));
      setIsLoading(false);
    } else {
      setWeatherData(null);
      setIsLoading(true);
    }
  }

  const fetchWeather = useCallback(
    async (isManual = false) => {
      if (!location || location.latitude === undefined || location.longitude === undefined) {
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      const currentReq = ++activeRequestId.current;

      // Check if current cache is already fresh (< 5 mins old) and this is not a manual retry
      const cached = getCachedWeather(location, unit);
      if (!isManual && cached?.isFresh && weatherData) {
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      // If we already have data, don't flash a full skeleton; set background refreshing
      if (weatherData || cached?.data) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const data = await getWeatherData(location, unit);

        // Only commit if this was the latest request
        if (currentReq === activeRequestId.current) {
          setWeatherData(data);
          setCachedWeather(location, unit, data);
          setLastUpdated(new Date());
          setError(null);
        }
      } catch (err) {
        if (currentReq === activeRequestId.current) {
          console.error('[KLIMA useWeather] Fetch error:', err);
          // Only show fatal error if we don't have any cached data to display
          if (!weatherData && !cached?.data) {
            setError(
              navigator.onLine === false
                ? 'You appear to be offline. Please check your internet connection.'
                : 'Unable to retrieve current weather data. Please try again shortly.'
            );
          }
        }
      } finally {
        if (currentReq === activeRequestId.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [location, unit, weatherData]
  );

  useEffect(() => {
    fetchWeather();
  }, [location?.latitude, location?.longitude, unit]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    weatherData,
    isLoading,
    isRefreshing,
    error,
    refetch: () => fetchWeather(true),
    lastUpdated,
  };
}
