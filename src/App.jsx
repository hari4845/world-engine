// WORLD ENGINE — Core Application Shell
// "Simulate the real world before changing it."

import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CampusCanvas3D from './components/CampusCanvas3D';
import TimeMachine from './components/TimeMachine';
import LayersControl from './components/LayersControl';
import SimulationMetricsHUD from './components/SimulationMetricsHUD';
import GeminiAgentPanel from './components/GeminiAgentPanel';
import ScenarioCompareModal from './components/ScenarioCompareModal';
import BuildingDetailModal from './components/BuildingDetailModal';
import ScaleEngineModal from './components/ScaleEngineModal';
import GoogleCloudArchModal from './components/GoogleCloudArchModal';
import PitchDemoGuide from './components/PitchDemoGuide';
import PhotoImportModal from './components/PhotoImportModal';
import { runSimulation, SCENARIO_PRESETS } from './simulation/simulationEngine';
import { soundFX } from './utils/audioSynth';

export default function App() {
  // --- Simulation State ---
  const [simState, setSimState] = useState(() =>
    runSimulation({
      studentCount: 6000,
      visitorCount: 150,
      timeWindowMinutes: 30,
      hour: 8.75, // 08:45 AM Peak
      isMainGateBlocked: false,
      isBuildingAPowerDown: false,
      deployShuttles: false,
      openOverflowLot: false,
      staggerClasses: false,
      weather: 'clear',
    })
  );

  // --- Layer Controls ---
  const [activeLayers, setActiveLayers] = useState({
    infrastructure: true,
    people: true,
    mobility: true,
    energy: true,
    resources: true,
  });

  // --- Time Machine State ---
  const [currentTime, setCurrentTime] = useState(8.75); // 8:45 AM
  const [isPlayingTime, setIsPlayingTime] = useState(false);
  const [simSpeed, setSimSpeed] = useState(5);

  // --- Modals and Panels ---
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [activeScale, setActiveScale] = useState('campus');
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isPitchGuideOpen, setIsPitchGuideOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Handle Custom Campus from Photos
  const handleApplyCustomCampus = ({ campusName, studentPop }) => {
    const nextParams = {
      ...simState.params,
      studentCount: studentPop,
    };
    const nextSim = runSimulation(nextParams);
    setSimState(nextSim);
  };

  // Handle Layer Toggle
  const handleToggleLayer = (layerId) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  // Handle Time Change (Recalculates solar & hourly load)
  const handleTimeChange = useCallback((newHour) => {
    setCurrentTime(newHour);
    setSimState((prev) =>
      runSimulation({
        ...prev.params,
        hour: newHour,
      })
    );
  }, []);

  // Handle Simulation Update from Gemini or Interventions
  const handleApplySimulation = (newSimResult) => {
    setSimState(newSimResult);
    if (newSimResult.params?.hour !== undefined) {
      setCurrentTime(newSimResult.params.hour);
    }
  };

  // Handle Intervention Toggles
  const handleApplyIntervention = (interventionParams) => {
    const nextParams = {
      ...simState.params,
      ...interventionParams,
    };
    const nextSim = runSimulation(nextParams);
    setSimState(nextSim);
  };

  // Handle Preset Selection
  const handleSelectPreset = (preset) => {
    const nextSim = runSimulation(preset.params);
    setSimState(nextSim);
    if (preset.params.hour) {
      setCurrentTime(preset.params.hour);
    }
  };

  // Handle Guided Pitch Step Params
  const handleApplyStepParams = (stepParams) => {
    const nextSim = runSimulation(stepParams);
    setSimState(nextSim);
    if (stepParams.hour) {
      setCurrentTime(stepParams.hour);
    }
  };

  // Handle Building Power Outage Toggle
  const handleToggleBuildingPower = () => {
    const currentStatus = simState.params.isBuildingAPowerDown;
    const nextParams = {
      ...simState.params,
      isBuildingAPowerDown: !currentStatus,
    };
    const nextSim = runSimulation(nextParams);
    setSimState(nextSim);
  };

  const handleToggleSound = () => {
    const newState = soundFX.toggle();
    setSoundEnabled(newState);
  };

  return (
    <div className="world-engine-root">
      {/* 1. Command Header */}
      <Header
        activeScale={activeScale}
        onOpenScaleModal={() => setIsScaleModalOpen(true)}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
        onStartPitchDemo={() => setIsPitchGuideOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* 2. Main Workstation Grid */}
      <div className="workstation-layout">
        {/* Left Column: 3D Digital Twin Viewport */}
        <div className="canvas-column">
          <div className="canvas-wrapper">
            <CampusCanvas3D
              simState={simState}
              activeLayers={activeLayers}
              currentTimeHour={currentTime}
              onSelectBuilding={(bldg) => setSelectedBuilding(bldg)}
              selectedBuilding={selectedBuilding}
            />

            {/* Overlaid Telemetry HUD */}
            <div className="hud-overlay-wrapper">
              <SimulationMetricsHUD
                simState={simState}
                activeLayers={activeLayers}
              />
            </div>

            {/* Overlaid Digital Twin Layers Control */}
            <div className="layers-overlay-wrapper">
              <LayersControl
                activeLayers={activeLayers}
                onToggleLayer={handleToggleLayer}
              />
            </div>
          </div>

          {/* Bottom Dock: Time Machine Scrub Bar */}
          <TimeMachine
            currentTime={currentTime}
            onTimeChange={handleTimeChange}
            isPlaying={isPlayingTime}
            onTogglePlay={() => setIsPlayingTime(!isPlayingTime)}
            simSpeed={simSpeed}
            onSpeedChange={setSimSpeed}
          />
        </div>

        {/* Right Column: Gemini Causal Copilot Sidebar */}
        <div className="sidebar-column">
          <GeminiAgentPanel
            simState={simState}
            onApplySimulation={handleApplySimulation}
            onApplyIntervention={handleApplyIntervention}
            onSelectPreset={handleSelectPreset}
          />
        </div>
      </div>

      {/* 3. Modals */}
      <BuildingDetailModal
        building={selectedBuilding}
        isOpen={!!selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        isPowerDown={simState.params.isBuildingAPowerDown && selectedBuilding?.id === 'bldg_a'}
        onToggleBuildingPower={handleToggleBuildingPower}
      />

      <ScenarioCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        currentSimState={simState}
        onSelectScenario={(newSim) => setSimState(newSim)}
      />

      <ScaleEngineModal
        isOpen={isScaleModalOpen}
        onClose={() => setIsScaleModalOpen(false)}
        currentScale={activeScale}
        onSelectScale={(scale) => setActiveScale(scale)}
      />

      <GoogleCloudArchModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        currentSimState={simState}
      />

      <PitchDemoGuide
        isOpen={isPitchGuideOpen}
        onClose={() => setIsPitchGuideOpen(false)}
        onApplyStepParams={handleApplyStepParams}
        onOpenScaleModal={() => setIsScaleModalOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
      />

      <PhotoImportModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onApplyCustomCampus={handleApplyCustomCampus}
      />
    </div>
  );
}
