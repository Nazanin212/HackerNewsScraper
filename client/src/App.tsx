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
      case 'Top Stories':
        return <TopStories />;
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
            href="todo"
          >
            
          </a>
        </div>
      </header>

      <main className="app-body">
        <section className="tab-content">
          {!activeTab ? (
            <div className="welcome-message">
              <h1>👋 Welcome!</h1>
                <p>
                  This demo is my first end-to-end deployment, built as a way to dive into full-stack development after wanting to explore it for a long time. It's been a hands-on opportunity to build something real while learning by doing.
                </p>
                <h4>Explore the Project</h4>
                  <p>
                    Take a look around, the Top Stories tab pulls live Hacker News data, while the Test Dashboard shows automated test results powered by Playwright.
                  </p>
                  <p>
                    You can also visit the About section for technical details and check the logs for development updates and what's coming next.
                  </p>
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