import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get('salonId');

    if (!salonId) {
      return NextResponse.json({ error: 'salonId is required' }, { status: 400 });
    }

    const reviews = await db.review.findMany({
      where: { salonId },
      include: {
        customer: true,
        appointment: {
          include: { services: { include: { service: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalCount = reviews.length;
    const avgRating = totalCount > 0 ? (reviews.reduce((a, b) => a + b.rating, 0) / totalCount).toFixed(1) : '5.0';

    return NextResponse.json({ success: true, reviews, avgRating, totalCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { salonId, customerId, appointmentId, rating, comment } = await req.json();

    if (!salonId || !customerId || !appointmentId || !rating) {
      return NextResponse.json({ error: 'Missing required review fields' }, { status: 400 });
    }

    // Check if review already exists for this appointment
    const existing = await db.review.findUnique({
      where: { appointmentId },
    });

    let review;
    if (existing) {
      review = await db.review.update({
        where: { appointmentId },
        data: {
          rating: Number(rating),
          comment,
        },
      });
    } else {
      review = await db.review.create({
        data: {
          salonId,
          customerId,
          appointmentId,
          rating: Number(rating),
          comment,
        },
      });
    }

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
