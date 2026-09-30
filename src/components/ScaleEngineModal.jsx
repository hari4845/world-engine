// WORLD ENGINE Scale Horizon Modal ("Campus → City → Planet")
// Demonstrates that the identical Observe-Model-Simulate-Understand-Decide architecture scales infinitely

import React, { useState } from 'react';
import { X, Globe2, Compass, ArrowRight, Building, MapPin, Cpu, CheckCircle2, Shield } from 'lucide-react';
import { soundFX } from '../utils/audioSynth';

export default function ScaleEngineModal({ isOpen, onClose, currentScale, onSelectScale }) {
  if (!isOpen) return null;

  const [activeTier, setActiveTier] = useState(currentScale || 'campus');

  const tiers = [
    {
      id: 'campus',
      level: 'Level 1',
      title: 'College Campus Digital Twin',
      scope: '10 Buildings • 5,000 Students • 1 Microgrid',
      status: 'Active Simulation Twin',
      tagColor: '#10b981',
      icon: '🏛️',
      description: 'The foundation model: Simulates classroom ingress, parking saturation, cafeteria lines, and power substation loads before changing physical schedules.',
      mappings: [
        { twinElement: 'People', campus: '5,000 Students & Faculty', city: '1.2M Citizens', planet: '8.1B Global Population' },
        { twinElement: 'Structures', campus: '10 Academic Buildings & Labs', city: '45,000 Urban Buildings & Hospitals', planet: 'Continental Megacities' },
        { twinElement: 'Mobility', campus: 'Main Avenue & Campus Parking', city: 'Arterial Highways & Metro Lines', planet: 'Global Aviation & Maritime Corridors' },
        { twinElement: 'Energy', campus: '3.5 MW Campus Substation & Solar', city: '8.4 GW Metropolitan Power Grid', planet: 'Planetary Renewable Transition' },
        { twinElement: 'Resources', campus: 'Dining Hall Meals & Water Tanks', city: 'Reservoirs, Food Supply & Waste', planet: 'Global Freshwater & Agriculture' },
      ],
      sampleQuery: '"What happens if 5,000 students arrive between 8:30 and 9:00 AM?"',
    },
    {
      id: 'district',
      level: 'Level 2',
      title: 'University District & Medical Hub',
      scope: '80 Buildings • 45,000 People • Light Rail Line',
      status: 'Architecture Ready',
      tagColor: '#3b82f6',
      icon: '🎓',
      description: 'Expanded campus perimeter incorporating research tech parks, teaching hospitals, student housing corridors, and municipal light rail connections.',
      mappings: [
        { twinElement: 'People', campus: '5,000 Students', city: '45,000 Students & Medics', planet: '8.1B Global Population' },
        { twinElement: 'Structures', campus: '10 Buildings', city: '80 Complex Facilities', planet: 'Metropolitan Clusters' },
        { twinElement: 'Mobility', campus: 'Internal Roads', city: 'Autonomous Trams & Bus Corridors', planet: 'Intermodal Transit' },
        { twinElement: 'Energy', campus: '3.5 MW Grid', city: '42 MW Distributed Microgrid', planet: 'Regional Grid Sync' },
      ],
      sampleQuery: '"Simulate hospital ambulance corridor delays during Friday graduation rush."',
    },
    {
      id: 'city',
      level: 'Level 3',
      title: 'Smart City Digital Twin (Metropolis)',
      scope: '45,000 Structures • 1.2M Population • Urban Grid',
      status: 'Scale Vision',
      tagColor: '#8b5cf6',
      icon: '🌆',
      description: 'Classrooms become schools, offices, hospitals, and homes. Campus roads become arterial expressways. Simulates typhoon evacuation, congestion pricing, and grid brownout resilience.',
      mappings: [
        { twinElement: 'Infrastructure', campus: 'Building Classrooms', city: 'Schools, Offices, Hospitals, Residences', planet: 'Urban Footprints' },
        { twinElement: 'Mobility', campus: 'Campus Ring Road', city: 'Highways, Subway System, Bridges', planet: 'Supply Chains' },
        { twinElement: 'Energy', campus: 'Campus Substation', city: 'Municipal High-Voltage Grid & Peaker Plants', planet: 'Global Energy Networks' },
        { twinElement: 'Emergency', campus: 'Main Gate Block', city: 'Bridge Closure / Category 4 Storm Surge', planet: 'Planetary Crisis Management' },
      ],
      sampleQuery: '"Simulate closing the bay bridge during a category 3 storm surge with 400,000 evacuees."',
    },
    {
      id: 'planet',
      level: 'Level 4 / 5',
      title: 'WORLD ENGINE: Planetary Earth Twin',
      scope: 'Global Climate • Energy Transition • Mega Logistics',
      status: 'Ultimate Horizon',
      tagColor: '#00f0ff',
      icon: '🌍',
      description: 'The ultimate synthesis: Observe → Model → Simulate → Understand → Decide at planetary scale. Modeling interactions between climate, renewable energy grids, trade corridors, and human civilization.',
      mappings: [
        { twinElement: 'Systems', campus: 'Building Microgrids', city: 'City Power Grids', planet: 'Global Energy Transition (Solar/Wind/Nuclear)' },
        { twinElement: 'Resources', campus: 'Campus Water Tank', city: 'Municipal Reservoirs', planet: 'Transnational Watersheds & Aquifers' },
        { twinElement: 'Policy Testing', campus: 'Class Staggering', city: 'Congestion Pricing', planet: 'Carbon Tax & Global Food Logistics' },
      ],
      sampleQuery: '"Simulate the impact of a 40% renewable grid transition on regional water consumption."',
    },
  ];

  const currentTierData = tiers.find((t) => t.id === activeTier) || tiers[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window modal-wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Globe2 className="modal-icon-cyan" size={24} />
            <div>
              <h2 className="modal-title">Scalability Architecture: Campus → City → Planet</h2>
              <p className="modal-subtitle">
                “Don't predict the future. Simulate it.” The same underlying data schema and agentic loop scales to any real-world environment.
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Universal Architecture Loop Diagram */}
          <div className="universal-loop-diagram">
            <div className="loop-step">
              <span className="loop-icon">📡</span>
              <span className="loop-label">1. OBSERVE</span>
              <span className="loop-desc">IoT, Sensors, BigQuery Streams</span>
            </div>
            <ArrowRight size={18} className="loop-arrow" />
            <div className="loop-step">
              <span className="loop-icon">🏢</span>
              <span className="loop-label">2. MODEL</span>
              <span className="loop-desc">Continuous Digital Twin</span>
            </div>
            <ArrowRight size={18} className="loop-arrow" />
            <div className="loop-step active-step">
              <span className="loop-icon">⚡</span>
              <span className="loop-label">3. SIMULATE</span>
              <span className="loop-desc">Multi-Layer "What-If" Engine</span>
            </div>
            <ArrowRight size={18} className="loop-arrow" />
            <div className="loop-step">
              <span className="loop-icon">🧠</span>
              <span className="loop-label">4. UNDERSTAND</span>
              <span className="loop-desc">Gemini Causal Reasoning</span>
            </div>
            <ArrowRight size={18} className="loop-arrow" />
            <div className="loop-step">
              <span className="loop-icon">🎯</span>
              <span className="loop-label">5. DECIDE</span>
              <span className="loop-desc">Human-in-the-Loop Actions</span>
            </div>
          </div>

          {/* Tier Selection Tabs */}
          <div className="scale-tier-tabs">
            {tiers.map((t) => (
              <button
                key={t.id}
                className={`scale-tab-btn ${activeTier === t.id ? 'active' : ''}`}
                onClick={() => {
                  soundFX.playClick();
                  setActiveTier(t.id);
                }}
              >
                <span className="tier-icon">{t.icon}</span>
                <div className="tier-tab-text">
                  <span className="tier-level">{t.level}</span>
                  <span className="tier-title">{t.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Tier Details */}
          <div className="scale-tier-detail-card">
            <div className="tier-card-top">
              <div>
                <span className="tier-card-badge" style={{ backgroundColor: currentTierData.tagColor }}>
                  {currentTierData.status}
                </span>
                <h3 className="tier-card-title">{currentTierData.title}</h3>
                <p className="tier-card-scope">{currentTierData.scope}</p>
              </div>
              <div className="tier-query-box">
                <span className="query-box-label">SAMPLE "WHAT-IF" SIMULATION QUERY:</span>
                <span className="query-box-text">{currentTierData.sampleQuery}</span>
              </div>
            </div>

            <p className="tier-card-desc">{currentTierData.description}</p>

            {/* Dimensional Mapping Table */}
            <div className="mapping-table-container">
              <h4 className="mapping-table-heading">Universal Object Mapping (Campus vs City vs Planet)</h4>
              <table className="mapping-table">
                <thead>
                  <tr>
                    <th>Twin Layer</th>
                    <th>College Campus (MVP)</th>
                    <th>Smart City (Scale)</th>
                    <th>Planet Earth (Vision)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTierData.mappings.map((m, i) => (
                    <tr key={i}>
                      <td><strong>{m.twinElement}</strong></td>
                      <td>{m.campus}</td>
                      <td>{m.city}</td>
                      <td>{m.planet}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {currentTierData.id === 'campus' && (
              <div className="tier-action-footer">
                <button
                  className="btn-select-tier active"
                  onClick={() => {
                    soundFX.playClick();
                    onSelectScale('campus');
                    onClose();
                  }}
                >
                  ✓ Currently Simulating Campus Digital Twin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
