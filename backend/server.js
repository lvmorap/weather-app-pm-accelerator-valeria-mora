// ================================================================
// WEATHER APP - Created by LAURA VALERIA MORA PARRA :) - BACKEND (Server)
// ================================================================
// Main server file: handles requests, APIs, database, responses
// ================================================================

require('dotenv').config(); // Load environment variables from .env
const express = require('express'); // Web server framework
const cors = require('cors'); // Allow frontend-backend communication
const axios = require('axios'); // Make HTTP requests to APIs
const sqlite3 = require('sqlite3'); 
const { open } = require('sqlite'); // Database helper
const PDFDocument = require('pdfkit'); // Generate PDFs
const { XMLBuilder } = require('fast-xml-parser'); // Generate XML

const app = express(); // Create server instance
const PORT = process.env.PORT || 3001; // Use .env port or default
const WEATHER_API_KEY = process.env.WEATHER_API_KEY; // Weather API key
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // YouTube API key

// ── BASIC CONFIG ─────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' })); // Allow frontend access
app.use(express.json()); // Allows receiving data in JSON format

// ── DATABASE ─────────────────────────────────────────────
let db; // Database variable

async function initDatabase() {
  db = await open({
    filename: './weather.db', // Database file
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS weather_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location TEXT NOT NULL,
      date_from TEXT NOT NULL,
      date_to TEXT NOT NULL,
      temperature REAL,
      feels_like REAL,
      description TEXT,
      humidity INTEGER,
      wind_speed REAL,
      icon TEXT,
      lat REAL,
      lon REAL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `); // Create table if not exists

  console.log('Database ready');
}

// ── ROUTES ───────────────────────────────────────────────

// 1. CURRENT WEATHER
app.get('/api/weather', async (req, res) => {
  const location = req.query.location; // Get user input

  if (!location) {
    return res.status(400).json({ error: 'Location required' });
  }

  try {
    let url;

    const isCoordinates = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(location); // Check lat,lon
    const isZipCode = /^\d{5}$/.test(location); // Check zip code

    if (isCoordinates) {
      const [lat, lon] = location.split(',');
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat.trim()}&lon=${lon.trim()}&appid=${WEATHER_API_KEY}&units=metric`;
    } else if (isZipCode) {
      url = `https://api.openweathermap.org/data/2.5/weather?zip=${location},us&appid=${WEATHER_API_KEY}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`;
    }

    const response = await axios.get(url); // Call weather API
    const d = response.data;

    res.json({
      location: d.name,
      country: d.sys.country,
      lat: d.coord.lat,
      lon: d.coord.lon,
      temperature: Math.round(d.main.temp),
      feels_like: Math.round(d.main.feels_like),
      humidity: d.main.humidity,
      description: d.weather[0].description,
      icon: d.weather[0].icon,
      wind_speed: d.wind.speed,
    }); // Send clean data

  } catch (err) {
    res.status(500).json({ error: 'Weather API error' });
  }
});

// 2. FORECAST (5 DAYS)
app.get('/api/forecast', async (req, res) => {
  const location = req.query.location;

  if (!location) {
    return res.status(400).json({ error: 'Location required' });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await axios.get(url);

    const forecast = response.data.list.map(item => ({
      date: item.dt_txt.split(' ')[0],
      temp_max: item.main.temp_max,
      temp_min: item.main.temp_min,
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon
    }));

    res.json(forecast);

  } catch (err) {
    res.status(500).json({ error: 'Forecast error' });
  }
});

// 3. CREATE RECORD

app.post('/api/records', async (req, res) => {
  const { location, date_from, date_to } = req.body;

  if (!location || !date_from || !date_to) {
    return res.status(400).json({ error: 'Missing data' });
  }

  try {
    // Obtener clima actual
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${WEATHER_API_KEY}&units=metric`;
    const weatherRes = await axios.get(weatherUrl);
    const d = weatherRes.data;

    // Guardar en DB
    const result = await db.run(
      `INSERT INTO weather_records 
       (location, date_from, date_to, temperature, feels_like, description, humidity, wind_speed, icon, lat, lon)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        d.name,
        date_from,
        date_to,
        Math.round(d.main.temp),
        Math.round(d.main.feels_like),
        d.weather[0].description,
        d.main.humidity,
        d.wind.speed,
        d.weather[0].icon,
        d.coord.lat,
        d.coord.lon
      ]
    );

    res.json({ message: 'Record saved successfully', id: result.lastID });

  } catch (err) {
    res.status(500).json({ error: 'Insert error' });
  }
});

