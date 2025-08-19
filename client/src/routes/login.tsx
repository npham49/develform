import { createFileRoute } from '@tanstack/react-router';
import AuthLayout from '../layouts/auth-layout';
import Login from '../pages/auth/Login';

export const Route = createFileRoute('/login')({
  component: () => (
    <AuthLayout title="Sign In" description="Sign in to your account">
      <Login />
    </AuthLayout>
  ),
});