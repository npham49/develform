import { createFileRoute } from '@tanstack/react-router';
import FormsSubmit from '../../pages/forms/Submit';

export const Route = createFileRoute('/forms/$formId/submit')({
  component: FormsSubmit,
});