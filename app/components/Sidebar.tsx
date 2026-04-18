import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/tab-1", label: "PostVisit.ai" },
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
              y="58"
              textAnchor="middle"
              fill="white"
              fontFamily="'DM Sans', system-ui, sans-serif"
              fontWeight="800"
              fontSize="28"
              letterSpacing="-1"
            >
              HP
            </text>
            <rect x="20" y="70" width="60" height="3" rx="1.5" fill="white" opacity="0.5" />
          </svg>
        </div>
        <div className="sidebar-logo-name">
          Hackathon<sup>Practice</sup>
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
