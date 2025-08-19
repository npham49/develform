import { createFileRoute, redirect } from '@tanstack/react-router';
import AppLayout from '../../layouts/app-layout';
import FormsManage from '../../pages/forms/Manage';

export const Route = createFileRoute('/forms/$id/manage')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <AppLayout>
      <FormsManage />
    </AppLayout>
  ),
});