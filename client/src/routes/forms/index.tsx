import { createFileRoute } from '@tanstack/react-router';
import FormsIndex from '../../pages/forms/Index';

export const Route = createFileRoute('/forms/')({
  component: () => <FormsIndex />,
});
