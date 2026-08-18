import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get('salonId');

    if (!salonId) {
      return NextResponse.json({ error: 'salonId is required' }, { status: 400 });
    }

    const categories = await db.serviceCategory.findMany({
      where: { salonId },
      include: {
        services: { orderBy: { name: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const allServices = await db.service.findMany({
      where: { salonId },
      include: { category: true },
    });

    return NextResponse.json({ success: true, categories, services: allServices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { salonId, categoryId, categoryName, name, price, durationMinutes, rebookingDays, description, imageUrl, assignedStaffIds } = data;

    if (!salonId || !name || !price || !durationMinutes) {
      return NextResponse.json({ error: 'Salon ID, Service Name, Price, and Duration are required' }, { status: 400 });
    }

    let targetCategoryId = categoryId;
    if (!targetCategoryId && categoryName) {
      let cat = await db.serviceCategory.findFirst({
        where: { salonId, name: categoryName },
      });
      if (!cat) {
        cat = await db.serviceCategory.create({
          data: { salonId, name: categoryName, sortOrder: 5 },
        });
      }
      targetCategoryId = cat.id;
    }

    if (!targetCategoryId) {
      let defaultCat = await db.serviceCategory.findFirst({ where: { salonId } });
      if (!defaultCat) {
        defaultCat = await db.serviceCategory.create({ data: { salonId, name: 'General Services' } });
      }
      targetCategoryId = defaultCat.id;
    }

    const service = await db.service.create({
      data: {
        salonId,
        categoryId: targetCategoryId,
        name,
        price: Number(price),
        durationMinutes: Number(durationMinutes),
        rebookingDays: Number(rebookingDays) || 30,
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&q=80',
        assignedStaffIds: assignedStaffIds ? JSON.stringify(assignedStaffIds) : '',
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
