// Shows the 5-day forecast
function ForecastCard({ forecast }) {
  // Converts "2024-01-15" into "Mon Jan 15"
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T12:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="forecast-section">
      <h3>📅 5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day) => (
          <div key={day.date} className="forecast-day">
            <p className="forecast-date">{formatDate(day.date)}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.description}
              className="forecast-icon"
            />
            <p className="forecast-desc">{day.description}</p>
            <p className="forecast-temps">
              <span className="temp-max">↑ {day.temp_max}°</span>
              <span className="temp-min">↓ {day.temp_min}°</span>
            </p>
            <p className="forecast-humidity">💧 {day.humidity}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastCard;