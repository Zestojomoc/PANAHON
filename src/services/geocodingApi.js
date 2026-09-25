/**
 * Geocoding service for PANAHON
 * Primary: Open-Meteo Geocoding Search API
 * Reverse: BigDataCloud Client Reverse Geocode (free, public, no key)
 */

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

/**
 * Searches locations using Open-Meteo Geocoding API
 * @param {string} query 
 * @param {number} count 
 * @returns {Promise<Array>}
 */
export async function searchLocations(query, count = 8) {
  const trimmed = query?.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map(item => ({
      id: `${item.id || item.latitude + '_' + item.longitude}`,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      admin2: item.admin2 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone,
      formattedLabel: [item.name, item.admin1, item.country].filter(Boolean).join(', '),
    }));
  } catch (error) {
    console.error('[PANAHON Geocoding] Search failed:', error);
    throw error;
  }
}

/**
 * Reverse geocodes latitude/longitude into human-readable city/region name
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>}
 */
export async function reverseGeocode(latitude, longitude) {
  const fallback = {
    id: `custom_${latitude.toFixed(2)}_${longitude.toFixed(2)}`,
    name: 'Current Location',
    country: '',
    admin1: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
    latitude,
    longitude,
    formattedLabel: `Current Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
  };

  try {
    const url = `${REVERSE_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!response.ok) return fallback;

    const data = await response.json();
    const city = data.city || data.locality || data.principalSubdivision || 'Current Location';
    const country = data.countryName || '';
    const admin1 = data.principalSubdivision && data.principalSubdivision !== city ? data.principalSubdivision : '';

    return {
      id: `geo_${latitude.toFixed(4)}_${longitude.toFixed(4)}`,
      name: city,
      country,
      admin1,
      latitude,
      longitude,
      formattedLabel: [city, admin1, country].filter(Boolean).join(', '),
    };
  } catch {
    // Return graceful fallback without crashing
    return fallback;
  }
}
