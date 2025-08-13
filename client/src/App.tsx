import { useEffect } from 'react';
import './App.css';
import TopStories from './components/TopStories';
import { useTheme } from './components/ThemeContext';


function App() {
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="App">
      <header className="app-header">
        <button className="clickable-header" onClick={() => window.location.reload()}>
          Hacker News Hub
        </button>

        <div className="header-actions">
          <label className="toggle-switch" aria-label="Toggle dark mode">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <span className="slider">
              <span className="icon light"></span>
              <span className="icon dark">🌙</span>
            </span>
          </label>
          <a
            className="feedback-button"
            href="https://hackernewshub.online"
          >
            
          </a>
        </div>
      </header>

      <main className="app-body">
        <section className="tab-content">
          <div>
            <TopStories />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App;
