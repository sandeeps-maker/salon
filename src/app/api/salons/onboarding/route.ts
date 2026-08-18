import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      name,
      logoUrl,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      ownerName,
      ownerPhone,
      services,
      staff,
    } = data;

    if (!name || !phone || !ownerPhone) {
      return NextResponse.json({ error: 'Salon name, phone, and owner phone are required' }, { status: 400 });
    }

    // Create Salon tenant
    const salon = await db.salon.create({
      data: {
        name,
        logoUrl: logoUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&q=80',
        address: address || 'Main Market Road',
        city: city || 'Mumbai',
        state: state || 'Maharashtra',
        pincode: pincode || '400001',
        phone,
        email: email || `${phone}@salonmitra.in`,
        status: 'ACTIVE',
      },
    });

    // Create Salon Owner User
    const ownerUser = await db.user.create({
      data: {
        name: ownerName || 'Salon Owner',
        phone: ownerPhone,
        email: email || `${phone}@salonmitra.in`,
        role: 'SALON_OWNER',
        salonId: salon.id,
      },
    });

    // Default Salon Settings
    await db.salonSettings.create({
      data: {
        salonId: salon.id,
        whatsappApiKey: `sm_wa_${salon.id.slice(0, 8)}`,
        whatsappPhoneId: phone,
        autoRemindersEnabled: true,
        rebookingRemindersEnabled: true,
      },
    });

    // Default Subscription (₹2,999/yr)
    await db.subscription.create({
      data: {
        salonId: salon.id,
        planName: 'SalonOsa Annual Plan',
        price: 2999,
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
      },
    });

    // Create Business Hours
    for (let i = 0; i <= 6; i++) {
      await db.businessHours.create({
        data: {
          salonId: salon.id,
          dayOfWeek: i,
          openTime: '09:00 AM',
          closeTime: '08:00 PM',
          isClosed: i === 0,
        },
      });
    }

    // Default Categories & Services
    const defaultCat = await db.serviceCategory.create({
      data: { salonId: salon.id, name: 'General Services', sortOrder: 1 },
    });

    if (services && Array.isArray(services) && services.length > 0) {
      for (const s of services) {
        await db.service.create({
          data: {
            salonId: salon.id,
            categoryId: defaultCat.id,
            name: s.name,
            price: Number(s.price) || 300,
            durationMinutes: Number(s.duration) || 30,
            rebookingDays: 30,
          },
        });
      }
    } else {
      await db.service.create({
        data: {
          salonId: salon.id,
          categoryId: defaultCat.id,
          name: 'Haircut & Styling',
          price: 300,
          durationMinutes: 30,
          rebookingDays: 30,
        },
      });
    }

    // Add Staff
    if (staff && Array.isArray(staff) && staff.length > 0) {
      for (const st of staff) {
        await db.salonStaff.create({
          data: {
            salonId: salon.id,
            name: st.name,
            phone: st.phone || phone,
            role: st.role || 'Stylist',
          },
        });
      }
    } else {
      await db.salonStaff.create({
        data: {
          salonId: salon.id,
          name: ownerName || 'Main Stylist',
          phone: ownerPhone,
          role: 'Owner & Senior Stylist',
        },
      });
    }

    return NextResponse.json({
      success: true,
      salonId: salon.id,
      ownerUserId: ownerUser.id,
      message: 'Salon setup completed successfully in under 10 minutes!',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
