import React from 'react';
import './Tabs.css';

interface TabNavigationProps {
  activeTab: string | null;
  setActiveTab: React.Dispatch<React.SetStateAction<string | null>>;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ['About', 'Top Stories', 'Test Dashboard', '🚧 Keyword Search 🚧', '🚧 Point Dashboard 🚧', '🚧 Dev Sandbox 🚧'];

  return (
    <div className="tab-nav">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-button ${tab === activeTab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
