import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsAppNotification } from '@/lib/notifications';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const salonId = searchParams.get('salonId');

    if (!salonId) {
      return NextResponse.json({ error: 'salonId is required' }, { status: 400 });
    }

    const customers = await db.customer.findMany({
      where: { salonId },
      include: {
        appointments: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          include: {
            services: { include: { service: true } },
          },
        },
      },
    });

    const now = new Date();
    const dueCustomers = [];

    for (const c of customers) {
      if (!c.lastVisitDate) continue;

      const diffDays = Math.floor((now.getTime() - new Date(c.lastVisitDate).getTime()) / (1000 * 3600 * 24));
      
      // Determine service rebooking window
      let rebookingDays = 30; // default
      let lastServiceName = 'Haircut & Styling';

      if (c.appointments.length > 0 && c.appointments[0].services.length > 0) {
        const lastServ = c.appointments[0].services[0].service;
        if (lastServ) {
          rebookingDays = lastServ.rebookingDays || 30;
          lastServiceName = lastServ.name;
        }
      }

      if (diffDays >= rebookingDays) {
        dueCustomers.push({
          customerId: c.id,
          name: c.name,
          phone: c.phone,
          lastVisitDate: c.lastVisitDate,
          daysAgo: diffDays,
          recommendedDays: rebookingDays,
          lastService: lastServiceName,
          isOverdue: diffDays > rebookingDays + 7,
        });
      }
    }

    return NextResponse.json({ success: true, dueCustomers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { salonId, customerId, customerName, phone, serviceName, daysAgo } = await req.json();

    const salon = await db.salon.findUnique({ where: { id: salonId } });

    await sendWhatsAppNotification({
      salonId,
      recipientPhone: phone,
      customerName,
      type: 'REBOOKING_REMINDER',
      salonName: salon?.name || 'our salon',
      serviceName: serviceName || 'haircut',
      rebookingDays: daysAgo || 30,
    });

    await db.notification.create({
      data: {
        salonId,
        customerId,
        type: 'REBOOKING_REMINDER',
        channel: 'WHATSAPP',
        recipient: phone,
        message: `Rebooking reminder sent to ${customerName} (${phone}) for ${serviceName}`,
        status: 'SENT',
      },
    });

    return NextResponse.json({ success: true, message: `Rebooking WhatsApp reminder sent to ${customerName}!` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
