import React from 'react';
import './About.css';
import Logs from './Logs';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-container">
        <h1>About This Project</h1>

        <p>
          This project began as a simple Playwright automation script for interacting with
          {' '}
          <a href="https://news.ycombinator.com/" target="_blank" rel="noopener noreferrer">
            Hacker News
          </a>
          {''}
          , but quickly evolved into a full-stack experimental demo for exploring end-to-end web development. It fetches live data directly from the Hacker News website (without using public APIs), runs automated Playwright tests, and displays real-time results in a custom dashboard.
        </p>
        <p>
          The app is built as a learning sandbox, with a focus on clean architecture and modern full-stack practices. I'm actively maintaining and expanding the project with new features and improvements.
        </p>

        <h3>Tech Stack</h3>
          <ul>
            <li><a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a> + <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">TypeScript</a></li>
            <li><a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js</a> + <a href="https://expressjs.com/" target="_blank" rel="noopener noreferrer">Express</a></li>
            <li><a href="https://playwright.dev/" target="_blank" rel="noopener noreferrer">Playwright</a></li>
            <li><a href="https://www.sqlite.org/index.html" target="_blank" rel="noopener noreferrer">SQLite</a></li>
          </ul>

        <h3>🛠️ Features 🛠️</h3>
          <ul>
            <li><strong>Live Scraping:</strong> Scrapes and displays top Hacker News stories in a clean UI</li>
            <li><strong>Automated Testing:</strong> Runs scheduled Playwright tests to validate content and links</li>
            <li><strong>Live Dashboard:</strong> View test results in real-time</li>
            <li><strong>Dark Mode:</strong> Accessible toggle for light/dark themes</li>
            <li><strong>Modular Architecture:</strong> Clean separation of frontend, backend, and test layers</li>
          </ul>

        <h3>🚧 In Progress 🚧</h3>
          <ul>
            <li>Feedback submission form</li>
            <li>Enhancements to test dashboard (Live scraping feed, filtering, user inputs)</li>
            <li>Keyword search for stories</li>
            <li>Point and ranking tracking for stories</li>
            <li>Site wide accessability and error improvements</li>
            <li>Continuous performance optimization</li>
          </ul>

        <h3>Planned stack for website tests </h3>
          <ul>
            <li>Jest - Unit Tests</li>
            <li>Supertest - Integration Tests</li>
            <li>Playwright - E2E Tests</li>
          </ul>

        <h3>GitHub</h3>
          <p>
            Click 
            {' '}
            <a href="https://github.com/Nazanin212/HackerNewsScraper.git" target="_blank" rel="noopener noreferrer">
              here 
            </a>
            {' '}
            to view my GitHub source repo.
          </p>
      </section>

      <div className="logs">
       < Logs />
      </div>
    </div>
  );
};

export default About;