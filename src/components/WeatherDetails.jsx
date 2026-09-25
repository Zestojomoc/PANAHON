import React from 'react';
import {
  Droplets,
  Wind,
  SunMedium,
  Eye,
  Gauge,
  CloudRain,
  Cloud,
  Sunrise,
  Sunset,
  Navigation,
} from 'lucide-react';
import { formatWindSpeed } from '../utils/temperature';

/**
 * Returns UV index risk category and color badge
 */
function getUVIndexInfo(uv) {
  if (uv === undefined || uv === null) return { level: 'Normal', color: 'text-slate-400' };
  if (uv < 3) return { level: 'Low', color: 'text-emerald-400', badge: 'bg-emerald-500/10 border-emerald-500/20' };
  if (uv < 6) return { level: 'Moderate', color: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/20' };
  if (uv < 8) return { level: 'High', color: 'text-orange-400', badge: 'bg-orange-500/10 border-orange-500/20' };
  if (uv < 11) return { level: 'Very High', color: 'text-rose-400', badge: 'bg-rose-500/10 border-rose-500/20' };
  return { level: 'Extreme', color: 'text-purple-400', badge: 'bg-purple-500/10 border-purple-500/20' };
}

/**
 * Format visibility in kilometers
 */
function formatVisibility(meters) {
  if (meters === undefined || meters === null) return '--';
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

/**
 * Format ISO time into HH:MM
 */
function formatSunTime(isoTime) {
  if (!isoTime) return '--:--';
  try {
    const d = new Date(isoTime);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return isoTime.slice(11, 16);
  }
}

export default function WeatherDetails({ weather }) {
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const uvInfo = getUVIndexInfo(current.uvIndex);

  const detailItems = [
    {
      id: 'humidity',
      label: 'Humidity',
      icon: Droplets,
      iconColor: 'text-sky-400',
      value: `${current.humidity}%`,
      subtext: current.humidity > 70 ? 'High humidity' : current.humidity < 35 ? 'Dry air' : 'Comfortable',
    },
    {
      id: 'wind',
      label: 'Wind',
      icon: Wind,
      iconColor: 'text-teal-400',
      value: formatWindSpeed(current.windSpeed),
      subtext: (
        <span className="flex items-center gap-1">
          <Navigation
            className="w-3 h-3 text-teal-400 inline"
            style={{ transform: `rotate(${current.windDirection || 0}deg)` }}
          />
          <span>{current.windDirectionCardinal} ({current.windDirection}°)</span>
          {current.windGusts > 0 && (
            <span className="text-slate-500">• Gusts {Math.round(current.windGusts)} km/h</span>
          )}
        </span>
      ),
    },
    {
      id: 'uv',
      label: 'UV Index',
      icon: SunMedium,
      iconColor: uvInfo.color,
      value: current.uvIndex !== undefined ? current.uvIndex.toFixed(1) : '--',
      subtext: (
        <span className={`inline-block px-1.5 py-0.2 rounded text-[11px] font-semibold border ${uvInfo.badge}`}>
          {uvInfo.level}
        </span>
      ),
    },
    {
      id: 'precipitation',
      label: 'Precipitation',
      icon: CloudRain,
      iconColor: 'text-blue-400',
      value: `${current.precipitation} mm`,
      subtext: current.precipitation > 0 ? 'Active moisture' : 'No rain recorded',
    },
    {
      id: 'visibility',
      label: 'Visibility',
      icon: Eye,
      iconColor: 'text-indigo-400',
      value: formatVisibility(current.visibility),
      subtext: current.visibility >= 10000 ? 'Clear view' : 'Restricted view',
    },
    {
      id: 'pressure',
      label: 'Pressure',
      icon: Gauge,
      iconColor: 'text-amber-400',
      value: `${Math.round(current.pressure)} hPa`,
      subtext: current.pressure > 1013 ? 'High pressure' : 'Low pressure',
    },
    {
      id: 'cloud_cover',
      label: 'Cloud Cover',
      icon: Cloud,
      iconColor: 'text-slate-300',
      value: `${current.cloudCover}%`,
      subtext: current.cloudCover > 60 ? 'Dense coverage' : current.cloudCover > 20 ? 'Scattered' : 'Clear skies',
    },
    {
      id: 'sun',
      label: 'Sun Cycle',
      icon: Sunrise,
      iconColor: 'text-amber-400',
      value: formatSunTime(current.todaySunrise),
      subtext: (
        <span className="flex items-center gap-1.5">
          <Sunset className="w-3 h-3 text-orange-400" />
          <span>Set: {formatSunTime(current.todaySunset)}</span>
        </span>
      ),
    },
  ];

  return (
    <section aria-label="Weather Highlights" className="space-y-3">
      <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 px-1">
        Weather Conditions & Highlights
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {detailItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="glass-card glass-card-hover rounded-2xl p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">{item.label}</span>
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">
                  {item.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
