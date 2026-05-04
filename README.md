# 🌤 Weather App — PM Accelerator Technical Assessment

**Developed by:** Laura Valeria Mora Parra
**Assessment:** Full Stack (Tech Assessment #1 + #2)

---

## About PM Accelerator

**Product Manager Accelerator** is a community that accelerates the careers of
aspiring and experienced product managers. It offers mentorship, resources,
networking, and growth opportunities in tech product management.
LinkedIn: https://www.linkedin.com/company/pm-accelerator

---

## What does this app do?

* 🔍 Search weather for any city, zip code, or GPS coordinates
* 📍 Auto-detect your current location
* 📅 Show 5-day forecast
* 💾 Save records to database (SQLite)
* ✏️ Full CRUD: Create, Read, Update, Delete records
* 🗺 Interactive map of the location (OpenStreetMap)
* ▶ YouTube videos about the location
* ⬇ Export data as: JSON, CSV, XML, Markdown, PDF

---

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React + Vite                        |
| Backend  | Node.js + Express                   |
| Database | SQLite                              |
| APIs     | OpenWeatherMap, YouTube Data API v3 |
| Maps     | OpenStreetMap (no API key needed)   |

---

## How to run the project

### Prerequisites

* Node.js 18+ installed (https://nodejs.org)
* OpenWeatherMap API Key (https://openweathermap.org/api)
* YouTube API Key (https://console.cloud.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/weather-app-pm-accelerator.git
cd weather-app-pm-accelerator
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file with your keys:

```
WEATHER_API_KEY=your_openweathermap_key
YOUTUBE_API_KEY=your_youtube_key
PORT=3001
```

Start the backend:

```bash
npm start
```

### 3. Set up the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the app

Go to: **http://localhost:5173**

---

## Features Checklist

* ✅ Flexible search: city, zip code, GPS coordinates
* ✅ Auto geolocation
* ✅ 5-day forecast
* ✅ CRUD with date and location validation
* ✅ Export in 5 formats
* ✅ YouTube videos of the location
* ✅ Interactive map
* ✅ Error handling (city not found, API down, etc.)
* ✅ Responsive design
