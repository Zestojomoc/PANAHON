import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Umbrella,
  Sun,
  Shirt,
  Wind,
  Activity,
  Calendar,
  ShieldAlert,
  Droplets,
  Clock,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { generateWeatherSummary } from '../utils/weatherSummary';
import { formatTemperature } from '../utils/temperature';

export default function WeatherSummary({ weather, unit }) {
  const [activeTab, setActiveTab] = useState('briefing'); // 'briefing' | 'advice' | 'weekly'
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // References to prevent garbage collection and manage speech heartbeat on mobile/Vercel
  const activeUtteranceRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);

  // Generate structured summary from current weather data
  const summary = useMemo(() => {
    if (!weather) return null;
    return generateWeatherSummary(weather, unit);
  }, [weather, unit]);

  // Cleanly stop any ongoing speech synthesis and release resources
  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    activeUtteranceRef.current = null;
    if (typeof window !== 'undefined') {
      window._klima_active_utterance = null;
    }
    setIsSpeaking(false);
  }, []);

  // Clean up on component unmount or weather data change
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [weather, stopSpeech]);

  // Handle mobile voices pre-warming
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    // Trigger voices load on mount
    window.speechSynthesis.getVoices();
    const onVoicesChanged = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.onvoiceschanged = onVoicesChanged;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Robust Text-to-speech engine compatible with mobile browsers & production deployments
  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser or device.');
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    if (!summary) return;

    // Cancel any stuck previous synthesis
    window.speechSynthesis.cancel();

    // If synthesis is paused or stalled, resume it
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Split speech into concise sentences to avoid the 15-second browser cutoff limit
    const fullText = `${summary.headline}. ${summary.fullReportText} Outdoor suitability is rated as ${summary.outdoorRating.status}, with an index of ${summary.outdoorRating.score} out of 100.`;

    const sentences = fullText
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (sentences.length === 0) return;

    let sentenceIndex = 0;
    setIsSpeaking(true);

    const speakNextSentence = (index) => {
      if (index >= sentences.length) {
        stopSpeech();
        return;
      }

      const sentence = sentences[index];
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Google') ||
                v.name.includes('Samantha') ||
                v.name.includes('Ava') ||
                v.name.includes('Daniel') ||
                v.name.includes('Karen'))
          ) || voices.find((v) => v.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      // CRITICAL FOR MOBILE & CHROMIUM: Store persistent reference to prevent GC mid-speech
      activeUtteranceRef.current = utterance;
      if (typeof window !== 'undefined') {
        window._klima_active_utterance = utterance;
      }

      utterance.onend = () => {
        sentenceIndex++;
        speakNextSentence(sentenceIndex);
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('[KLIMA TTS] Speech error:', e.error);
        }
        stopSpeech();
      };

      try {
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('[KLIMA TTS] Failed to execute speak:', err);
        stopSpeech();
      }
    };

    // Mobile WebKit / Chromium heartbeat: unpause speech if browser stalls
    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    heartbeatIntervalRef.current = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    }, 4000);

    // Speak initial sentence immediately inside the user touch/click gesture
    speakNextSentence(0);
  };

  // Copy structured report to clipboard
  const handleCopyReport = async () => {
    if (!summary) return;

    const reportLines = [
      `🌤️ Weather Summary: ${summary.locationName}`,
      `📌 ${summary.headline}`,
      `🌡️ High: ${formatTemperature(summary.highTemp, unit)} | Low: ${formatTemperature(summary.lowTemp, unit)} (Feels like ${formatTemperature(summary.feelsLike, unit)})`,
      `💧 Rain Probability: ${summary.peakRainProb}%${summary.peakRainHour ? ` (Peak around ${summary.peakRainHour})` : ''}`,
      `🚶 Outdoor Index: ${summary.outdoorRating.score}/100 (${summary.outdoorRating.status})`,
      `👕 Recommended Gear: ${summary.gearRecommendations.map((g) => g.item).join(', ')}`,
      `\n📝 Overview:\n${summary.fullReportText}`,
      `\n📅 7-Day Trend: ${summary.weeklySummaryText}`,
      `\n— Generated by KLIMA`,
    ];

    try {
      await navigator.clipboard.writeText(reportLines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement('textarea');
      textarea.value = reportLines.join('\n');
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!summary) return null;

  return (
    <section
      aria-label="Weather Summary Report"
      className="relative overflow-hidden rounded-3xl p-5 sm:p-7 glass-panel shadow-2xl border border-white/10 transition-all duration-300"
    >
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 p-[1.5px] shadow-lg shadow-sky-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-base sm:text-xl font-bold tracking-tight text-white leading-tight">
                Weather Summary Report
              </h3>
              <span className="inline-flex items-center gap-1 shrink-0 whitespace-nowrap text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
                AI Briefing
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 sm:mt-0.5 leading-snug">
              Intelligent daily digest and actionable guidance for {summary.locationName}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Audio Listen / Stop Button */}
          <button
            type="button"
            onClick={toggleSpeech}
            aria-label={isSpeaking ? 'Stop reading summary' : 'Listen to audio weather briefing'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
              isSpeaking
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-md shadow-rose-500/20 animate-pulse'
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title={isSpeaking ? 'Stop voice readout' : 'Read weather briefing aloud'}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Listen</span>
              </>
            )}
          </button>

          {/* Copy Report Button */}
          <button
            type="button"
            onClick={handleCopyReport}
            aria-label="Copy summary report to clipboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
            title="Copy weather report to share"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Expand / Minimize Toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse weather report' : 'Expand weather report'}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all"
            title={isExpanded ? 'Minimize summary' : 'Expand summary'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Headline & Quick Metrics Bar (Always Visible) */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider font-bold text-sky-400 flex items-center gap-1.5">
            <span>Today's Outlook</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-normal capitalize">
              {summary.todayCondition.label}
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-white tracking-tight">
            {summary.headline}
          </h4>
        </div>

        {/* Quick Highlights Badges */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          {/* Outdoor Rating Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${summary.outdoorRating.badgeClass}`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Outdoor: {summary.outdoorRating.status} ({summary.outdoorRating.score}/100)</span>
          </div>

          {/* Rain chance pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-300">
            <Droplets className="w-3.5 h-3.5 text-sky-400" />
            <span>
              {summary.peakRainProb > 0
                ? `${summary.peakRainProb}% Rain ${summary.peakRainHour ? `(${summary.peakRainHour})` : ''}`
                : 'Dry Today'}
            </span>
          </div>
        </div>
      </div>

      {/* Expandable In-Depth Report */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 space-y-5 overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('briefing')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'briefing'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Today's Briefing
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('advice')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'advice'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Activities & Gear Guide
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('weekly')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'weekly'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Weekly Trends
              </button>
            </div>

            {/* TAB 1: Today's Narrative & Day Segments */}
            {activeTab === 'briefing' && (
              <motion.div
                key="tab-briefing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Natural Language Narrative Text */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-200 text-sm leading-relaxed">
                  <p>{summary.fullReportText}</p>
                </div>

                {/* Day Phase Breakdown (Morning, Afternoon, Evening, Night) */}
                <div>
                  <h5 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2.5 px-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Time of Day Breakdown</span>
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {summary.segmentReports.map((seg) => (
                      <div
                        key={seg.key}
                        className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="text-xs font-bold text-white">{seg.label}</span>
                          <span className="text-[10px] text-slate-400">{seg.timeframe}</span>
                        </div>

                        <div className="flex items-center gap-2.5 my-1.5">
                          <WeatherIcon code={seg.weatherCode} isDay={seg.isDay ? 1 : 0} size={28} />
                          <div>
                            <div className="text-lg font-bold text-white leading-tight">
                              {formatTemperature(seg.temp, unit)}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[90px]">
                              {seg.condition}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Rain chance</span>
                          <span className={`font-semibold ${seg.rainProb >= 40 ? 'text-sky-400' : 'text-slate-400'}`}>
                            {seg.rainProb}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Smart Advice & Gear Recommendations */}
            {activeTab === 'advice' && (
              <motion.div
                key="tab-advice"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Outdoor suitability card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                        Outdoor Condition Assessment
                      </span>
                    </div>
                    <div className="text-base font-semibold text-white">
                      Score: {summary.outdoorRating.score}/100 — {summary.outdoorRating.status}
                    </div>
                    <p className="text-xs text-slate-400">
                      {summary.outdoorRating.description}
                    </p>
                    {summary.negativeFactors.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                        <span className="text-[11px] text-slate-400">Considerations:</span>
                        {summary.negativeFactors.map((factor, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[10px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-md"
                          >
                            <ShieldAlert className="w-2.5 h-2.5" />
                            {factor}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Progress bar visual */}
                  <div className="w-full sm:w-40 shrink-0">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Index</span>
                      <span className="font-bold text-white">{summary.outdoorRating.score}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 transition-all duration-500"
                        style={{ width: `${summary.outdoorRating.score}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Outfit & Gear Guide */}
                <div>
                  <h5 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2.5 px-1 flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-sky-400" />
                    <span>What to Wear & Pack Today</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {summary.gearRecommendations.map((gear, idx) => {
                      const IconComponent =
                        gear.icon === 'Umbrella'
                          ? Umbrella
                          : gear.icon === 'Sun'
                          ? Sun
                          : gear.icon === 'Wind'
                          ? Wind
                          : Shirt;

                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all flex items-start gap-3"
                        >
                          <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${gear.color} shrink-0`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{gear.item}</div>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                              {gear.reason}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: 7-Day Overview & Highlights */}
            {activeTab === 'weekly' && (
              <motion.div
                key="tab-weekly"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Weekly summary narrative */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-200 text-sm leading-relaxed flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-white mb-1">Extended 7-Day Synopsis</h5>
                    <p className="text-xs sm:text-sm text-slate-300">{summary.weeklySummaryText}</p>
                  </div>
                </div>

                {/* Key weekly stat highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {summary.warmestDay && (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                          <Sun className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Warmest Upcoming Day</div>
                          <div className="text-sm font-bold text-white">
                            {new Date(`${summary.warmestDay.date}T12:00:00`).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                      <span className="text-base font-bold text-rose-400">
                        {formatTemperature(summary.warmestDay.temperatureMax, unit)}
                      </span>
                    </div>
                  )}

                  {summary.rainiestDay && (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Highest Rain Chance</div>
                          <div className="text-sm font-bold text-white">
                            {new Date(`${summary.rainiestDay.date}T12:00:00`).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                      <span className="text-base font-bold text-sky-400">
                        {summary.rainiestDay.precipitationProbabilityMax ?? 0}%
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
