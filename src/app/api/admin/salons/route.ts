import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const salons = await db.salon.findMany({
      include: {
        subscriptions: { orderBy: { createdAt: 'desc' } },
        users: { where: { role: 'SALON_OWNER' } },
        _count: {
          select: {
            customers: true,
            appointments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalSalons = salons.length;
    const activeSalons = salons.filter((s) => s.status === 'ACTIVE').length;
    const totalRevenue = activeSalons * 2999;

    return NextResponse.json({
      success: true,
      salons,
      metrics: {
        totalSalons,
        activeSalons,
        totalRevenue,
        planPrice: 2999,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { salonId, status } = await req.json();

    if (!salonId || !status) {
      return NextResponse.json({ error: 'salonId and status are required' }, { status: 400 });
    }

    const salon = await db.salon.update({
      where: { id: salonId },
      data: { status },
    });

    return NextResponse.json({ success: true, salon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
