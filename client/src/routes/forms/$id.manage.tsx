import { createFileRoute } from '@tanstack/react-router';
import FormsManage from '../../pages/forms/Manage';

export const Route = createFileRoute('/forms/$id/manage')({
  component: () => <FormsManage />,
});
