import React from 'react';

const Logs: React.FC = () => {
return (
<div className="logs-page">
    <h2>Project Logs</h2>

    <div className="log-entry">
        <div className="log-date">{new Date().toLocaleDateString('en-US')} — Currently in progress</div>
        <p> 
        { /* Still need to add more accessibility options for the UI, optimize test dashboard, and implement automated tests for the site. <br />
            Frontend and backend for live streaming test results both need some work before the feature can be deployed.*/}
        </p>
    </div>

    <div className="log-entry">
        <div className="log-date">7/16/2025</div>
        <p>
            Official public launch with MVP, new and improved URL.<br /> 
            Polished UI, added Logs page, and finalized test dashboard.<br /> 
            Added backend logic and routes for live scraping test results.<br /> 
        </p>
    </div>

    <div className="log-entry">
        <div className="log-date">7/14/2025</div>
        <p>
            Refined website UI and styling, added a dark mode toggle.<br />
            Improved code structure, styling, and accessibility.<br />
            Refined test dashbord to display more information and updated UI.<br />
            Set up backend routes to live stream updates and information so I can add a few longer running tests. Reverted front end to simpler test dashboard layout without streaming results. TODO Add dropdown for live updates in test dashboard<br />
            Wrote about page and prepared the project for deployment.<br />
        </p>
    </div>

    <div className="log-entry">
        <div className="log-date">7/11/2025</div>
        <p>
            Added espress API routes to integrate with frontend.<br />
            Set up basic react UI sturcuture with minimal styling.<br />
            Built fully integrated top stories tab.<br />
            Connected SQLite database for basic data persistence for test results.<br />
            Built initial dashboard for test results, connected backend API, and added a few more tests.<br />
            Set up Git repo and deployed at <a href='https://hackernewsscraper.onrender.com' >temporary URL </a> for testing.
        </p>
    </div>

    <div className="log-entry">
        <div className="log-date">7/7/2025</div>
        <p>
            Finalized tech stack and learned core tools: TypeScript, React, Chrome DevTools, Node.js, Express, Playwright. <br />
            Began adding typing for more robustness and easier integration.<br />
            Built backend logic for automated testing and top stories.<br />
        </p>
    </div>

    <div className="log-entry">
        <div className="log-date">6/23/2025</div>
        <p>
            Wrote Playwright script to scrape Hacker News and validate the first 100 newest articles as a basic prototype. <br />
            Defined feature goals and project MVP: Deployed website with modern UI, custom web scraper, and test dashboard to display results.
        </p>
    </div>
    </div>
);
};

export default Logs;