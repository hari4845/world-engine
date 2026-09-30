// WORLD ENGINE Guided 3-Minute Hackathon Demo Controller
// Automates the exact 7-part presentation flow from the user specification

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Volume2,
  Clock
} from 'lucide-react';
import { soundFX } from '../utils/audioSynth';

export const DEMO_STEPS = [
  {
    stepIndex: 1,
    timeRange: '0:00 – 0:20',
    title: '1. The Problem: Universities React After Chaos',
    script: '“Today, university administrators, facility managers, and city planners react to problems after they occur — when parking collapses, crowds bottleneck at gates, and power grids fail. What if we could test decisions before enacting them in the real world?”',
    actionDesc: 'Displaying nominal campus baseline at 08:00 AM.',
    targetParams: {
      studentCount: 5000,
      visitorCount: 0,
      timeWindowMinutes: 60,
      hour: 8.0,
      isMainGateBlocked: false,
      isBuildingAPowerDown: false,
      deployShuttles: false,
      openOverflowLot: false,
      staggerClasses: false,
    },
    cameraAction: 'overview',
  },
  {
    stepIndex: 2,
    timeRange: '0:20 – 0:40',
    title: '2. WORLD ENGINE Concept: Digital Twin + Causal AI',
    script: '“Meet WORLD ENGINE. We connect physical buildings, turnstiles, parking, energy, and students into a unified virtual model. The killer question isn’t ‘What is happening?’ — it’s ‘What would happen if...?’”',
    actionDesc: 'Engaging real-time digital twin synchronization over Google Cloud Run.',
    targetParams: {
      studentCount: 5000,
      visitorCount: 150,
      hour: 8.25,
      isMainGateBlocked: false,
      isBuildingAPowerDown: false,
      deployShuttles: false,
      openOverflowLot: false,
      staggerClasses: false,
    },
    cameraAction: 'overview',
  },
  {
    stepIndex: 3,
    timeRange: '0:40 – 1:10',
    title: '3. What-If #1: 5,000 Students Arrive at 8:45 AM',
    script: '“Let’s ask WORLD ENGINE: What happens if 5,000 students arrive in a tight 30-minute window? Notice what happens visually: Traffic surges, North Lot P1 reaches 94% occupancy, turnstile queues swell, and road congestion hits 81%.”',
    actionDesc: 'Simulating Morning Rush: 5,000 students, compressed 30-min window.',
    targetParams: {
      studentCount: 5000,
      visitorCount: 200,
      timeWindowMinutes: 30,
      hour: 8.75,
      isMainGateBlocked: false,
      isBuildingAPowerDown: false,
      deployShuttles: false,
      openOverflowLot: false,
      staggerClasses: false,
    },
    cameraAction: 'maingate',
  },
  {
    stepIndex: 4,
    timeRange: '1:10 – 1:40',
    title: '4. The Intervention: Add Autonomous Shuttle Buses',
    script: '“Instead of telling leaders what to do, we let them experiment. We click ‘Deploy Autonomous Shuttles’. Watch the twin update: vehicle demand drops 38%, parking saturation falls back to 68%, and road delay clears.”',
    actionDesc: 'Applying Intervention: 12 electric perimeter shuttle loops active.',
    targetParams: {
      studentCount: 5000,
      visitorCount: 200,
      timeWindowMinutes: 30,
      hour: 8.75,
      isMainGateBlocked: false,
      isBuildingAPowerDown: false,
      deployShuttles: true,
      openOverflowLot: false,
      staggerClasses: false,
    },
    cameraAction: 'quad',
  },
  {
    stepIndex: 5,
    timeRange: '1:40 – 2:10',
    title: '5. Emergency Mode: Main Gate Blockage & Rerouting',
    script: '“Now the ultimate stress test: ‘What if the Main Entrance is blocked?’ WORLD ENGINE instantly reroutes all incoming traffic to the West Portal, warns security of turnstile delays, and reroutes emergency access routes.”',
    actionDesc: 'Simulating Incident: Main Gate closed; traffic dynamically diverted.',
    targetParams: {
      studentCount: 5000,
      visitorCount: 200,
      timeWindowMinutes: 30,
      hour: 8.75,
      isMainGateBlocked: true,
      isBuildingAPowerDown: false,
      deployShuttles: true,
      openOverflowLot: false,
      staggerClasses: false,
    },
    cameraAction: 'maingate',
  },
  {
    stepIndex: 6,
    timeRange: '2:10 – 2:40',
    title: '6. Gemini Causal Reasoning & A/B Trade-Offs',
    script: '“Gemini acts as the natural-language reasoning brain. It explains the exact chain of effects and generates an A/B decision matrix comparing new parking vs shuttle buses vs staggered timings.”',
    actionDesc: 'Displaying Gemini Causal Chain & Scenario Comparison.',
    targetParams: {
      studentCount: 5000,
      visitorCount: 200,
      timeWindowMinutes: 30,
      hour: 8.75,
      isMainGateBlocked: false,
      isBuildingAPowerDown: false,
      deployShuttles: true,
      openOverflowLot: false,
      staggerClasses: true,
    },
    openCompareModal: true,
  },
  {
    stepIndex: 7,
    timeRange: '2:40 – 3:00',
    title: '7. The Grand Vision: Campus → Smart City → Planet',
    script: '“Today we simulated a campus. But the architecture is universal: Classrooms become office towers, campus roads become city highways, students become citizens. Observe → Model → Simulate → Understand → Decide. Don’t predict the future. Simulate it.”',
    actionDesc: 'Unveiling planetary scalability horizon.',
    targetParams: {
      studentCount: 5000,
      visitorCount: 0,
      hour: 9.0,
      isMainGateBlocked: false,
      isBuildingAPowerDown: false,
      deployShuttles: false,
      openOverflowLot: false,
      staggerClasses: false,
    },
    openScaleModal: true,
  },
];

