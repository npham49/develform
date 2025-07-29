import { createFileRoute } from '@tanstack/react-router'
import Register from '../../pages/auth/register-hono'

export const Route = createFileRoute('/auth/register')({
  component: Register,
})