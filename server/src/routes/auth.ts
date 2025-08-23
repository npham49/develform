import { Octokit } from '@octokit/rest';
import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';
import { db } from '../db/index';
import { authMiddleware } from '../middleware/auth';
import * as authService from '../services/auth';
import type { AuthUser } from '../types/index';

const auth = new Hono();

/**
 * Initiates GitHub OAuth flow by redirecting to GitHub authorization
 * Constructs OAuth URL with client ID and redirect URI from environment
 */
auth.get('/github', async (c) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.GITHUB_REDIRECT_URI || 'http://localhost:3001/api/auth/github/callback');

  if (!clientId) {
    return c.json({ error: 'GitHub OAuth not configured' }, 500);
  }

  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

  return c.redirect(githubUrl);
});

/**
 * Handles GitHub OAuth callback after user authorization
 * Exchanges code for access token, fetches user data, creates/updates user record
 * Sets JWT cookie and redirects to dashboard on success
 */
auth.get('/github/callback', async (c) => {
  const code = c.req.query('code');
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    return c.json({ error: 'Invalid OAuth callback' }, 400);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = (await tokenResponse.json()) as { access_token?: string; error?: string };

    if (!tokenData.access_token) {
      return c.json({ error: 'Failed to get access token' }, 400);
    }

    // Get user info from GitHub
    const octokit = new Octokit({
      auth: tokenData.access_token,
    });

    const { data: githubUser } = await octokit.rest.users.getAuthenticated();

    // Find or create user in database
    let user = await authService.findUserByGithubId(db, githubUser.id.toString());

    if (user.length === 0) {
      // Check if user exists by email
      if (githubUser.email) {
        const existingUser = await authService.findUserByEmail(db, githubUser.email);

        if (existingUser.length > 0) {
          // Update existing user with GitHub data
          await authService.updateUserWithGithubData(db, existingUser[0].id, {
            githubId: githubUser.id.toString(),
            avatarUrl: githubUser.avatar_url,
          });

          user = existingUser;
        } else {
          // Create new user
          const newUser = await authService.createUser(db, {
            name: githubUser.name || githubUser.login,
            email: githubUser.email,
            githubId: githubUser.id.toString(),
            avatarUrl: githubUser.avatar_url,
          });

          user = newUser;
        }
      } else {
        // Create new user without email
        const newUser = await authService.createUser(db, {
          name: githubUser.name || githubUser.login,
          githubId: githubUser.id.toString(),
          avatarUrl: githubUser.avatar_url,
        });

        user = newUser;
      }
    }

    // Create JWT token
    const authUser: AuthUser = {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      githubId: user[0].githubId,
      avatarUrl: user[0].avatarUrl,
    };

    const token = await sign(
      {
        sub: user[0].id.toString(),
        user: authUser,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
      },
      process.env.JWT_SECRET || 'your-secret-key',
    );

    // Set cookie and redirect to frontend
    setCookie(c, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const redirectUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    return c.redirect(`${redirectUrl}/dashboard`);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return c.json({ error: 'Authentication failed' }, 500);
  }
});

/**
 * Retrieves current authenticated user information
 * Returns user data from JWT payload for client-side state management
 */
auth.get('/user', authMiddleware, async (c) => {
  const payload = c.get('jwtPayload');

  if (!payload) {
    console.log('Not authenticated');
    return c.json({ error: 'Not authenticated' }, 401);
  }

  return c.json({ user: payload.user });
});

/**
 * Logs out the current user by clearing the auth cookie
 * Client should redirect to login page after successful logout
 */
auth.post('/logout', authMiddleware, async (c) => {
  deleteCookie(c, 'auth_token');
  return c.json({ message: 'Logged out successfully' });
});

export default auth;
