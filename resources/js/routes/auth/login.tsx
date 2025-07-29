import { createFileRoute } from '@tanstack/react-router'
import Login from '../../pages/auth/login-hono'

export const Route = createFileRoute('/auth/login')({
  component: Login,
})