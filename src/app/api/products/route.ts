// GGH Products — List products with pagination, filtering, sorting

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, paginatedResponse, errorResponse } from '@/lib/ggh/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'popular';
    const featured = searchParams.get('featured');
    const deals = searchParams.get('deals');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      deletedAt: null,
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { nameEn: { contains: search } },
        { nameAr: { contains: search } },
        { brandEn: { contains: search } },
        { brandAr: { contains: search } },
        { handle: { contains: search } },
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (deals === 'true') {
      where.isDeal = true;
    }

    // Build order by
    let orderBy: Prisma.ProductOrderByWithRelationInput = { totalSold: 'desc' };
    switch (sort) {
      case 'price_asc':
        orderBy = { todayPrice: 'asc' };
        break;
      case 'price_desc':
        orderBy = { todayPrice: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'popular':
      default:
        orderBy = { totalSold: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
      db.product.count({ where }),
    ]);

    return paginatedResponse(products, page, limit, total);
  } catch (err) {
    console.error('Products list error:', err);
    return errorResponse('Failed to fetch products', 'PRODUCTS_FETCH_FAILED', 500);
  }
}
