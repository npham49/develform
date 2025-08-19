import { createFileRoute, redirect } from '@tanstack/react-router';
import AppLayout from '../../layouts/app-layout';
import FormsSchema from '../../pages/forms/Schema';

export const Route = createFileRoute('/forms/$id/schema')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <AppLayout>
      <FormsSchema />
    </AppLayout>
  ),
});