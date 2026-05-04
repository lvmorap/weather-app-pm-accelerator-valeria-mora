import { useState, useEffect } from 'react';

// Shows YouTube videos about the searched location
function YoutubeVideos({ location, apiUrl }) {
  const [videos, setVideos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // useEffect = runs something when the component appears or when "location" changes
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiUrl}/api/youtube?location=${encodeURIComponent(location)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setVideos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [location, apiUrl]);

  if (loading) return <div className="yt-section"><p>⏳ Loading videos...</p></div>;

  if (error) return (
    <div className="yt-section">
      <h3>▶ Videos about {location}</h3>
      <p className="error-msg">⚠️ {error}</p>
      <a
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(location + ' travel')}`}
        target="_blank"
        rel="noreferrer"
        className="btn btn-secondary"
      >
        Search on YouTube manually
      </a>
    </div>
  );

  return (
    <div className="yt-section">
      <h3>▶ Videos about {location}</h3>
      <div className="yt-grid">
        {videos.map(video => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noreferrer"
            className="yt-card"
          >
            <img src={video.thumbnail} alt={video.title} className="yt-thumb" />
            <div className="yt-info">
              <p className="yt-title">{video.title}</p>
              <p className="yt-channel">📺 {video.channel}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default YoutubeVideos;