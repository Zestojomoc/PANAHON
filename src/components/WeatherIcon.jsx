import React from 'react';
import { resolveWeatherType, getIconColorClass } from '../utils/weatherIcons';

/* ==========================================================================
   Animated SVG Subcomponents
   ========================================================================== */

/**
 * 1. Sunny / Clear (Sun Icon):
 * - Continuous subtle clockwise rotation on the sun rays (20s loop)
 * - Gentle breathing scale effect on the core sun circle (scale 1.0 to 1.08 over 3s infinite ease-in-out)
 */
export function SunIconAnimated({ size = 28, strokeWidth = 2, animate = true, color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="weather-vector-svg overflow-visible"
    >
      {/* 20s continuous clockwise rotating rays */}
      <g
        className={animate ? 'weather-anim-sun-rays' : ''}
        style={{ transformOrigin: '12px 12px' }}
      >
        <line x1="12" y1="2" x2="12" y2="4.5" />
        <line x1="12" y1="19.5" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4.5" y2="12" />
        <line x1="19.5" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="6.7" y2="6.7" />
        <line x1="17.3" y1="17.3" x2="19.07" y2="19.07" />
        <line x1="4.93" y1="19.07" x2="6.7" y2="17.3" />
        <line x1="17.3" y1="6.7" x2="19.07" y2="4.93" />
      </g>
      {/* 3s gentle breathing scale on core sun circle (1.0 to 1.08) */}
      <circle
        cx="12"
        cy="12"
        r="4"
        className={animate ? 'weather-anim-sun-core' : ''}
        style={{ transformOrigin: '12px 12px' }}
      />
    </svg>
  );
}

/**
 * 2. Overcast / Cloud (Cloud Icon):
 * - Horizontal floating sine-wave drift (translateY: -3px to 3px, translateX: -2px to 2px over 4s infinite ease-in-out)
 */
export function CloudIconAnimated({ size = 28, strokeWidth = 2, animate = true, color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="weather-vector-svg overflow-visible"
    >
      <g className={animate ? 'weather-anim-cloud-drift' : ''}>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </g>
    </svg>
  );
}

/**
 * 3. Partly Cloudy / Sun Behind Cloud (Sun + Cloud Icon):
 * - The sun rays rotate slowly behind the cloud (20s loop)
 * - The cloud gently drifts horizontally across the front with a subtle opacity pulse (4s loop)
 */
export function PartlyCloudyDayIconAnimated({ size = 28, strokeWidth = 2, animate = true, color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="weather-vector-svg overflow-visible"
    >
      {/* Sun rays rotating slowly behind cloud */}
      <g
        className={animate ? 'weather-anim-sun-rays-behind' : ''}
        style={{ transformOrigin: '15.5px 8.5px' }}
      >
        <line x1="15.5" y1="2" x2="15.5" y2="4.2" />
        <line x1="22" y1="8.5" x2="19.8" y2="8.5" />
        <line x1="20.1" y1="3.9" x2="18.5" y2="5.5" />
        <line x1="10.9" y1="3.9" x2="12.5" y2="5.5" />
        <line x1="9.5" y1="8.5" x2="11.2" y2="8.5" />
      </g>
      {/* Sun core circle behind cloud */}
      <circle
        cx="15.5"
        cy="8.5"
        r="3.2"
        className={animate ? 'weather-anim-sun-core-behind' : ''}
        style={{ transformOrigin: '15.5px 8.5px' }}
      />
      {/* Cloud drifting horizontally across the front with subtle opacity pulse */}
      <g className={animate ? 'weather-anim-cloud-front-drift' : ''}>
        <path
          d="M17 20H7a5 5 0 1 1 4.9-6.2h1.3A3.8 3.8 0 1 1 17 20Z"
          fill="rgba(15, 23, 42, 0.75)"
        />
      </g>
    </svg>
  );
}

/**
 * 4. Rain / Light Drizzle / Moderate Drizzle (Cloud + Rain Drops Icon):
 * - Cloud body has a slight vertical hover/bob
 * - Raindrop vectors animate downward in sequence with staggered animation delays
 *   (falling down 6px, fading out at bottom, looping endlessly)
 */