// 4. READ RECORDS
app.get('/api/records', async (req, res) => {
  const records = await db.all('SELECT * FROM weather_records');
  res.json(records); // Return all records
});

// 5. DELETE RECORD
app.delete('/api/records/:id', async (req, res) => {
  await db.run('DELETE FROM weather_records WHERE id=?', [req.params.id]);
  res.json({ message: 'Deleted' }); // Delete record
});

// 5.1 UPDATE RECORD  
app.put('/api/records/:id', async (req, res) => {
  const { location, date_from, date_to } = req.body;

  if (!location || !date_from || !date_to) {
    return res.status(400).json({ error: 'Missing data' });
  }

  if (date_from > date_to) {
    return res.status(400).json({ error: 'Start date cannot be after end date' });
  }

  try {
    await db.run(
      `UPDATE weather_records 
       SET location=?, date_from=?, date_to=? 
       WHERE id=?`,
      [location, date_from, date_to, req.params.id]
    );

    res.json({ message: 'Updated successfully' });

  } catch (err) {
    res.status(500).json({ error: 'Update error' });
  }
});

// 6. YOUTUBE VIDEOS
app.get('/api/youtube', async (req, res) => {
  const location = req.query.location;

  if (!location) {
    return res.status(400).json({ error: 'Location required' });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(location + " travel")}&type=video&maxResults=6&key=${YOUTUBE_API_KEY}`;

    const response = await axios.get(url);

    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url
    }));

    res.json(videos);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'YouTube API error' });
  }
});

// 7. EXPORT JSON
app.get('/api/export/json', async (req, res) => {
  try {
    const records = await db.all('SELECT * FROM weather_records');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Export JSON error' });
  }
});

// 8. EXPORT CSV
app.get('/api/export/csv', async (req, res) => {
  try {
    const records = await db.all('SELECT * FROM weather_records');

    let csv = 'id,location,date_from,date_to,temperature,humidity\n';

    records.forEach(r => {
      csv += `${r.id},${r.location},${r.date_from},${r.date_to},${r.temperature},${r.humidity}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('weather.csv');
    res.send(csv);

  } catch (err) {
    res.status(500).json({ error: 'CSV export error' });
  }
});

// 9. EXPORT MARKDOWN
app.get('/api/export/markdown', async (req, res) => {
  try {
    const records = await db.all('SELECT * FROM weather_records');

    let md = '# Weather Records\n\n';

    records.forEach(r => {
      md += `## ${r.location}\n`;
      md += `- Dates: ${r.date_from} → ${r.date_to}\n`;
      md += `- Temp: ${r.temperature}°C\n`;
      md += `- Humidity: ${r.humidity}%\n\n`;
    });

    res.header('Content-Type', 'text/markdown');
    res.send(md);

  } catch (err) {
    res.status(500).json({ error: 'Markdown export error' });
  }
});

// 10. EXPORT XML
app.get('/api/export/xml', async (req, res) => {
  try {
    const records = await db.all('SELECT * FROM weather_records');

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true
    });

    const xmlData = {
      weather_records: {
        record: records
      }
    };

    const xml = builder.build(xmlData);

    res.header('Content-Type', 'application/xml');
    res.send(xml);

  } catch (err) {
    res.status(500).json({ error: 'XML export error' });
  }
});

// 11. EXPORT PDF
app.get('/api/export/pdf', async (req, res) => {
  try {
    const records = await db.all('SELECT * FROM weather_records');

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=weather.pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Weather Records', { align: 'center' });
    doc.moveDown();

    records.forEach(r => {
      doc
        .fontSize(12)
        .text(`Location: ${r.location}`)
        .text(`Dates: ${r.date_from} → ${r.date_to}`)
        .text(`Temperature: ${r.temperature || 'N/A'} °C`)
        .text(`Humidity: ${r.humidity || 'N/A'}%`)
        .text('-----------------------------');
      doc.moveDown();
    });

    doc.end();

  } catch (err) {
    res.status(500).json({ error: 'PDF export error' });
  }
});

// ── START SERVER ─────────────────────────────────────────
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); // Start server
  });
});