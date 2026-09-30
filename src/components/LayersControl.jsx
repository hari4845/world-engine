// WORLD ENGINE Multi-Layer Digital Twin Control Dock
// Toggle between physical infrastructure, human agents, mobility, energy, and resource layers

import React from 'react';
import { 
  Building2, 
  Users, 
  Car, 
  Zap, 
  Droplets, 
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { soundFX } from '../utils/audioSynth';

export default function LayersControl({ activeLayers, onToggleLayer }) {
  const layers = [
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      icon: Building2,
      color: '#3b82f6',
      desc: 'Buildings, Classrooms & Design Capacities',
    },
    {
      id: 'people',
      label: 'People',
      icon: Users,
      color: '#00f0ff',
      desc: 'Students, Faculty & Pedestrian Corridors',
    },
    {
      id: 'mobility',
      label: 'Mobility',
      icon: Car,
      color: '#10b981',
      desc: 'Vehicles, Shuttles & Parking Bays',
    },
    {
      id: 'energy',
      label: 'Energy',
      icon: Zap,
      color: '#f59e0b',
      desc: 'Power Grid, Solar Arrays & Substation kW',
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: Droplets,
      color: '#06b6d4',
      desc: 'Water Consumption & Cafeteria Food Supply',
    },
  ];

  return (
    <div className="layers-dock-container">
      <div className="layers-dock-title">
        <SlidersHorizontal size={14} className="title-icon" />
        <span>DIGITAL TWIN LAYERS</span>
      </div>
      <div className="layers-buttons-row">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = !!activeLayers[layer.id];

          return (
            <button
              key={layer.id}
              className={`layer-toggle-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                soundFX.playClick();
                onToggleLayer(layer.id);
              }}
              title={`${layer.label}: ${layer.desc}`}
              style={{
                '--layer-color': layer.color,
              }}
            >
              <Icon size={16} className="layer-btn-icon" />
              <span className="layer-btn-label">{layer.label}</span>
              <span className={`layer-status-dot ${isActive ? 'active' : ''}`}></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
