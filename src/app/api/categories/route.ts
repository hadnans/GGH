// GGH Categories — List all active categories with product counts

import { db } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/ggh/auth';

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true, deletedAt: null },
            },
          },
        },
      },
    });

    const categoriesWithCount = categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      nameEn: cat.nameEn,
      nameAr: cat.nameAr,
      descriptionEn: cat.descriptionEn,
      descriptionAr: cat.descriptionAr,
      icon: cat.icon,
      color: cat.color,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
      parentId: cat.parentId,
      productCount: cat._count.products,
    }));

    return successResponse(categoriesWithCount);
  } catch (err) {
    console.error('Categories list error:', err);
    return errorResponse('Failed to fetch categories', 'CATEGORIES_FETCH_FAILED', 500);
  }
}
