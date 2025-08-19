import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { authMiddleware } from '../middleware/auth.js';
import { z } from 'zod';

const settingsRoutes = new Hono();

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email').optional(),
});

// Get user profile
settingsRoutes.get('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('jwtPayload').user;
    
    const userProfile = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        githubId: users.githubId,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (userProfile.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ data: userProfile[0] });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update user profile
settingsRoutes.patch('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('jwtPayload').user;
    const body = await c.req.json();
    
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await db
      .update(users)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        githubId: users.githubId,
        avatarUrl: users.avatarUrl,
      });

    return c.json({ data: updatedUser[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation failed', errors: error.errors }, 400);
    }
    console.error('Error updating profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Delete user account
settingsRoutes.delete('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('jwtPayload').user;

    // Note: In a real application, you might want to handle this more gracefully
    // by anonymizing data instead of hard deleting, depending on your data retention policies
    await db.delete(users).where(eq(users.id, user.id));

    return c.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return c.json({ error: 'Failed to delete account' }, 500);
  }
});

export default settingsRoutes;