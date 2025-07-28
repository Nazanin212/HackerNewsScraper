# Hacker News Scraper +

Scrapes the latest stories from [Hacker News](https://news.ycombinator.com/) and displays them in a clean UI. 

A side project to explore end-to-end development and automated website testing using Playwright.

---

## Getting Started

### Install Dependencies

```bash
npm install
```

---

### Start the Frontend

```bash
npm start
```

> Runs the frontend development server (typically on `http://localhost:3000`).

---

### Start the Backend

```bash
npm run dev
```

> Runs the backend server (`http://localhost:4000`).

---

## Automated Testing with Playwright

To install Playwright:

```bash
npx playwright install
```

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js / Express, SQLite
- **Testing:** Playwright

---

## Project Structure

```
/client                 # React frontend  
├── /src
│   └── /components     # Reusable UI components and styles
│       └── ...         # Add more components here

/server                 # Backend server  
├── cache.db            # Local SQLite database file
├── db.ts               # DB connection logic
├── server.ts           # API entry point
└── /routes             # All backend route handlers
    └── ...             # Add more routes here

/tests                  # Automated tests
└── ...                 # Add more tests here
```
