# ☀️ SolarSathi — AI Solar Monitoring Platform

> **Live:** [solarsathi.online](https://solarsathi.online)  
> **GitHub:** [ArpitChb2704/SolarSathi](https://github.com/ArpitChb2704/SolarSathi)

SolarSathi is a full-stack AI-powered solar plant monitoring platform built for Indian rooftop solar owners. It predicts energy generation, tracks performance, sends AI-generated email reports, and provides an intelligent chatbot assistant — all in a premium glassmorphism UI.

---

## 🚀 Features

### ⚡ Core
- **Solar Prediction Engine** — Physics-based inverter simulation using location, tilt, azimuth, and real weather data
- **Performance Tracking** — Actual vs predicted energy with performance ratio
- **7-Day Forecast** — Weekly energy generation forecast per plant
- **Monthly & Annual Analytics** — Full year breakdown with bar charts

### 🤖 AI
- **LangGraph Chatbot** — Intent-routing AI assistant (plant QA, prediction QA, alerts, general)
- **AI Email Reports** — Groq LLM generates personalized plant analysis sent via Gmail API
- **Smart Alerts** — Auto-detects underperforming plants after each prediction run

### 🌤 Insights
- **Live Weather Widget** — Real-time weather at plant location via OpenWeatherMap
- **Carbon Footprint** — CO₂ saved, trees equivalent, cars off road
- **Savings Calculator** — Adjustable ₹/kWh rate shows annual/monthly/daily savings

### 🎨 UX
- **Glassmorphism UI** — Solar panel background with frosted glass cards
- **Onboarding Tour** — First-time user walkthrough
- **Mobile Responsive** — Bottom navigation for mobile, sidebar for desktop
- **PWA Ready** — Installable as a mobile app
- **Bell Alerts** — Real-time notification bell in topbar

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| PostgreSQL + SQLAlchemy | Database & ORM |
| LangGraph | Agentic chatbot workflow |
| Groq (Llama 3.3 70B) | LLM for chat & email reports |
| Gmail API | Email delivery |
| OpenWeatherMap API | Live weather data |
| pvlib / pandas | Solar simulation |
| passlib + jose | Auth & password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI framework |
| Recharts | Charts & visualizations |
| CSS Variables | Design system & theming |
| Syne + DM Sans | Typography |

### Infrastructure
| Service | Purpose |
|---|---|
| Railway | Backend + Frontend hosting |
| Supabase | PostgreSQL database |
| Namecheap | Domain (solarsathi.online) |

---

## 📁 Project Structure

```
SolarSathi/
├── backend/
│   ├── app.py                 # FastAPI app & all endpoints
│   ├── models.py              # SQLAlchemy models
│   ├── chatbot.py             # LangGraph chatbot workflow
│   ├── emailing.py            # Gmail API email sender
│   ├── inverter_simulation.py # Physics-based solar simulation
│   ├── auth.py                # JWT authentication
│   ├── utils.py               # Password hashing
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddPlant.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Chatbot.jsx
│   │   ├── components/
│   │   │   ├── PlantInsights.jsx  # Weather, Carbon, Savings cards
│   │   │   └── OnboardingTour.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── config.js
│   │   └── index.css
│   ├── public/
│   │   ├── logo.png
│   │   ├── manifest.json
│   │   └── sw.js
│   ├── Caddyfile
│   └── package.json
└── README.md
```

---

## 🗄 Database Schema

```
users
├── id (PK)
├── name
├── email
├── hashed_password
└── created_at

plants
├── id (PK)
├── user_id (FK → users)
├── plant_name
├── lat, lon
├── capacity_kw
├── tilt
└── azimuth

predictions
├── id (PK)
├── plant_id (FK → plants)
├── actual_energy
├── predicted_energy
├── performance_ratio
├── annual_energy
├── monthly_energy (JSON)
├── forecast_7_days (JSON)
└── created_at

alerts
├── id (PK)
├── user_id (FK → users)
├── plant_id (FK → plants)
├── plant_name
├── message
├── severity (warning | critical)
├── is_read
└── created_at
```

---

## ⚙️ Local Setup

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://...
export API_KEY=your_groq_api_key
export WEATHER_API_KEY=your_openweathermap_key
export GOOGLE_REFRESH_TOKEN=...
export GOOGLE_CLIENT_ID=...
export GOOGLE_CLIENT_SECRET=...

# Run
uvicorn app:app --reload
```

### Frontend

```bash
cd frontend

npm install
npm run dev
```

Open `http://localhost:5173`

---

## 🚀 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Railway | solarsathi.online |
| Backend | Railway | backend-production-7c98.up.railway.app |
| Database | Supabase | PostgreSQL |

### Railway Environment Variables (Backend)

```
DATABASE_URL=postgresql://...
API_KEY=groq_api_key
WEATHER_API_KEY=openweathermap_key
GOOGLE_REFRESH_TOKEN=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Railway Environment Variables (Frontend)

```
VITE_API_URL=https://backend-production-7c98.up.railway.app
```

---

## 🤖 Chatbot Intent Routing

```
User Message
     ↓
Intent Router
     ↓
┌────────────┬───────────────┬──────────────┬──────────────┐
│  Plant QA  │ Prediction QA │ General Chat │  Alert QA    │
│            │               │              │              │
│  DB Query  │  DB Query     │  LLM Only    │  Analytics   │
└────────────┴───────────────┴──────────────┴──────────────┘
     ↓
LLM Response (Groq Llama 3.3 70B)
     ↓
Session Memory (in-memory, resets on restart)
```

---

## 📧 Email Report Flow

```
User clicks "Email Report"
        ↓
Fetch all plants + latest predictions from DB
        ↓
Build plant summary text
        ↓
Groq LLM generates personalized AI analysis
        ↓
Build dark-themed HTML email with metrics + AI text
        ↓
Gmail API sends to user's registered email
```

---

## 🌱 Carbon Impact Formula

```
CO₂ saved (kg) = annual_kwh × 0.82  (India grid emission factor)
CO₂ saved (tonnes) = CO₂ saved (kg) / 1000
Trees equivalent = CO₂ saved (kg) / 21.77
Cars off road = CO₂ saved (tonnes) / 4.6
```

---



## Screenshots

Add screenshots here:


<img width="2878" height="1624" alt="image" src="https://github.com/user-attachments/assets/efbb5033-e570-46d9-a871-fa1eea41d9ba" />

<img width="1600" height="999" alt="image" src="https://github.com/user-attachments/assets/43ed062b-ec4e-4c14-a5ec-cc70725573fe" />

<img width="1280" height="720" alt="image" src="https://github.com/user-attachments/assets/3fb0e8a7-3089-411f-ac04-10576309a1de" />

<img width="1600" height="913" alt="image" src="https://github.com/user-attachments/assets/eb69a405-7f43-46ec-95c7-9365cf3d53fc" />




---

## Deployment

Frontend and backend deployed with custom domain support:

🌐 https://solarsathi.online

---

## Author

**Arpit Chhabra**

GitHub:
https://github.com/ArpitChb2704


---

## License

This project is developed for educational, research, and portfolio purposes.
