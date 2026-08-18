export interface NotificationPayload {
  salonId: string;
  recipientPhone: string;
  customerName: string;
  type: 'BOOKING_CONFIRMED' | 'ARRIVAL' | 'STARTED' | 'COMPLETED' | 'REBOOKING_REMINDER' | 'OFFER';
  salonName: string;
  appointmentTime?: string;
  serviceName?: string;
  rebookingDays?: number;
}

export function generateNotificationMessage(payload: NotificationPayload): string {
  switch (payload.type) {
    case 'BOOKING_CONFIRMED':
      return `Hello ${payload.customerName}, your appointment with ${payload.salonName} for ${payload.serviceName || 'service'} is confirmed for ${payload.appointmentTime || 'today'}. Thank you for booking with us!`;
    case 'ARRIVAL':
      return `Welcome ${payload.customerName}! You have been checked in at ${payload.salonName}. Your stylist will be with you shortly.`;
    case 'STARTED':
      return `Hi ${payload.customerName}, your ${payload.serviceName || 'salon'} service at ${payload.salonName} has started. Relax and enjoy!`;
    case 'COMPLETED':
      return `Thank you for visiting ${payload.salonName}, ${payload.customerName}! We hope you loved your experience. Rate us & view special offers on our app.`;
    case 'REBOOKING_REMINDER':
      return `Hi ${payload.customerName}, it's been ${payload.rebookingDays || 30} days since your last ${payload.serviceName || 'haircut'}. Ready for your next pampering session? Book again in 1-click on SalonOsa!`;
    case 'OFFER':
      return `Special offer from ${payload.salonName}! Get 20% OFF on Facials & Hair Spa this week. Book your slot now!`;
    default:
      return `Notification from ${payload.salonName}`;
  }
}

export async function sendWhatsAppNotification(payload: NotificationPayload) {
  const message = generateNotificationMessage(payload);
  console.log(`[WhatsApp API Simulated] To: ${payload.recipientPhone} | Msg: ${message}`);
  return {
    success: true,
    channel: 'WHATSAPP',
    message,
    sentAt: new Date().toISOString(),
  };
}
