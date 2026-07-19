## Summary

Implements the **Expense Meter Frontend UI** and a complete **Profile / Settings** page, following the master document and the reference design.

**Submitted by:** ANSHUL-REAL (`anshulnautiyal2006@gmail.com`)

## What’s included

### Profile page (primary task)
- Accessible from **profile avatar** (top right) and sidebar **Settings**
- User info: name, email, avatar, preferred currency
- Appearance: light / dark mode
- Notifications: budget alerts, expense/income reminders
- Data management: export CSV, backup, reset demo data

### Master document modules
- Dashboard with Income | Expenditure toggle and summary cards  
- Income & Expense management (forms, categories, charts)  
- Transactions table with search, filters, and live totals  
- Analytics & report export (PDF / CSV)  
- Budget limits and savings goals  

### UX polish
- Professional icon system, animations, notifications panel  
- Live stats: one change updates totals, charts, and budgets  

## How to review

```bash
cd Frontend
npm install
npm run dev
```

1. Open the app in the browser  
2. Click the **avatar** → confirm Profile / Settings  
3. Add an expense → check Home / Analytics / Budget update  

## Scope notes

- Changes are under **`Frontend/`** only  
- **`Backend/`** is unchanged  
- UI demo uses `localStorage` (no Vercel deploy required)  

## Checklist

- [x] Profile page implemented (not “Coming Soon”)  
- [x] Design aligned with reference UI  
- [x] Features mapped to master document chapters  
- [x] README with run instructions  
- [x] Builds successfully (`npm run build`)  
