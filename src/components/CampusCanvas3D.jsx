// WORLD ENGINE 3D Interactive Campus Digital Twin
// Procedural Three.js Campus with dynamic traffic, pedestrians, solar panels, and layers

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BUILDINGS_DATA, PARKING_ZONES, GATES_DATA } from '../data/campusData';
import { soundFX } from '../utils/audioSynth';

export default function CampusCanvas3D({
  simState,
  activeLayers,
  currentTimeHour,
  onSelectBuilding,
  selectedBuilding,
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const buildingMeshesRef = useRef({});
  const parkingGroupRef = useRef(null);
  const trafficGroupRef = useRef(null);
  const pedestrianGroupRef = useRef(null);
  const energyLinesGroupRef = useRef(null);
  const emergencyGroupRef = useRef(null);
  const hoveredBuildingRef = useRef(null);

  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [cameraPreset, setCameraPreset] = useState('isometric');

  const { kpis, params } = simState;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.007);
    sceneRef.current = scene;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(90, 80, 100);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // --- 2. Lighting Rig ---
    const ambientLight = new THREE.AmbientLight(0xdde5ed, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(60, 100, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 300;
    dirLight.shadow.camera.left = -90;
    dirLight.shadow.camera.right = 90;
    dirLight.shadow.camera.top = 90;
    dirLight.shadow.camera.bottom = -90;
    scene.add(dirLight);

    // Cyber grid ground
    const gridHelper = new THREE.GridHelper(240, 60, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0b1329,
      roughness: 0.85,
      metalness: 0.15,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Central Quad Turf
    const quadGeo = new THREE.PlaneGeometry(70, 70);
    const quadMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.9,
    });
    const quadMesh = new THREE.Mesh(quadGeo, quadMat);
    quadMesh.rotation.x = -Math.PI / 2;
    quadMesh.position.set(0, 0.02, -5);
    quadMesh.receiveShadow = true;
    scene.add(quadMesh);

    // Reflective Water Feature / Fountain in Quad
    const waterGeo = new THREE.CylinderGeometry(8, 8, 0.5, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.8,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.set(0, 0.2, -5);
    scene.add(waterMesh);

    // --- 3. Roads Network ---
    const roadsGroup = new THREE.Group();
    scene.add(roadsGroup);

    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });

    // Main Avenue (North Gate to Central Quad)
    const mainAve = new THREE.Mesh(new THREE.PlaneGeometry(12, 60), roadMat);
    mainAve.rotation.x = -Math.PI / 2;
    mainAve.position.set(0, 0.05, -35);
    mainAve.receiveShadow = true;
    roadsGroup.add(mainAve);

    // South Boulevard
    const southAve = new THREE.Mesh(new THREE.PlaneGeometry(12, 60), roadMat);
    southAve.rotation.x = -Math.PI / 2;
    southAve.position.set(0, 0.05, 35);
    southAve.receiveShadow = true;
    roadsGroup.add(southAve);

    // East-West Central Crossroad
    const crossRoad = new THREE.Mesh(new THREE.PlaneGeometry(120, 10), roadMat);
    crossRoad.rotation.x = -Math.PI / 2;
    crossRoad.position.set(0, 0.06, -5);
    crossRoad.receiveShadow = true;
    roadsGroup.add(crossRoad);

    // Perimeter Ring Roads
    const northRing = new THREE.Mesh(new THREE.PlaneGeometry(120, 8), roadMat);
    northRing.rotation.x = -Math.PI / 2;
    northRing.position.set(0, 0.05, -60);
    roadsGroup.add(northRing);

    const southRing = new THREE.Mesh(new THREE.PlaneGeometry(120, 8), roadMat);
    southRing.rotation.x = -Math.PI / 2;
    southRing.position.set(0, 0.05, 60);
    roadsGroup.add(southRing);

    // --- 4. Procedural Buildings ---
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    BUILDINGS_DATA.forEach((b) => {
      const bldgGroup = new THREE.Group();
      bldgGroup.position.set(b.x, 0, b.z);
      bldgGroup.userData = { buildingId: b.id, data: b };

      // Base Structure
      const bodyGeo = new THREE.BoxGeometry(b.width, b.height, b.depth);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(b.color),
        roughness: 0.3,
        metalness: 0.6,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMesh.position.y = b.height / 2;
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      bodyMesh.userData = { buildingId: b.id };
      bldgGroup.add(bodyMesh);

      // Glass windows (reflective stripes)
      const windowGeo = new THREE.BoxGeometry(b.width + 0.2, b.height * 0.7, b.depth * 0.95);
      const windowMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0369a1,
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85,
      });
      const windowMesh = new THREE.Mesh(windowGeo, windowMat);
      windowMesh.position.y = b.height / 2;
      bldgGroup.add(windowMesh);

      // Rooftop Equipment / Solar Panels
      if (b.solarRoofKW > 0) {
        const solarGeo = new THREE.BoxGeometry(b.width * 0.7, 0.5, b.depth * 0.7);
        const solarMat = new THREE.MeshStandardMaterial({
          color: 0x1e3a8a,
          emissive: 0x1e40af,
          emissiveIntensity: 0.2,
          roughness: 0.2,
          metalness: 0.8,
        });
        const solarMesh = new THREE.Mesh(solarGeo, solarMat);
        solarMesh.position.y = b.height + 0.3;
        bldgGroup.add(solarMesh);
      }

      // Edge outline for crisp cyber look
      const edges = new THREE.EdgesGeometry(bodyGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(b.accentColor), linewidth: 1.5 });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.position.y = b.height / 2;
      bldgGroup.add(wireframe);

      buildingsGroup.add(bldgGroup);
      buildingMeshesRef.current[b.id] = { group: bldgGroup, body: bodyMesh, window: windowMat };
    });

    // --- 5. Parking Lots & Static Vehicles ---
    const parkingGroup = new THREE.Group();
    scene.add(parkingGroup);
    parkingGroupRef.current = parkingGroup;

    PARKING_ZONES.forEach((lot) => {
      const lotGeo = new THREE.PlaneGeometry(lot.width, lot.depth);
      const lotMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
      const lotMesh = new THREE.Mesh(lotGeo, lotMat);
      lotMesh.rotation.x = -Math.PI / 2;
      lotMesh.position.set(lot.x, 0.08, lot.z);
      parkingGroup.add(lotMesh);

      // Border outline
      const border = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(lot.width, 0.2, lot.depth)),
        new THREE.LineBasicMaterial({ color: new THREE.Color(lot.color) })
      );
      border.position.set(lot.x, 0.1, lot.z);
      parkingGroup.add(border);
    });

    // --- 6. Dynamic Traffic Vehicles Group ---
    const trafficGroup = new THREE.Group();
    scene.add(trafficGroup);
    trafficGroupRef.current = trafficGroup;

    // Vehicle Pool (Cars, Shuttles, Bikes)
    const vehicles = [];
    const carColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0xe2e8f0, 0x8b5cf6];

    for (let i = 0; i < 30; i++) {
      const isShuttle = i < 4;
      const isBike = i >= 20;

      let vGeo, vMat;
      if (isShuttle) {
        vGeo = new THREE.BoxGeometry(2.4, 1.8, 5.0);
        vMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 0.3 });
      } else if (isBike) {
        vGeo = new THREE.BoxGeometry(0.6, 0.8, 1.4);
        vMat = new THREE.MeshStandardMaterial({ color: 0x10b981 });
      } else {
        vGeo = new THREE.BoxGeometry(1.6, 1.2, 3.2);
        vMat = new THREE.MeshStandardMaterial({ color: carColors[i % carColors.length] });
      }

      const vMesh = new THREE.Mesh(vGeo, vMat);
      vMesh.castShadow = true;
      vMesh.position.y = isShuttle ? 0.9 : 0.6;

      // Assign trajectory properties
      vehicles.push({
        mesh: vMesh,
        isShuttle,
        isBike,
        progress: (i / 30) * Math.PI * 2,
        speed: 0.004 + (i % 5) * 0.001,
        pathType: i % 3, // 0: Main Ave, 1: Ring Road, 2: Crossroad
      });
      trafficGroup.add(vMesh);
    }

    // --- 7. Pedestrian Particles ---
    const pedestrianCount = 180;
    const pedGeo = new THREE.BufferGeometry();
    const pedPositions = new Float32Array(pedestrianCount * 3);

    for (let i = 0; i < pedestrianCount; i++) {
      pedPositions[i * 3] = (Math.random() - 0.5) * 60;
      pedPositions[i * 3 + 1] = 0.5;
      pedPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    pedGeo.setAttribute('position', new THREE.BufferAttribute(pedPositions, 3));
    const pedMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
    });
    const pedParticles = new THREE.Points(pedGeo, pedMat);
    scene.add(pedParticles);
    pedestrianGroupRef.current = pedParticles;

    // --- 8. Energy Transmission Grid Neon Lines ---
    const energyGroup = new THREE.Group();
    scene.add(energyGroup);
    energyLinesGroupRef.current = energyGroup;

    BUILDINGS_DATA.forEach((b) => {
      const points = [
        new THREE.Vector3(0, 1, 0), // Central Substation in Quad
        new THREE.Vector3(b.x * 0.5, 3, b.z * 0.5),
        new THREE.Vector3(b.x, b.height * 0.8, b.z),
      ];
      const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
      const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.15, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.65,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      energyGroup.add(tube);
    });

    // --- 9. Emergency Blockade Siren & Barriers ---
    const emergencyGroup = new THREE.Group();
    scene.add(emergencyGroup);
    emergencyGroupRef.current = emergencyGroup;

    // Main Gate Barrier
    const barrierGeo = new THREE.BoxGeometry(14, 2, 1);
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xb91c1c,
      emissiveIntensity: 0.6,
    });
    const barrier = new THREE.Mesh(barrierGeo, barrierMat);
    barrier.position.set(0, 1.2, -66);
    emergencyGroup.add(barrier);

    // Hazard Siren Beacon
    const sirenGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
    const sirenMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const siren = new THREE.Mesh(sirenGeo, sirenMat);
    siren.position.set(0, 3, -66);
    emergencyGroup.add(siren);

    // --- 10. Raycasting & User Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingsGroup.children, true);

      if (intersects.length > 0) {
        // Find top-level building group
        let obj = intersects[0].object;
        while (obj.parent && obj.parent !== buildingsGroup) {
          obj = obj.parent;
        }
        if (obj.userData?.data) {
          hoveredBuildingRef.current = obj.userData.buildingId;
          setHoveredInfo({
            building: obj.userData.data,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          document.body.style.cursor = 'pointer';
          return;
        }
      }

      hoveredBuildingRef.current = null;
      setHoveredInfo(null);
      document.body.style.cursor = 'default';
    };

    const handleClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingsGroup.children, true);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && obj.parent !== buildingsGroup) {
          obj = obj.parent;
        }
        if (obj.userData?.data) {
          soundFX.playClick();
          onSelectBuilding(obj.userData.data);
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // --- 11. Mouse Drag Orbit Controls (Custom smooth orbit without extra bundle bloat) ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let cameraAngle = Math.PI / 4;
    let cameraElevation = Math.PI / 5;
    let cameraDistance = 145;

    const onMouseDown = (e) => {
      if (e.button === 0) {
        isDragging = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onDragMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      cameraAngle -= deltaX * 0.007;
      cameraElevation = Math.max(0.15, Math.min(Math.PI / 2.2, cameraElevation + deltaY * 0.007));
    };

    const onWheel = (e) => {
      cameraDistance = Math.max(45, Math.min(230, cameraDistance + e.deltaY * 0.08));
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onDragMove);
    container.addEventListener('wheel', onWheel, { passive: true });

    // --- 12. Main Animation Render Loop ---
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera Position update
      camera.position.x = Math.sin(cameraAngle) * Math.cos(cameraElevation) * cameraDistance;
      camera.position.y = Math.sin(cameraElevation) * cameraDistance;
      camera.position.z = Math.cos(cameraAngle) * Math.cos(cameraElevation) * cameraDistance;
      camera.lookAt(0, 0, 0);

      // Traffic Animation
      const congestionFactor = Math.max(0.2, 1 - (kpis.roadCongestionPct / 100) * 0.7);

      vehicles.forEach((v, idx) => {
        v.progress += v.speed * congestionFactor;
        const p = v.progress;

        if (v.pathType === 0) {
          // North-South Corridor
          if (params.isMainGateBlocked && Math.cos(p) < -0.7) {
            // Divert vehicle to West Gate!
            v.mesh.position.x = -35 + Math.sin(p * 2) * 15;
            v.mesh.position.z = -10 + Math.cos(p) * 20;
            v.mesh.rotation.y = Math.PI / 2;
          } else {
            v.mesh.position.x = Math.sin(idx) * 2.5;
            v.mesh.position.z = Math.sin(p) * 55;
            v.mesh.rotation.y = Math.cos(p) > 0 ? 0 : Math.PI;
          }
        } else if (v.pathType === 1) {
          // Ring Road Loop
          v.mesh.position.x = Math.cos(p) * 52;
          v.mesh.position.z = Math.sin(p) * 52;
          v.mesh.rotation.y = -p + Math.PI / 2;
        } else {
          // East-West Arterial
          v.mesh.position.x = Math.sin(p) * 50;
          v.mesh.position.z = -5 + (idx % 2 === 0 ? 2 : -2);
          v.mesh.rotation.y = Math.cos(p) > 0 ? Math.PI / 2 : -Math.PI / 2;
        }
      });

      // Pedestrian swarm animation
      if (pedestrianGroupRef.current) {
        const positions = pedestrianGroupRef.current.geometry.attributes.position.array;
        for (let i = 0; i < pedestrianCount; i++) {
          positions[i * 3 + 2] += (Math.sin(elapsedTime + i) * 0.05);
          positions[i * 3] += (Math.cos(elapsedTime * 0.8 + i) * 0.05);
        }
        pedestrianGroupRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Building effects (Power failure & selection glow)
      BUILDINGS_DATA.forEach((b) => {
        const meshEntry = buildingMeshesRef.current[b.id];
        if (meshEntry) {
          const isSelected = selectedBuilding?.id === b.id;
          const isHovered = hoveredBuildingRef.current === b.id;
          const isBlackout = params.isBuildingAPowerDown && b.id === 'bldg_a';

          if (isBlackout) {
            meshEntry.window.emissive.setHex(0x000000);
            meshEntry.window.color.setHex(0x111827);
          } else if (isSelected || isHovered) {
            meshEntry.window.emissive.setHex(0x00f0ff);
            meshEntry.window.emissiveIntensity = 0.8 + Math.sin(elapsedTime * 4) * 0.3;
          } else {
            meshEntry.window.emissive.setHex(0x0369a1);
            meshEntry.window.emissiveIntensity = 0.35;
          }
        }
      });

      // Siren beacon rotation if emergency
      if (emergencyGroupRef.current && params.isMainGateBlocked) {
        emergencyGroupRef.current.rotation.y = Math.sin(elapsedTime * 6) * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onDragMove);
      container.removeEventListener('wheel', onWheel);
      if (rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Update Layers Visibility when toggled
  useEffect(() => {
    if (pedestrianGroupRef.current) pedestrianGroupRef.current.visible = !!activeLayers.people;
    if (trafficGroupRef.current) trafficGroupRef.current.visible = !!activeLayers.mobility;
    if (energyLinesGroupRef.current) energyLinesGroupRef.current.visible = !!activeLayers.energy;
    if (emergencyGroupRef.current) emergencyGroupRef.current.visible = !!params.isMainGateBlocked;
  }, [activeLayers, params.isMainGateBlocked]);

  // Quick Camera Presets
  const setPreset = (preset) => {
    setCameraPreset(preset);
    soundFX.playClick();
    if (!cameraRef.current) return;
    if (preset === 'overview') {
      cameraRef.current.position.set(90, 80, 100);
      cameraRef.current.lookAt(0, 0, 0);
    } else if (preset === 'maingate') {
      cameraRef.current.position.set(0, 25, -95);
      cameraRef.current.lookAt(0, 5, -40);
    } else if (preset === 'quad') {
      cameraRef.current.position.set(30, 35, 30);
      cameraRef.current.lookAt(0, 5, -5);
    } else if (preset === 'topdown') {
      cameraRef.current.position.set(0, 160, 1);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  return (
    <div className="campus-canvas-container" ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Camera Controls Floating Bar */}
      <div className="camera-presets-bar">
        <span className="preset-label">VIEWPORT</span>
        <button className={`cam-btn ${cameraPreset === 'overview' ? 'active' : ''}`} onClick={() => setPreset('overview')}>
          🏛️ Overview
        </button>
        <button className={`cam-btn ${cameraPreset === 'maingate' ? 'active' : ''}`} onClick={() => setPreset('maingate')}>
          🚪 Main Gate
        </button>
        <button className={`cam-btn ${cameraPreset === 'quad' ? 'active' : ''}`} onClick={() => setPreset('quad')}>
          📚 Academic Quad
        </button>
        <button className={`cam-btn ${cameraPreset === 'topdown' ? 'active' : ''}`} onClick={() => setPreset('topdown')}>
          🛰️ Top-Down
        </button>
      </div>

      {/* Floating 3D Building Tooltip */}
      {hoveredInfo && (
        <div
          className="canvas-hud-tooltip"
          style={{
            left: `${hoveredInfo.x + 15}px`,
            top: `${hoveredInfo.y - 45}px`,
          }}
        >
          <div className="hud-tooltip-header">
            <span className="hud-cat-tag">{hoveredInfo.building.category}</span>
            <span className="hud-title">{hoveredInfo.building.name}</span>
          </div>
          <div className="hud-tooltip-stats">
            <div className="hud-stat-item">
              <span className="hud-stat-label">Capacity</span>
              <span className="hud-stat-val">{hoveredInfo.building.capacity.toLocaleString()}</span>
            </div>
            <div className="hud-stat-item">
              <span className="hud-stat-label">Occupants</span>
              <span className="hud-stat-val">
                {params.isBuildingAPowerDown && hoveredInfo.building.id === 'bldg_a' ? '0 (EVACUATED)' : hoveredInfo.building.currentOccupants}
              </span>
            </div>
            <div className="hud-stat-item">
              <span className="hud-stat-label">Power Draw</span>
              <span className="hud-stat-val" style={{ color: params.isBuildingAPowerDown && hoveredInfo.building.id === 'bldg_a' ? '#ef4444' : '#00f0ff' }}>
                {params.isBuildingAPowerDown && hoveredInfo.building.id === 'bldg_a' ? '0 kW (TRIPPED)' : `${hoveredInfo.building.basePowerKW} kW`}
              </span>
            </div>
          </div>
          <div className="hud-tooltip-footer">Click to inspect digital twin telemetry</div>
        </div>
      )}

      {/* Active Incident Warning Hologram */}
      {params.isMainGateBlocked && (
        <div className="incident-canvas-badge">
          <span className="incident-pulse"></span>
          🚨 INCIDENT: MAIN GATE BLOCKED — REROUTING TRAFFIC TO WEST PORTAL
        </div>
      )}

      {params.isBuildingAPowerDown && (
        <div className="incident-canvas-badge power-fail">
          <span className="incident-pulse"></span>
          ⚡ SUBSTATION FAULT: BUILDING A BLACKOUT — 1,150 STUDENTS EVACUATED
        </div>
      )}
    </div>
  );
}
