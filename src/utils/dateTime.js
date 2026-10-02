/**
 * Date and time formatting helpers for KLIMA
 */

/**
 * Format hourly timestamp (ISO string like "2026-09-26T14:00")
 * @param {string} isoString 
 * @param {boolean} isCurrentHour 
 * @returns {string} e.g. "Now" or "2 PM" / "14:00"
 */
export function formatHour(isoString, isCurrentHour = false) {
  if (isCurrentHour) return 'Now';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  } catch {
    return isoString.slice(11, 16);
  }
}

/**
 * Format daily forecast date
 * @param {string} dateString e.g. "2026-09-26"
 * @param {number} index index in the 7-day array
 * @returns {{ dayName: string, fullDate: string }}
 */
export function formatDay(dateString, index = 0) {
  if (index === 0) {
    return { dayName: 'Today', shortDate: formatDateShort(dateString) };
  }
  if (index === 1) {
    return { dayName: 'Tomorrow', shortDate: formatDateShort(dateString) };
  }

  try {
    // Append T12:00 to prevent timezone shift issues on pure dates
    const date = new Date(`${dateString}T12:00:00`);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const shortDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { dayName, shortDate };
  } catch {
    return { dayName: dateString, shortDate: '' };
  }
}

function formatDateShort(dateString) {
  try {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

/**
 * Format current location header time and date
 * @param {string} timeString - e.g. "2026-09-26T03:00"
 * @param {string} timezone - e.g. "Asia/Manila"
 */
export function formatLocationTime(timeString, timezone) {
  try {
    const date = timeString ? new Date(timeString) : new Date();
    const options = {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...(timezone ? { timeZone: timezone } : {}),
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }
}
