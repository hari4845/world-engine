// WORLD ENGINE Google Cloud & Vertex AI Architecture Modal
// Visual architectural diagram and live BigQuery streaming telemetry inspector

import React, { useState, useEffect } from 'react';
import { X, Cloud, Cpu, Database, HardDrive, Radio, ShieldCheck, Terminal, Activity, ArrowRight } from 'lucide-react';
import { soundFX } from '../utils/audioSynth';

export default function GoogleCloudArchModal({ isOpen, onClose, currentSimState }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('diagram'); // 'diagram' | 'telemetry'
  const [streamLogs, setStreamLogs] = useState([]);

  // Generate synthetic BigQuery / PubSub streaming events
  useEffect(() => {
    const buildings = ['BLDG_A_SCIENCE', 'BLDG_B_ACADEMIC', 'BLDG_C_AI_LAB', 'AUDITORIUM', 'CAFETERIA', 'NORTH_GATE', 'EAST_GATE'];
    const eventTypes = ['TURNSTILE_RFID_SCAN', 'SMART_METER_KW_SAMPLE', 'ANPR_LICENSE_PLATE', 'HVAC_CHILLER_DELTA', 'SOLAR_INVERTER_TICK'];

    const interval = setInterval(() => {
      const bldg = buildings[Math.floor(Math.random() * buildings.length)];
      const evType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const ts = new Date().toISOString();

      let payload = {};
      if (evType === 'TURNSTILE_RFID_SCAN') {
        payload = { student_id_hash: `stu_${Math.floor(Math.random() * 90000 + 10000)}`, gate: bldg, direction: 'INBOUND', rfid_ms: 18 };
      } else if (evType === 'SMART_METER_KW_SAMPLE') {
        payload = { meter_id: `gcp_sensor_${bldg}`, instantaneous_kw: (Math.random() * 200 + 150).toFixed(1), power_factor: 0.94 };
      } else {
        payload = { sensor: bldg, latency_ms: (Math.random() * 12 + 4).toFixed(1), pubsub_topic: 'projects/world-engine/topics/telemetry' };
      }

      setStreamLogs((prev) => [
        {
          id: Math.random().toString(36).substring(7),
          timestamp: ts,
          source: 'Pub/Sub → BigQuery',
          eventType: evType,
          payload: JSON.stringify(payload),
        },
        ...prev.slice(0, 18),
      ]);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const gcpServices = [
    {
      name: 'Google Cloud Run',
      role: 'Serverless Simulation & API Host',
      icon: '☁️',
      color: '#4285F4',
      desc: 'Hosts deterministic simulation engine workers and WebSocket sync. Auto-scales from 0 to 1,000 instances during massive campus or smart city scenarios.',
    },
    {
      name: 'Gemini / Vertex AI',
      role: 'Causal Reasoning & Copilot Engine',
      icon: '🧠',
      color: '#8E24AA',
      desc: 'Gemini 1.5 / 2.0 Flash models parse natural language, construct mathematical simulation parameters, evaluate causal chains, and rank policy interventions.',
    },
    {
      name: 'Google BigQuery',
      role: 'Streaming Campus Data Warehouse',
      icon: '📊',
      color: '#0F9D58',
      desc: 'Ingests millions of telemetry events per second from turnstiles, power sub-meters, and ANPR cameras with SQL-based time-series analytics.',
    },
    {
      name: 'Cloud Pub/Sub',
      role: 'Real-Time IoT Event Ingress',
      icon: '🔄',
      color: '#F4B400',
      desc: 'Decoupled asynchronous event broker streaming real-world campus measurements directly into the digital twin simulation loop.',
    },
    {
      name: 'Cloud Storage (GCS)',
      role: 'Spatial Twin & 3D Mesh Assets',
      icon: '🗂️',
      color: '#DB4437',
      desc: 'Stores high-resolution GIS shapefiles, procedural 3D building meshes, LiDAR scans, and historical scenario checkpoint snapshots.',
    },
    {
      name: 'Firebase / Firestore',
      role: 'Low-Latency Synchronized Twin State',
      icon: '🔐',
      color: '#FFCA28',
      desc: 'Real-time document synchronization keeping 3D client viewports, dashboard HUDs, and decision-maker devices aligned in sub-50ms.',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window modal-wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <Cloud className="modal-icon-cyan" size={24} />
            <div>
              <h2 className="modal-title">Google Cloud & Vertex AI Architecture</h2>
              <p className="modal-subtitle">
                Built on enterprise Google Cloud services designed to scale from a single campus to planetary twins.
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="gcp-tabs-bar">
          <button 
            className={`gcp-tab-btn ${activeTab === 'diagram' ? 'active' : ''}`}
            onClick={() => { soundFX.playClick(); setActiveTab('diagram'); }}
          >
            <Cpu size={16} />
            <span>Architecture Flow & Stack</span>
          </button>
          <button 
            className={`gcp-tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
            onClick={() => { soundFX.playClick(); setActiveTab('telemetry'); }}
          >
            <Activity size={16} />
            <span>Live BigQuery Synthetic Ingestion Stream</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'diagram' && (
            <div className="gcp-diagram-view">
              {/* Pipeline Flowchart */}
              <div className="arch-flow-diagram">
                <div className="arch-node user-node">
                  <span className="node-icon">👤</span>
                  <span className="node-label">CAMPUS DECISION MAKER</span>
                  <span className="node-sub">Natural Language Query</span>
                </div>
                <ArrowRight className="arch-arrow" size={20} />
                <div className="arch-node web-node">
                  <span className="node-icon">🌐</span>
                  <span className="node-label">WEB APPLICATION</span>
                  <span className="node-sub">3D Three.js Digital Twin</span>
                </div>
                <ArrowRight className="arch-arrow" size={20} />
                <div className="arch-node cloudrun-node">
                  <span className="node-icon">☁️</span>
                  <span className="node-label">CLOUD RUN</span>
                  <span className="node-sub">Simulation Microservice</span>
                </div>
                <ArrowRight className="arch-arrow" size={20} />
                <div className="arch-node vertex-node">
                  <span className="node-icon">🧠</span>
                  <span className="node-label">GEMINI / VERTEX AI</span>
                  <span className="node-sub">Causal Reasoning Engine</span>
                </div>
              </div>

              {/* Grid of GCP Services */}
              <div className="gcp-services-grid">
                {gcpServices.map((svc, i) => (
                  <div key={i} className="gcp-service-card">
                    <div className="service-card-top">
                      <span className="service-icon">{svc.icon}</span>
                      <div>
                        <h4 className="service-name">{svc.name}</h4>
                        <span className="service-role">{svc.role}</span>
                      </div>
                    </div>
                    <p className="service-desc">{svc.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="gcp-telemetry-view">
              <div className="telemetry-stream-header">
                <div className="telemetry-live-badge">
                  <span className="stream-live-dot"></span>
                  <span>BIGQUERY REAL-TIME INGESTION STREAM (projects/world-engine-prod/datasets/campus_twin)</span>
                </div>
                <span className="stream-stats">4.2k events/sec • Pub/Sub Ack &lt; 8ms</span>
              </div>

              <div className="telemetry-terminal-window">
                <div className="terminal-top-bar">
                  <span className="term-dot red"></span>
                  <span className="term-dot yellow"></span>
                  <span className="term-dot green"></span>
                  <span className="term-title">bigquery_streaming_buffer.log</span>
                </div>
                <div className="terminal-logs-body">
                  {streamLogs.map((log) => (
                    <div key={log.id} className="terminal-log-row">
                      <span className="log-ts">[{log.timestamp.split('T')[1].replace('Z', '')}]</span>
                      <span className="log-src">[{log.source}]</span>
                      <span className="log-type">{log.eventType}:</span>
                      <code className="log-payload">{log.payload}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
