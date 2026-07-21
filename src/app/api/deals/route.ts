// GGH Deals — List active deals with products

import { db } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/ggh/auth';

export async function GET() {
  try {
    const deals = await db.deal.findMany({
      where: {
        isActive: true,
        startsAt: { lte: new Date() },
        endsAt: { gt: new Date() },
      },
      orderBy: { discountPercent: 'desc' },
    });

    // Fetch products separately to avoid relation issues during dev hot reload
    const productIds = deals.map((d) => d.productId);
    const products = await db.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
        deletedAt: null,
      },
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
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const dealsWithProducts = deals.map((deal) => ({
      ...deal,
      product: productMap.get(deal.productId) || null,
    }));

    return successResponse(dealsWithProducts);
  } catch (err) {
    console.error('Deals list error:', err);
    return errorResponse('Failed to fetch deals', 'DEALS_FETCH_FAILED', 500);
  }
}
