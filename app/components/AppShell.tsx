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
