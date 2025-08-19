import { createFileRoute, redirect } from '@tanstack/react-router';
import AppLayout from '../../layouts/app-layout';
import FormsIndex from '../../pages/forms/Index';

export const Route = createFileRoute('/forms/')({
  beforeLoad: () => {
    // Simple auth check - you'd replace this with actual auth logic
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <AppLayout>
      <FormsIndex />
    </AppLayout>
  ),
});