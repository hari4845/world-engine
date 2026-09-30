// WORLD ENGINE Mathematical Simulation Engine
// Computes multi-layer campus interactions: Influx -> Traffic -> Parking -> Turnstiles -> Grid -> Causal Chains

import { BUILDINGS_DATA, PARKING_ZONES, GATES_DATA, CAMPUS_METRICS } from '../data/campusData';

export const SCENARIO_PRESETS = [
  {
    id: 'morning_rush',
    title: 'SICET Morning Bus & Bike Ingress (8:30 - 9:00 AM)',
    description: '6,000 students arrive: 28 college fleet buses from Hyderabad routes + 1,400 bikes at Sagar Highway Gate.',
    icon: 'Users',
    badge: 'Peak Demand',
    params: {
      studentCount: 6000,
      visitorCount: 150,
      timeWindowMinutes: 30,
      hour: 8.75, // 08:45 AM
      weather: 'clear',
      isMainGateBlocked: false,
      isBuildingAPowerDown: false,
      deployShuttles: false,
      openOverflowLot: false,
      staggerClasses: false,
    },
  },
  {
    id: 'campus_fest',
    title: 'TECH-SPARK & Cultural Fest (12,000 Visitors)',
    description: 'Mega Auditorium (3,200 seats) and Central Quad host participants across Telangana colleges.',
    icon: 'Sparkles',
    badge: 'Mega Event',
    params: {
      studentCount: 6000,
      visitorCount: 6000, // Total 12k
      timeWindowMinutes: 60,
      hour: 11.5,
      weather: 'clear',
      isMainGateBlocked: false,
      isBuildingAPowerDown: false,
      deployShuttles: false,
      openOverflowLot: false,
      staggerClasses: false,
    },
  },
  {
    id: 'emergency_gate_block',
    title: 'Emergency: Sagar Highway Gate Blockage',
    description: 'Roadwork obstructs Main Entrance. All 28 college buses and two-wheelers rerouted to East Bypass Gate.',
    icon: 'AlertTriangle',
    badge: 'Incident',
    params: {
      studentCount: 6000,
      visitorCount: 200,
      timeWindowMinutes: 45,
      hour: 8.75,
      weather: 'clear',
      isMainGateBlocked: true,
      isBuildingAPowerDown: false,
      deployShuttles: false,
      openOverflowLot: false,
      staggerClasses: false,
    },
  },
  {
    id: 'power_failure',
    title: 'Aryabhata CSE Block Substation Blackout',
    description: 'Transformer trip cuts power to AI Superlabs & Server Clusters. 1,560 students relocated to Main Block & Quad.',
    icon: 'ZapOff',
    badge: 'Infrastructure Failure',
    params: {
      studentCount: 6000,
      visitorCount: 100,
      timeWindowMinutes: 30,
      hour: 10.0,
      weather: 'clear',
      isMainGateBlocked: false,
      isBuildingAPowerDown: true,
      deployShuttles: false,
      openOverflowLot: false,
      staggerClasses: false,
    },
  },
  {
    id: 'rain_storm',
    title: 'Monsoon Cloudburst on Sagar Highway Corridor',
    description: 'Heavy rainfall stops two-wheelers. College bus ridership surges to 85%, causing gatehouse bottlenecks.',
    icon: 'CloudRain',
    badge: 'Weather Disruption',
    params: {
      studentCount: 6000,
      visitorCount: 100,
      timeWindowMinutes: 40,
      hour: 8.75,
      weather: 'rain',
      isMainGateBlocked: false,
      isBuildingAPowerDown: false,
      deployShuttles: false,
      openOverflowLot: false,
      staggerClasses: false,
    },
  },
];

/**
 * Execute a simulation run based on parameters
 */
