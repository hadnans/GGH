// GGH Admin Auth — Session Check
// GET: Check admin session status, return full admin profile if authenticated
// Includes roleNames and permissionNames for frontend RBAC

import { db } from '@/lib/db';
import { apiHandler } from '@/lib/errors';
import { getAuthenticatedAdmin } from '@/lib/ggh/auth/admin-auth';
import { successResponse } from '@/lib/ggh/auth';
import { createLogger } from '@/lib/logger';

const logger = createLogger('admin-auth-session');

export const GET = apiHandler(async () => {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    return successResponse({ authenticated: false });
  }

  // Fetch full permissions list for this admin (via all roles)
  const adminRoles = await db.adminUserRole.findMany({
    where: { adminId: admin.id },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  // Collect all unique permission names across all roles
  const permissionNames = new Set<string>();
  for (const adminRole of adminRoles) {
    for (const rolePerm of adminRole.role.permissions) {
      permissionNames.add(rolePerm.permission.name);
    }
  }

  logger.info('Admin session verified', { adminId: admin.id, roleCount: adminRoles.length, permissionCount: permissionNames.size });

  return successResponse({
    authenticated: true,
    user: {
      id: admin.id,
      email: admin.email,
      nameEn: admin.nameEn,
      nameAr: admin.nameAr,
      phone: admin.phone,
      isActive: admin.isActive,
      customerId: admin.customerId,
      roleNames: admin.roleNames,
      permissionNames: Array.from(permissionNames),
    },
  });
});
