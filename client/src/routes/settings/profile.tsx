import { createFileRoute } from '@tanstack/react-router';
import SettingsProfile from '../../pages/settings/Profile';

export const Route = createFileRoute('/settings/profile')({
  component: () => <SettingsProfile />,
});