export function runSimulation(params) {
  const {
    studentCount = 5000,
    visitorCount = 0,
    timeWindowMinutes = 45,
    isMainGateBlocked = false,
    isBuildingAPowerDown = false,
    deployShuttles = false,
    openOverflowLot = false,
    staggerClasses = false,
    weather = 'clear',
    hour = 8.75,
  } = params;

  const totalPeople = studentCount + visitorCount + CAMPUS_METRICS.facultyPop + CAMPUS_METRICS.staffPop;

  // 1. Modal Split Calculation
  let carRatio = 0.22;
  let bikeRatio = 0.38;
  let busRatio = 0.18;
  let walkRatio = 0.22;

  if (weather === 'rain') {
    bikeRatio *= 0.2; // Bikes plummet
    carRatio *= 1.7; // Cars surge
    busRatio *= 1.6;
    walkRatio *= 0.5;
  }

  if (deployShuttles) {
    // Shuttles absorb private vehicle demand
    carRatio *= 0.55;
    bikeRatio *= 0.8;
    busRatio *= 2.4;
  }

  const effectiveWindow = staggerClasses ? timeWindowMinutes * 2.2 : timeWindowMinutes;

  const totalVehicles = Math.round(
    (totalPeople * carRatio * 0.75) + // Avg car occupancy ~1.3
    (totalPeople * bikeRatio * 0.95)
  );

  const carsCount = Math.round(totalPeople * carRatio * 0.75);
  const bikesCount = Math.round(totalPeople * bikeRatio * 0.95);
  const shuttleCount = deployShuttles ? 12 : 2;

  // 2. Parking Occupancy Calculations
  const northLotCap = PARKING_ZONES[0].capacity; // 900
  const southLotCap = PARKING_ZONES[1].capacity; // 1200
  const facultyLotCap = PARKING_ZONES[2].capacity; // 400
  const overflowLotCap = openOverflowLot ? PARKING_ZONES[3].capacity : 0; // 800 or 0
  const totalParkingCap = northLotCap + southLotCap + facultyLotCap + overflowLotCap;

  let northLotDemand = Math.round(carsCount * 0.75);
  let southLotDemand = Math.round(bikesCount * 0.92);
  let facultyLotDemand = Math.round(CAMPUS_METRICS.facultyPop * 0.85);

  let overflowDemand = 0;
  if (northLotDemand > northLotCap) {
    const spill = northLotDemand - northLotCap;
    if (openOverflowLot) {
      overflowDemand = spill;
      northLotDemand = northLotCap;
    }
  }

  const northOccupancyPct = Math.min(100, Math.round((northLotDemand / northLotCap) * 100));
  const southOccupancyPct = Math.min(100, Math.round((southLotDemand / southLotCap) * 100));
  const overallParkingPct = Math.min(100, Math.round(((northLotDemand + southLotDemand + facultyLotDemand + overflowDemand) / totalParkingCap) * 100));

  // 3. Traffic and Road Congestion (BPR volume-to-capacity function)
  const baseRoadCapacityPerMin = isMainGateBlocked ? 28 : 75; // Vehicles per minute
  const arrivalRatePerMin = totalVehicles / effectiveWindow;
  const v_c_ratio = arrivalRatePerMin / baseRoadCapacityPerMin;

  let roadCongestionPct = Math.min(100, Math.round(15 + Math.pow(v_c_ratio, 1.8) * 45));
  if (isMainGateBlocked) {
    roadCongestionPct = Math.min(100, roadCongestionPct + 32);
  }
  if (deployShuttles) {
    roadCongestionPct = Math.max(18, Math.round(roadCongestionPct * 0.62));
  }
  if (staggerClasses) {
    roadCongestionPct = Math.max(16, Math.round(roadCongestionPct * 0.58));
  }

  // 4. Turnstile Queue & Pedestrian Wait Time
  const activeTurnstiles = isMainGateBlocked ? 10 : 20; // Main gate has 10 turnstiles
  const pedestrianRatePerMin = (totalPeople * (walkRatio + busRatio * 0.9)) / effectiveWindow;
  const turnstileCapacityPerMin = activeTurnstiles * 14; // ~14 people per turnstile per min

  let avgWaitMinutes = Math.max(0.5, ((pedestrianRatePerMin - turnstileCapacityPerMin) / turnstileCapacityPerMin) * 8 + 1.2);
  if (isMainGateBlocked) avgWaitMinutes *= 2.4;
  if (staggerClasses) avgWaitMinutes *= 0.38;
  avgWaitMinutes = Math.min(28, Math.max(0.5, Math.round(avgWaitMinutes * 10) / 10));

  const queueLengthPeople = Math.round(avgWaitMinutes * (isMainGateBlocked ? 180 : 75));

  // 5. Energy and Power Load Calculation
  let baseCampusKW = BUILDINGS_DATA.reduce((sum, b) => sum + (b.isPowered ? b.basePowerKW : 0), 0);
  // Dynamic occupancy multiplier
  const occupancyMultiplier = Math.min(1.8, 0.6 + (totalPeople / CAMPUS_METRICS.normalStudentPop) * 0.5);
  let totalPowerKW = Math.round(baseCampusKW * occupancyMultiplier);

  if (isBuildingAPowerDown) {
    // Subtract Building A (420 kW) and add load shed & surge on Building B and quad
    totalPowerKW = Math.round(totalPowerKW - 340);
  }

  // Solar generation based on time of day and weather
  let solarFactor = 0;
  if (hour >= 7 && hour <= 18) {
    solarFactor = Math.sin(((hour - 7) / 11) * Math.PI); // Bell curve peaking at 12:30 PM
  }
  if (weather === 'rain') solarFactor *= 0.25;

  const solarGenerationKW = Math.round(CAMPUS_METRICS.solarCapacityKW * Math.max(0, solarFactor));
  const gridDrawKW = Math.max(200, totalPowerKW - solarGenerationKW);
  const gridStressPct = Math.min(100, Math.round((gridDrawKW / CAMPUS_METRICS.gridCapacityKW) * 100));

  // 6. Cafeteria and Water Resources
  const cafeteriaCapacity = 1200;
  const lunchTimeMultiplier = hour >= 11.5 && hour <= 14.0 ? 1.9 : 0.6;
  const cafeteriaDemandPeople = Math.round((totalPeople * 0.42) * lunchTimeMultiplier);
  const cafeteriaStressPct = Math.min(100, Math.round((cafeteriaDemandPeople / cafeteriaCapacity) * 100));

  const waterDrawLitersPerMin = Math.round(180 + totalPeople * 0.35 + (weather === 'rain' ? 80 : 0));

  // 7. Causal Chain Generation (The Chain of Effects)
  const causalChain = generateCausalChain({
    totalPeople,
    totalVehicles,
    effectiveWindow,
    roadCongestionPct,
    overallParkingPct,
    avgWaitMinutes,
    gridStressPct,
    isMainGateBlocked,
    isBuildingAPowerDown,
    deployShuttles,
    openOverflowLot,
    staggerClasses,
    visitorCount,
  });

  return {
    timestamp: new Date().toISOString(),
    params,
    kpis: {
      totalPeople,
      totalVehicles,
      carsCount,
      bikesCount,
      shuttleCount,
      roadCongestionPct,
      overallParkingPct,
      northOccupancyPct,
      southOccupancyPct,
      overflowActive: openOverflowLot,
      avgWaitMinutes,
      queueLengthPeople,
      totalPowerKW,
      solarGenerationKW,
      gridDrawKW,
      gridStressPct,
      cafeteriaStressPct,
      waterDrawLitersPerMin,
      systemStressScore: Math.round((roadCongestionPct * 0.35) + (overallParkingPct * 0.3) + (gridStressPct * 0.2) + (avgWaitMinutes * 2.5)),
    },
    causalChain,
  };
}

