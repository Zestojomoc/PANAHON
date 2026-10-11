import { getWeatherInfo } from './weatherCodes';

/**
 * Normalizes input props (condition, code, isDay, iconName) into a canonical weather type key
 */
export function resolveWeatherType({ condition, code, isDay = 1, iconName }) {
  const isDayBool = isDay === 1 || isDay === true;

  // 1. Direct numeric code (or numeric condition string)
  let numericCode =
    typeof code === 'number'
      ? code
      : typeof condition === 'number'
      ? condition
      : null;

  if (numericCode === null && typeof condition === 'string' && /^\d+$/.test(condition.trim())) {
    numericCode = parseInt(condition.trim(), 10);
  }

  if (numericCode !== null) {
    const info = getWeatherInfo(numericCode, isDayBool);
    return mapIconNameToType(info.icon, isDayBool);
  }

  // 2. String condition parsing (handles labels, themes, lucide names, shorthand keys)
  if (condition && typeof condition === 'string') {
    const norm = condition.toLowerCase().trim().replace(/[-_\s]+/g, '');

    // Thunderstorm states (codes 95, 96, 99)
    if (norm.includes('thunder') || norm.includes('lightning') || norm.includes('storm')) {
      return norm.includes('hail') ? 'thunderstorm-hail' : 'thunderstorm';
    }

    // Drizzle states (codes 51, 53, 55)
    if (norm.includes('drizzle')) {
      return 'drizzle';
    }

    // Rain states (codes 61, 63, 65, 80, 81, 82)
    if (norm.includes('rain') || norm.includes('shower') || norm.includes('precipitation')) {
      return 'rain';
    }

    // Snow / Freezing states (codes 56, 57, 66, 67, 71, 73, 75, 77, 85, 86)
    if (
      norm.includes('snow') ||
      norm.includes('blizzard') ||
      norm.includes('flurr') ||
      norm.includes('freez') ||
      norm.includes('sleet')
    ) {
      return 'snow';
    }

    // Fog / Mist states (codes 45, 48)
    if (norm.includes('fog') || norm.includes('mist') || norm.includes('haze')) {
      return 'fog';
    }

    // Partly cloudy states (code 2)
    if (
      norm.includes('partly') ||
      norm.includes('scattered') ||
      norm.includes('cloudsun') ||
      norm.includes('cloudmoon') ||
      norm.includes('sunbehindcloud')
    ) {
      return isDayBool ? 'partly-cloudy-day' : 'partly-cloudy-night';
    }

    // Overcast / Cloudy states (code 3)
    if (norm.includes('overcast') || norm.includes('cloud')) {
      return 'cloudy';
    }

    // Sunny / Clear sky (codes 0, 1)
    if (norm.includes('clear') || norm.includes('sun') || norm.includes('mainlyclear')) {
      return isDayBool ? 'sunny' : 'clear-night';
    }

    if (norm.includes('moon') || norm.includes('night') || norm.includes('star')) {
      return 'clear-night';
    }

    // Check direct icon name match
    const mapped = mapIconNameToType(condition, isDayBool);
    if (mapped) return mapped;
  }

  // 3. Fallback to iconName prop if specified
  if (iconName) {
    return mapIconNameToType(iconName, isDayBool);
  }

  // Default fallback
  return isDayBool ? 'sunny' : 'clear-night';
}

export function mapIconNameToType(name, isDay = true) {
  switch (name) {
    case 'Sun':
    case 'SunMedium':
      return 'sunny';
    case 'Moon':
    case 'MoonStar':
      return 'clear-night';
    case 'CloudSun':
      return 'partly-cloudy-day';
    case 'CloudMoon':
      return 'partly-cloudy-night';
    case 'Cloud':
      return 'cloudy';
    case 'CloudFog':
      return 'fog';
    case 'CloudDrizzle':
      return 'drizzle';
    case 'CloudRain':
    case 'CloudSunRain':
    case 'CloudMoonRain':
      return 'rain';
    case 'CloudLightning':
      return 'thunderstorm';
    case 'CloudSnow':
    case 'Snowflake':
      return 'snow';
    default:
      return isDay ? 'sunny' : 'clear-night';
  }
}

/**
 * Returns glow and color styling utility classes based on weather type
 */
export function getIconColorClass(weatherType, isDay = true) {
  switch (weatherType) {
    case 'sunny':
      return 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]';
    case 'clear-night':
      return 'text-indigo-200 drop-shadow-[0_0_12px_rgba(165,180,252,0.4)]';
    case 'partly-cloudy-day':
      return 'text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.4)]';
    case 'partly-cloudy-night':
      return 'text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.3)]';
    case 'cloudy':
      return 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.25)]';
    case 'fog':
      return 'text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.2)]';
    case 'drizzle':
    case 'rain':
      return 'text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]';
    case 'thunderstorm':
    case 'thunderstorm-hail':
      return 'text-yellow-300 drop-shadow-[0_0_14px_rgba(253,224,71,0.6)]';
    case 'snow':
      return 'text-cyan-200 drop-shadow-[0_0_10px_rgba(165,243,252,0.5)]';
    default:
      return isDay ? 'text-amber-400' : 'text-slate-300';
  }
}