export default function PitchDemoGuide({
  isOpen,
  onClose,
  onApplyStepParams,
  onOpenScaleModal,
  onOpenCompareModal,
}) {
  if (!isOpen) return null;

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const step = DEMO_STEPS[currentStepIdx];

  const applyStep = (idx) => {
    setCurrentStepIdx(idx);
    const target = DEMO_STEPS[idx];
    soundFX.playSimulationRun();
    onApplyStepParams(target.targetParams);

    if (target.openCompareModal) {
      onOpenCompareModal();
    }
    if (target.openScaleModal) {
      onOpenScaleModal();
    }
  };

  const handleNext = () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      applyStep(currentStepIdx + 1);
    } else {
      setIsAutoPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      applyStep(currentStepIdx - 1);
    }
  };

  return (
    <div className="pitch-guide-dock">
      {/* Header */}
      <div className="pitch-guide-header">
        <div className="pitch-badge-group">
          <span className="pitch-pulse-dot"></span>
          <span className="pitch-badge-label">3-MINUTE HACKATHON PITCH TOUR</span>
          <span className="pitch-timestamp">{step.timeRange}</span>
        </div>
        <button className="pitch-close-btn" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      {/* Step Title & Script */}
      <div className="pitch-guide-content">
        <div className="pitch-step-counter">
          <span>STEP {step.stepIndex} OF 7</span>
          <div className="pitch-progress-bars">
            {DEMO_STEPS.map((_, i) => (
              <div 
                key={i} 
                className={`pitch-bar-pip ${i === currentStepIdx ? 'active' : i < currentStepIdx ? 'done' : ''}`}
                onClick={() => applyStep(i)}
              ></div>
            ))}
          </div>
        </div>

        <h3 className="pitch-title">{step.title}</h3>

        <div className="pitch-script-card">
          <span className="pitch-script-heading">🎙️ PRESENTER TALKING SCRIPT:</span>
          <p className="pitch-script-text">{step.script}</p>
        </div>

        <div className="pitch-action-indicator">
          <Sparkles size={14} className="pitch-sparkle" />
          <span><strong>Twin Action:</strong> {step.actionDesc}</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="pitch-guide-footer">
        <button 
          className="btn-pitch-nav" 
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <span className="pitch-step-label">
          {currentStepIdx + 1} / {DEMO_STEPS.length}
        </span>

        <button 
          className="btn-pitch-nav next-btn" 
          onClick={handleNext}
        >
          <span>{currentStepIdx === DEMO_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
