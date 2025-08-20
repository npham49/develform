import { createFileRoute } from '@tanstack/react-router';
import FormsCreate from '../../pages/forms/Create';

export const Route = createFileRoute('/forms/create')({
  component: () => <FormsCreate />,
});
