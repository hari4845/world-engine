// WORLD ENGINE Gemini AI Co-Pilot Panel
// Natural language interface, causal chain inspector, and intervention recommendation engine

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  CornerDownRight, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Sliders, 
  RefreshCw,
  Key,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { askGeminiAgent } from '../simulation/geminiAgent';
import { SCENARIO_PRESETS } from '../simulation/simulationEngine';
import { soundFX } from '../utils/audioSynth';

export default function GeminiAgentPanel({
  simState,
  onApplySimulation,
  onApplyIntervention,
  onSelectPreset,
}) {
  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [agentResponse, setAgentResponse] = useState(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'presets' | 'chain'

  const quickPrompts = [
    "What happens if 28 college buses and 6,000 students arrive at 8:45 AM?",
    "Simulate SICET TECH-SPARK Fest with 12,000 visitors in Mega Auditorium",
    "What happens if Sagar Highway Main Gate is blocked?",
    "What happens if Aryabhata CSE Block loses electricity?",
    "Deploy 12 electric perimeter shuttles from Ibrahimpatnam junction",
  ];

  const handleSubmit = async (textToRun = null) => {
    const prompt = textToRun || inputPrompt;
    if (!prompt.trim() || isThinking) return;

    soundFX.playSimulationRun();
    setIsThinking(true);

    try {
      const response = await askGeminiAgent(prompt, simState, apiKey);
      setAgentResponse(response);

      // If the response yielded new simulation parameters, apply them to the digital twin
      if (response.simResult) {
        onApplySimulation(response.simResult);
      }
    } catch (err) {
      console.error("Gemini Agent error:", err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="gemini-panel-container">
      {/* Panel Header */}
      <div className="gemini-panel-header">
        <div className="agent-identity">
          <div className="agent-avatar-halo">
            <Sparkles size={18} className="agent-spark-icon" />
          </div>
          <div>
            <div className="agent-name-row">
              <span className="agent-title">Gemini Causal Co-Pilot</span>
              <span className="agent-tag">VERTEX AI</span>
            </div>
            <span className="agent-desc">Natural-language scenario & causal reasoning</span>
          </div>
        </div>

        <button 
          className="btn-api-key"
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          title="Configure Google Gemini API Key"
        >
          <Key size={13} />
          <span>{apiKey ? 'API Set' : 'GCP Key'}</span>
        </button>
      </div>

      {/* Optional Gemini API Key input drawer */}
      {showApiKeyInput && (
        <div className="api-key-drawer">
          <div className="drawer-label">
            <ShieldCheck size={13} />
            <span>Google AI Studio / Vertex API Key (Optional)</span>
          </div>
          <div className="drawer-input-row">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="api-input"
            />
            <button className="api-save-btn" onClick={() => setShowApiKeyInput(false)}>Save</button>
          </div>
          <span className="api-note">Default: Built-in deterministic Gemini Causal Reasoning Engine active.</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="panel-tab-bar">
        <button 
          className={`panel-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => { soundFX.playClick(); setActiveTab('chat'); }}
        >
          💬 AI "What-If"
        </button>
        <button 
          className={`panel-tab ${activeTab === 'presets' ? 'active' : ''}`}
          onClick={() => { soundFX.playClick(); setActiveTab('presets'); }}
        >
          ⚡ Presets
        </button>
        <button 
          className={`panel-tab ${activeTab === 'chain' ? 'active' : ''}`}
          onClick={() => { soundFX.playClick(); setActiveTab('chain'); }}
        >
          🔗 Causal Chain ({simState.causalChain.length})
        </button>
      </div>

      {/* TAB 1: Chat / Causal Reasoning */}
      {activeTab === 'chat' && (
        <div className="panel-tab-body">
          {/* Natural Language Prompt Bar */}
          <div className="prompt-input-group">
            <textarea
              rows={2}
              placeholder="Ask Gemini: 'What happens if 5,000 students arrive at 8:45 AM?'"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="prompt-textarea"
            />
            <button 
              className={`btn-send-prompt ${isThinking ? 'thinking' : ''}`}
              onClick={() => handleSubmit()}
              disabled={isThinking}
            >
              {isThinking ? <RefreshCw size={16} className="spin-icon" /> : <Send size={16} />}
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="quick-prompts-tray">
            <span className="chips-label">SUGGESTED "WHAT-IF" SCENARIOS:</span>
            <div className="chips-row">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  className="quick-chip"
                  onClick={() => {
                    setInputPrompt(q);
                    handleSubmit(q);
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Thinking Indicator */}
          {isThinking && (
            <div className="ai-thinking-card">
              <div className="thinking-spinner"></div>
              <div>
                <span className="thinking-title">Gemini Reasoning Over Campus Digital Twin...</span>
                <p className="thinking-sub">Querying BigQuery synthetic telemetry • Calibrating BPR mobility formulas • Propagating ripple effects</p>
              </div>
            </div>
          )}

          {/* Gemini AI Agent Response */}
          {agentResponse && !isThinking && (
            <div className="agent-response-card">
              <div className="response-header">
                <Sparkles size={16} className="sparkle-cyan" />
                <span className="response-title">{agentResponse.title}</span>
              </div>

              <div className="response-rationale">
                <p>{agentResponse.rationale}</p>
              </div>

              {/* Chain summary bullets */}
              {agentResponse.chainSummary && agentResponse.chainSummary.length > 0 && (
                <div className="response-chain-bullets">
                  <span className="bullets-heading">SIMULATED CHAIN OF EFFECTS:</span>
                  <ul>
                    {agentResponse.chainSummary.map((item, idx) => (
                      <li key={idx}>
                        <ArrowRight size={12} className="bullet-arrow" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Interventions */}
              {agentResponse.recommendations && (
                <div className="recommendations-container">
                  <span className="recom-heading">💡 AI RECOMMENDED INTERVENTIONS</span>
                  <div className="recom-cards">
                    {agentResponse.recommendations.map((rec, i) => (
                      <div key={i} className="intervention-card">
                        <div className="intervention-card-top">
                          <span className="intervention-badge">{rec.badge}</span>
                          <span className="intervention-feasibility">Feasibility: {rec.feasibility}</span>
                        </div>
                        <h4 className="intervention-title">{rec.scenario}</h4>
                        <p className="intervention-impact">{rec.impact}</p>
                        <button
                          className="btn-apply-intervention"
                          onClick={() => {
                            soundFX.playSimulationRun();
                            if (rec.scenario.toLowerCase().includes('shuttle')) {
                              onApplyIntervention({ deployShuttles: true });
                            } else if (rec.scenario.toLowerCase().includes('overflow')) {
                              onApplyIntervention({ openOverflowLot: true });
                            } else if (rec.scenario.toLowerCase().includes('stagger')) {
                              onApplyIntervention({ staggerClasses: true });
                            }
                          }}
                        >
                          <span>Simulate This Intervention</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Scenarios Presets */}
      {activeTab === 'presets' && (
        <div className="panel-tab-body presets-body">
          <span className="tab-section-desc">Select benchmark scenarios to stress-test campus infrastructure:</span>
          <div className="presets-list">
            {SCENARIO_PRESETS.map((preset) => (
              <div 
                key={preset.id} 
                className="preset-item-card"
                onClick={() => {
                  soundFX.playSimulationRun();
                  onSelectPreset(preset);
                }}
              >
                <div className="preset-card-top">
                  <span className="preset-badge">{preset.badge}</span>
                  <button className="preset-run-link">Run Sim →</button>
                </div>
                <h4 className="preset-title">{preset.title}</h4>
                <p className="preset-desc">{preset.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Causal Chain Timeline */}
      {activeTab === 'chain' && (
        <div className="panel-tab-body chain-body">
          <span className="tab-section-desc">Causal Ripple Graph (Time-sequenced impact propagation):</span>
          <div className="chain-timeline-list">
            {simState.causalChain.map((step, idx) => (
              <div key={idx} className={`chain-step-card ${step.severity}`}>
                <div className="chain-step-indicator">
                  <span className="chain-step-num">{step.step}</span>
                  <span className="chain-step-time">{step.time}</span>
                </div>
                <div className="chain-step-content">
                  <div className="chain-step-component">{step.component}</div>
                  <h4 className="chain-step-title">{step.title}</h4>
                  <p className="chain-step-cause"><strong>Trigger:</strong> {step.cause}</p>
                  <p className="chain-step-effect"><strong>Simulated Effect:</strong> {step.effect}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
