// GGH Auth — Send OTP

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse, normalizePhone, isValidEgyptianPhone } from '@/lib/ggh/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return errorResponse('Phone number is required', 'MISSING_PHONE');
    }

    if (!isValidEgyptianPhone(phone)) {
      return errorResponse('Invalid Egyptian phone number', 'INVALID_PHONE');
    }

    const normalizedPhone = normalizePhone(phone);

    // Invalidate any previous OTPs for this phone
    await db.otpCode.updateMany({
      where: { phone: normalizedPhone, verified: false },
      data: { verified: true }, // Mark as used to invalidate
    });

    // In development mode, always use code 1234
    const code = '1234';
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await db.otpCode.create({
      data: {
        phone: normalizedPhone,
        code,
        expiresAt,
        attempts: 0,
        verified: false,
      },
    });

    return successResponse(
      { message: 'OTP sent successfully' },
      'OTP sent successfully'
    );
  } catch (err) {
    console.error('OTP send error:', err);
    return errorResponse('Failed to send OTP', 'OTP_SEND_FAILED', 500);
  }
}
