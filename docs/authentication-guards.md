# Authentication Guards

This document explains how the authentication guard functions work in the TanStack Router implementation.

## Overview

The authentication system uses two main guard functions to protect routes:
- `requireAuth()` - Protects routes that require user authentication
- `requireGuest()` - Protects routes that should only be accessible to non-authenticated users

These guards are located in `client/src/lib/auth-utils.ts` and work with TanStack Router's context system.

## How the Guards Work

### RouterContext Integration

Both guards receive a `RouterContext` object that contains the authentication state from the `useAuth` hook. This context includes:

```typescript
interface RouterContext {
  auth: {
    user: User | null;
    loading: boolean;
    // ... other auth properties
  };
}
```

### Loading State Handling

Both guards first check if authentication is still loading:

```typescript
if (auth.loading) {
  return; // Don't redirect while auth state is being determined
}
```

This prevents premature redirects while the authentication status is being fetched.

## requireAuth() Guard

### Purpose
Protects routes that require user authentication. If a user is not authenticated, they are redirected to the login page.

### Function Signature
```typescript
function requireAuth(context: RouterContext, redirectTo?: string): void
```

### Parameters
- `context: RouterContext` - The router context containing auth state
- `redirectTo?: string` - Optional redirect path to return to after login (defaults to current pathname)

### How It Works

1. **Loading Check**: Returns early if auth is still loading
2. **Authentication Check**: Checks if `auth.user` exists
3. **Redirect Logic**: If no user is found, throws a redirect to `/auth/login` with the current path as a search parameter

```typescript
export function requireAuth(context: RouterContext, redirectTo?: string) {
  const { auth } = context;
  
  if (auth.loading) return;
  
  if (!auth.user) {
    throw redirect({
      to: '/auth/login',
      search: {
        redirect: redirectTo || window.location.pathname,
      },
    });
  }
}
```

### Usage Example

```typescript
// In a route definition
export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    requireAuth(context, '/dashboard');
  },
  // ... rest of route configuration
});
```

### Redirect Behavior

When an unauthenticated user tries to access a protected route:
- User navigating to `/dashboard` → Redirected to `/auth/login?redirect=/dashboard`
- After successful login, user is redirected back to `/dashboard`

## requireGuest() Guard

### Purpose
Protects authentication-related routes (login, register, etc.) from authenticated users. If a user is already authenticated, they are redirected away from these pages.

### Function Signature
```typescript
function requireGuest(context: RouterContext, redirectTo: string = '/dashboard'): void
```

### Parameters
- `context: RouterContext` - The router context containing auth state
- `redirectTo: string` - Redirect destination for authenticated users (defaults to `/dashboard`)

### How It Works

1. **Loading Check**: Returns early if auth is still loading
2. **Authentication Check**: Checks if `auth.user` exists
3. **Redirect Logic**: If a user is found, throws a redirect to the specified destination

```typescript
export function requireGuest(context: RouterContext, redirectTo: string = '/dashboard') {
  const { auth } = context;
  
  if (auth.loading) return;
  
  if (auth.user) {
    throw redirect({
      to: redirectTo,
    });
  }
}
```

### Usage Example

```typescript
// In an auth route definition
export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    requireGuest(context, '/dashboard');
  },
  // ... rest of route configuration
});
```

### Redirect Behavior

When an authenticated user tries to access guest-only routes:
- Authenticated user navigating to `/auth/login` → Redirected to `/dashboard`
- Prevents logged-in users from seeing login/register forms

## Benefits of This Approach

### 1. Centralized Logic
- Single source of truth for authentication checks
- Consistent behavior across all routes
- Easy to maintain and update

### 2. Performance
- No redundant API calls on route navigation
- Uses existing auth context from `useAuth` hook
- Leverages TanStack Router's efficient context system

### 3. Type Safety
- Full TypeScript support with router context
- Compile-time validation of auth properties
- IntelliSense support in route definitions

### 4. Developer Experience
- Simple, declarative API
- Clear separation of concerns
- Reduced boilerplate code

### 5. Flexibility
- Customizable redirect destinations
- Works with any authentication provider
- Easily extensible for additional auth logic

## Migration from Manual Checks

Before implementing these guards, routes used manual API-based authentication checks:

```typescript
// Old approach (verbose and duplicated)
beforeLoad: async () => {
  try {
    const response = await fetch('/api/auth/user', { credentials: 'include' });
    if (!response.ok) {
      throw redirect({ to: '/auth/login', search: { redirect: '/dashboard' } });
    }
  } catch (error) {
    throw redirect({ to: '/auth/login', search: { redirect: '/dashboard' } });
  }
}
```

```typescript
// New approach (clean and centralized)
beforeLoad: ({ context }) => {
  requireAuth(context, '/dashboard');
}
```

This reduces code duplication and improves maintainability significantly.

## Error Handling

The guards use TanStack Router's `redirect` function to perform navigation. This:
- Throws a redirect exception that TanStack Router catches
- Prevents the route from loading
- Maintains proper browser history
- Preserves URL parameters and state

## Security Considerations

These guards work at the route level and should be combined with:
- Server-side authentication validation
- API endpoint protection
- Proper session management
- CSRF protection where applicable

The guards provide UI-level protection and user experience improvements, but server-side validation remains essential for security.