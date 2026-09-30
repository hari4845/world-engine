// WORLD ENGINE Command Header
// Shows system status, scale level indicator, and quick-launch modal triggers

import React from 'react';
import { 
  Globe2, 
  Activity, 
  Layers, 
  Cloud, 
  GitCompare, 
  Play, 
  Volume2, 
  VolumeX,
  Compass,
  Zap,
  Camera
} from 'lucide-react';
import { soundFX } from '../utils/audioSynth';

export default function Header({
  activeScale,
  onOpenScaleModal,
  onOpenCloudModal,
  onOpenCompareModal,
  onOpenPhotoModal,
  onStartPitchDemo,
  soundEnabled,
  onToggleSound,
}) {
  return (
    <header className="engine-header">
      {/* Brand & Tagline */}
      <div className="header-brand-group">
        <div className="brand-logo-container">
          <div className="brand-icon-halo">
            <Globe2 className="brand-icon" size={26} />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">WORLD ENGINE</h1>
              <span className="brand-badge-version">v2.4 TWIN</span>
            </div>
            <p className="brand-tagline">“Simulate the real world before changing it.”</p>
          </div>
        </div>
      </div>

      {/* Futuristic Scale Switcher Capsule */}
      <div className="scale-indicator-capsule" onClick={() => { soundFX.playClick(); onOpenScaleModal(); }}>
        <div className="scale-pill-dot"></div>
        <div className="scale-text-block">
          <span className="scale-sub">SIMULATION HORIZON</span>
          <span className="scale-name">
            {activeScale === 'campus' && '🏛️ Level 1: College Campus'}
            {activeScale === 'district' && '🎓 Level 2: University District'}
            {activeScale === 'city' && '🌆 Level 3: Smart City'}
            {activeScale === 'state' && '🗺️ Level 4: State Grid'}
            {activeScale === 'planet' && '🌍 Level 5: Planet Earth'}
          </span>
        </div>
        <Compass size={15} className="scale-expand-icon" />
      </div>

      {/* Cloud & Telemetry Sync Badge */}
      <div className="telemetry-sync-badge">
        <span className="telemetry-live-dot"></span>
        <div className="telemetry-info">
          <span className="telemetry-label">GCP TWIN SYNC • CLOUD RUN</span>
          <span className="telemetry-stat">BIGQUERY 4.2k evt/s • 12ms</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="header-actions">
        {/* 3-Minute Hackathon Pitch Demo Button */}
        <button 
          className="btn-pitch-demo"
          onClick={() => { soundFX.playSimulationRun(); onStartPitchDemo(); }}
          title="Start 3-Minute Guided Hackathon Pitch Walkthrough"
        >
          <Play size={15} fill="currentColor" />
          <span>3-Min Pitch Tour</span>
        </button>

        {/* Scenario Comparison Modal Trigger */}
        <button 
          className="btn-header-tool"
          onClick={() => { soundFX.playClick(); onOpenCompareModal(); }}
          title="Compare Baseline vs Interventions"
        >
          <GitCompare size={16} />
          <span>Compare Scenarios</span>
        </button>

        {/* Import Photos Modal Trigger */}
        <button 
          className="btn-header-tool"
          onClick={() => { soundFX.playClick(); onOpenPhotoModal(); }}
          title="Upload real college photos & reconstruct digital twin"
        >
          <Camera size={16} />
          <span>Import Photos</span>
        </button>

        {/* Google Cloud Architecture Modal Trigger */}
        <button 
          className="btn-header-tool"
          onClick={() => { soundFX.playClick(); onOpenCloudModal(); }}
          title="Inspect Google Cloud & Vertex AI Architecture"
        >
          <Cloud size={16} />
          <span>Cloud Arch</span>
        </button>

        {/* Audio FX Toggle */}
        <button 
          className={`btn-icon-toggle ${soundEnabled ? 'active' : ''}`}
          onClick={onToggleSound}
          title={soundEnabled ? "Mute UI Sounds" : "Enable UI Sounds"}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>
    </header>
  );
}
