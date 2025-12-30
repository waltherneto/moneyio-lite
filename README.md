# MoneyIO Lite

> 🇧🇷 Read this documentation in Portuguese: [README.pt-BR.md](./README.pt-BR.md)

**MoneyIO Lite** is a personal finance dashboard developed as an MVP with a strong focus on **architecture quality, UX decisions, and product thinking**, simulating a real-world SaaS from conception to visual polish.

## Overview

The application allows users to register **income and expenses**, categorize transactions, visualize **financial indicators**, track daily cash flow, and analyze expenses by category — all with local persistence and a clean, professional UI.

Beyond functionality, this project emphasizes:
- intentional UX decisions
- visual consistency
- modern front-end best practices
- readable and maintainable code

**Current version:** `v1.0.0 (MVP)`

---

## Features

- Full CRUD for transactions (income & expenses)
- Custom expense categories
- Local persistence using `localStorage`
- Financial summary cards (Income, Expenses, Balance)
- Expense breakdown by category (Top 5 + Others)
- Daily flow chart (Income vs Expenses)
- Month filter and text search
- CSV export
- Demo reset mode
- Thoughtful empty states
- Custom branding (logo and favicon)

---

## Product & UX Decisions

### “In the blue” financial concept (Brazilian context)
Positive balance and income use **blue** instead of green, reflecting the Brazilian cultural association of being financially healthy.

### Top 5 + Others strategy
Prevents visual overload while keeping insights clear, even with many categories.

### Stable dashboard layout
Fixed-height chart cards avoid grid breaking when data volume changes.

### Improved form experience
Currency input with real-time masking and validation prevents user errors and improves clarity.

### No heavy UI templates
The UI was built incrementally to maintain full control over design and architecture.

---

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Hook Form + Zod (forms & validation)
- Recharts (data visualization)

---

## Project Structure

```text
src/
 ├─ modules/
 │   └─ transactions/
 │       ├─ components/
 │       ├─ pages/
 │       ├─ store/
 │       └─ utils/
 ├─ shared/
 ├─ App.tsx
 └─ index.css
 ```

This structure supports future evolution such as authentication, backend integration, and multi-user support.

---

## Running the project locally

```bash
npm install
npm run dev
```

---

## Author

Walther Fornaciari Neto  
Senior Project Manager / Full-Stack Developer / Tech & Product  
Focused on digital products, UX, and sustainable engineering.

---

## Disclaimer

This project was built as a portfolio MVP, simulating real product decisions rather than aiming for feature overload.