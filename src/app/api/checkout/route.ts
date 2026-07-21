// GGH Checkout — Create order from cart items

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse, requireAuth } from '@/lib/ggh/auth';
import { NextResponse } from 'next/server';

function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `GGH-${dateStr}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;

    const customer = authResult;
    const body = await request.json();
    const { addressId, deliverySlot, deliveryDate, paymentMethod = 'cod', notes = '' } = body;

    if (!addressId) {
      return errorResponse('Address ID is required', 'MISSING_ADDRESS');
    }

    if (!deliverySlot) {
      return errorResponse('Delivery slot is required', 'MISSING_DELIVERY_SLOT');
    }

    if (!deliveryDate) {
      return errorResponse('Delivery date is required', 'MISSING_DELIVERY_DATE');
    }

    // Verify address belongs to customer
    const address = await db.address.findFirst({
      where: { id: addressId, customerId: customer.id, deletedAt: null },
    });

    if (!address) {
      return errorResponse('Address not found', 'ADDRESS_NOT_FOUND', 404);
    }

    // Get cart items
    const cartItems = await db.cartItem.findMany({
      where: { customerId: customer.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return errorResponse('Cart is empty', 'CART_EMPTY');
    }

    // Validate all products are in stock
    for (const item of cartItems) {
      if (!item.product.isActive || item.product.deletedAt) {
        return errorResponse(
          `Product "${item.product.nameEn}" is no longer available`,
          'PRODUCT_UNAVAILABLE'
        );
      }
      if (item.product.stock < item.quantity) {
        return errorResponse(
          `Insufficient stock for "${item.product.nameEn}". Available: ${item.product.stock}`,
          'INSUFFICIENT_STOCK'
        );
      }
    }

    // Calculate subtotal
    let subtotal = 0;
    const orderItemsData = cartItems.map((item) => {
      const totalPrice = item.unitPrice * item.quantity;
      subtotal += totalPrice;
      return {
        productId: item.productId,
        productNameEn: item.product.nameEn,
        productNameAr: item.product.nameAr,
        brandEn: item.product.brandEn,
        brandAr: item.product.brandAr,
        weight: item.product.weight,
        icon: item.product.icon,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice,
      };
    });

    // Calculate delivery fee based on zone
    let deliveryFee = 0;
    const deliveryZone = await db.deliveryZone.findFirst({
      where: { area: address.area, isActive: true },
    });

    if (deliveryZone) {
      deliveryFee = deliveryZone.deliveryFee;
      // Free delivery above minimum order threshold
      if (deliveryZone.minOrder > 0 && subtotal >= deliveryZone.minOrder) {
        deliveryFee = 0;
      }
    }

    const discountAmount = 0;
    const totalAmount = subtotal + deliveryFee - discountAmount;

    // Create address snapshot
    const addressSnapshot = JSON.stringify({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      area: address.area,
      buildingNo: address.buildingNo,
      floorNo: address.floorNo,
      apartmentNo: address.apartmentNo,
      landmark: address.landmark,
      deliveryZone: address.deliveryZone,
    });

    // Generate unique order number
    let orderNumber = generateOrderNumber();
    let existingOrder = await db.order.findUnique({ where: { orderNumber } });
    while (existingOrder) {
      orderNumber = generateOrderNumber();
      existingOrder = await db.order.findUnique({ where: { orderNumber } });
    }

    // Create order with items and status history in a transaction
    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          status: 'pending',
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
          subtotal,
          deliveryFee,
          discountAmount,
          totalAmount,
          notes,
          deliveryAddressId: addressId,
          deliveryAddressSnapshot: addressSnapshot,
          deliverySlot,
          deliveryDate: new Date(deliveryDate),
          items: {
            create: orderItemsData,
          },
          statusHistory: {
            create: {
              status: 'pending',
              note: 'Order placed successfully',
              changedBy: 'customer',
            },
          },
        },
        include: {
          items: true,
          statusHistory: true,
        },
      });

      // Update product stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            totalSold: { increment: item.quantity },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { customerId: customer.id },
      });

      return newOrder;
    });

    return successResponse(order, 'Order placed successfully');
  } catch (err) {
    console.error('Checkout error:', err);
    return errorResponse('Failed to create order', 'CHECKOUT_FAILED', 500);
  }
}
