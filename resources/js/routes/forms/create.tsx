import { createFileRoute } from '@tanstack/react-router'
import FormsCreate from '../../pages/forms/create-hono'

export const Route = createFileRoute('/forms/create')({
  component: FormsCreate,
})