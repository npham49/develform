import { createFileRoute } from '@tanstack/react-router';
import SettingsAppearance from '../../pages/settings/Appearance';

export const Route = createFileRoute('/settings/appearance')({
  component: () => <SettingsAppearance />,
});
