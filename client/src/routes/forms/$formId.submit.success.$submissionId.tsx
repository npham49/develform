import { createFileRoute } from '@tanstack/react-router';
import FormsSuccess from '../../pages/forms/Success';

export const Route = createFileRoute('/forms/$formId/submit/success/$submissionId')({
  component: FormsSuccess,
});