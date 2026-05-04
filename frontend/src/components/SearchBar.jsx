import { useState } from 'react';

// props = information this component receives from App.jsx
function SearchBar({ onSearch, onGeolocate }) {
  const [input, setInput] = useState(''); // What the user is typing

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from reloading when pressing Enter
    if (input.trim()) {
      onSearch(input.trim()); // We call the search function
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="🔍 City, zip code or coordinates (e.g. London, 10001, 51.5,-0.12)"
          className="search-input"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
        <button
          type="button"
          onClick={onGeolocate}
          className="btn btn-secondary"
          title="Use my current location"
        >
          📍 My Location
        </button>
      </form>
      <p className="search-hint">
        You can search by: city name, zip code (5 digits),
        or GPS coordinates (latitude,longitude)
      </p>
    </div>
  );
}

export default SearchBar;