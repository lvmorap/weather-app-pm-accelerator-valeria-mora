import { useState, useEffect, useCallback } from 'react';

// Table showing all saved records with edit/delete options
function RecordsTable({ apiUrl }) {
  const [records, setRecords]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editingId, setEditingId] = useState(null); // ID of the record being edited
  const [editData, setEditData]   = useState({});   // Edit form data
  const [message, setMessage]     = useState('');

  // Load records from backend
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/records`);
      const data = await response.json();
      setRecords(data);
    } catch {
      setMessage('❌ Error loading records');
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  // Runs when the page loads
  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // Delete a record
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`${apiUrl}/api/records/${id}`, {
        method: 'DELETE' // DELETE = remove data
      });
      const data = await response.json();
      setMessage(data.message);
      fetchRecords(); // Reload the list
    } catch {
      setMessage('❌ Error deleting record');
    }
  };

  // Start editing
  const handleEdit = (record) => {
    setEditingId(record.id);
    setEditData({
      location:  record.location.split(',')[0], // Only the city name
      date_from: record.date_from,
      date_to:   record.date_to,
    });
  };

  // Save edit
  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/api/records/${id}`, {
        method: 'PUT', // PUT = update data
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessage(data.message);
      setEditingId(null);
      fetchRecords();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  if (loading) return <div className="records-section"><p>⏳ Loading records...</p></div>;

  return (
    <div className="records-section">
      <h3>📋 Saved Records ({records.length})</h3>
      
      {message && (
        <div className={message.startsWith('❌') ? 'error-box' : 'success-box'}>
          {message}
        </div>
      )}

      {records.length === 0 ? (
        <p className="no-records">
          No records yet. Search for a city and save it using the "💾 Save Record" button.
        </p>
      ) : (
        <div className="records-list">
          {records.map(record => (
            <div key={record.id} className="record-card">
              {editingId === record.id ? (
                /* ── EDIT MODE ── */
                <div className="edit-form">
                  <h4>✏️ Editing record #{record.id}</h4>
                  <div className="edit-fields">
                    <div>
                      <label>City:</label>
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>Start date:</label>
                      <input
                        type="date"
                        value={editData.date_from}
                        onChange={(e) => setEditData({ ...editData, date_from: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>End date:</label>
                      <input
                        type="date"
                        value={editData.date_to}
                        onChange={(e) => setEditData({ ...editData, date_to: e.target.value })}
                        min={editData.date_from}
                      />
                    </div>
                  </div>
                  <div className="edit-actions">
                    <button onClick={() => handleUpdate(record.id)} className="btn btn-primary">✅ Save</button>
                    <button onClick={() => setEditingId(null)} className="btn btn-secondary">❌ Cancel</button>
                  </div>
                </div>
              ) : (
                /* ── VIEW MODE ── */
                <div className="record-view">
                  <div className="record-info">
                    <img
                      src={`https://openweathermap.org/img/wn/${record.icon}@2x.png`}
                      alt={record.description}
                      className="record-icon"
                    />
                    <div>
                      <strong>📍 {record.location}</strong>
                      <p>📅 {record.date_from} → {record.date_to}</p>
                      <p>🌡 {record.temperature}°C | {record.description} | 💧 {record.humidity}%</p>
                      <p className="record-date">Saved: {new Date(record.created_at).toLocaleString('en-US')}</p>
                    </div>
                  </div>
                  <div className="record-actions">
                    <button onClick={() => handleEdit(record)} className="btn btn-edit">✏️ Edit</button>
                    <button onClick={() => handleDelete(record.id)} className="btn btn-delete">🗑 Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecordsTable;