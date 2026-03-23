# SportsFeed

A real-time sports feed backend for creating matches, storing live commentary, and broadcasting updates over WebSockets.

## Overview

SportsFeed is a backend service built with Node.js, Express, PostgreSQL, Drizzle ORM, and WebSockets. It lets you:

- create and list matches
- add and fetch match commentary
- broadcast new matches in real time
- broadcast commentary updates to subscribed clients
- seed sample sports data through REST APIs

This project is useful as a base for a live scorecard, match tracker, or sports dashboard application.

---

## Tech Stack

- **Node.js**
- **Express**
- **PostgreSQL**
- **Drizzle ORM**
- **WebSocket (`ws`)**
- **Zod**
- **Arcjet**
- **dotenv**

---

## Features

- REST API for match management
- REST API for match commentary
- Real-time WebSocket updates
- PostgreSQL schema for matches and commentary
- Request validation using Zod
- Basic API and WebSocket protection using Arcjet
- Seed script for loading demo match/commentary data

---

## Project Structure

```bash
SportsFeed/
├── drizzle/
├── src/
│   ├── data/
│   ├── db/
│   │   ├── db.js
│   │   └── schema.js
│   ├── routes/
│   │   ├── commentary.js
│   │   └── matches.js
│   ├── seed/
│   │   └── seed.js
│   ├── utils/
│   ├── validation/
│   │   ├── commentary.js
│   │   └── matches.js
│   ├── ws/
│   │   └── server.js
│   ├── arcjet.js
│   └── index.js
├── drizzle.config.js
├── package.json
└── README.md
