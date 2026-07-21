// GGH Search — Search products and categories

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/ggh/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const lang = searchParams.get('lang') || 'en';

    if (!query || query.trim().length < 2) {
      return errorResponse('Search query must be at least 2 characters', 'INVALID_QUERY');
    }

    const searchTerm = query.trim();

    // Search products
    const productWhere: Prisma.ProductWhereInput = {
      isActive: true,
      deletedAt: null,
      OR: [
        { nameEn: { contains: searchTerm } },
        { nameAr: { contains: searchTerm } },
        { brandEn: { contains: searchTerm } },
        { brandAr: { contains: searchTerm } },
        { handle: { contains: searchTerm } },
      ],
    };

    const categoryWhere: Prisma.CategoryWhereInput = {
      isActive: true,
      deletedAt: null,
      OR: [
        { nameEn: { contains: searchTerm } },
        { nameAr: { contains: searchTerm } },
        { slug: { contains: searchTerm } },
      ],
    };

    const [products, categories] = await Promise.all([
      db.product.findMany({
        where: productWhere,
        take: 20,
        orderBy: { totalSold: 'desc' },
        include: {
          category: {
            select: {
              id: true,
              slug: true,
              nameEn: true,
              nameAr: true,
              icon: true,
              color: true,
            },
          },
        },
      }),
      db.category.findMany({
        where: categoryWhere,
        take: 10,
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: {
            select: {
              products: { where: { isActive: true, deletedAt: null } },
            },
          },
        },
      }),
    ]);

    const totalProducts = await db.product.count({ where: productWhere });
    const totalCategories = await db.category.count({ where: categoryWhere });

    return successResponse({
      products,
      categories: categories.map((cat) => ({
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
      })),
      totalProducts,
      totalCategories,
    });
  } catch (err) {
    console.error('Search error:', err);
    return errorResponse('Search failed', 'SEARCH_FAILED', 500);
  }
}
