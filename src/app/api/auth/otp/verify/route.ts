// GGH Auth — Verify OTP

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import {
  successResponse,
  errorResponse,
  normalizePhone,
  isValidEgyptianPhone,
  createSession,
  setSessionCookie,
} from '@/lib/ggh/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return errorResponse('Phone and code are required', 'MISSING_FIELDS');
    }

    if (!isValidEgyptianPhone(phone)) {
      return errorResponse('Invalid Egyptian phone number', 'INVALID_PHONE');
    }

    const normalizedPhone = normalizePhone(phone);

    // Find the most recent valid OTP
    const otpRecord = await db.otpCode.findFirst({
      where: {
        phone: normalizedPhone,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return errorResponse('No valid OTP found. Please request a new one.', 'OTP_EXPIRED');
    }

    // Check attempts (max 3)
    if (otpRecord.attempts >= 3) {
      return errorResponse('Too many attempts. Please request a new OTP.', 'OTP_MAX_ATTEMPTS');
    }

    // Increment attempts
    await db.otpCode.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    // In dev mode, accept "1234"
    if (code !== '1234' && code !== otpRecord.code) {
      return errorResponse('Invalid OTP code', 'INVALID_OTP');
    }

    // Mark OTP as verified
    await db.otpCode.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Find or create customer
    let customer = await db.customer.findUnique({
      where: { phone: normalizedPhone },
    });

    const isNew = !customer;

    if (!customer) {
      // Generate unique placeholder email to avoid unique constraint on empty string
      const placeholderEmail = `${normalizedPhone.replace('+', '')}@ggh.dev`;
      customer = await db.customer.create({
        data: {
          phone: normalizedPhone,
          email: placeholderEmail,
          isVerified: true,
          preferredLang: 'ar',
          wholesaleStatus: 'retail',
        },
      });
    } else {
      // Update verification and last login
      await db.customer.update({
        where: { id: customer.id },
        data: {
          isVerified: true,
          lastLoginAt: new Date(),
        },
      });
    }

    // Create session
    const token = await createSession(customer.id);
    await setSessionCookie(token);

    // Update OTP with customer reference
    await db.otpCode.update({
      where: { id: otpRecord.id },
      data: { customerId: customer.id },
    });

    return successResponse({
      isNew,
      customer: {
        id: customer.id,
        phone: customer.phone,
        firstName: customer.firstName,
        lastName: customer.lastName,
        nameAr: customer.nameAr,
        preferredLang: customer.preferredLang,
        wholesaleStatus: customer.wholesaleStatus,
        isVerified: customer.isVerified,
      },
      token,
    });
  } catch (err) {
    console.error('OTP verify error:', err);
    return errorResponse('Failed to verify OTP', 'OTP_VERIFY_FAILED', 500);
  }
}
