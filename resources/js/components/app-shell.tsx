interface AppShellProps {
  children: React.ReactNode;
  variant?: 'header' | 'sidebar';
}

export function AppShell({ children }: AppShellProps) {
  // Force header layout - no sidebar
  return <div className="d-flex min-vh-100 w-100 flex-column">{children}</div>;
}
