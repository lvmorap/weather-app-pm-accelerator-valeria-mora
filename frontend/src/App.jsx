import { useState } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import RecordsTable from './components/RecordsTable';
import SaveRecordForm from './components/SaveRecordForm';
import MapView from './components/MapView';
import YoutubeVideos from './components/YoutubeVideos';
import ExportButtons from './components/ExportButtons';
import './App.css';

// The URL of our backend server
const API_URL = 'http://localhost:3001';

function App() {
  // "useState" = store information that can change on screen
  const [weather, setWeather]     = useState(null);  // Current weather data
  const [forecast, setForecast]   = useState([]);    // 5-day forecast
  const [loading, setLoading]     = useState(false); // Is it loading?
  const [error, setError]         = useState('');    // Error message
  const [activeTab, setActiveTab] = useState('weather'); // Active tab

  // Function that runs when the user searches a city
  const handleSearch = async (location) => {
    setLoading(true);
    setError('');
    setWeather(null);
    setForecast([]);

    try {
      // Request current weather and forecast at the same time
      const [weatherRes, forecastRes] = await Promise.all([
        fetch(`${API_URL}/api/weather?location=${encodeURIComponent(location)}`),
        fetch(`${API_URL}/api/forecast?location=${encodeURIComponent(location)}`),
      ]);

      if (!weatherRes.ok) {
        const err = await weatherRes.json();
        throw new Error(err.error || 'Location not found');
      }

      const weatherData  = await weatherRes.json();
      const forecastData = forecastRes.ok ? await forecastRes.json() : [];

      setWeather(weatherData);
      setForecast(forecastData);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to use the user's GPS location
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Your browser does not support geolocation');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        handleSearch(`${latitude},${longitude}`);
      },
      () => {
        setLoading(false);
        setError('Could not get your location. Please allow access in the browser.');
      }
    );
  };

  return (
    <div className="app">
      {/* ── HEADER ── */}
      <header className="app-header">
        <h1>🌤 Weather App</h1>
        <p className="author">Developed by: <strong>[Valeria Mora]</strong></p>
        <div className="pm-info">
          <strong>PM Accelerator</strong> — Product Manager Accelerator is a community
          for product managers that accelerates their careers through mentorship,
          resources, and networking. It connects aspiring and experienced professionals
          with growth opportunities in tech product management.
        </div>
      </header>

      {/* ── TABS ── */}
      <nav className="tabs">
        <button
          className={activeTab === 'weather' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('weather')}
        >🌡 Weather</button>
        <button
          className={activeTab === 'records' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('records')}
        >📋 Records</button>
      </nav>

      <main className="content">
        {/* ── WEATHER TAB ── */}
        {activeTab === 'weather' && (
          <div>
            <SearchBar onSearch={handleSearch} onGeolocate={handleGeolocation} />

            {loading && (
              <div className="loading">
                <span className="spinner">⏳</span> Searching...
              </div>
            )}

            {error && (
              <div className="error-box">
                ❌ {error}
              </div>
            )}

            {weather && (
              <>
                <WeatherCard weather={weather} />
                <SaveRecordForm location={weather.location} apiUrl={API_URL} />
                {forecast.length > 0 && <ForecastCard forecast={forecast} />}
                <MapView lat={weather.lat} lon={weather.lon} location={weather.location} />
                <YoutubeVideos location={weather.location} apiUrl={API_URL} />
              </>
            )}
          </div>
        )}

        {/* ── RECORDS TAB ── */}
        {activeTab === 'records' && (
          <div>
            <ExportButtons apiUrl={API_URL} />
            <RecordsTable apiUrl={API_URL} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;