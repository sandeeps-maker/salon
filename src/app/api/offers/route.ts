import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get('salonId');

    if (!salonId) {
      return NextResponse.json({ error: 'salonId is required' }, { status: 400 });
    }

    const offers = await db.offer.findMany({
      where: { salonId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, offers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { salonId, code, name, description, discountType, discountValue, startDate, endDate, maxUsage } = data;

    if (!salonId || !code || !name || !discountValue) {
      return NextResponse.json({ error: 'Salon ID, Code, Name, and Discount Value are required' }, { status: 400 });
    }

    const offer = await db.offer.create({
      data: {
        salonId,
        code: code.toUpperCase(),
        name,
        description,
        discountType: discountType || 'PERCENTAGE',
        discountValue: Number(discountValue),
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || '2026-12-31',
        maxUsage: Number(maxUsage) || 100,
      },
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
