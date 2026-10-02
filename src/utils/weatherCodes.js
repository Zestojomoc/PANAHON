/**
 * Open-Meteo WMO Weather Code Interpreter for KLIMA
 * Provides centralized weather mappings, descriptions, iconography, and visual themes.
 */

export const WEATHER_THEMES = {
  CLEAR_DAY: 'clear-day',
  CLEAR_NIGHT: 'clear-night',
  PARTLY_CLOUDY_DAY: 'partly-cloudy-day',
  PARTLY_CLOUDY_NIGHT: 'partly-cloudy-night',
  CLOUDY: 'cloudy',
  RAIN: 'rain',
  HEAVY_RAIN: 'heavy-rain',
  THUNDERSTORM: 'thunderstorm',
  SNOW: 'snow',
  FOG: 'fog',
};

const WEATHER_CODE_MAP = {
  0: {
    day: { label: 'Clear Sky', icon: 'Sun', emoji: '☀️', theme: WEATHER_THEMES.CLEAR_DAY, description: 'Sunny and clear conditions' },
    night: { label: 'Clear Sky', icon: 'Moon', emoji: '🌙', theme: WEATHER_THEMES.CLEAR_NIGHT, description: 'Clear starlit skies' },
  },
  1: {
    day: { label: 'Mainly Clear', icon: 'SunMedium', emoji: '🌤️', theme: WEATHER_THEMES.CLEAR_DAY, description: 'Mostly sunny with faint clouds' },
    night: { label: 'Mainly Clear', icon: 'MoonStar', emoji: '🌙', theme: WEATHER_THEMES.CLEAR_NIGHT, description: 'Mostly clear starry skies' },
  },
  2: {
    day: { label: 'Partly Cloudy', icon: 'CloudSun', emoji: '⛅', theme: WEATHER_THEMES.PARTLY_CLOUDY_DAY, description: 'Scattered clouds and pleasant breaks' },
    night: { label: 'Partly Cloudy', icon: 'CloudMoon', emoji: '☁️', theme: WEATHER_THEMES.PARTLY_CLOUDY_NIGHT, description: 'Passing clouds in the night sky' },
  },
  3: {
    day: { label: 'Overcast', icon: 'Cloud', emoji: '☁️', theme: WEATHER_THEMES.CLOUDY, description: 'Heavy overcast cloud blanket' },
    night: { label: 'Overcast', icon: 'Cloud', emoji: '☁️', theme: WEATHER_THEMES.CLOUDY, description: 'Dense cloud coverage' },
  },
  45: {
    day: { label: 'Foggy', icon: 'CloudFog', emoji: '🌫️', theme: WEATHER_THEMES.FOG, description: 'Dense fog reducing road visibility' },
    night: { label: 'Foggy', icon: 'CloudFog', emoji: '🌫️', theme: WEATHER_THEMES.FOG, description: 'Misty fog throughout the area' },
  },
  48: {
    day: { label: 'Rime Fog', icon: 'CloudFog', emoji: '🌫️', theme: WEATHER_THEMES.FOG, description: 'Depositing rime fog and chill' },
    night: { label: 'Rime Fog', icon: 'CloudFog', emoji: '🌫️', theme: WEATHER_THEMES.FOG, description: 'Freezing rime fog' },
  },
  51: {
    day: { label: 'Light Drizzle', icon: 'CloudDrizzle', emoji: '🌦️', theme: WEATHER_THEMES.RAIN, description: 'Gentle mist and light drizzle' },
    night: { label: 'Light Drizzle', icon: 'CloudDrizzle', emoji: '🌧️', theme: WEATHER_THEMES.RAIN, description: 'Sporadic night mist' },
  },
  53: {
    day: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', emoji: '🌦️', theme: WEATHER_THEMES.RAIN, description: 'Steady damp drizzle' },
    night: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', emoji: '🌧️', theme: WEATHER_THEMES.RAIN, description: 'Consistent light precipitation' },
  },
  55: {
    day: { label: 'Dense Drizzle', icon: 'CloudDrizzle', emoji: '🌧️', theme: WEATHER_THEMES.RAIN, description: 'Heavy drizzle, wet surfaces' },
    night: { label: 'Dense Drizzle', icon: 'CloudDrizzle', emoji: '🌧️', theme: WEATHER_THEMES.RAIN, description: 'Heavy drizzle throughout the night' },
  },
  56: {
    day: { label: 'Freezing Drizzle', icon: 'CloudSnow', emoji: '🌧️', theme: WEATHER_THEMES.SNOW, description: 'Cold freezing drizzle' },
    night: { label: 'Freezing Drizzle', icon: 'CloudSnow', emoji: '🌧️', theme: WEATHER_THEMES.SNOW, description: 'Freezing drizzle on cold surfaces' },
  },
  57: {
    day: { label: 'Dense Freezing Drizzle', icon: 'CloudSnow', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Heavy freezing drizzle' },
    night: { label: 'Dense Freezing Drizzle', icon: 'CloudSnow', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Heavy freezing drizzle' },
  },
  61: {
    day: { label: 'Slight Rain', icon: 'CloudRain', emoji: '🌧️', theme: WEATHER_THEMES.RAIN, description: 'Light passing rain showers' },
    night: { label: 'Slight Rain', icon: 'CloudRain', emoji: '🌧️', theme: WEATHER_THEMES.RAIN, description: 'Light gentle nighttime rain' },
  },
  63: {
    day: { label: 'Moderate Rain', icon: 'CloudRain', emoji: '🌧️', theme: WEATHER_THEMES.RAIN, description: 'Steady rain showers' },
    night: { label: 'Moderate Rain', icon: 'CloudRain', emoji: '🌧️', theme: WEATHER_THEMES.RAIN, description: 'Steady rainfall' },
  },
  65: {
    day: { label: 'Heavy Rain', icon: 'CloudRain', emoji: '⛈️', theme: WEATHER_THEMES.HEAVY_RAIN, description: 'Intense rain, take an umbrella' },
    night: { label: 'Heavy Rain', icon: 'CloudRain', emoji: '⛈️', theme: WEATHER_THEMES.HEAVY_RAIN, description: 'Pouring nighttime rainfall' },
  },
  66: {
    day: { label: 'Freezing Rain', icon: 'CloudSnow', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Freezing icy rain' },
    night: { label: 'Freezing Rain', icon: 'CloudSnow', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Icy freezing rain' },
  },
  67: {
    day: { label: 'Heavy Freezing Rain', icon: 'CloudSnow', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Hazardous freezing rain' },
    night: { label: 'Heavy Freezing Rain', icon: 'CloudSnow', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Hazardous freezing rain' },
  },
  71: {
    day: { label: 'Slight Snowfall', icon: 'Snowflake', emoji: '🌨️', theme: WEATHER_THEMES.SNOW, description: 'Light fluttering snow' },
    night: { label: 'Slight Snowfall', icon: 'Snowflake', emoji: '🌨️', theme: WEATHER_THEMES.SNOW, description: 'Delicate night snowflakes' },
  },
  73: {
    day: { label: 'Moderate Snowfall', icon: 'Snowflake', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Steady accumulating snowfall' },
    night: { label: 'Moderate Snowfall', icon: 'Snowflake', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Steady blanket of snow' },
  },
  75: {
    day: { label: 'Heavy Snowfall', icon: 'Snowflake', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Heavy winter blizzard conditions' },
    night: { label: 'Heavy Snowfall', icon: 'Snowflake', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Heavy blizzard conditions' },
  },
  77: {
    day: { label: 'Snow Grains', icon: 'Snowflake', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Granular icy snow pellets' },
    night: { label: 'Snow Grains', icon: 'Snowflake', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Granular icy pellets' },
  },
  80: {
    day: { label: 'Light Showers', icon: 'CloudSunRain', emoji: '🌦️', theme: WEATHER_THEMES.RAIN, description: 'Scattered sunny showers' },
    night: { label: 'Light Showers', icon: 'CloudMoonRain', emoji: '🌧️', theme: WEATHER_THEMES.RAIN, description: 'Intermittent night showers' },
  },
  81: {
    day: { label: 'Moderate Showers', icon: 'CloudRain', emoji: '🌧️', theme: WEATHER_THEMES.RAIN, description: 'Brisk rain showers' },
    night: { label: 'Moderate Showers', icon: 'CloudRain', emoji: '🌧️', theme: WEATHER_THEMES.RAIN, description: 'Passing rain showers' },
  },
  82: {
    day: { label: 'Violent Showers', icon: 'CloudRain', emoji: '⛈️', theme: WEATHER_THEMES.HEAVY_RAIN, description: 'Sudden heavy downpours' },
    night: { label: 'Violent Showers', icon: 'CloudRain', emoji: '⛈️', theme: WEATHER_THEMES.HEAVY_RAIN, description: 'Torrential downpours' },
  },
  85: {
    day: { label: 'Slight Snow Showers', icon: 'CloudSnow', emoji: '🌨️', theme: WEATHER_THEMES.SNOW, description: 'Passing light snow squalls' },
    night: { label: 'Slight Snow Showers', icon: 'CloudSnow', emoji: '🌨️', theme: WEATHER_THEMES.SNOW, description: 'Brief night snow flurries' },
  },
  86: {
    day: { label: 'Heavy Snow Showers', icon: 'CloudSnow', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Intense snow bursts' },
    night: { label: 'Heavy Snow Showers', icon: 'CloudSnow', emoji: '❄️', theme: WEATHER_THEMES.SNOW, description: 'Heavy snow gusts' },
  },
  95: {
    day: { label: 'Thunderstorm', icon: 'CloudLightning', emoji: '⛈️', theme: WEATHER_THEMES.THUNDERSTORM, description: 'Thunderstorm with lightning' },
    night: { label: 'Thunderstorm', icon: 'CloudLightning', emoji: '⛈️', theme: WEATHER_THEMES.THUNDERSTORM, description: 'Atmospheric night thunderstorm' },
  },
  96: {
    day: { label: 'Thunderstorm with Hail', icon: 'CloudLightning', emoji: '⛈️', theme: WEATHER_THEMES.THUNDERSTORM, description: 'Storm with hail and gusts' },
    night: { label: 'Thunderstorm with Hail', icon: 'CloudLightning', emoji: '⛈️', theme: WEATHER_THEMES.THUNDERSTORM, description: 'Severe thunderstorm with hail' },
  },
  99: {
    day: { label: 'Heavy Hailstorm', icon: 'CloudLightning', emoji: '⛈️', theme: WEATHER_THEMES.THUNDERSTORM, description: 'Severe storm with heavy hail' },
    night: { label: 'Heavy Hailstorm', icon: 'CloudLightning', emoji: '⛈️', theme: WEATHER_THEMES.THUNDERSTORM, description: 'Severe hailstorm alert' },
  },
};

/**
 * Returns condition details for a given WMO weather code
 * @param {number} code - WMO weather code (0-99)
 * @param {boolean | number} isDay - 1 / true for day, 0 / false for night
 */
export function getWeatherInfo(code, isDay = 1) {
  const isDayBool = isDay === 1 || isDay === true;
  const timeKey = isDayBool ? 'day' : 'night';
  
  const entry = WEATHER_CODE_MAP[code];
  if (entry && entry[timeKey]) {
    return {
      ...entry[timeKey],
      code,
      isDay: isDayBool,
    };
  }

  // Fallback for unknown codes
  return {
    label: 'Variable Conditions',
    icon: isDayBool ? 'Sun' : 'Moon',
    emoji: isDayBool ? '☀️' : '🌙',
    theme: isDayBool ? WEATHER_THEMES.CLEAR_DAY : WEATHER_THEMES.CLEAR_NIGHT,
    description: 'Scattered atmospheric conditions',
    code,
    isDay: isDayBool,
  };
}
