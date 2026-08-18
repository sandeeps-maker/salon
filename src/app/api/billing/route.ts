import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateLoyaltyPointsEarned } from '@/lib/loyalty';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      salonId,
      appointmentId,
      customerId,
      subtotal,
      discountAmount = 0,
      taxAmount = 0,
      paymentMethod = 'CASH',
      redeemPoints = 0,
    } = data;

    if (!salonId || !customerId || !subtotal) {
      return NextResponse.json({ error: 'Missing required billing info (salon, customer, subtotal)' }, { status: 400 });
    }

    // Points redemption calculation (1 point = ₹0.50)
    const pointsDiscount = redeemPoints * 0.5;
    const totalDiscount = Number(discountAmount) + pointsDiscount;
    const finalAmount = Math.max(0, Number(subtotal) - totalDiscount + Number(taxAmount));

    const receiptNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let targetAppointmentId = appointmentId;

    if (!targetAppointmentId) {
      // Create quick walk-in appointment record
      const defaultStaff = await db.salonStaff.findFirst({ where: { salonId } });
      const todayStr = new Date().toISOString().split('T')[0];

      const appt = await db.appointment.create({
        data: {
          salonId,
          customerId,
          staffId: defaultStaff ? defaultStaff.id : '',
          appointmentDate: todayStr,
          startTime: 'NOW',
          endTime: 'NOW',
          status: 'COMPLETED',
          paymentStatus: 'PAID',
          totalAmount: finalAmount,
        },
      });
      targetAppointmentId = appt.id;
    } else {
      // Mark appointment as COMPLETED & PAID
      await db.appointment.update({
        where: { id: targetAppointmentId },
        data: {
          status: 'COMPLETED',
          paymentStatus: 'PAID',
          totalAmount: finalAmount,
        },
      });
    }

    // Create Payment record
    const payment = await db.payment.create({
      data: {
        salonId,
        appointmentId: targetAppointmentId,
        customerId,
        subtotal: Number(subtotal),
        discountAmount: totalDiscount,
        taxAmount: Number(taxAmount),
        finalAmount,
        paymentMethod,
        receiptNumber,
      },
    });

    // Update Customer stats
    await db.customer.update({
      where: { id: customerId },
      data: {
        totalVisits: { increment: 1 },
        totalSpend: { increment: finalAmount },
        lastVisitDate: new Date(),
      },
    });

    // Loyalty points update
    const pointsEarned = calculateLoyaltyPointsEarned(finalAmount, 5); // 5 points per ₹100
    let loyaltyAcc = await db.loyaltyAccount.findUnique({ where: { customerId } });

    if (!loyaltyAcc) {
      loyaltyAcc = await db.loyaltyAccount.create({
        data: { salonId, customerId, pointsBalance: 0 },
      });
    }

    const netPointsChange = pointsEarned - redeemPoints;
    await db.loyaltyAccount.update({
      where: { customerId },
      data: {
        pointsBalance: { increment: netPointsChange },
        totalEarned: { increment: pointsEarned },
        totalRedeemed: { increment: redeemPoints },
      },
    });

    if (pointsEarned > 0) {
      await db.loyaltyTransaction.create({
        data: {
          loyaltyAccountId: loyaltyAcc.id,
          amount: finalAmount,
          points: pointsEarned,
          transactionType: 'EARN',
          description: `Earned on receipt #${receiptNumber}`,
        },
      });
    }

    if (redeemPoints > 0) {
      await db.loyaltyTransaction.create({
        data: {
          loyaltyAccountId: loyaltyAcc.id,
          amount: pointsDiscount,
          points: redeemPoints,
          transactionType: 'REDEEM',
          description: `Redeemed ₹${pointsDiscount} discount on receipt #${receiptNumber}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      payment,
      receiptNumber,
      finalAmount,
      pointsEarned,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
