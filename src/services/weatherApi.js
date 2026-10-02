/**
 * Open-Meteo Forecast API Service for KLIMA
 * Implements the exact Open-Meteo contract and transforms responses
 * into the normalized internal weather model.
 */

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Exact current fields required by contract
 */
const CURRENT_FIELDS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'precipitation',
  'rain',
  'showers',
  'weather_code',
  'cloud_cover',
  'pressure_msl',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'visibility',
  'uv_index',
  'is_day',
].join(',');

/**
 * Exact hourly fields required by contract
 */
const HOURLY_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation_probability',
  'precipitation',
  'weather_code',
  'cloud_cover',
  'wind_speed_10m',
  'wind_direction_10m',
  'uv_index',
  'visibility',
].join(',');

/**
 * Exact daily fields required by contract
 */
const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_max',
  'apparent_temperature_min',
  'precipitation_sum',
  'precipitation_probability_max',
  'precipitation_hours',
  'sunrise',
  'sunset',
  'sunshine_duration',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
  'wind_direction_10m_dominant',
  'uv_index_max',
].join(',');

/**
 * Fetch weather forecast adhering strictly to the contract
 * @param {Object} location - Location object with latitude, longitude, name, etc.
 * @param {'C' | 'F'} unit - Temperature unit ('C' or 'F')
 * @returns {Promise<Object>} Normalized internal weather model
 */
export async function getWeatherData(location, unit = 'C') {
  if (!location || location.latitude === undefined || location.longitude === undefined) {
    throw new Error('Valid location with latitude and longitude is required.');
  }

  const temperatureUnitParam = unit === 'F' ? 'fahrenheit' : 'celsius';

  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: CURRENT_FIELDS,
    hourly: HOURLY_FIELDS,
    daily: DAILY_FIELDS,
    timezone: 'auto',
    temperature_unit: temperatureUnitParam,
    wind_speed_unit: 'kmh',
    precipitation_unit: 'mm',
    forecast_days: '7',
  });

  const url = `${BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather service responded with status ${response.status}`);
    }
    const rawData = await response.json();
    return transformWeatherResponse(rawData, location);
  } catch (error) {
    console.error('[KLIMA Weather API] Request failed:', error);
    throw error;
  }
}

/**
 * Convert wind degree into 16-point cardinal direction
 * @param {number} deg 
 * @returns {string}
 */
export function getWindDirection(deg) {
  if (deg === null || deg === undefined) return '--';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

/**
 * Internal transformation function creating the normalized KLIMA weather model.
 * Presentation components consume this normalized model and never touch raw API keys.
 * 
 * @param {Object} raw - Raw payload from Open-Meteo
 * @param {Object} location - Location metadata
 * @returns {Object} Normalized internal weather model
 */
export function transformWeatherResponse(raw, location) {
  const { current = {}, hourly = {}, daily = {}, timezone } = raw;

  // Hourly normalization (filter next 24 hours from the current location time)
  const currentLocalTime = current.time;
  let startIndex = 0;
  if (hourly.time && currentLocalTime) {
    const foundIndex = hourly.time.findIndex(t => t >= currentLocalTime);
    if (foundIndex !== -1) {
      startIndex = foundIndex;
    }
  }

  const hourlyNormalized = [];
  if (hourly.time) {
    const limit = Math.min(startIndex + 24, hourly.time.length);
    for (let i = startIndex; i < limit; i++) {
      hourlyNormalized.push({
        time: hourly.time[i],
        temperature: hourly.temperature_2m?.[i],
        feelsLike: hourly.apparent_temperature?.[i],
        humidity: hourly.relative_humidity_2m?.[i],
        precipitationProbability: hourly.precipitation_probability?.[i] ?? 0,
        precipitation: hourly.precipitation?.[i] ?? 0,
        weatherCode: hourly.weather_code?.[i] ?? 0,
        cloudCover: hourly.cloud_cover?.[i] ?? 0,
        windSpeed: hourly.wind_speed_10m?.[i] ?? 0,
        windDirection: hourly.wind_direction_10m?.[i] ?? 0,
        uvIndex: hourly.uv_index?.[i] ?? 0,
        visibility: hourly.visibility?.[i] ?? 10000,
        isNow: i === startIndex,
      });
    }
  }

  // Daily normalization (7 forecast days)
  const dailyNormalized = [];
  if (daily.time) {
    const count = Math.min(7, daily.time.length);
    for (let i = 0; i < count; i++) {
      dailyNormalized.push({
        date: daily.time[i],
        weatherCode: daily.weather_code?.[i] ?? 0,
        temperatureMax: daily.temperature_2m_max?.[i],
        temperatureMin: daily.temperature_2m_min?.[i],
        apparentTemperatureMax: daily.apparent_temperature_max?.[i],
        apparentTemperatureMin: daily.apparent_temperature_min?.[i],
        precipitationSum: daily.precipitation_sum?.[i] ?? 0,
        precipitationProbabilityMax: daily.precipitation_probability_max?.[i] ?? 0,
        precipitationHours: daily.precipitation_hours?.[i] ?? 0,
        sunrise: daily.sunrise?.[i],
        sunset: daily.sunset?.[i],
        sunshineDuration: daily.sunshine_duration?.[i] ?? 0,
        windSpeedMax: daily.wind_speed_10m_max?.[i] ?? 0,
        windGustsMax: daily.wind_gusts_10m_max?.[i] ?? 0,
        windDirectionDominant: daily.wind_direction_10m_dominant?.[i] ?? 0,
        uvIndexMax: daily.uv_index_max?.[i] ?? 0,
      });
    }
  }

  // Current weather normalization
  const currentNormalized = {
    time: current.time,
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    precipitation: current.precipitation ?? 0,
    rain: current.rain ?? 0,
    showers: current.showers ?? 0,
    weatherCode: current.weather_code ?? 0,
    cloudCover: current.cloud_cover ?? 0,
    pressure: current.pressure_msl ?? 1013,
    windSpeed: current.wind_speed_10m ?? 0,
    windDirection: current.wind_direction_10m ?? 0,
    windDirectionCardinal: getWindDirection(current.wind_direction_10m),
    windGusts: current.wind_gusts_10m ?? 0,
    visibility: current.visibility ?? 10000,
    uvIndex: current.uv_index ?? (dailyNormalized[0]?.uvIndexMax ?? 0),
    isDay: current.is_day ?? 1,
    todayMax: daily.temperature_2m_max?.[0],
    todayMin: daily.temperature_2m_min?.[0],
    todaySunrise: daily.sunrise?.[0],
    todaySunset: daily.sunset?.[0],
  };

  // Normalized KLIMA weather internal model
  return {
    location: {
      name: location.name || 'Current Location',
      country: location.country || '',
      region: location.admin1 || location.region || '',
      latitude: raw.latitude ?? location.latitude,
      longitude: raw.longitude ?? location.longitude,
      timezone: timezone || location.timezone || 'auto',
    },
    current: currentNormalized,
    hourly: hourlyNormalized,
    daily: dailyNormalized,
  };
}
