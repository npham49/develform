import { createFileRoute } from '@tanstack/react-router'
import FormsIndex from '../pages/forms/index-hono'

export const Route = createFileRoute('/forms')({
  component: FormsIndex,
})