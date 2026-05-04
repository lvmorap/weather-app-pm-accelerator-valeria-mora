// Receives weather data and displays it in a nice card
function WeatherCard({ weather }) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
  
  // Function to describe wind speed
  const windDescription = (speed) => {
    if (speed < 0.3) return '🌬 Calm';
    if (speed < 3.3) return '💨 Light breeze';
    if (speed < 7.9) return '💨 Moderate breeze';
    return '🌪 Strong wind';
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div>
          <h2 className="location-name">
            📍 {weather.location}, {weather.country}
          </h2>
          <p className="weather-desc">{weather.description}</p>
        </div>
        <img src={iconUrl} alt={weather.description} className="weather-icon" />
      </div>

      <div className="temperature-main">
        {weather.temperature}°C
      </div>
      <p className="feels-like">Feels like: {weather.feels_like}°C</p>
      <p className="temp-range">↓ {weather.temp_min}°C  ↑ {weather.temp_max}°C</p>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{weather.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <span className="detail-label">Wind</span>
          <span className="detail-value">{weather.wind_speed} m/s</span>
          <span className="detail-extra">{windDescription(weather.wind_speed)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">👁</span>
          <span className="detail-label">Visibility</span>
          <span className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🌡</span>
          <span className="detail-label">Pressure</span>
          <span className="detail-value">{weather.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;