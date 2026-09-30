# 🌍 WORLD ENGINE
> *“Don't predict the future. Simulate it.”*  
> *“Simulate the real world before changing it.”*

**WORLD ENGINE** is a Google Cloud-powered Digital Twin and Causal AI Simulation platform. It creates a virtual, continuously synchronized copy of a real-world environment, allowing AI and human decision-makers to experiment in simulation before making high-stakes decisions in reality.

The MVP is built as a **College Campus Digital Twin**, demonstrating an architecture that scales smoothly to **University Districts**, **Smart Cities**, **Regional Grids**, and **Planet Earth**.

---

## 🚀 Key Features

### 1. Interactive 3D Campus Digital Twin (Three.js)
- **10 Campus Buildings** with procedural 3D architectural geometry, dynamic window glow, rooftop solar arrays, and capacity badges.
- **Dynamic Mobility Network**:
  - Live animated traffic (cars, two-wheelers, electric shuttles) moving along realistic road splines.
  - Speed automatically adapts to BPR road congestion (green $\rightarrow$ yellow $\rightarrow$ glowing red).
  - Dynamic traffic rerouting: closing the North Main Gate instantly reroutes approaching vehicles to the West Portal.
- **Swarm Pedestrians**: Animated particle swarms representing students entering gates, walking to lecture halls, and queuing at turnstiles.
- **Clickable 3D Buildings**: Raycasting allows clicking any structure to open its real-time telemetry HUD (Occupancy, HVAC Power, Labs, Evacuation readiness).

### 2. Multi-Layer Digital Twin System
Toggle between real-time operational layers:
- 🏢 **Infrastructure Layer**: Structural footprints, capacity gauges, floor breakdowns.
- 👥 **People Layer**: Students, faculty, staff, turnstile entry queues, density indicators.
- 🚗 **Mobility Layer**: Road congestion index, parking bay occupancies (P1, P2, P3, P4).
- ⚡ **Energy Layer**: Power grid load (kW), rooftop solar generation (kW), substation transmission lines.
- 💧 **Resource Layer**: Dining food supplies and water draw (Liters/min).
- 🚨 **Emergency Overlay**: Incident barriers, warning sirens, traffic detours.

### 3. Gemini Causal Reasoning Co-Pilot
- **Natural Language "What-If" Interface**:
  - *"What happens if 5,000 students arrive between 8:30 and 9:00 AM?"*
  - *"Simulate tomorrow's annual fest with 15,000 visitors."*
  - *"What happens if Building A loses electricity?"*
  - *"Test closing the Main Gate and deploying 12 autonomous electric shuttles."*
- **Causal Chain Propagation**: Step-by-step ripple effect modeling ($T+00m \rightarrow T+10m \rightarrow T+18m \rightarrow T+25m$).
- **A/B Decision Engine**: Quantified trade-offs comparing interventions (Scenario A vs B vs C) with impact scores.

### 4. Simulation Time Machine
- Time scrubber from **06:00 to 22:00** with variable speeds (1x, 5x, 20x, 60x).
- Visual day-to-night lighting transitions (Dawn twilight, Midday sun, Golden hour, Cyberpunk night mode).
- Instant milestone jumps: **08:45 AM Peak**, **12:30 PM Lunch Surge**, **05:30 PM Departure**.

### 5. Google Cloud & Vertex AI Architecture
- **Cloud Run**: Serverless simulation microservices and WebSocket synchronization.
- **Gemini / Vertex AI**: Natural-language interpretation and causal graph reasoning.
- **BigQuery**: Streaming IoT telemetry warehouse (turnstile RFID ticks, smart meters, ANPR).
- **Cloud Pub/Sub**: Decoupled asynchronous event broker.
- **Cloud Storage**: Spatial 3D models and GIS maps.
- **Firestore**: Real-time twin state replication.
- Includes an interactive **Live BigQuery Stream Inspector** directly in the UI!

### 6. Universal Scalability Horizon ("Campus → City → Planet")
- **Level 1**: College Campus (Active Simulation Twin)
- **Level 2**: University District & Medical Hub
- **Level 3**: Smart City Digital Twin (1.2M citizens, arterial highways, flood response)
- **Level 4**: State & Regional Power Grid
- **Level 5**: Planet Earth Engine (*Observe $\rightarrow$ Model $\rightarrow$ Simulate $\rightarrow$ Understand $\rightarrow$ Decide*)

### 7. Built-in 3-Minute Hackathon Demo Mode
Single-click guided pitch walkthrough featuring scripted talking points, automated camera views, and live simulation triggers matching the 3-minute hackathon pitch format.

---

## 🛠️ Tech Stack

- **Core**: React 19 + Vite 8
- **3D Graphics**: Three.js (Procedural geometries, raycasting, dynamic lighting)
- **Styling**: Vanilla CSS (Cyberpunk command-center dark mode, glassmorphism, responsive)
- **Typography**: Google Fonts (*Outfit* + *JetBrains Mono*)
- **Icons**: Lucide React
- **Audio Synthesis**: Web Audio API (Zero external MP3 audio assets needed)

---

## 💻 Running Locally

```bash
# Clone the repository
cd "world engine"

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173/`.
