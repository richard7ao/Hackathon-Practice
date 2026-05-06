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
