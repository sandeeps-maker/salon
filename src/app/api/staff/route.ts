import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get('salonId');

    if (!salonId) {
      return NextResponse.json({ error: 'salonId is required' }, { status: 400 });
    }

    const staff = await db.salonStaff.findMany({
      where: { salonId },
      include: {
        appointments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { salonId, name, phone, role, photoUrl, workingHours } = data;

    if (!salonId || !name || !phone) {
      return NextResponse.json({ error: 'Salon ID, Staff Name, and Phone are required' }, { status: 400 });
    }

    const staffMember = await db.salonStaff.create({
      data: {
        salonId,
        name,
        phone,
        role: role || 'Beautician & Hair Stylist',
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
        workingHours: workingHours || '09:00 AM - 07:00 PM',
      },
    });

    return NextResponse.json({ success: true, staff: staffMember });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
