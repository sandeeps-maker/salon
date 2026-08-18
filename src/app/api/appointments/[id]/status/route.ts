import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsAppNotification } from '@/lib/notifications';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const appointmentId = params.id;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const appointment = await db.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: {
        customer: true,
        salon: true,
        services: { include: { service: true } },
      },
    });

    // Update Customer stats if completed
    if (status === 'COMPLETED') {
      await db.customer.update({
        where: { id: appointment.customerId },
        data: {
          totalVisits: { increment: 1 },
          totalSpend: { increment: appointment.totalAmount },
          lastVisitDate: new Date(),
        },
      });
    }

    // Trigger WhatsApp notification according to status
    let notifType: any = null;
    if (status === 'CONFIRMED') notifType = 'BOOKING_CONFIRMED';
    else if (status === 'ARRIVED') notifType = 'ARRIVAL';
    else if (status === 'SERVICE_STARTED') notifType = 'STARTED';
    else if (status === 'COMPLETED') notifType = 'COMPLETED';

    if (notifType) {
      const serviceName = appointment.services.map((s) => s.service.name).join(', ');
      await sendWhatsAppNotification({
        salonId: appointment.salonId,
        recipientPhone: appointment.customer.phone,
        customerName: appointment.customer.name,
        type: notifType,
        salonName: appointment.salon.name,
        serviceName,
      });

      await db.notification.create({
        data: {
          salonId: appointment.salonId,
          customerId: appointment.customerId,
          type: notifType,
          channel: 'WHATSAPP',
          recipient: appointment.customer.phone,
          message: `Status updated to ${status} for service: ${serviceName}`,
          status: 'SENT',
        },
      });
    }

    return NextResponse.json({ success: true, appointment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
