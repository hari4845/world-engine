// WORLD ENGINE Building Inspection & Telemetry Modal
// Detailed digital twin telemetry for individual campus structures

import React from 'react';
import { X, Building2, Zap, Users, ShieldAlert, Sun, BatteryCharging, Flame } from 'lucide-react';
import { soundFX } from '../utils/audioSynth';

export default function BuildingDetailModal({ building, isOpen, onClose, isPowerDown, onToggleBuildingPower }) {
  if (!isOpen || !building) return null;

  const occupancyPct = Math.round((building.currentOccupants / building.capacity) * 100);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Building2 className="modal-icon-cyan" size={22} />
            <div>
              <span className="building-modal-cat">{building.category}</span>
              <h2 className="modal-title">{building.name}</h2>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Status Alert if Blackout */}
          {isPowerDown && (
            <div className="incident-alert-box">
              <ShieldAlert size={20} className="alert-icon-red" />
              <div>
                <h4 className="alert-box-title">SUBSTATION POWER FAILURE SIMULATED</h4>
                <p className="alert-box-desc">
                  Building breaker tripped. Classrooms evacuated; emergency backup battery powering critical life-safety ventilation.
                </p>
              </div>
            </div>
          )}

          {/* Quick Metrics Cards */}
          <div className="building-stats-grid">
            <div className="b-stat-card">
              <span className="b-stat-label">Design Capacity</span>
              <span className="b-stat-val">{building.capacity.toLocaleString()}</span>
              <span className="b-stat-sub">{building.floors} Physical Floors</span>
            </div>

            <div className="b-stat-card">
              <span className="b-stat-label">Current Occupants</span>
              <span className="b-stat-val" style={{ color: occupancyPct > 80 ? '#f59e0b' : '#00f0ff' }}>
                {isPowerDown ? '0 (EVACUATED)' : building.currentOccupants.toLocaleString()}
              </span>
              <span className="b-stat-sub">{isPowerDown ? '0%' : `${occupancyPct}%`} Occupancy</span>
            </div>

            <div className="b-stat-card">
              <span className="b-stat-label">Power Demand</span>
              <span className="b-stat-val" style={{ color: isPowerDown ? '#ef4444' : '#10b981' }}>
                {isPowerDown ? '0 kW' : `${building.basePowerKW} kW`}
              </span>
              <span className="b-stat-sub">HVAC & Lab Load</span>
            </div>

            <div className="b-stat-card">
              <span className="b-stat-label">Rooftop Solar</span>
              <span className="b-stat-val" style={{ color: '#38bdf8' }}>
                +{building.solarRoofKW} kW
              </span>
              <span className="b-stat-sub">Photovoltaic Array</span>
            </div>
          </div>

          {/* Departments & Facilities */}
          <div className="building-section">
            <h4 className="b-section-title">Departments & Research Labs</h4>
            <div className="dept-tags-row">
              {building.departments.map((dept, i) => (
                <span key={i} className="dept-tag">{dept}</span>
              ))}
            </div>
          </div>

          {/* Infrastructure Specs */}
          <div className="building-section">
            <h4 className="b-section-title">Telemetry & Access Controls</h4>
            <div className="meta-pairs-table">
              <div className="meta-pair-row">
                <span>Active Turnstiles / Gates:</span>
                <strong>{building.turnstiles} RFID Turnstiles (~{building.turnstiles * 14} entries/min)</strong>
              </div>
              <div className="meta-pair-row">
                <span>Backup Diesel / Battery Microgrid:</span>
                <strong>{building.hasBackupGen ? 'Online (Tier 2 Certified)' : 'Grid Reliant Only'}</strong>
              </div>
              <div className="meta-pair-row">
                <span>Structural Digital Twin ID:</span>
                <code>TWIN-GEO-AST-{building.id.toUpperCase()}</code>
              </div>
            </div>
          </div>

          {/* Action Simulation Trigger */}
          <div className="building-footer-actions">
            <button
              className={`btn-toggle-power ${isPowerDown ? 'restore' : 'trip'}`}
              onClick={() => {
                soundFX.playSimulationRun();
                onToggleBuildingPower();
              }}
            >
              <Zap size={16} />
              <span>{isPowerDown ? 'Restore Substation Power' : 'Simulate Power Failure In This Building'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
