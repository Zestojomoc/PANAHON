import { getWeatherInfo } from './weatherCodes';
import { formatTemperature, formatWindSpeed } from './temperature';

/**
 * Parses hour number (0-23) from ISO date-time string
 */
function getHourFromISO(isoString) {
  if (!isoString) return 12;
  try {
    const parts = isoString.split('T');
    if (parts[1]) {
      return parseInt(parts[1].split(':')[0], 10);
    }
    const d = new Date(isoString);
    return d.getHours();
  } catch {
    return 12;
  }
}

/**
 * Formats hour to 12-hour AM/PM label
 */
function formatHour12(hourNum) {
  const h = hourNum % 24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour} ${ampm}`;
}

/**
 * Generate comprehensive, human-like weather summary and actionable insights
 * from the normalized PANAHON weather object.
 *
 * @param {Object} weather - Normalized PANAHON weather data
 * @param {'C' | 'F'} unit - Temperature unit ('C' or 'F')
 * @returns {Object} Structured summary report data
 */
export function generateWeatherSummary(weather, unit = 'C') {
  if (!weather || !weather.current) {
    return null;
  }

  const { current, daily = [], hourly = [], location = {} } = weather;
  const today = daily[0] || {};
  const locationName = location.name || 'Your area';
  const currentCondition = getWeatherInfo(current.weatherCode, current.isDay);

  const highTemp = today.temperatureMax ?? current.todayMax ?? current.temperature;
  const lowTemp = today.temperatureMin ?? current.todayMin ?? current.temperature;
  const currentTemp = current.temperature;
  const feelsLike = current.feelsLike;

  // Temperature in Celsius for threshold logic
  const tempC = unit === 'F' ? ((currentTemp - 32) * 5) / 9 : currentTemp;
  const highC = unit === 'F' ? ((highTemp - 32) * 5) / 9 : highTemp;

  // 1. Hourly Precipitation Analysis
  let peakRainProb = today.precipitationProbabilityMax ?? 0;
  let peakRainHour = null;
  const rainHours = [];

  hourly.forEach((hour) => {
    const prob = hour.precipitationProbability ?? 0;
    if (prob > peakRainProb) {
      peakRainProb = prob;
    }
    if (prob >= 35) {
      rainHours.push(hour);
    }
  });

  if (rainHours.length > 0) {
    const sorted = [...rainHours].sort((a, b) => (b.precipitationProbability ?? 0) - (a.precipitationProbability ?? 0));
    const peakHourNum = getHourFromISO(sorted[0].time);
    peakRainHour = formatHour12(peakHourNum);
  }

  // 2. Daytime segments breakdown (Morning, Afternoon, Evening, Night)
  const segments = {
    morning: { label: 'Morning', hours: [], title: '6 AM – 12 PM', icon: 'Sunrise' },
    afternoon: { label: 'Afternoon', hours: [], title: '12 PM – 6 PM', icon: 'Sun' },
    evening: { label: 'Evening', hours: [], title: '6 PM – 10 PM', icon: 'Sunset' },
    night: { label: 'Overnight', hours: [], title: '10 PM – 6 AM', icon: 'Moon' },
  };

  hourly.slice(0, 24).forEach((h) => {
    const hourNum = getHourFromISO(h.time);
    if (hourNum >= 6 && hourNum < 12) {
      segments.morning.hours.push(h);
    } else if (hourNum >= 12 && hourNum < 18) {
      segments.afternoon.hours.push(h);
    } else if (hourNum >= 18 && hourNum < 22) {
      segments.evening.hours.push(h);
    } else {
      segments.night.hours.push(h);
    }
  });

  const segmentReports = Object.entries(segments).map(([key, seg]) => {
    if (seg.hours.length === 0) {
      return {
        key,
        label: seg.label,
        timeframe: seg.title,
        temp: currentTemp,
        weatherCode: current.weatherCode,
        condition: currentCondition.label,
        rainProb: 0,
        feelsLike: feelsLike,
      };
    }
    const avgTemp = Math.round(seg.hours.reduce((acc, curr) => acc + curr.temperature, 0) / seg.hours.length);
    const maxProb = Math.max(...seg.hours.map((curr) => curr.precipitationProbability ?? 0));
    // Dominant weather code is from the mid hour of segment
    const midIndex = Math.floor(seg.hours.length / 2);
    const dominantHour = seg.hours[midIndex];
    const isDay = key === 'night' ? false : true;
    const cond = getWeatherInfo(dominantHour.weatherCode, isDay);

    return {
      key,
      label: seg.label,
      timeframe: seg.title,
      temp: avgTemp,
      weatherCode: dominantHour.weatherCode,
      condition: cond.label,
      rainProb: maxProb,
      feelsLike: dominantHour.feelsLike,
      isDay,
    };
  });

  // 3. Outdoor & Comfort Suitability Score (0-100)
  let outdoorScore = 95;
  const negativeFactors = [];

  // Precipitation impact
  if (peakRainProb >= 70) {
    outdoorScore -= 45;
    negativeFactors.push('High likelihood of rainfall');
  } else if (peakRainProb >= 40) {
    outdoorScore -= 25;
    negativeFactors.push('Scattered showers expected');
  } else if (peakRainProb >= 20) {
    outdoorScore -= 10;
  }

  // Extreme temperatures impact
  if (tempC >= 36) {
    outdoorScore -= 30;
    negativeFactors.push('Extreme tropical heat warning');
  } else if (tempC >= 32) {
    outdoorScore -= 15;
    negativeFactors.push('Intense daytime heat');
  } else if (tempC <= 0) {
    outdoorScore -= 35;
    negativeFactors.push('Freezing conditions');
  } else if (tempC <= 8) {
    outdoorScore -= 15;
    negativeFactors.push('Chilly temperatures');
  }

  // Wind impact
  if (current.windSpeed >= 45) {
    outdoorScore -= 30;
    negativeFactors.push('Strong, hazardous winds');
  } else if (current.windSpeed >= 28) {
    outdoorScore -= 12;
    negativeFactors.push('Breezy and gusty winds');
  }

  // UV impact
  const uvMax = today.uvIndexMax ?? current.uvIndex ?? 0;
  if (uvMax >= 9) {
    outdoorScore -= 12;
    negativeFactors.push('Very high UV radiation');
  }

  outdoorScore = Math.max(15, Math.min(100, outdoorScore));

  let outdoorRating = {
    score: outdoorScore,
    status: 'Excellent',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'Conditions are great for walks, sports, commuting, and outdoor gatherings.',
  };

  if (outdoorScore < 45) {
    outdoorRating = {
      score: outdoorScore,
      status: 'Challenging',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      description: 'Inclement weather expected. Indoor activities and extra caution recommended.',
    };
  } else if (outdoorScore < 70) {
    outdoorRating = {
      score: outdoorScore,
      status: 'Moderate',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description: 'Fair conditions with some weather elements to plan around (sun/rain/wind).',
    };
  } else if (outdoorScore < 85) {
    outdoorRating = {
      score: outdoorScore,
      status: 'Good',
      badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      description: 'Pleasant atmosphere with minor breeze or clouds; generally comfortable.',
    };
  }

  // 4. Outfit and Daily Gear Advice
  const gearRecommendations = [];

  if (peakRainProb >= 40 || current.precipitation > 0) {
    gearRecommendations.push({
      item: 'Umbrella / Raincoat',
      reason: `Rain probability peaks at ${peakRainProb}%${peakRainHour ? ` around ${peakRainHour}` : ''}.`,
      icon: 'Umbrella',
      color: 'text-sky-400',
    });
  }

  if (uvMax >= 6) {
    gearRecommendations.push({
      item: 'Sunscreen & Shades',
      reason: `UV index peaks at ${uvMax.toFixed(1)} (Very High). Protect your skin and eyes midday.`,
      icon: 'Sun',
      color: 'text-amber-400',
    });
  }

  if (highC >= 29) {
    gearRecommendations.push({
      item: 'Light, Breathable Wear',
      reason: `High humidity and peak temp of ${formatTemperature(highTemp, unit)} warrant cool, ventilated fabrics.`,
      icon: 'Shirt',
      color: 'text-emerald-400',
    });
  } else if (highC < 14) {
    gearRecommendations.push({
      item: 'Warm Jacket / Layers',
      reason: `Cool conditions reaching lows of ${formatTemperature(lowTemp, unit)}.`,
      icon: 'Shirt',
      color: 'text-indigo-400',
    });
  } else {
    gearRecommendations.push({
      item: 'Casual Comfortable Attire',
      reason: `Moderate temperatures around ${formatTemperature(currentTemp, unit)}.`,
      icon: 'Shirt',
      color: 'text-teal-400',
    });
  }

  if (current.windSpeed >= 25) {
    gearRecommendations.push({
      item: 'Windbreaker / Secure Hats',
      reason: `Brisk winds up to ${formatWindSpeed(current.windSpeed)} with gusts.`,
      icon: 'Wind',
      color: 'text-cyan-400',
    });
  }

  // 5. Natural Language Briefing Text
  // Headline one-liner
  let headline = `${currentCondition.label} in ${locationName}`;
  if (peakRainProb >= 50 && peakRainHour) {
    headline = `Showers expected around ${peakRainHour} (${peakRainProb}% chance)`;
  } else if (peakRainProb >= 50) {
    headline = `Scattered rainfall likely today (${peakRainProb}% chance)`;
  } else if (highC >= 33) {
    headline = `Hot and sunny day with highs reaching ${formatTemperature(highTemp, unit)}`;
  } else if (currentCondition.label.toLowerCase().includes('clear')) {
    headline = `Clear skies with comfortable conditions in ${locationName}`;
  } else if (currentCondition.label.toLowerCase().includes('cloud')) {
    headline = `Mostly cloudy throughout the day with mild temperatures`;
  }

  // Narrative paragraph
  const sentences = [];
  sentences.push(
    `Today in ${locationName}, weather conditions will feature ${currentCondition.description.toLowerCase()} with a high of ${formatTemperature(highTemp, unit)} and a low of ${formatTemperature(lowTemp, unit)}.`
  );

  if (Math.abs(feelsLike - currentTemp) >= 2) {
    sentences.push(
      `Currently at ${formatTemperature(currentTemp, unit)}, it feels closer to ${formatTemperature(feelsLike, unit)} due to relative humidity (${current.humidity}%).`
    );
  }

  if (peakRainProb >= 40) {
    if (peakRainHour) {
      sentences.push(
        `Precipitation is likely, with rain chance peaking at ${peakRainProb}% around ${peakRainHour}. Remember to bring an umbrella.`
      );
    } else {
      sentences.push(
        `There is a ${peakRainProb}% chance of rain showers during the day. Keeping rain gear handy is advised.`
      );
    }
  } else if (peakRainProb >= 20) {
    sentences.push(
      `Only a low ${peakRainProb}% chance of brief, isolated showers; largely dry conditions will prevail.`
    );
  } else {
    sentences.push(
      `Skies are projected to stay predominantly dry with minimal chance of precipitation.`
    );
  }

  if (current.windSpeed >= 20) {
    sentences.push(
      `Winds are blowing from the ${current.windDirectionCardinal} at ${formatWindSpeed(current.windSpeed)}${current.windGusts > 25 ? ` with gusts up to ${Math.round(current.windGusts)} km/h` : ''}.`
    );
  }

  if (uvMax >= 7) {
    sentences.push(
      `The UV index will peak at ${uvMax.toFixed(1)}, so sun protection is strongly recommended between 10 AM and 3 PM.`
    );
  }

  const fullReportText = sentences.join(' ');

  // 6. 7-Day Overview Highlights
  let weeklySummaryText = '';
  let rainiestDay = null;
  let warmestDay = null;

  if (daily.length > 1) {
    const restOfDays = daily.slice(0, 7);
    let maxTempFound = -Infinity;
    let maxRainProbFound = -1;

    restOfDays.forEach((d) => {
      if (d.temperatureMax > maxTempFound) {
        maxTempFound = d.temperatureMax;
        warmestDay = d;
      }
      const prob = d.precipitationProbabilityMax ?? 0;
      if (prob > maxRainProbFound) {
        maxRainProbFound = prob;
        rainiestDay = d;
      }
    });

    const rainDaysCount = restOfDays.filter((d) => (d.precipitationProbabilityMax ?? 0) >= 40).length;

    if (rainDaysCount >= 3) {
      weeklySummaryText = `An unsettled week ahead with ${rainDaysCount} days seeing elevated rain probabilities.`;
    } else if (rainDaysCount === 0) {
      weeklySummaryText = `A steady dry spell expected over the next 7 days with consistent sun and pleasant visibility.`;
    } else {
      weeklySummaryText = `Generally stable weather ahead, with isolated precipitation possible around mid-week.`;
    }

    if (warmestDay) {
      const wDate = new Date(`${warmestDay.date}T12:00:00`);
      const wDayName = wDate.toLocaleDateString('en-US', { weekday: 'long' });
      weeklySummaryText += ` Warmest day will be ${wDayName} reaching ${formatTemperature(warmestDay.temperatureMax, unit)}.`;
    }

    if (rainiestDay && maxRainProbFound >= 40) {
      const rDate = new Date(`${rainiestDay.date}T12:00:00`);
      const rDayName = rDate.toLocaleDateString('en-US', { weekday: 'long' });
      weeklySummaryText += ` Highest chance of rain is on ${rDayName} (${maxRainProbFound}%).`;
    }
  }

  return {
    locationName,
    headline,
    fullReportText,
    outdoorRating,
    negativeFactors,
    gearRecommendations,
    segmentReports,
    peakRainProb,
    peakRainHour,
    highTemp,
    lowTemp,
    currentTemp,
    feelsLike,
    uvMax,
    weeklySummaryText,
    rainiestDay,
    warmestDay,
    todayCondition: currentCondition,
  };
}
