import { requireGuest } from '@/lib/auth-utils';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    requireGuest(context);
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}
