# Template Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone Next.js starter template that replicates the PLP Admin visual shell (sidebar + topbar + content area) with a Home page greeting and 5 bare placeholder tabs — zero backend dependencies.

**Architecture:** Fresh Next.js 15 App Router project in the Hackathon-Practice repo root. A single `"use client"` AppShell component handles layout (sidebar + topbar + content). CSS extracted from PLP Admin light-mode tokens. Each page is a minimal server component.

**Tech Stack:** Next.js 15, React 19, TypeScript, CSS custom properties, DM Sans font

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Project metadata, next/react/react-dom deps, dev/build/start scripts |
| `tsconfig.json` | TypeScript config for Next.js App Router |
| `next.config.ts` | Minimal Next.js config |
| `app/layout.tsx` | Root layout: html, body, DM Sans font, globals.css import |
| `app/globals.css` | Light-mode design tokens + app shell + sidebar + topbar styles |
| `app/components/AppShell.tsx` | `"use client"` layout wrapper: sidebar + topbar + content, pathname detection |
| `app/components/Sidebar.tsx` | Logo block + flat nav list of 6 links with active state |
| `app/components/Topbar.tsx` | Page title bar, sticky |
| `app/page.tsx` | Home: time-based greeting + formatted date |
| `app/tab-1/page.tsx` | Placeholder: "Tab 1" heading |
| `app/tab-2/page.tsx` | Placeholder: "Tab 2" heading |
| `app/tab-3/page.tsx` | Placeholder: "Tab 3" heading |
| `app/tab-4/page.tsx` | Placeholder: "Tab 4" heading |
| `app/tab-5/page.tsx` | Placeholder: "Tab 5" heading |

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `.gitignore`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "template-dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Create .gitignore**

```
node_modules/
.next/
out/
.superpowers/
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` generated, no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts .gitignore
git commit -m "chore: scaffold Next.js project with TypeScript"
```

---

### Task 2: Global CSS (Design Tokens + Layout Styles)

**Files:**
- Create: `app/globals.css`

- [ ] **Step 1: Create globals.css with light-mode design tokens and layout styles**

```css
/* ============================================================
   DESIGN TOKENS — Light mode only
   ============================================================ */
:root {
  /* Backgrounds */
  --bg-page:        #f4f4f8;
  --bg-surface:     #ffffff;
  --bg-sidebar:     #ffffff;
  --bg-hover:       #f0f0f8;
  --bg-active:      #eef2ff;

  /* Borders */
  --border:         #e6e6ee;

  /* Text */
  --text-primary:   #1a1a2e;
  --text-secondary: #7070a0;
  --text-muted:     #b0b0c4;

  /* Accent */
  --accent:         #3730a3;
  --accent-subtle:  #eef2ff;
  --accent-text:    #3730a3;

  /* Shadows */
  --shadow-sm:      0 1px 3px rgba(0,0,0,0.08);

  /* Layout */
  --sidebar-w:      224px;
  --topbar-h:       46px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-dm-sans), 'DM Sans', system-ui, -apple-system, sans-serif;
  background: var(--bg-page);
  color: var(--text-primary);
}

/* ============================================================
   APP SHELL LAYOUT
   ============================================================ */
.app-shell {
  display: flex;
  height: 100vh;
  background: var(--bg-page);
  color: var(--text-primary);
}

.app-sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  height: 100vh;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  overflow-y: auto;
}

.app-main {
  margin-left: var(--sidebar-w);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.app-topbar {
  height: var(--topbar-h);
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 5px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 40;
}

.topbar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.app-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* ============================================================
   SIDEBAR INTERNALS
   ============================================================ */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 16px;
  border-bottom: 1px solid var(--border);
  font-weight: 700;
  font-size: 15px;
  color: var(--text-primary);
  text-decoration: none;
}

.sidebar-logo-mark {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-logo-name {
  font-weight: 700;
  font-size: 15px;
}

.sidebar-logo-name sup {
  font-weight: 400;
  font-size: 11px;
  vertical-align: super;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
  cursor: pointer;
}

.sidebar-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.sidebar-item.active {
  background: var(--bg-active);
  color: var(--accent-text);
  font-weight: 600;
  border-left: 3px solid var(--accent);
  padding-left: 7px;
  border-radius: 0 6px 6px 0;
}

.sidebar-item-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: transparent;
  flex-shrink: 0;
}

