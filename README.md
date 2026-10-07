# Purchase Requisition Management — Spectrum ERP module

Force Intellect React Developer assignment. Built with **React 19, TypeScript, Vite, Tailwind CSS v4, React Router, Redux Toolkit, TanStack Query, React Hook Form + Zod**.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts: `npm run build` · `npm run preview` · `npm run typecheck` · `npm run lint` · `npm test`

Requires Node 20+ (tested on Node 22).

## Features

**Listing** — PR Number / Date (DD/MM/YYYY) / Department / Requested By / Status / Total Items / View + Edit actions; search by PR number (debounced), status filter, date range filter, pagination, loading skeleton, empty state, error state with retry.

**Create / Edit** — auto-generated read-only PR number, request date, department, requested-by (defaults to logged-in user), priority; dynamic material rows (add / remove), material code auto-fills name and unit, quantity validation, required-date validation, duplicate-material handling (disabled in dropdown + validated), **Save as Draft** and **Submit for Approval** (with confirmation).

**View + workflow** — read-only details, approval history timeline, Draft → Pending Approval → Approved / Rejected (reject requires a reason). Only drafts are editable.

## Architecture

```
src/
  app/                    store, providers, router
  components/ui/          reusable, feature-agnostic UI kit (Button, Input, Select, FormField,
                          Badge, Card, PageHeader, Pagination, ConfirmDialog, StateMessage, Skeleton)
  components/layout/      AppLayout, Sidebar, Topbar
  hooks/ lib/             typed redux hooks, cn(), date + id helpers
  features/purchase-requisitions/
    api/                  mock REST layer (localStorage + latency + 404/409/503 errors)
    hooks/                TanStack Query hooks (list, detail, save, transition)
    store/                Redux slices: list filters, session user
    components/           PRFilters, PRTable, PRHeaderForm, MaterialItemsTable, StatusBadge, StatusTimeline
    pages/                PRListPage, PRFormPage, PRViewPage (route-level, lazy loaded)
    schemas.ts            Zod schemas (draft vs. submit)
    types.ts constants.ts formDefaults.ts
```

- **Server state** → TanStack Query. **Client/UI state** (filters, session) → Redux Toolkit. **Forms** → React Hook Form + Zod.
- The mock API in `api/prApi.ts` is the only file to replace when connecting a real backend.
- Data persists in `localStorage`. Use the sidebar **Demo tools** to simulate an API failure (error state) or reset the seed data.
