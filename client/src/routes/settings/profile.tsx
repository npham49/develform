import { createFileRoute, redirect } from '@tanstack/react-router';
import AppLayout from '../../layouts/app-layout';
import SettingsProfile from '../../pages/settings/Profile';

export const Route = createFileRoute('/settings/profile')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <AppLayout>
      <SettingsProfile />
    </AppLayout>
  ),
});