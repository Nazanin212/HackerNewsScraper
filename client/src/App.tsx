import { useEffect, useState } from 'react';
import './App.css';
import TabNavigation from './components/TabNavigation';
import About from './components/About';
import TopStories from './components/TopStories';
import TestDashboard from './components/TestDashboard';
//import KeywordSearch from './components/KeywordSearch';


function App() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const renderContent = () => {
    switch (activeTab) {
      case 'About':
        return <About />;        
      case 'Test Dashboard':
        return <TestDashboard />;
      case 'Keyword Search':
        return null;
        //return <KeywordSearch />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <button className="clickable-header" onClick={() => window.location.reload()}>
          Hacker News Hub
        </button>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="header-actions">
          <label className="toggle-switch" aria-label="Toggle dark mode">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(prev => !prev)}
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
          {!activeTab ? (
          <div>
            <TopStories />;
          </div>
          ) : (
            renderContent()
          )}
        </section>
      </main>
    </div>
  );
}

export default App;