// WORLD ENGINE Time Machine Component
// Scrub between Past, Present, and Future simulation horizons with variable speeds

import React, { useEffect } from 'react';
import { Play, Pause, FastForward, RotateCcw, Clock, Sun, Moon, Calendar } from 'lucide-react';
import { soundFX } from '../utils/audioSynth';

export default function TimeMachine({
  currentTime,
  onTimeChange,
  isPlaying,
  onTogglePlay,
  simSpeed,
  onSpeedChange,
}) {
  // Format decimal hour to 12h/24h string, e.g. 8.75 -> 08:45 AM
  const formatHourString = (val) => {
    const hours = Math.floor(val);
    const minutes = Math.floor((val - hours) * 60);
    const paddedH = String(hours).padStart(2, '0');
    const paddedM = String(minutes).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayH = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${paddedH}:${paddedM} (${displayH}:${paddedM} ${ampm})`;
  };

  // Determine ambient phase
  const getPhaseName = (h) => {
    if (h < 7.5) return '🌅 Dawn Twilight — Perimeter Gates Open';
    if (h >= 7.5 && h <= 9.25) return '🚨 Morning Rush Peak — Heavy Inbound Congestion';
    if (h > 9.25 && h < 11.75) return '📚 Main Academic Lecture Blocks';
    if (h >= 11.75 && h <= 14.0) return '🍔 Midday Dining & Food Court Surge';
    if (h > 14.0 && h < 17.0) return '🔬 Afternoon Research Labs & Workshops';
    if (h >= 17.0 && h <= 18.75) return '🚗 Evening Campus Departure & Traffic Peak';
    return '🌙 Night Mode — Hostels, Library & Microgrid Low Load';
  };

  // Auto-advance loop when playing
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onTimeChange((prev) => {
        let next = prev + 0.05 * (simSpeed / 5);
        if (next > 22) next = 6.0; // Loop back
        return Math.round(next * 100) / 100;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed, onTimeChange]);

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    onTimeChange(val);
  };

  return (
    <div className="time-machine-dock">
      {/* Top info row */}
      <div className="time-dock-header">
        <div className="time-horizon-pill">
          <Clock size={15} className="clock-pulse" />
          <span className="horizon-tag">
            {currentTime < 8.5 ? '⏪ PAST' : currentTime <= 9.0 ? '▶️ PRESENT' : '⏩ FUTURE SIM'}
          </span>
          <span className="time-clock-display">{formatHourString(currentTime)}</span>
        </div>

        <div className="time-phase-description">
          <span>{getPhaseName(currentTime)}</span>
        </div>

        {/* Milestone Quick Jumps */}
        <div className="time-milestones">
          <button 
            className={`milestone-chip ${Math.abs(currentTime - 8.75) < 0.2 ? 'active' : ''}`}
            onClick={() => { soundFX.playClick(); onTimeChange(8.75); }}
            title="Jump to 08:45 AM Peak Arrival Rush"
          >
            08:45 AM Peak
          </button>
          <button 
            className={`milestone-chip ${Math.abs(currentTime - 12.5) < 0.2 ? 'active' : ''}`}
            onClick={() => { soundFX.playClick(); onTimeChange(12.5); }}
            title="Jump to 12:30 PM Cafeteria Peak"
          >
            12:30 PM Lunch
          </button>
          <button 
            className={`milestone-chip ${Math.abs(currentTime - 17.5) < 0.2 ? 'active' : ''}`}
            onClick={() => { soundFX.playClick(); onTimeChange(17.5); }}
            title="Jump to 05:30 PM Departure"
          >
            05:30 PM Exit
          </button>
        </div>
      </div>

      {/* Scrub Slider Bar with markers */}
      <div className="time-slider-wrapper">
        <input
          type="range"
          min="6.0"
          max="22.0"
          step="0.05"
          value={currentTime}
          onChange={handleSliderChange}
          className="time-range-input"
        />
        <div className="time-ticks">
          <span>06:00</span>
          <span>08:00</span>
          <span className="tick-peak">08:45 (PEAK)</span>
          <span>11:00</span>
          <span>13:00</span>
          <span>15:00</span>
          <span>17:30</span>
          <span>20:00</span>
          <span>22:00</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="time-dock-footer">
        <div className="playback-btns">
          <button 
            className="btn-playback-toggle"
            onClick={() => { soundFX.playClick(); onTogglePlay(); }}
            title={isPlaying ? "Pause Simulation Time" : "Start Simulation Time"}
          >
            {isPlaying ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
            <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
          </button>

          <button 
            className="btn-playback-reset"
            onClick={() => { soundFX.playClick(); onTimeChange(8.75); }}
            title="Reset to 8:45 AM Peak"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>

        {/* Speed multiplier selector */}
        <div className="speed-selector">
          <span className="speed-label">SPEED:</span>
          {[1, 5, 20, 60].map((spd) => (
            <button
              key={spd}
              className={`speed-pill ${simSpeed === spd ? 'active' : ''}`}
              onClick={() => { soundFX.playClick(); onSpeedChange(spd); }}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
