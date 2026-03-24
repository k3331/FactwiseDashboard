# FactWise Employee Dashboard

A professional, fully-featured React dashboard built with **AG Grid** for managing and visualizing employee data. Built as a frontend assignment for FactWise.

**Live Demo:** [factwise-dashboard-orpin.vercel.app](https://factwise-dashboard-orpin.vercel.app)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Type safety across all components |
| Vite | 8 | Build tool & dev server |
| AG Grid Community | 35 | Data grid with sorting, filtering, pagination |
| Tailwind CSS | 4 | Utility-first styling (no custom CSS classes) |

Zero additional runtime dependencies -- pie chart is pure SVG, animations use CSS keyframes, modals use React portals.

---

## Features

### AG Grid Table
- **Client-side rendering** with all 20 employee records
- **Column sorting** (click any header), **resizable columns**, and **column reordering**
- **Column filters** -- text, number, and date filters per column
- **Quick search** across all columns simultaneously
- **Pagination** with 10/20 rows per page selector
- **Multi-row selection** via checkboxes
- **CSV export** button to download data
- **Custom cell renderers:**
  - Employee avatar with initials + name + email
  - Color-coded salary formatting
  - Performance rating with progress bar (green/indigo/amber/red)
  - Active/Inactive status badges
  - Skill tags
  - Formatted hire dates
- **Custom AG Grid theme** (Quartz base with indigo accent, Inter font)

### CRUD Operations
- **Create** -- "Add Employee" button opens a form modal with all fields and client-side validation
- **Read** -- AG Grid displays all employee data with rich formatting
- **Update** -- Edit via 3-dot row menu, pre-fills form with existing data
- **Delete** -- Delete via 3-dot row menu with a confirmation modal

### Dashboard Analytics
- **Summary cards** -- Total employees, average salary, average rating, projects completed
- **Department chips** -- Color-coded badges with per-department counts
- **Donut pie chart** -- SVG department distribution with legend (count + percentage)
- All analytics update live as employees are added, edited, or deleted

### Animations
- Staggered fade-in on page load (header, cards, chart, grid)
- Pie chart spin-in with staggered legend rows
- Modal backdrop fade + panel slide-up with spring easing
- 3-dot dropdown scale-in pop
- All CSS-only via Tailwind `@theme` keyframes

### Other
- **Fully responsive** -- adapts from mobile to wide desktop
- **Accessible** -- Escape key closes modals, focus management
- **Portal-based menus** -- 3-dot dropdown renders via `createPortal` to avoid AG Grid overflow clipping

---

## Project Structure

```
src/
├── types/
│   └── employee.ts              # Employee & Department types
├── data/
│   └── employees.ts             # Sample dataset (20 records)
├── components/
│   ├── SummaryCards.tsx          # KPI metric cards + department chips
│   ├── DepartmentPieChart.tsx    # SVG donut chart with legend
│   ├── EmployeeGrid.tsx         # AG Grid with toolbar, custom renderers, 3-dot menu
│   ├── EmployeeFormModal.tsx    # Add/Edit form with validation
│   └── ConfirmModal.tsx         # Delete confirmation dialog
├── App.tsx                      # Root layout + state management + CRUD handlers
├── main.tsx                     # Entry point
└── index.css                    # Tailwind import + animation keyframes
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Commands

```bash
# Production build
npm run build

# Preview production build locally
npm run preview

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

## Deployment

Deployed on **Vercel** via CLI (`npx vercel deploy --prod`). The Vite build output is auto-detected -- no custom configuration needed.