export function RainIconAnimated({
  size = 28,
  strokeWidth = 2,
  isDrizzle = false,
  isHeavy = false,
  animate = true,
  color,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="weather-vector-svg overflow-visible"
    >
      {/* Cloud body vertical bob */}
      <g className={animate ? 'weather-anim-cloud-bob' : ''}>
        <path d="M17.5 15H9a5.5 5.5 0 1 1 5.3-7h1.4A4 4 0 1 1 17.5 15Z" />
      </g>
      {/* Raindrops animated downward in sequence with staggered delays */}
      <g>
        <line
          x1="8"
          y1="16.5"
          x2="8"
          y2={isHeavy ? 19.5 : 18.5}
          strokeWidth={isDrizzle ? 1.6 : strokeWidth}
          className={animate ? 'weather-anim-raindrop weather-raindrop-1' : ''}
        />
        <line
          x1="12"
          y1="16.5"
          x2="12"
          y2={isHeavy ? 19.5 : 18.5}
          strokeWidth={isDrizzle ? 1.6 : strokeWidth}
          className={animate ? 'weather-anim-raindrop weather-raindrop-2' : ''}
        />
        <line
          x1="16"
          y1="16.5"
          x2="16"
          y2={isHeavy ? 19.5 : 18.5}
          strokeWidth={isDrizzle ? 1.6 : strokeWidth}
          className={animate ? 'weather-anim-raindrop weather-raindrop-3' : ''}
        />
      </g>
    </svg>
  );
}

/**
 * 5. Thunderstorm / Thunderstorm with Hail (Cloud + Lightning Icon):
 * - Cloud body shakes/flashes subtly on impact
 * - Lightning bolt uses keyframe stroke-dashoffset / opacity flicker
 *   to simulate realistic flash pulses every 2.5s
 */
export function ThunderstormIconAnimated({
  size = 28,
  strokeWidth = 2,
  withHail = false,
  animate = true,
  color,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="weather-vector-svg overflow-visible"
    >
      {/* Cloud body shakes/flashes subtly on impact */}
      <g className={animate ? 'weather-anim-cloud-thunder' : ''}>
        <path d="M17.5 15H9a5.5 5.5 0 1 1 5.3-7h1.4A4 4 0 1 1 17.5 15Z" />
      </g>
      {/* Lightning bolt stroke-dashoffset / opacity flicker realistic flash pulses every 2.5s */}
      <path
        d="m13 11-4 6h5l-2.5 5.5 6.5-7.5h-4.5l2.5-4"
        className={animate ? 'weather-anim-lightning-flash' : ''}
        strokeDasharray="30"
        strokeDashoffset="0"
        fill="rgba(250, 204, 21, 0.12)"
      />
      {/* Optional Hail stones */}
      {withHail && (
        <g fill="currentColor" stroke="none">
          <circle cx="7" cy="18" r="1.1" className={animate ? 'weather-anim-raindrop weather-raindrop-1' : ''} />
          <circle cx="17" cy="18" r="1.1" className={animate ? 'weather-anim-raindrop weather-raindrop-3' : ''} />
        </g>
      )}
    </svg>
  );
}

/**
 * 6. Clear Night (Moon & Twinkling Star)
 */
export function MoonIconAnimated({ size = 28, strokeWidth = 2, animate = true, color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="weather-vector-svg overflow-visible"
    >
      <g
        className={animate ? 'weather-anim-moon-cradle' : ''}
        style={{ transformOrigin: '12px 12px' }}
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </g>
      <g
        className={animate ? 'weather-anim-star-twinkle' : ''}
        style={{ transformOrigin: '19px 5px' }}
      >
        <path d="M19 3v4M17 5h4" strokeWidth={1.5} />
      </g>
    </svg>
  );
}

/**
 * 7. Partly Cloudy Night (Moon Behind Cloud)
 */
export function PartlyCloudyNightIconAnimated({ size = 28, strokeWidth = 2, animate = true, color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="weather-vector-svg overflow-visible"
    >
      {/* Moon cradle behind cloud */}
      <g
        className={animate ? 'weather-anim-moon-cradle-behind' : ''}
        style={{ transformOrigin: '15px 9px' }}
      >
        <path d="M13.5 4.5a4.2 4.2 0 0 0 5 5 5.5 5.5 0 0 1-5-5Z" />
      </g>
      {/* Cloud front drift */}
      <g className={animate ? 'weather-anim-cloud-front-drift' : ''}>
        <path
          d="M17 20H7a5 5 0 1 1 4.9-6.2h1.3A3.8 3.8 0 1 1 17 20Z"
          fill="rgba(15, 23, 42, 0.75)"
        />
      </g>
    </svg>
  );
}

