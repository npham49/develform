import { createFileRoute, redirect } from '@tanstack/react-router';
import AppLayout from '../../layouts/app-layout';
import FormsPreview from '../../pages/forms/Preview';

export const Route = createFileRoute('/forms/$id/preview')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <AppLayout>
      <FormsPreview />
    </AppLayout>
  ),
});