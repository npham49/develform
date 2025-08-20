import { createFileRoute } from '@tanstack/react-router';
import FormsSchema from '../../pages/forms/Schema';

export const Route = createFileRoute('/forms/$id/schema')({
  component: () => <FormsSchema />,
});
