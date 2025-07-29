import { createFileRoute } from '@tanstack/react-router'
import FormManage from '../../../pages/forms/manage-hono'

export const Route = createFileRoute('/forms/$formId/manage')({
  component: FormManage,
})