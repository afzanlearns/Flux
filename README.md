# Flux

**Your money, clearly.** A personal finance tracker that works offline — no bank integration, no accounts to link, just you and your numbers.

### Features

- **Dashboard** — net worth at a glance with income, expenses, and balance breakdown
- **Transactions** — log and categorize every inflow and outflow
- **Subscriptions** — track recurring payments and get alerted to duplicates
- **Debts** — monitor loans and celebrate milestones
- **Insights** — spending charts, patterns, and monthly snapshots
- **Offline-first** — everything stored locally in IndexedDB. Works without internet.
- **PWA** — install on your phone or desktop for a native-like experience

### Tech

React, Vite, Tailwind CSS v4, Recharts, Lucide icons, IndexedDB (idb), Workbox (PWA).

### Run locally

```bash
npm install
npm run dev
```

### Build for production

```bash
npm run build
npx vite preview
```

### Install as PWA

Build the app, open the preview URL in Chrome/Edge on your phone, tap the install banner or use the browser menu → Add to Home Screen.

### License

MIT
