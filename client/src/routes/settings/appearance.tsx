import { createFileRoute, redirect } from '@tanstack/react-router';
import AppLayout from '../../layouts/app-layout';
import SettingsAppearance from '../../pages/settings/Appearance';

export const Route = createFileRoute('/settings/appearance')({
  beforeLoad: () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => (
    <AppLayout>
      <SettingsAppearance />
    </AppLayout>
  ),
});