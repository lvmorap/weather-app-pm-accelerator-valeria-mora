// Shows a map of the location using OpenStreetMap (free, no API Key needed)
function MapView({ lat, lon, location }) {
  // Build the map URL with the coordinates
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.15},${lat - 0.15},${lon + 0.15},${lat + 0.15}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div className="map-section">
      <h3>🗺 Map: {location}</h3>
      <iframe
        title={`Map of ${location}`}
        src={mapUrl}
        width="100%"
        height="350"
        frameBorder="0"
        scrolling="no"
        style={{ borderRadius: '12px', border: '2px solid #e5e7eb' }}
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`}
        target="_blank"
        rel="noreferrer"
        className="map-link"
      >
        🔗 View full map
      </a>
    </div>
  );
}

export default MapView;