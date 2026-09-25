import { useState, useCallback } from 'react';
import { reverseGeocode } from '../services/geocodingApi';

/**
 * Hook to request and process browser geolocation with safety and reverse geocoding
 */
export function useLocation() {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const getCurrentLocation = useCallback(async (onSuccess) => {
    setLocationError(null);

    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationDetails = await reverseGeocode(latitude, longitude);
          setIsLocating(false);
          if (onSuccess) {
            onSuccess(locationDetails);
          }
        } catch {
          setIsLocating(false);
          const fallback = {
            id: `geo_${position.coords.latitude.toFixed(4)}_${position.coords.longitude.toFixed(4)}`,
            name: 'Current Location',
            country: '',
            admin1: '',
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            formattedLabel: 'Current Location',
          };
          if (onSuccess) onSuccess(fallback);
        }
      },
      (error) => {
        setIsLocating(false);
        let userMessage = 'Unable to determine your location.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            userMessage = 'Location permission was denied. Please enable location permissions or search for your city.';
            break;
          case error.POSITION_UNAVAILABLE:
            userMessage = 'Location information is currently unavailable.';
            break;
          case error.TIMEOUT:
            userMessage = 'Location request timed out. Please check connection and try again.';
            break;
          default:
            userMessage = 'An unexpected error occurred while obtaining your location.';
            break;
        }

        setLocationError(userMessage);
      },
      geoOptions
    );
  }, []);

  const clearLocationError = useCallback(() => {
    setLocationError(null);
  }, []);

  return {
    getCurrentLocation,
    isLocating,
    locationError,
    clearLocationError,
  };
}
