import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { env } from '../env.js';
import { AdminLoginSchema } from '../schemas/order.schema.js';
import { loginRateLimiter, resetLoginLimit } from '../middleware/rateLimit.js';
import { verifyJWT } from '../middleware/auth.js';

export const authRouter = Router();

const COOKIE_NAME = 'charms_admin_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: env.NODE_ENV === 'production',
  maxAge: 8 * 60 * 60 * 1000, // 8 hours
  path: '/',
};

// POST /api/auth/login
authRouter.post('/login', loginRateLimiter, async (req, res) => {
  const parse = AdminLoginSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: 'Invalid credentials', details: parse.error.flatten() });
    return;
  }

  const { email, password } = parse.data;

  const user = await db.adminUser.findUnique({ where: { email } });
  if (!user) {
    // Constant-time response — do not leak existence
    await bcrypt.compare(password, '$2b$12$dummyhash.placeholder.value.to.prevent.timing.attack.ab');
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  // Login success — reset rate limit
  resetLoginLimit(req);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  res.json({ email: user.email, role: user.role });
});

// POST /api/auth/logout
authRouter.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
authRouter.get('/me', verifyJWT, (req, res) => {
  res.json({ email: req.admin!.email, role: req.admin!.role });
});
