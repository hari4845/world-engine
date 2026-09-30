// WORLD ENGINE Telemetry & Simulation Metrics HUD
// Displays real-time operational indicators with color-coded risk levels

import React from 'react';
import { 
  Users, 
  Car, 
  ParkingSquare, 
  Clock, 
  Zap, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Flame
} from 'lucide-react';

export default function SimulationMetricsHUD({ simState, activeLayers }) {
  const { kpis, params } = simState;

  // Helper for status badge & color
  const getStressColor = (pct) => {
    if (pct >= 85) return '#ef4444'; // Red
    if (pct >= 65) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };

  return (
    <div className="metrics-hud-card">
      <div className="hud-card-header">
        <div className="hud-header-title">
          <TrendingUp size={16} className="hud-icon-cyan" />
          <span>REAL-TIME DIGITAL TWIN TELEMETRY</span>
        </div>
        <div 
          className="hud-stress-badge" 
          style={{ borderColor: getStressColor(kpis.systemStressScore), color: getStressColor(kpis.systemStressScore) }}
        >
          <span className="stress-dot" style={{ backgroundColor: getStressColor(kpis.systemStressScore) }}></span>
          <span>STRESS: {kpis.systemStressScore} / 100</span>
        </div>
      </div>

      <div className="metrics-grid">
        {/* Metric 1: Campus Population */}
        <div className="metric-box">
          <div className="metric-box-top">
            <span className="metric-box-label">SIMULATED POPULATION</span>
            <Users size={14} className="metric-box-icon" />
          </div>
          <div className="metric-box-val-row">
            <span className="metric-box-val">{kpis.totalPeople.toLocaleString()}</span>
            <span className="metric-box-unit">agents</span>
          </div>
          <div className="metric-box-sub">
            <span>{params.studentCount.toLocaleString()} Students • {params.visitorCount > 0 ? `${params.visitorCount.toLocaleString()} Visitors` : 'Nominal'}</span>
          </div>
        </div>

        {/* Metric 2: Road Congestion */}
        {activeLayers.mobility && (
          <div className="metric-box">
            <div className="metric-box-top">
              <span className="metric-box-label">ROAD CONGESTION</span>
              <Car size={14} className="metric-box-icon" />
            </div>
            <div className="metric-box-val-row">
              <span className="metric-box-val" style={{ color: getStressColor(kpis.roadCongestionPct) }}>
                {kpis.roadCongestionPct}%
              </span>
              <span className="metric-box-unit">delay index</span>
            </div>
            <div className="metric-bar-track">
              <div 
                className="metric-bar-fill" 
                style={{ 
                  width: `${kpis.roadCongestionPct}%`, 
                  backgroundColor: getStressColor(kpis.roadCongestionPct) 
                }}
              ></div>
            </div>
            <div className="metric-box-sub">
              <span>{kpis.totalVehicles.toLocaleString()} Vehicles • {params.deployShuttles ? '12 Shuttles Active' : 'No Shuttles'}</span>
            </div>
          </div>
        )}

        {/* Metric 3: Parking Saturation */}
        {activeLayers.mobility && (
          <div className="metric-box">
            <div className="metric-box-top">
              <span className="metric-box-label">PARKING SATURATION</span>
              <ParkingSquare size={14} className="metric-box-icon" />
            </div>
            <div className="metric-box-val-row">
              <span className="metric-box-val" style={{ color: getStressColor(kpis.overallParkingPct) }}>
                {kpis.overallParkingPct}%
              </span>
              <span className="metric-box-unit">occupied</span>
            </div>
            <div className="metric-bar-track">
              <div 
                className="metric-bar-fill" 
                style={{ 
                  width: `${kpis.overallParkingPct}%`, 
                  backgroundColor: getStressColor(kpis.overallParkingPct) 
                }}
              ></div>
            </div>
            <div className="metric-box-sub">
              <span>P1 Cars: {kpis.northOccupancyPct}% • P2 Bikes: {kpis.southOccupancyPct}%</span>
            </div>
          </div>
        )}

        {/* Metric 4: Turnstile Wait Time */}
        {activeLayers.people && (
          <div className="metric-box">
            <div className="metric-box-top">
              <span className="metric-box-label">ENTRY TURNSTILE QUEUE</span>
              <Clock size={14} className="metric-box-icon" />
            </div>
            <div className="metric-box-val-row">
              <span className="metric-box-val" style={{ color: kpis.avgWaitMinutes > 5 ? '#ef4444' : '#00f0ff' }}>
                {kpis.avgWaitMinutes}
              </span>
              <span className="metric-box-unit">min avg wait</span>
            </div>
            <div className="metric-box-sub">
              <span>Queue: ~{kpis.queueLengthPeople.toLocaleString()} students at gates</span>
            </div>
          </div>
        )}

        {/* Metric 5: Energy Grid Draw */}
        {activeLayers.energy && (
          <div className="metric-box">
            <div className="metric-box-top">
              <span className="metric-box-label">POWER GRID LOAD</span>
              <Zap size={14} className="metric-box-icon" />
            </div>
            <div className="metric-box-val-row">
              <span className="metric-box-val" style={{ color: getStressColor(kpis.gridStressPct) }}>
                {kpis.totalPowerKW.toLocaleString()}
              </span>
              <span className="metric-box-unit">kW ({kpis.gridStressPct}%)</span>
            </div>
            <div className="metric-bar-track">
              <div 
                className="metric-bar-fill" 
                style={{ 
                  width: `${kpis.gridStressPct}%`, 
                  backgroundColor: getStressColor(kpis.gridStressPct) 
                }}
              ></div>
            </div>
            <div className="metric-box-sub">
              <span>Solar: +{kpis.solarGenerationKW} kW offset • {params.isBuildingAPowerDown ? 'Bldg A OFF' : 'All Grid OK'}</span>
            </div>
          </div>
        )}

        {/* Metric 6: Cafeteria & Resources */}
        {activeLayers.resources && (
          <div className="metric-box">
            <div className="metric-box-top">
              <span className="metric-box-label">DINING & WATER FLOW</span>
              <Flame size={14} className="metric-box-icon" />
            </div>
            <div className="metric-box-val-row">
              <span className="metric-box-val" style={{ color: getStressColor(kpis.cafeteriaStressPct) }}>
                {kpis.cafeteriaStressPct}%
              </span>
              <span className="metric-box-unit">capacity</span>
            </div>
            <div className="metric-box-sub">
              <span>Water draw: {kpis.waterDrawLitersPerMin} L/min</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