/**
 * Generates step-by-step causal chain of effects
 */
function generateCausalChain(ctx) {
  const chain = [];
  let timeOffset = 0;

  if (ctx.isBuildingAPowerDown) {
    chain.push({
      step: 1,
      time: `T+00m`,
      severity: 'critical',
      component: 'Energy Substation B-01',
      title: 'Phase Transformer Trip in Building A',
      cause: 'Short-circuit fault triggered campus breaker.',
      effect: '420 kW load instantly decoupled; 1,150 occupants in darkness.',
    });
    chain.push({
      step: 2,
      time: `T+04m`,
      severity: 'warning',
      component: 'Facilities & Security',
      title: 'Autonomous Relocation Protocol Initiated',
      cause: 'Building A safety air handler shutdown.',
      effect: '680 students directed to Building B Lecture Hall 1-4; 470 students to Central Quad.',
    });
    chain.push({
      step: 3,
      time: `T+12m`,
      severity: 'warning',
      component: 'Building B Infrastructure',
      title: 'Secondary HVAC & Wi-Fi Surge in Building B',
      cause: 'Sudden influx of +680 displaced students.',
      effect: 'Building B power draw increases +38%; Wi-Fi access points experience 94% packet contention.',
    });
    chain.push({
      step: 4,
      time: `T+25m`,
      severity: 'info',
      component: 'Solar Battery Microgrid',
      title: 'Clean Backup Storage Injected',
      cause: 'Automatic transfer switch active.',
      effect: 'Essential server rooms in Building C protected; emergency lights operational.',
    });
    return chain;
  }

  if (ctx.isMainGateBlocked) {
    chain.push({
      step: 1,
      time: `T+00m`,
      severity: 'critical',
      component: 'North Main Gate',
      title: 'Main Arterial Entrance Blocked',
      cause: 'Structural gatehouse obstruction halts inbound lanes.',
      effect: '4 lanes reduced to 0; 75 vehicles/min throughput abruptly drops to zero.',
    });
    chain.push({
      step: 2,
      time: `T+06m`,
      severity: 'danger',
      component: 'Outer Ring Highway',
      title: 'Spillover Gridlock on Perimeter Road',
      cause: 'Incoming vehicles attempt U-turn or divert to East Gate.',
      effect: 'Queue reaches 1.4 km; vehicle delay escalates to 24 minutes.',
    });
    chain.push({
      step: 3,
      time: `T+14m`,
      severity: 'warning',
      component: 'East & West Gate Portals',
      title: 'Secondary Gates Reach 185% Design Capacity',
      cause: '100% of campus inbound traffic funneled through 2-lane gates.',
      effect: 'Pedestrian turnstile queues swell to 450+ students in queue.',
    });
    if (ctx.deployShuttles) {
      chain.push({
        step: 4,
        time: `T+20m`,
        severity: 'success',
        component: 'Autonomous Shuttle Fleet',
        title: 'Intervention: High-Capacity Shuttle Loop Activated',
        cause: '12 electric shuttles ferry passengers from outer overflow perimeter.',
        effect: 'Road congestion drops by 41%; student walking queue cleared in 9 minutes.',
      });
    } else {
      chain.push({
        step: 4,
        time: `T+25m`,
        severity: 'danger',
        component: 'Academic Buildings A & B',
        title: 'Cascading Class Tardiness & Exam Disruption',
        cause: 'Over 2,100 students stranded outside security perimeter.',
        effect: 'Morning lecture start delayed by 35 minutes; quad entry congestion index at 92%.',
      });
    }
    return chain;
  }

  // Standard arrival chain (Normal, Rush, or Fest)
  chain.push({
    step: 1,
    time: `T+00m`,
    severity: 'info',
    component: 'Campus Entrances',
    title: `${ctx.totalPeople.toLocaleString()} Individuals Enter Morning Horizon`,
    cause: `${ctx.effectiveWindow}-minute compressed arrival schedule.`,
    effect: `Peak influx rate of ${Math.round(ctx.totalPeople / ctx.effectiveWindow)} persons/minute across all transit portals.`,
  });

  chain.push({
    step: 2,
    time: `T+10m`,
    severity: ctx.roadCongestionPct > 75 ? 'danger' : ctx.roadCongestionPct > 50 ? 'warning' : 'info',
    component: 'Main Avenue & North Blvd',
    title: `Road Network Congestion: ${ctx.roadCongestionPct}%`,
    cause: `${ctx.totalVehicles.toLocaleString()} vehicles entering within peak window.`,
    effect: ctx.roadCongestionPct > 75 
      ? 'Severe bottlenecks at central quad roundabout; vehicle deceleration of 65%.'
      : 'Smooth transit flow with moderate queuing at intersection signals.',
  });

  chain.push({
    step: 3,
    time: `T+18m`,
    severity: ctx.overallParkingPct > 90 ? 'danger' : ctx.overallParkingPct > 70 ? 'warning' : 'info',
    component: 'Parking Zones (P1, P2, P3)',
    title: `Parking Occupancy Reaches ${ctx.overallParkingPct}%`,
    cause: 'Private vehicle modal share absorbs available spaces.',
    effect: ctx.overallParkingPct > 90
      ? (ctx.openOverflowLot ? 'Overflow Lot P4 absorbed 340 spillover vehicles, averting street parking violations.' : 'Critical shortage! Cars circulating continuously searching for vacant slots.')
      : 'Sufficient parking capacity available with clear bay indicators.',
  });

  chain.push({
    step: 4,
    time: `T+25m`,
    severity: ctx.avgWaitMinutes > 8 ? 'danger' : ctx.avgWaitMinutes > 4 ? 'warning' : 'info',
    component: 'Turnstile Portals & RFID Scanners',
    title: `Entry Turnstile Wait Time: ${ctx.avgWaitMinutes} mins`,
    cause: `Pedestrian influx vs turnstile scan capacity.`,
    effect: ctx.avgWaitMinutes > 8 
      ? `Dense security queues outside Main Gate with queue lengths reaching ${Math.round(ctx.avgWaitMinutes * 45)} meters.`
      : 'Turnstile throughput nominal with steady boarding speed.',
  });

  chain.push({
    step: 5,
    time: `T+35m`,
    severity: ctx.gridStressPct > 80 ? 'warning' : 'info',
    component: 'Campus Substation & HVAC',
    title: `Power Grid Peak Draw: ${ctx.gridStressPct}% of capacity`,
    cause: 'Simultaneous classroom lighting, lab chillers, and cafeteria cooking.',
    effect: ctx.gridStressPct > 80 
      ? 'Peak tariff threshold breached; automated HVAC pre-cooling throttling initiated.'
      : 'Rooftop solar generation offsets 24% of campus baseline consumption.',
  });

  return chain;
}

/**
 * Compare two simulation states (e.g. Baseline vs Intervention)
 */
export function compareSimulations(simA, simB) {
  const kpiA = simA.kpis;
  const kpiB = simB.kpis;

  return {
    roadCongestionDelta: kpiB.roadCongestionPct - kpiA.roadCongestionPct,
    parkingOccupancyDelta: kpiB.overallParkingPct - kpiA.overallParkingPct,
    waitMinutesDelta: Math.round((kpiB.avgWaitMinutes - kpiA.avgWaitMinutes) * 10) / 10,
    gridStressDelta: kpiB.gridStressPct - kpiA.gridStressPct,
    systemStressDelta: kpiB.systemStressScore - kpiA.systemStressScore,
    summary: {
      isBetter: kpiB.systemStressScore < kpiA.systemStressScore,
      percentImprovement: Math.round(Math.abs((kpiB.systemStressScore - kpiA.systemStressScore) / (kpiA.systemStressScore || 1)) * 100),
    }
  };
}
