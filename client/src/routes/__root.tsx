import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Toaster } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string | null;
  githubId: string | null;
  avatarUrl: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContext {
  user: User | null;
  loading: boolean;
  login: (redirectUrl?: string) => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

export interface RouterContext {
  queryClient: QueryClient;
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Toaster richColors duration={3000} position="top-right" />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
