# Expense Meter — Frontend

Professional personal finance UI for the Expense Meter monorepo.

**Author:** ANSHUL-REAL · anshulnautiyal2006@gmail.com

## Quick start

```bash
cd Frontend
npm install
npm run dev
```

Open `http://localhost:5173` (or the port Vite prints).

## Profile & settings (required task)

| Action | Result |
|--------|--------|
| Click **avatar** (top right) | Opens Profile / Settings |
| Sidebar → **Settings** | Same page |

**Profile features:** name, email, avatar upload, currency, light/dark mode, notification toggles, export / backup / reset data.

## Feature map

| Page | Highlights |
|------|------------|
| Home | Financial overview, Income/Expenditure toggle, summary cards |
| Transactions | Search, filters, status badges, live money in/out cards, export |
| Income | Categories, add form, trend & distribution charts |
| Expenses | Categories, drafts, receipts, budget vs actual, heatmap |
| Analytics | Comparisons, PDF/CSV export |
| Budget & Goals | Limits, progress bars, savings goals |
| Settings | Full profile & app configuration |

## Scripts

```bash
npm run dev       # development server
npm run build     # production build
npm run preview   # preview production build
```

## Notes

- Demo data uses `localStorage` (works offline).
- Backend remains in `../Backend` and is not required to demo the UI.
