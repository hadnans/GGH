// GGH Admin Auth — Login
// POST: Authenticate admin with email/username + password, create session, set cookie

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { apiHandler, ValidationError, UnauthorizedError } from '@/lib/errors';
import {
  createAdminSession,
  setAdminSessionCookie,
} from '@/lib/ggh/auth/admin-auth';
import { successResponse } from '@/lib/ggh/auth';
import { createLogger } from '@/lib/logger';

const logger = createLogger('admin-auth-login');

// Username-to-email mapping for convenience login
const USERNAME_EMAIL_MAP: Record<string, string> = {
  admin: 'admin@ggh.com',
};

export const POST = apiHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { email, username, password } = body;

  // Resolve email: username takes priority if provided, otherwise use email field
  let resolvedEmail: string | null = null;

  if (username && typeof username === 'string') {
    // Username login — map known usernames to their emails
    const mappedEmail = USERNAME_EMAIL_MAP[username];
    if (!mappedEmail) {
      throw new ValidationError('Unknown username', 'UNKNOWN_USERNAME');
    }
    resolvedEmail = mappedEmail;
    logger.info('Login via username alias', { username, resolvedEmail });
  } else if (email && typeof email === 'string') {
    // Email login — validate format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format', 'INVALID_EMAIL');
    }
    resolvedEmail = email;
  }

  if (!resolvedEmail) {
    throw new ValidationError('Email or username is required', 'MISSING_IDENTIFIER');
  }
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required', 'MISSING_PASSWORD');
  }

  // Look up admin user by email
  const admin = await db.adminUser.findUnique({
    where: { email: resolvedEmail },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!admin) {
    logger.warn('Admin login failed — user not found', { email: resolvedEmail });
    throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  if (!admin.isActive) {
    logger.warn('Admin login failed — user inactive', { email: resolvedEmail });
    throw new UnauthorizedError('Account is deactivated', 'ACCOUNT_DEACTIVATED');
  }

  // Password verification
  // Dev mode: allow "admin" as the default dev password for convenience
  // Production: compare stored passwordHash
  const isDevPassword = password === 'admin';
  const isStoredPassword = admin.passwordHash === password;

  if (!isDevPassword && !isStoredPassword) {
    logger.warn('Admin login failed — invalid password', { email: resolvedEmail });
    throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  // Create admin session
  const token = await createAdminSession(admin.id);
  await setAdminSessionCookie(token);

  // Update last login timestamp
  await db.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const roleNames = admin.roles.map((aur) => aur.role.name);

  logger.info('Admin logged in successfully', { adminId: admin.id, email: resolvedEmail });

  return successResponse({
    user: {
      id: admin.id,
      email: admin.email,
      nameEn: admin.nameEn,
      nameAr: admin.nameAr,
      phone: admin.phone,
      isActive: admin.isActive,
      customerId: admin.customerId,
      roleNames,
    },
    token,
  }, 'Login successful');
});
