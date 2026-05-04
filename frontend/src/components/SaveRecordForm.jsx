import { useState } from 'react';

// Form to save a record to the database
function SaveRecordForm({ location, apiUrl }) {
  const today = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo]     = useState(today);
  const [message, setMessage]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${apiUrl}/api/records`, {
        method: 'POST', // POST = create new data
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, date_from: dateFrom, date_to: dateTo }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setMessage(`✅ ${data.message}`);

    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="save-form">
      <h4>💾 Save to Database</h4>
      <p>Location: <strong>{location}</strong></p>
      
      <div className="date-inputs">
        <div className="date-group">
          <label>Start date:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="date-group">
          <label>End date:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            min={dateFrom}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="btn btn-save"
      >
        {loading ? '⏳ Saving...' : '💾 Save Record'}
      </button>

      {message && <p className="success-msg">{message}</p>}
      {error   && <p className="error-msg">{error}</p>}
    </div>
  );
}

export default SaveRecordForm;