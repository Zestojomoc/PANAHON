# ☀️ PANAHON — Weather, at a glance

> *"Panahon"* is the Tagalog word for **weather**.  
> PANAHON is a modern, responsive, and aesthetic weather web application built with React, Vite, Tailwind CSS v4, and Framer Motion, powered by real-time data from the [Open-Meteo API](https://open-meteo.com/).

---

## ✨ Features

- **Real-Time Current Weather**: Live temperature, feels-like, WMO weather condition descriptions, and today's high/low ranges.
- **24-Hour Forecast Timeline**: Next 24 hours of forecast with day/night awareness, rain chance percentages, and horizontal scrolling.
- **7-Day Forecast**: Multi-day forecast cards featuring dynamic min/max temperature range bars.
- **Detailed Weather Metrics**:
  - Humidity (%)
  - Wind speed (km/h) with 16-point cardinal compass direction and wind gusts
  - UV Index with risk tier badges (*Low*, *Moderate*, *High*, *Very High*, *Extreme*)
  - Atmospheric pressure (hPa)
  - Visibility (km)
  - Precipitation (mm)
  - Cloud cover (%)
  - Sunrise and sunset times
- **City & Regional Search**: Debounced search with the Open-Meteo Geocoding API with keyboard navigation support (`↑`, `↓`, `Enter`, `Esc`).
- **Geolocation Support**: "Use my location" button utilizing the browser Geolocation API and reverse geocoding with graceful error handling.
- **Persistent Local Preferences**:
  - Switch seamlessly between Celsius (°C) and Fahrenheit (°F) with direct API queries.
  - Save and manage favorite locations with zero account required.
  - Remembers your last searched location across page visits.
- **Weather-Aware UI Atmosphere**: Dynamic ambient gradient backdrops that adapt smoothly to weather conditions and day/night state.
- **Fully Responsive**: Crafted with mobile-first design, fluid layouts, and accessibility consideration.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Weather Data**: [Open-Meteo Forecast API](https://open-meteo.com/en/docs)
- **Geocoding**: [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)
- **Storage**: `localStorage` (no external database or authentication needed)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Zestojomoc/PANAHON.git

# Navigate to project folder
cd PANAHON

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License & Attribution

- Weather data provided by [Open-Meteo](https://open-meteo.com/) under non-commercial CC BY 4.0.
