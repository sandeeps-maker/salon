import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get('salonId');
    const id = searchParams.get('id');

    if (id) {
      const customer = await db.customer.findUnique({
        where: { id },
        include: {
          appointments: {
            include: { staff: true, services: { include: { service: true } }, payment: true },
            orderBy: { createdAt: 'desc' },
          },
          loyaltyAccount: true,
          reviews: true,
        },
      });
      return NextResponse.json({ success: true, customer });
    }

    if (!salonId) {
      return NextResponse.json({ error: 'salonId is required' }, { status: 400 });
    }

    const customers = await db.customer.findMany({
      where: { salonId },
      include: {
        loyaltyAccount: true,
        appointments: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { lastVisitDate: 'desc' },
    });

    return NextResponse.json({ success: true, customers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { salonId, name, phone, email, birthday, gender, notes, preferredStaffId, preferredServiceId } = data;

    if (!salonId || !name || !phone) {
      return NextResponse.json({ error: 'Salon ID, Customer Name, and Phone are required' }, { status: 400 });
    }

    const existing = await db.customer.findFirst({
      where: { salonId, phone },
    });

    if (existing) {
      return NextResponse.json({ error: 'Customer with this phone number already exists in your salon' }, { status: 409 });
    }

    const customer = await db.customer.create({
      data: {
        salonId,
        name,
        phone,
        email,
        birthday,
        gender: gender || 'Female',
        notes,
        preferredStaffId,
        preferredServiceId,
      },
    });

    // Create Loyalty Account
    await db.loyaltyAccount.create({
      data: {
        salonId,
        customerId: customer.id,
        pointsBalance: 0,
      },
    });

    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
