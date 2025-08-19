import { createFileRoute } from '@tanstack/react-router';
import GitHubLogin from '../../pages/auth/GitHubLogin';

export const Route = createFileRoute('/auth/login')({
  component: GitHubLogin,
});