/**
 * 8. Snow / Snowflake (Cloud + Fluttering Snowflakes)
 */
export function SnowIconAnimated({ size = 28, strokeWidth = 2, animate = true, color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="weather-vector-svg overflow-visible"
    >
      <g className={animate ? 'weather-anim-cloud-bob' : ''}>
        <path d="M17.5 15H9a5.5 5.5 0 1 1 5.3-7h1.4A4 4 0 1 1 17.5 15Z" />
      </g>
      <g>
        <path d="M8 17v2.5m-1.2-1.25h2.4" className={animate ? 'weather-snow-1' : ''} strokeWidth={1.4} />
        <path d="M12 17v2.5m-1.2-1.25h2.4" className={animate ? 'weather-snow-2' : ''} strokeWidth={1.4} />
        <path d="M16 17v2.5m-1.2-1.25h2.4" className={animate ? 'weather-snow-3' : ''} strokeWidth={1.4} />
      </g>
    </svg>
  );
}

/**
 * 9. Fog / Mist (Cloud + Drifting Fog Lines)
 */
export function FogIconAnimated({ size = 28, strokeWidth = 2, animate = true, color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="weather-vector-svg overflow-visible"
    >
      <g className={animate ? 'weather-anim-cloud-drift' : ''}>
        <path d="M17.5 14H9a5 5 0 1 1 4.8-6.3h1.4A3.8 3.8 0 1 1 17.5 14Z" />
      </g>
      <g>
        <line x1="6" y1="17" x2="18" y2="17" className={animate ? 'weather-anim-fog-1' : ''} />
        <line x1="8" y1="20" x2="16" y2="20" className={animate ? 'weather-anim-fog-2' : ''} />
      </g>
    </svg>
  );
}

/* ==========================================================================
   Main WeatherIcon Component
   ========================================================================== */

/**
 * Universal Animated WeatherIcon component for KLIMA.
 * 
 * Accepts:
 * - `condition`: weather label string, condition keyword, or Lucide icon name
 * - `size`: icon size in px (default: 28)
 * - `code`: WMO weather code (0-99)
 * - `isDay`: 1 / true for day, 0 / false for night
 * - `animate`: whether keyframe animations are enabled (default: true)
 * - `className`: additional CSS classes
 * - `color`: custom stroke color override
 */
export default function WeatherIcon({
  condition,
  code,
  isDay = 1,
  iconName,
  size = 28,
  className = '',
  animate = true,
  strokeWidth = 2,
  color,
  ...props
}) {
  const weatherType = resolveWeatherType({ condition, code, isDay, iconName });
  const isDayBool = isDay === 1 || isDay === true;
  const colorClass = getIconColorClass(weatherType, isDayBool);

  let IconComponent;
  let extraProps = {};

  switch (weatherType) {
    case 'sunny':
      IconComponent = SunIconAnimated;
      break;
    case 'clear-night':
      IconComponent = MoonIconAnimated;
      break;
    case 'partly-cloudy-day':
      IconComponent = PartlyCloudyDayIconAnimated;
      break;
    case 'partly-cloudy-night':
      IconComponent = PartlyCloudyNightIconAnimated;
      break;
    case 'cloudy':
      IconComponent = CloudIconAnimated;
      break;
    case 'fog':
      IconComponent = FogIconAnimated;
      break;
    case 'drizzle':
      IconComponent = RainIconAnimated;
      extraProps = { isDrizzle: true };
      break;
    case 'rain':
      IconComponent = RainIconAnimated;
      extraProps = { isHeavy: false };
      break;
    case 'thunderstorm':
      IconComponent = ThunderstormIconAnimated;
      extraProps = { withHail: false };
      break;
    case 'thunderstorm-hail':
      IconComponent = ThunderstormIconAnimated;
      extraProps = { withHail: true };
      break;
    case 'snow':
      IconComponent = SnowIconAnimated;
      break;
    default:
      IconComponent = isDayBool ? SunIconAnimated : MoonIconAnimated;
      break;
  }

  return (
    <div
      className={`inline-flex items-center justify-center transition-transform duration-300 ${colorClass} ${className}`}
      style={{ width: size, height: size }}
      aria-label={typeof condition === 'string' ? condition : `${weatherType} weather icon`}
      role="img"
      {...props}
    >
      <IconComponent
        size={size}
        strokeWidth={strokeWidth}
        animate={animate}
        color={color}
        {...extraProps}
      />
    </div>
  );
}
