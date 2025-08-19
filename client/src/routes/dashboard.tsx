import { createFileRoute, redirect } from '@tanstack/react-router';
import AppLayout from '../layouts/app-layout';
import Dashboard from '../pages/Dashboard';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  ),
});