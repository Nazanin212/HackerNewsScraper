import React, { useEffect, useState } from 'react';
import './TopStories.css';

type Story = {
  title: string;
  url: string;
  score: string;
  user: string;
  comments: string;
  id?: string | number;
};

const TopStories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStories = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/top-stories');
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const data = await res.json();
      setStories(data);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to Fetch Stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  return (
    <div className="top-stories-container">
      <h1>Hacker News Top Stories</h1>
      {error && <h2 className="error-container">{error}</h2>}
      <button
        className={`refresh-button ${loading ? 'loading' : ''}`}
        onClick={loadStories}
        aria-label="Refresh stories"
        disabled={loading}
        >
        {loading ? '' : '↻'}
      </button>

      <div className="story-list-wrapper">
        <ul className="story-list">
          {loading ? (
            <li className="loading-placeholder">Loading top stories...</li>
          ) : (
            stories.map((story, i) => (
              <li key={story.id ?? i}>
                <a href={story.url} target="_blank" rel="noopener noreferrer">
                  {story.title}
                </a>
                <div>
                  <span>{story.score}</span> |{' '}
                  <span>by {story.user || 'unknown'}</span> |{' '}
                  <span>{story.comments}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <p className="disclaimer">
        Content is sourced from{' '}
        <a
          href="https://news.ycombinator.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Hacker News
        </a> I do not own or represent it. This project is for educational and demonstration purposes only.
      </p>
    </div>
  )
};

export default TopStories;
