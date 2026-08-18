import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { phone, otp, name, salonId } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // In MVP demo mode, any 4-digit OTP is valid (default 1234)
    let user = await db.user.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          name: name || `Customer ${phone.slice(-4)}`,
          phone,
          role: 'CUSTOMER',
          salonId: salonId || null,
        },
      });
    }

    // Ensure Customer record exists for this salon if salonId is provided
    if (salonId) {
      const existingCustomer = await db.customer.findFirst({
        where: { salonId, phone },
      });

      if (!existingCustomer) {
        const cust = await db.customer.create({
          data: {
            salonId,
            userId: user.id,
            name: user.name,
            phone: user.phone,
          },
        });
        await db.loyaltyAccount.create({
          data: {
            salonId,
            customerId: cust.id,
            pointsBalance: 50, // 50 welcome bonus points
            totalEarned: 50,
          },
        });
      }
    }

    const token = signToken({
      userId: user.id,
      name: user.name,
      phone: user.phone,
      role: 'CUSTOMER',
      salonId: salonId || undefined,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: 'CUSTOMER',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'OTP verification failed' }, { status: 500 });
  }
}
