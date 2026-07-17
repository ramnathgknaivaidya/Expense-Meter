# Expense Meter

**Premium personal finance dashboard** built from the *Expense Meter Master Document* and the reference UI design.

**Contributor:** [ANSHUL-REAL](https://github.com/ANSHUL-REAL) · `anshulnautiyal2006@gmail.com`

---

## Overview

Expense Meter helps users **track → analyze → control → improve** their financial habits through a clear UI and live, connected data.

| Area | Description |
|------|-------------|
| **Frontend/** | React + TypeScript + Vite UI (this submission) |
| **Backend/** | Existing Node API (auth, income, expense, analytics) — left intact |

---

## How to run (Frontend)

```bash
cd Frontend
npm install
npm run dev
```

Open the local URL shown in the terminal (typically `http://localhost:5173`).

**No cloud deploy required** — run locally for review.

### Profile page (task focus)

1. Click the **profile avatar** in the top-right, **or**
2. Open **Settings** in the sidebar  

There you can manage name, email, avatar, currency, light/dark mode, notifications, and data export/reset.

---

## Features (per master document)

### Chapter 1 — Dashboard & financial overview
- Hero section with CTAs: **Add Income** / **Add Expense**
- **Income | Expenditure** toggle (green / orange themes, animated switch)
- Summary cards: Total Balance, Total Income, Total Expense, Savings
- Recent activity with view / edit / delete actions
- Live month-over-month growth indicators

### Chapter 2 — Income management
- Summary: total, monthly, average, top source
- Income categories: Salary, Freelance, Business, Investment, Bonus, Rental, Other
- **Add Income** form (amount, source, date, payment method, description)
- Analytics: trend chart, source distribution, monthly comparison

### Chapter 3 — Expenditure management
- Summary: total expense, remaining budget, daily average, highest category
- Categories: Food, Transport, Housing, Bills, Shopping, Healthcare, Education, Entertainment, Travel, Other
- **Add Expense** form (merchant, notes, receipt upload, save draft)
- Pie / line charts, planned vs actual budget, spending heatmap

### Chapter 4 — Transactions
- Premium table UI (status badges, filters, export)
- Summary cards: **Net change**, **Money In**, **Money Out** (live totals)
- Global search, filters (type, status, date, amount)
- Actions: view details, duplicate, delete, CSV export

### Chapter 5 — Analytics & reports
- Income vs expense comparison (bar chart)
- Spending analysis and top spending areas
- Monthly financial report export (**PDF** via print, **CSV** data)

### Chapter 6 — Budget planning & goals
- Monthly spending limit with usage progress
- Category budgets (spent / limit / %)
- Savings goals: Emergency Fund, New Device, Vacation, Investment Goal
- Auto-save 5% of new income toward the first open goal (demo)

### Chapter 7 — Profile & application settings
- User information: name, email, avatar, currency
- Appearance: light / dark mode
- Notifications: budget alerts, expense / income reminders
- Data management: export CSV, backup JSON, reset demo data

### Interaction & design system
- Smooth page transitions and toggle animations
- Count-up numbers, staggered lists, chart animations
- Professional Lucide icons (no emoji clutter)
- Notifications bell (empty state when none; alerts when budgets fire)
- Profile click → Settings
- Responsive layout; `prefers-reduced-motion` respected

---

## Live data behavior

All modules share one store. When you **add / edit / delete** a transaction:

- Totals and balance update  
- Charts re-render  
- Budgets and remaining amounts update  
- Budget alerts can appear in the notification panel  

Demo data is stored in **browser `localStorage`** so the UI works without running the backend.

---

## Repository structure

```
Expense-Meter/
├── Frontend/          # UI (Vite + React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/     # Dashboard, Income, Expenses, Transactions,
│   │   │              # Analytics, Budget, Settings (Profile)
│   │   └── data/      # Seed data + live stats store
│   └── package.json
├── Backend/           # Existing API (unchanged in this branch)
├── .gitignore
└── README.md
```

---

## Backend (optional)

```bash
cd Backend
npm install
# see Backend/readme.md
npm start
```

Typical API base: `http://localhost:5000/api`

---

## Tech stack (Frontend)

- React 19 · TypeScript · Vite  
- Recharts · Lucide React  
- Local state + `localStorage` for demo persistence  

---

## Branch

`feature/profile-ui-demo` — Frontend UI + Profile/Settings implementation for review via Pull Request.
