# Template Dashboard Design Spec

## Overview

A standalone Next.js starter template in the Hackathon-Practice repo that replicates the PLP Admin visual shell (sidebar + topbar + content area) with zero backend dependencies. Contains 1 Home tab with a time-based greeting and 5 bare placeholder tabs.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Custom CSS with CSS variables (extracted from PLP Admin light-mode tokens)
- **Font:** DM Sans (Google Fonts)
- **Dependencies:** next, react, react-dom — nothing else

## Project Structure

```
Hackathon-Practice/
├── app/
│   ├── layout.tsx          # Root layout — html, body, font, global CSS
│   ├── globals.css         # Design tokens + all styling
│   ├── page.tsx            # Home — greeting + date
│   ├── tab-1/page.tsx      # Placeholder page
│   ├── tab-2/page.tsx      # Placeholder page
│   ├── tab-3/page.tsx      # Placeholder page
│   ├── tab-4/page.tsx      # Placeholder page
│   ├── tab-5/page.tsx      # Placeholder page
│   └── components/
│       ├── AppShell.tsx    # Client component — layout wrapper
│       ├── Sidebar.tsx     # Left nav — logo + flat list of 6 links
│       └── Topbar.tsx      # Page header bar (title only)
├── public/                 # Static assets (empty)
├── package.json
├── tsconfig.json
└── next.config.ts
```

## Styling

### Design Tokens (light mode only)

| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#3730a3` | Active nav, logo badge |
| `--bg-page` | `#f4f4f8` | Page background |
| `--bg-sidebar` | `#ffffff` | Sidebar background |
| `--bg-surface` | `#ffffff` | Content surfaces |
| `--border` | `#e6e6ee` | Borders |
| `--text-primary` | `#1a1a2e` | Primary text |
| `--text-secondary` | `#7070a0` | Muted text |

### Layout Dimensions

- Sidebar width: 224px (fixed, left-aligned)
- Topbar height: ~46px (sticky)
- App shell: flexbox — sidebar fixed left, main content flex-1

### What Is Copied from PLP Admin

- CSS custom properties (light mode tokens)
- Sidebar styling: nav link hover/active states, purple dot for active item
- Topbar styling: title, bottom border
- App shell flexbox layout
- Logo block styling

### What Is Dropped

- Dark mode tokens and `[data-theme="dark"]` rules
- Stat card, workflow card, table, modal, detail panel, toast styles
- Animation keyframes
- Auth layout styles

## Components

### AppShell.tsx

- `"use client"` component
- Wraps all page content
- Renders Sidebar + Topbar + content area
- Uses `usePathname()` from `next/navigation` to determine active route
- Maps pathname to page title for Topbar

### Sidebar.tsx

- Logo block: purple badge with "PLP" + "Admin" text
- Flat list of 6 navigation links (no grouping):
  - Home → `/`
  - Tab 1 → `/tab-1`
  - Tab 2 → `/tab-2`
  - Tab 3 → `/tab-3`
  - Tab 4 → `/tab-4`
  - Tab 5 → `/tab-5`
- Active link: purple left dot + purple text + light purple background
- Inactive links: gray text, purple on hover
- Uses `next/link` for client-side navigation

### Topbar.tsx

- Receives page title as prop
- Title displayed left-aligned
- Thin bottom border, sticky at top
- No dark mode toggle or right-side controls

## Pages

### Home (`/`)

- Greeting: "Good morning/afternoon/evening, User"
  - Morning: before 12:00
  - Afternoon: 12:00–17:59
  - Evening: 18:00+
- Date: formatted as "Saturday, 18 April 2026"
- Hardcoded name "User" (no auth system)
- Nothing else below the greeting

### Tab 1–5 (`/tab-1` through `/tab-5`)

- Each page displays only a centered heading with the tab name
- No other content — pure placeholder

## Constraints

- Zero backend dependencies — no API calls, no auth, no database
- No state management libraries — no Redux, Zustand, or Context
- No dark mode
- Runs locally with `npm run dev`
- Deployable as a static webapp (Next.js static export compatible)

## Running Locally

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```