.sidebar-item.active .sidebar-item-dot {
  background: var(--accent);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: add light-mode design tokens and layout CSS from PLP Admin"
```

---

### Task 3: Root Layout

**Files:**
- Create: `app/layout.tsx`

- [ ] **Step 1: Create the root layout**

```tsx
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import AppShell from "./components/AppShell";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PLP Admin",
  description: "PLP Admin Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head />
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add root layout with DM Sans font and AppShell wrapper"
```

---

### Task 4: Topbar Component

**Files:**
- Create: `app/components/Topbar.tsx`

- [ ] **Step 1: Create Topbar component**

```tsx
interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
  return (
    <header className="app-topbar">
      <span className="topbar-title">{title}</span>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/Topbar.tsx
git commit -m "feat: add Topbar component"
```

---

### Task 5: Sidebar Component

**Files:**
- Create: `app/components/Sidebar.tsx`

- [ ] **Step 1: Create Sidebar component with logo, flat nav list, and active state**

```tsx
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/tab-1", label: "Tab 1" },
  { href: "/tab-2", label: "Tab 2" },
  { href: "/tab-3", label: "Tab 3" },
  { href: "/tab-4", label: "Tab 4" },
  { href: "/tab-5", label: "Tab 5" },
];

interface SidebarProps {
  pathname: string;
}

export default function Sidebar({ pathname }: SidebarProps) {
  return (
    <aside className="app-sidebar">
      <Link href="/" className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <svg
            width={16}
            height={16}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="100" height="100" rx="22" fill="#5B4CC4" />
            <text
              x="50"
              y="60"
              textAnchor="middle"
              fill="white"
              fontFamily="'DM Sans', system-ui, sans-serif"
              fontWeight="800"
              fontSize="36"
              letterSpacing="-2"
            >
              PLP
            </text>
            <rect x="20" y="70" width="60" height="3" rx="1.5" fill="white" opacity="0.5" />
          </svg>
        </div>
        <div className="sidebar-logo-name">
          PLP<sup>Admin</sup>
        </div>
      </Link>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item${isActive ? " active" : ""}`}
            >
              <div className="sidebar-item-dot" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/Sidebar.tsx
git commit -m "feat: add Sidebar component with PLP logo and flat nav list"
```

---

### Task 6: AppShell Component

**Files:**
- Create: `app/components/AppShell.tsx`

- [ ] **Step 1: Create AppShell client component that wires Sidebar + Topbar + content**

```tsx
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const PAGE_TITLES: Record<string, string> = {
  "/": "Home",
  "/tab-1": "Tab 1",
  "/tab-2": "Tab 2",
  "/tab-3": "Tab 3",
  "/tab-4": "Tab 4",
  "/tab-5": "Tab 5",
};

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Page";

  return (
    <div className="app-shell">
      <Sidebar pathname={pathname} />
      <div className="app-main">
        <Topbar title={title} />
        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/AppShell.tsx
git commit -m "feat: add AppShell client component wiring sidebar, topbar, and content"
```

---

### Task 7: Home Page

**Files:**
- Create: `app/page.tsx`

- [ ] **Step 1: Create home page with time-based greeting and formatted date**

```tsx
"use client";

import { useEffect, useState } from "react";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  const [greeting, setGreeting] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
    setDate(formatDate());
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 4px" }}>
        {greeting}, User
      </h1>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>{date}</p>
    </div>
  );
}
```

- [ ] **Step 2: Verify the app runs**

Run: `npm run dev`
Expected: App starts at http://localhost:3000. Home page shows greeting and date. Sidebar shows all 6 links with Home highlighted. Topbar shows "Home".

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add Home page with time-based greeting and formatted date"
```

---

### Task 8: Placeholder Tab Pages

**Files:**
- Create: `app/tab-1/page.tsx`
- Create: `app/tab-2/page.tsx`
- Create: `app/tab-3/page.tsx`
- Create: `app/tab-4/page.tsx`
- Create: `app/tab-5/page.tsx`

- [ ] **Step 1: Create app/tab-1/page.tsx**

```tsx
export default function Tab1() {
  return (
    <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
      Tab 1
    </h1>
  );
}
```

- [ ] **Step 2: Create app/tab-2/page.tsx**

```tsx
export default function Tab2() {
  return (
    <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
      Tab 2
    </h1>
  );
}
```

- [ ] **Step 3: Create app/tab-3/page.tsx**

```tsx
export default function Tab3() {
  return (
    <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
      Tab 3
    </h1>
  );
}
```

- [ ] **Step 4: Create app/tab-4/page.tsx**

```tsx
export default function Tab4() {
  return (
    <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
      Tab 4
    </h1>
  );
}
```

- [ ] **Step 5: Create app/tab-5/page.tsx**

```tsx
export default function Tab5() {
  return (
    <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
      Tab 5
    </h1>
  );
}
```

- [ ] **Step 6: Verify all tabs work**

Run: `npm run dev`
Expected: Click each sidebar link. Each tab page loads with its heading. Sidebar active state moves to the clicked link. Topbar title updates.

- [ ] **Step 7: Commit**

```bash
git add app/tab-1/page.tsx app/tab-2/page.tsx app/tab-3/page.tsx app/tab-4/page.tsx app/tab-5/page.tsx
git commit -m "feat: add 5 placeholder tab pages"
```

---

### Task 9: Final Verification

- [ ] **Step 1: Run the build to check for TypeScript/compilation errors**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 2: Visual check against PLP Admin**

Verify in the browser at http://localhost:3000:
- Sidebar: white background, purple PLP logo badge, "PLPAdmin" text, 6 flat nav links
- Active link: indigo left border, purple text, light purple background
- Hover on inactive links: light hover background
- Topbar: white bar with title, thin bottom border with shadow
- Content area: light lavender (#f4f4f8) background
- Home page: greeting text + date, nothing else
- Tab pages: just the heading
- DM Sans font renders correctly

- [ ] **Step 3: Commit any final fixes if needed, then tag**

```bash
git add -A
git commit -m "chore: final polish and verification"
```
