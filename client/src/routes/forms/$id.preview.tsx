import { createFileRoute } from '@tanstack/react-router';
import FormsPreview from '../../pages/forms/Preview';

export const Route = createFileRoute('/forms/$id/preview')({
  component: () => <FormsPreview />,
});
