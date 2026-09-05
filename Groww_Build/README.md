# Smart Market Watchlist

> **Intelligent Market Intelligence & Delta Engine**
> A production-grade financial platform engineered to track, detect, explain, and prioritize meaningful asset movements for Indian and global equities based on personal user baselines.

---

## Executive Summary

Traditional financial watchlists present static 24-hour price deltas measured from the previous session's market close. When investors or active traders return to their portfolio after several hours or days, standard 24-hour metrics fail to address three core analytical questions:

1. **Personalized Delta Tracking:** What has meaningfully shifted since the user *personally* last checked?
2. **Contextual Priority:** Which assets within the user's watchlist require immediate risk or opportunity review?
3. **Multivariate Cause Analysis:** Why is the asset moving beyond routine market noise?

**Smart Market Watchlist** addresses this breakdown by decoupling exchange ingestion from individual user state. The platform maintains persistent per-user baselines (`lastSeenPrice`, `lastSeenTimestamp`) and executes an automated multi-signal detection pipeline to surface, explain, and order high-priority market movements.

---

## Key Platform Capabilities

### 1. Multi-Signal Change Detection Engine
Rather than relying on arbitrary single-variable price thresholds, the change engine evaluates a composite weighted severity score across five normalized market heuristics:

* **Price Movement Velocity (30% weight):** Rate of change relative to the user's personal baseline price.
* **Volume Expansion Anomaly (25% weight):** Intraday trading volume relative to the 20-period moving average.
* **Volatility & Range Expansion (15% weight):** Average True Range (ATR) and intraday high-low expansion relative to baseline volatility.
* **Moving Average Crossovers (15% weight):** Price crossing key 20-period and 50-period Simple Moving Averages.
* **Structural Breakouts & Breakdowns (15% weight):** Channel breaches and 20-day high/low boundaries.

#### Severity Classification Matrix
* **High Severity (Score ≥ 70):** Substantial price movement corroborated by volume anomalies or structural breakouts.
* **Medium Severity (Score ≥ 40):** Moderate price shifts accompanied by channel boundary testing.
* **Low Severity (Score < 40):** Standard market noise or minor fractional price updates.

---

### 2. Personal Baseline Management
* **State Isolation:** Decouples global market data ingestion (scheduled symbol polling) from user interaction state (`UserMarketState`).
* **User-Driven Baseline Sync:** When a user reviews their dashboard alerts, acknowledging a change updates their personal snapshot baseline (`lastSeenPrice` = current market price), resetting delta tracking for subsequent sessions.

---

### 3. AI-Assisted Synthesis & Market Briefings
* Generates concise, natural-language narrative explanations for active market signals.
* Translates complex quantitative indicator interactions into actionable financial summaries.

---

### 4. Responsive Mobile Architecture
* **Native Select Controls:** Custom mobile layout components for seamless scenario navigation on compact viewports.
* **Indian Equity Sector Analytics:** Specialized tracking categories including Nifty 50, Sensex, Banking, Information Technology, Auto, and Energy.
* **Interactive Technical Charts:** Multi-timeframe OHLCV candlestick charting (`1D`, `1W`, `1M`, `1Y`) optimized for desktop and touch interfaces.

---

### 5. Enterprise Security & State Invalidation
* **Authentication:** Stateful JWT architecture with HTTP-only cookie security headers and bearer token authorization.
* **Cache Hygiene:** Automated purge of React Query client caches (`queryClient.clear()`) upon session termination to eliminate cross-tenant state bleeding.

---

## Technology Stack

### Frontend Application
* **Framework:** React 18, Vite
* **State Management & Data Fetching:** TanStack Query v5 (React Query)
* **Routing:** React Router v7
* **Styling & UI:** Tailwind CSS, Framer Motion, React Icons

### Backend Infrastructure
* **Runtime & Framework:** Node.js (ES Modules), Express.js
* **Database & ORM:** MongoDB Atlas, Mongoose ODM
* **Security & Middleware:** Zod validation, Helmet.js, CORS, Express Rate Limit

---

## System Architecture & File Structure

```
Groww_Build/
├── client/                      # Frontend Application (Vite + React SPA)
│   ├── public/                  # Static assets & favicon
│   ├── src/
│   │   ├── app/                 # Root wrapper, Router, Global Providers
│   │   ├── components/          # Reusable UI & Layout components
│   │   ├── context/             # LoadingContext state manager
│   │   ├── features/            # Feature modules (Auth, Dashboard, Market, Watchlist, AI)
│   │   ├── lib/                 # Axios HTTP client & Query client instance
│   │   └── styles/              # Global styles & Tailwind configuration
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json              # Vercel SPA routing rules
│   └── .gitignore
│
├── server/                      # Backend API Service (Express.js)
│   ├── api/
│   │   └── index.js             # Vercel Serverless Function entrypoint
│   ├── src/
│   │   ├── config/              # Zod environment schemas, Pino logger, Database connection
│   │   ├── controllers/         # Express request handlers
│   │   ├── middleware/          # Security, Auth, Validation, Error Handling
│   │   ├── models/              # Mongoose Data Models (User, Watchlist, ChangeEvent, UserState)
│   │   ├── routes/              # Express API Route Definitions (/api/v1)
│   │   ├── services/            # Business Logic & Multi-Signal Change Engine
│   │   └── validators/          # Payload validation schemas
│   ├── tests/                   # Integration test suite
│   ├── package.json
│   ├── vercel.json              # Vercel serverless routing configuration
│   └── .gitignore
│
├── .gitignore                   # Workspace root Git configuration
├── package.json                 # Monorepo workspace scripts
└── README.md
```
---
