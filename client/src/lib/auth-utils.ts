import { RouterContext } from '@/routes/__root';
import { redirect } from '@tanstack/react-router';

/**
 * Auth guard function that checks if user is authenticated
 * Redirects to login if not authenticated
 */
export function requireAuth(context: RouterContext, redirectTo?: string) {
  const { auth } = context;

  // If still loading, don't redirect yet
  if (auth.loading) {
    return;
  }

  // If no user, redirect to login
  if (!auth.user) {
    throw redirect({
      to: '/auth/login',
      search: {
        redirect: redirectTo || window.location.pathname,
      },
    });
  }
}

/**
 * Auth guard function that redirects authenticated users away from auth pages
 */
export function requireGuest(context: RouterContext, redirectTo: string = '/dashboard') {
  const { auth } = context;

  // If still loading, don't redirect yet
  if (auth.loading) {
    return;
  }

  // If user is authenticated, redirect away from auth pages
  if (auth.user) {
    throw redirect({
      to: redirectTo,
    });
  }
}
