import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsAppNotification } from '@/lib/notifications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get('salonId');
    const customerId = searchParams.get('customerId');
    const date = searchParams.get('date');

    const where: any = {};
    if (salonId) where.salonId = salonId;
    if (customerId) where.customerId = customerId;
    if (date) where.appointmentDate = date;

    const appointments = await db.appointment.findMany({
      where,
      include: {
        customer: true,
        staff: true,
        services: {
          include: { service: true },
        },
        payment: true,
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, appointments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      salonId,
      customerId,
      customerName,
      customerPhone,
      staffId,
      serviceIds,
      appointmentDate,
      startTime,
      endTime,
      notes,
    } = data;

    if (!salonId || !staffId || !serviceIds || !serviceIds.length || !appointmentDate || !startTime) {
      return NextResponse.json(
        { error: 'Missing required appointment fields (salon, staff, services, date, time)' },
        { status: 400 }
      );
    }

    // Double Booking Prevention Check
    const existingConflict = await db.appointment.findFirst({
      where: {
        salonId,
        staffId,
        appointmentDate,
        startTime,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
    });

    if (existingConflict) {
      return NextResponse.json(
        { error: 'The selected staff member is already booked at this time slot. Please choose another time or staff.' },
        { status: 409 }
      );
    }

    // Resolve or Create Customer CRM record
    let targetCustomerId = customerId;
    let targetCustomerName = customerName;

    if (!targetCustomerId) {
      if (!customerPhone) {
        return NextResponse.json({ error: 'Customer phone is required' }, { status: 400 });
      }

      let existingCust = await db.customer.findFirst({
        where: { salonId, phone: customerPhone },
      });

      if (!existingCust) {
        existingCust = await db.customer.create({
          data: {
            salonId,
            name: customerName || 'Walk-in Customer',
            phone: customerPhone,
          },
        });
        await db.loyaltyAccount.create({
          data: {
            salonId,
            customerId: existingCust.id,
            pointsBalance: 0,
          },
        });
      }

      targetCustomerId = existingCust.id;
      targetCustomerName = existingCust.name;
    }

    // Fetch services to calculate total price and duration
    const services = await db.service.findMany({
      where: { id: { in: serviceIds } },
    });

    const totalAmount = services.reduce((acc, s) => acc + s.price, 0);

    const appointment = await db.appointment.create({
      data: {
        salonId,
        customerId: targetCustomerId,
        staffId,
        appointmentDate,
        startTime,
        endTime: endTime || startTime,
        status: 'CONFIRMED',
        paymentStatus: 'PENDING',
        totalAmount,
        notes,
      },
      include: {
        customer: true,
        staff: true,
        salon: true,
      },
    });

    // Create AppointmentServices junction records
    for (const s of services) {
      await db.appointmentService.create({
        data: {
          appointmentId: appointment.id,
          serviceId: s.id,
          price: s.price,
          durationMinutes: s.durationMinutes,
        },
      });
    }

    // Emit Automated WhatsApp Notification
    await sendWhatsAppNotification({
      salonId,
      recipientPhone: appointment.customer.phone,
      customerName: appointment.customer.name,
      type: 'BOOKING_CONFIRMED',
      salonName: appointment.salon.name,
      appointmentTime: `${appointmentDate} at ${startTime}`,
      serviceName: services.map((s) => s.name).join(', '),
    });

    await db.notification.create({
      data: {
        salonId,
        customerId: targetCustomerId,
        type: 'BOOKING_CONFIRMED',
        channel: 'WHATSAPP',
        recipient: appointment.customer.phone,
        message: `Booking confirmed for ${appointmentDate} at ${startTime}`,
        status: 'SENT',
      },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
