import React, { useEffect, useState } from 'react';
import './TopStories.css';

type Article = {
  id: string;
  title: string;
  url: string;
  author: string;
  points: string;
  content: string;
  created_at: string;
};

const TopStories: React.FC = () => {
  const [stories, setStories] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStories = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/articles');
    const text = await res.text();
    console.log('Raw response text:', text);
    const data = JSON.parse(text);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
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
                  <span>{story.points}</span> |{' '}
                  <span>by {story.author	 || 'unknown'}</span> |{' '}
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
