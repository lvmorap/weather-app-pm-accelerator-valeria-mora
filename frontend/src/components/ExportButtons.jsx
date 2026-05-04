// Buttons to download records in different formats
function ExportButtons({ apiUrl }) {
  const formats = [
    { key: 'json',     label: '📄 JSON',     color: '#f59e0b' },
    { key: 'csv',      label: '📊 CSV',      color: '#10b981' },
    { key: 'xml',      label: '🏷 XML',      color: '#8b5cf6' },
    { key: 'markdown', label: '📝 Markdown', color: '#3b82f6' },
    { key: 'pdf',      label: '📕 PDF',      color: '#ef4444' },
  ];

  const handleExport = (format) => {
    // Opens the download URL in a new tab
    window.open(`${apiUrl}/api/export/${format}`, '_blank');
  };

  return (
    <div className="export-section">
      <h3>⬇ Export Data</h3>
      <p>Download all saved records in your preferred format:</p>
      <div className="export-buttons">
        {formats.map(f => (
          <button
            key={f.key}
            onClick={() => handleExport(f.key)}
            className="btn btn-export"
            style={{ borderColor: f.color, color: f.color }}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ExportButtons;