import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { phone, password, role } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { phone },
      include: { salon: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found with this phone number' }, { status: 404 });
    }

    // Role check if provided
    if (role && user.role !== role && user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: `Access denied. Role is ${user.role}` }, { status: 403 });
    }

    const token = signToken({
      userId: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role as any,
      salonId: user.salonId || undefined,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        salonId: user.salonId,
        salonName: user.salon?.name || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}
