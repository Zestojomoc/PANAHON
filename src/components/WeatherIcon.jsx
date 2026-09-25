import React from 'react';
import {
  Sun,
  Moon,
  SunMedium,
  MoonStar,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
} from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherCodes';

const ICON_MAP = {
  Sun,
  Moon,
  SunMedium,
  MoonStar,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
};

/**
 * Returns weather icon color styles based on condition
 */
function getIconColorClass(iconName, isDay) {
  switch (iconName) {
    case 'Sun':
    case 'SunMedium':
      return 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]';
    case 'Moon':
    case 'MoonStar':
      return 'text-indigo-200 drop-shadow-[0_0_12px_rgba(165,180,252,0.4)]';
    case 'CloudSun':
      return 'text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.4)]';
    case 'CloudMoon':
      return 'text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.3)]';
    case 'Cloud':
    case 'CloudFog':
      return 'text-slate-300';
    case 'CloudDrizzle':
    case 'CloudRain':
      return 'text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.4)]';
    case 'CloudLightning':
      return 'text-yellow-300 drop-shadow-[0_0_14px_rgba(253,224,71,0.6)]';
    case 'CloudSnow':
    case 'Snowflake':
      return 'text-cyan-200 drop-shadow-[0_0_10px_rgba(165,243,252,0.5)]';
    default:
      return isDay ? 'text-amber-400' : 'text-slate-300';
  }
}

export default function WeatherIcon({
  code,
  isDay = 1,
  iconName,
  size = 28,
  className = '',
  animate = false,
}) {
  let targetIconName = iconName;
  if (!targetIconName && code !== undefined && code !== null) {
    const info = getWeatherInfo(code, isDay);
    targetIconName = info.icon;
  }

  const Component = ICON_MAP[targetIconName] || (isDay ? Sun : Moon);
  const colorClass = getIconColorClass(targetIconName, isDay);

  return (
    <div
      className={`inline-flex items-center justify-center transition-transform duration-300 ${
        animate ? 'hover:scale-110' : ''
      } ${className}`}
    >
      <Component size={size} className={colorClass} strokeWidth={1.8} />
    </div>
  );
}
