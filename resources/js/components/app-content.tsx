import * as React from 'react';

interface AppContentProps extends React.ComponentProps<'main'> {
  variant?: 'header' | 'sidebar';
}

export function AppContent({ children, ...props }: AppContentProps) {
  // Always use header layout - no sidebar inset
  return (
    <main className="container-fluid px-4 py-4 flex-fill overflow-x-hidden" {...props}>
      {children}
    </main>
  );
}
