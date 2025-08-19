import { createFileRoute, redirect } from '@tanstack/react-router';
import AppLayout from '../../layouts/app-layout';
import FormsCreate from '../../pages/forms/Create';

export const Route = createFileRoute('/forms/create')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <AppLayout>
      <FormsCreate />
    </AppLayout>
  ),
});