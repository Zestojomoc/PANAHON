/**
 * Safe localStorage wrapper and persistence utility for KLIMA
 * Gracefully degrades if localStorage is disabled, full, or blocked.
 */

export const STORAGE_KEYS = {
  UNIT: 'klima_temp_unit',
  SAVED_LOCATIONS: 'klima_saved_locations',
  LAST_LOCATION: 'klima_last_location',
};

const LEGACY_STORAGE_KEYS = {
  [STORAGE_KEYS.UNIT]: 'panahon_temp_unit',
  [STORAGE_KEYS.SAVED_LOCATIONS]: 'panahon_saved_locations',
  [STORAGE_KEYS.LAST_LOCATION]: 'panahon_last_location',
};

// Default featured locations to suggest if user has no saved locations
export const DEFAULT_SUGGESTED_LOCATIONS = [
  { id: 'manila_ph', name: 'Manila', country: 'Philippines', admin1: 'Metro Manila', latitude: 14.6042, longitude: 120.9822 },
  { id: 'antipolo_ph', name: 'Antipolo', country: 'Philippines', admin1: 'Rizal', latitude: 14.5842, longitude: 121.1764 },
  { id: 'cebu_ph', name: 'Cebu City', country: 'Philippines', admin1: 'Central Visayas', latitude: 10.3167, longitude: 123.8907 },
  { id: 'baguio_ph', name: 'Baguio', country: 'Philippines', admin1: 'Cordillera', latitude: 16.4164, longitude: 120.5931 },
  { id: 'tokyo_jp', name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6895, longitude: 139.6917 },
  { id: 'london_uk', name: 'London', country: 'United Kingdom', admin1: 'England', latitude: 51.5085, longitude: -0.1257 },
];

export const DEFAULT_LOCATION = DEFAULT_SUGGESTED_LOCATIONS[0]; // Manila

export function safeGet(key, fallback = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    let item = window.localStorage.getItem(key);
    // Backward-compatibility: fallback to previous panahon key if not yet saved under klima
    if (item === null && LEGACY_STORAGE_KEYS[key]) {
      item = window.localStorage.getItem(LEGACY_STORAGE_KEYS[key]);
    }
    if (item === null) return fallback;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`[KLIMA Storage] Failed reading key "${key}":`, error);
    return fallback;
  }
}

export function safeSet(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[KLIMA Storage] Failed writing key "${key}":`, error);
    return false;
  }
}

export function getStoredUnit() {
  const unit = safeGet(STORAGE_KEYS.UNIT, 'C');
  return unit === 'F' ? 'F' : 'C';
}

export function setStoredUnit(unit) {
  return safeSet(STORAGE_KEYS.UNIT, unit === 'F' ? 'F' : 'C');
}

export function getSavedLocations() {
  const locations = safeGet(STORAGE_KEYS.SAVED_LOCATIONS, []);
  return Array.isArray(locations) ? locations : [];
}

export function setSavedLocations(locations) {
  return safeSet(STORAGE_KEYS.SAVED_LOCATIONS, locations);
}

export function getLastLocation() {
  const location = safeGet(STORAGE_KEYS.LAST_LOCATION, null);
  if (location && typeof location.latitude === 'number' && typeof location.longitude === 'number') {
    return location;
  }
  return DEFAULT_LOCATION;
}

export function setLastLocation(location) {
  return safeSet(STORAGE_KEYS.LAST_LOCATION, location);
}
