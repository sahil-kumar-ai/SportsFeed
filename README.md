# SportsFeed

**SportsFeed** is a real-time sports data backend for live match creation, commentary ingestion, and low-latency fan-out to connected clients over WebSockets.

Built for modern live-score and match-tracking products, SportsFeed combines a clean REST API, PostgreSQL persistence, schema-safe validation, and real-time event delivery in one service.

## Key Capabilities

- Real-time match and commentary delivery over WebSockets
- REST APIs for match creation and commentary ingestion
- PostgreSQL-backed persistence with Drizzle ORM
- Request validation with Zod
- API and WebSocket protection with Arcjet
- Seed tooling for demo and local testing
- Designed for **sub-200 ms live update targets** under normal deployment conditions

---

## Why SportsFeed

Most sports dashboards fail on one of two things: slow update propagation or messy backend structure.

SportsFeed is designed to solve both.

It provides a structured backend for ingesting live commentary, persisting match data, and instantly pushing updates to subscribed clients. This makes it suitable for:

- live score platforms
- sports commentary timelines
- match center products
- betting-adjacent live data dashboards
- second-screen fan engagement apps
- internal real-time event feeds

---

## Architecture Overview

SportsFeed follows a simple event flow:

1. A match is created through the REST API
2. Commentary is posted to a match
3. The event is persisted in PostgreSQL
4. Connected WebSocket clients subscribed to that match receive the update immediately

This architecture keeps ingestion simple while enabling real-time delivery to frontend dashboards, admin panels, or mobile clients.

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
