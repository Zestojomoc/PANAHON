/**
 * Temperature and formatting utilities for KLIMA.
 * Temperatures are provided directly by Open-Meteo in the requested unit
 * ('celsius' or 'fahrenheit') without manual mathematical conversion.
 */

/**
 * Formats a temperature value directly returned from the API
 * @param {number} temp - Temperature value in the active API unit
 * @param {'C' | 'F'} unit - Unit label ('C' or 'F')
 * @param {boolean} includeUnit - Whether to append 'C' or 'F' after the degree symbol
 * @returns {string}
 */
export function formatTemperature(temp, unit = 'C', includeUnit = false) {
  if (temp === null || temp === undefined || isNaN(temp)) {
    return '--';
  }
  const rounded = Math.round(temp);
  return includeUnit ? `${rounded}°${unit}` : `${rounded}°`;
}

/**
 * Formats wind speed in km/h as requested by the API contract
 * @param {number} speedKmh 
 * @returns {string}
 */
export function formatWindSpeed(speedKmh) {
  if (speedKmh === null || speedKmh === undefined || isNaN(speedKmh)) {
    return '--';
  }
  return `${Math.round(speedKmh)} km/h`;
}
