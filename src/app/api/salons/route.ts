import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const salon = await db.salon.findUnique({
        where: { id },
        include: {
          categories: {
            include: { services: true },
          },
          staff: true,
          offers: { where: { isActive: true } },
          businessHours: true,
          settings: true,
        },
      });
      return NextResponse.json({ success: true, salon });
    }

    const salons = await db.salon.findMany({
      where: { status: 'ACTIVE' },
      include: {
        services: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, salons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
