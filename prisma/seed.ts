import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SalonOsa Demo Database Seeding...');

  // Clear existing records
  await prisma.subscriptionPayment.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.review.deleteMany();
  await prisma.loyaltyTransaction.deleteMany();
  await prisma.loyaltyAccount.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.appointmentService.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.salonStaff.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.salonSettings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.salon.deleteMany();

  // 1. Super Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: 'Super Admin',
      phone: '9999999999',
      email: 'admin@salonosa.in',
      passwordHash: 'admin123',
      role: 'SUPER_ADMIN',
    },
  });

  // 2. Demo Salon: Glow Beauty Salon
  const salon = await prisma.salon.create({
    data: {
      name: 'Glow Beauty Salon',
      logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&q=80',
      address: 'Shop 14, Sunrise Commercial Complex, MG Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      phone: '9876543210',
      email: 'owner@glowbeautysalon.in',
      status: 'ACTIVE',
    },
  });

  // Salon Settings
  await prisma.salonSettings.create({
    data: {
      salonId: salon.id,
      whatsappApiKey: 'glow_wa_key_88912',
      whatsappPhoneId: '+91 98765 43210',
      autoRemindersEnabled: true,
      rebookingRemindersEnabled: true,
      loyaltyPointsPer100: 5,
      pointRedemptionValue: 0.5,
    },
  });

  // Salon Owner User
  const ownerUser = await prisma.user.create({
    data: {
      name: 'Anish Gupta',
      phone: '9876543210',
      email: 'owner@glowbeautysalon.in',
      passwordHash: 'owner123',
      role: 'SALON_OWNER',
      salonId: salon.id,
    },
  });

  // Business Hours (Mon-Sat 9AM-8PM, Sun Closed)
  for (let i = 0; i <= 6; i++) {
    await prisma.businessHours.create({
      data: {
        salonId: salon.id,
        dayOfWeek: i,
        openTime: '09:00 AM',
        closeTime: '08:00 PM',
        isClosed: i === 0, // Sunday closed
      },
    });
  }

  // Active SaaS Subscription
  const subscription = await prisma.subscription.create({
    data: {
      salonId: salon.id,
      planName: 'SalonOsa Annual Plan',
      price: 2999,
      startDate: new Date('2026-01-01'),
      expiryDate: new Date('2027-01-01'),
      status: 'ACTIVE',
      autoRenew: true,
    },
  });

  await prisma.subscriptionPayment.create({
    data: {
      subscriptionId: subscription.id,
      salonId: salon.id,
      amount: 2999,
      paymentMethod: 'UPI',
      transactionRef: 'UPI/SM20260101/98124',
      status: 'SUCCESS',
    },
  });

  // 3. Staff Members
  const staff1 = await prisma.salonStaff.create({
    data: {
      salonId: salon.id,
      name: 'Priya Sharma',
      role: 'Senior Hair Stylist',
      phone: '9820011223',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
      workingHours: '09:00 AM - 07:00 PM',
      isActive: true,
    },
  });

  const staff2 = await prisma.salonStaff.create({
    data: {
      salonId: salon.id,
      name: 'Rahul Verma',
      role: 'Skin & Facial Specialist',
      phone: '9820022334',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      workingHours: '10:00 AM - 08:00 PM',
      isActive: true,
    },
  });

  const staff3 = await prisma.salonStaff.create({
    data: {
      salonId: salon.id,
      name: 'Neha Patel',
      role: 'Nail & Makeup Artist',
      phone: '9820033445',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
      workingHours: '09:30 AM - 07:30 PM',
      isActive: true,
    },
  });

  // 4. Service Categories & Services
  const catHair = await prisma.serviceCategory.create({
    data: { salonId: salon.id, name: 'Hair Services', sortOrder: 1 },
  });
  const catFacial = await prisma.serviceCategory.create({
    data: { salonId: salon.id, name: 'Facial & Skin Care', sortOrder: 2 },
  });
  const catNails = await prisma.serviceCategory.create({
    data: { salonId: salon.id, name: 'Manicure & Pedicure', sortOrder: 3 },
  });
  const catMakeup = await prisma.serviceCategory.create({
    data: { salonId: salon.id, name: 'Makeup & Spa', sortOrder: 4 },
  });

  const s1 = await prisma.service.create({
    data: {
      salonId: salon.id,
      categoryId: catHair.id,
      name: 'Trendy Haircut & Styling',
      price: 300,
      durationMinutes: 30,
      rebookingDays: 30,
      description: 'Precision haircut with hair wash, blow dry and styling consultation.',
      imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&q=80',
      assignedStaffIds: JSON.stringify([staff1.id]),
    },
  });

  const s2 = await prisma.service.create({
    data: {
      salonId: salon.id,
      categoryId: catHair.id,
      name: 'Nourishing Hair Spa',
      price: 800,
      durationMinutes: 45,
      rebookingDays: 45,
      description: 'Deep conditioning treatment with head massage and steam.',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80',
      assignedStaffIds: JSON.stringify([staff1.id, staff2.id]),
    },
  });

  const s3 = await prisma.service.create({
    data: {
      salonId: salon.id,
      categoryId: catHair.id,
      name: 'Global Hair Color / Highlights',
      price: 1200,
      durationMinutes: 60,
      rebookingDays: 60,
      description: 'Ammonia-free global color with vibrant shine treatment.',
      imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=300&q=80',
      assignedStaffIds: JSON.stringify([staff1.id]),
    },
  });

  const s4 = await prisma.service.create({
    data: {
      salonId: salon.id,
      categoryId: catFacial.id,
      name: 'Glowing Gold Facial',
      price: 600,
      durationMinutes: 45,
      rebookingDays: 45,
      description: 'Instant radiance facial with gold foil mask and neck massage.',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&q=80',
      assignedStaffIds: JSON.stringify([staff2.id]),
    },
  });

  const s5 = await prisma.service.create({
    data: {
      salonId: salon.id,
      categoryId: catFacial.id,
      name: 'Herbal Fruit Facial',
      price: 500,
      durationMinutes: 40,
      rebookingDays: 30,
      description: 'Natural organic fruit extracts for sensitive and oily skin types.',
      imageUrl: 'https://images.unsplash.com/photo-1512290900673-7002fffe9353?w=300&q=80',
      assignedStaffIds: JSON.stringify([staff2.id]),
    },
  });

  const s6 = await prisma.service.create({
    data: {
      salonId: salon.id,
      categoryId: catNails.id,
      name: 'Classic Rose Manicure',
      price: 400,
      durationMinutes: 30,
      rebookingDays: 25,
      description: 'Nail shaping, cuticle treatment, hand scrub & polish.',
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80',
      assignedStaffIds: JSON.stringify([staff3.id]),
    },
  });

  const s7 = await prisma.service.create({
    data: {
      salonId: salon.id,
      categoryId: catNails.id,
      name: 'Aroma Spa Pedicure',
      price: 500,
      durationMinutes: 45,
      rebookingDays: 30,
      description: 'Foot soak, exfoliating scrub, heel softening & reflexology massage.',
      imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=300&q=80',
      assignedStaffIds: JSON.stringify([staff3.id]),
    },
  });

  const s8 = await prisma.service.create({
    data: {
      salonId: salon.id,
      categoryId: catMakeup.id,
      name: 'Party HD Makeup',
      price: 1500,
      durationMinutes: 60,
      rebookingDays: 90,
      description: 'High-definition long-lasting evening glam makeup.',
      imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&q=80',
      assignedStaffIds: JSON.stringify([staff3.id]),
    },
  });

  // 5. Offers
  await prisma.offer.create({
    data: {
      salonId: salon.id,
      code: 'WELCOME50',
      name: 'First Visit 50% OFF',
      description: 'Flat ₹150 OFF on first service booking above ₹300',
      discountType: 'FIXED',
      discountValue: 150,
      startDate: '2026-08-01',
      endDate: '2026-12-31',
      applicableServices: 'ALL',
      maxUsage: 100,
      usedCount: 14,
    },
  });

  await prisma.offer.create({
    data: {
      salonId: salon.id,
      code: 'GLOW20',
      name: 'Festive Glow 20% OFF',
      description: 'Get 20% discount on all Facial & Hair Spa packages',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      startDate: '2026-08-01',
      endDate: '2026-09-30',
      applicableServices: JSON.stringify([s2.id, s4.id]),
      maxUsage: 50,
      usedCount: 8,
    },
  });

  // 6. Customers CRM Data (15 Indian Salon Customers)
  const customersData = [
    { name: 'Rahul Sharma', phone: '9819011111', email: 'rahul.s@gmail.com', gender: 'Male', visits: 8, spend: 7850, preferredStaffId: staff1.id, preferredServiceId: s1.id, lastDaysAgo: 35 },
    { name: 'Anita Deshmukh', phone: '9819022222', email: 'anita.d@gmail.com', gender: 'Female', visits: 12, spend: 14500, preferredStaffId: staff2.id, preferredServiceId: s4.id, lastDaysAgo: 10 },
    { name: 'Siddharth Rao', phone: '9819033333', email: 'siddharth@gmail.com', gender: 'Male', visits: 5, spend: 3200, preferredStaffId: staff1.id, preferredServiceId: s1.id, lastDaysAgo: 45 },
    { name: 'Pooja Mehta', phone: '9819044444', email: 'pooja.m@gmail.com', gender: 'Female', visits: 6, spend: 5400, preferredStaffId: staff3.id, preferredServiceId: s6.id, lastDaysAgo: 2 },
    { name: 'Vikram Joshi', phone: '9819055555', email: 'vikram.j@gmail.com', gender: 'Male', visits: 3, spend: 1800, preferredStaffId: staff1.id, preferredServiceId: s1.id, lastDaysAgo: 60 },
    { name: 'Kavita Singh', phone: '9819066666', email: 'kavita.s@gmail.com', gender: 'Female', visits: 15, spend: 22000, preferredStaffId: staff2.id, preferredServiceId: s4.id, lastDaysAgo: 5 },
    { name: 'Deepak Kumar', phone: '9819077777', email: 'deepak.k@gmail.com', gender: 'Male', visits: 2, spend: 900, preferredStaffId: staff1.id, preferredServiceId: s1.id, lastDaysAgo: 15 },
    { name: 'Sneha Kulkarni', phone: '9819088888', email: 'sneha.k@gmail.com', gender: 'Female', visits: 7, spend: 6800, preferredStaffId: staff3.id, preferredServiceId: s7.id, lastDaysAgo: 1 },
    { name: 'Amitabh Shah', phone: '9819099999', email: 'amitabh@gmail.com', gender: 'Male', visits: 4, spend: 2600, preferredStaffId: staff1.id, preferredServiceId: s1.id, lastDaysAgo: 20 },
    { name: 'Meera Iyer', phone: '9819000000', email: 'meera.i@gmail.com', gender: 'Female', visits: 9, spend: 9500, preferredStaffId: staff2.id, preferredServiceId: s2.id, lastDaysAgo: 3 },
    { name: 'Rohan Gupta', phone: '9819111222', email: 'rohan.g@gmail.com', gender: 'Male', visits: 1, spend: 300, preferredStaffId: staff1.id, preferredServiceId: s1.id, lastDaysAgo: 0 },
    { name: 'Simran Bajaj', phone: '9819222333', email: 'simran.b@gmail.com', gender: 'Female', visits: 4, spend: 3800, preferredStaffId: staff3.id, preferredServiceId: s6.id, lastDaysAgo: 0 },
    { name: 'Tanvi Nair', phone: '9819333444', email: 'tanvi.n@gmail.com', gender: 'Female', visits: 10, spend: 11200, preferredStaffId: staff2.id, preferredServiceId: s4.id, lastDaysAgo: 18 },
    { name: 'Gaurav Jain', phone: '9819444555', email: 'gaurav.j@gmail.com', gender: 'Male', visits: 3, spend: 1500, preferredStaffId: staff1.id, preferredServiceId: s1.id, lastDaysAgo: 28 },
    { name: 'Ritu Kapoor', phone: '9819555666', email: 'ritu.k@gmail.com', gender: 'Female', visits: 11, spend: 13900, preferredStaffId: staff3.id, preferredServiceId: s8.id, lastDaysAgo: 40 }
  ];

  const createdCustomers = [];
  const today = new Date();

  for (const c of customersData) {
    const lastVisit = new Date(today);
    lastVisit.setDate(today.getDate() - c.lastDaysAgo);

    const user = await prisma.user.create({
      data: {
        name: c.name,
        phone: c.phone,
        email: c.email,
        role: 'CUSTOMER',
      },
    });

    const cust = await prisma.customer.create({
      data: {
        salonId: salon.id,
        userId: user.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        gender: c.gender,
        totalVisits: c.visits,
        totalSpend: c.spend,
        preferredStaffId: c.preferredStaffId,
        preferredServiceId: c.preferredServiceId,
        lastVisitDate: lastVisit,
        notes: `Regular customer. Prefers quiet environment and online payments.`,
      },
    });

    // Loyalty Account
    const points = Math.floor((c.spend / 100) * 5);
    await prisma.loyaltyAccount.create({
      data: {
        salonId: salon.id,
        customerId: cust.id,
        pointsBalance: points,
        totalEarned: points,
        totalRedeemed: 0,
      },
    });

    createdCustomers.push(cust);
  }

  // 7. Today's & Weekly Appointments
  const todayStr = today.toISOString().split('T')[0];

  // Appointment 1: Completed today
  const appt1 = await prisma.appointment.create({
    data: {
      salonId: salon.id,
      customerId: createdCustomers[0].id, // Rahul Sharma
      staffId: staff1.id,
      appointmentDate: todayStr,
      startTime: '10:00 AM',
      endTime: '10:30 AM',
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      totalAmount: 300,
      notes: 'Customer arrived on time.',
    },
  });
  await prisma.appointmentService.create({
    data: { appointmentId: appt1.id, serviceId: s1.id, price: 300, durationMinutes: 30 },
  });
  await prisma.payment.create({
    data: {
      salonId: salon.id,
      appointmentId: appt1.id,
      customerId: createdCustomers[0].id,
      subtotal: 300,
      discountAmount: 0,
      taxAmount: 0,
      finalAmount: 300,
      paymentMethod: 'UPI',
      receiptNumber: 'INV-2026-0001',
    },
  });
  await prisma.review.create({
    data: {
      salonId: salon.id,
      customerId: createdCustomers[0].id,
      appointmentId: appt1.id,
      rating: 5,
      comment: 'Excellent haircut by Rahul! Super clean salon and polite behavior.',
    },
  });

  // Appointment 2: Service Started right now
  const appt2 = await prisma.appointment.create({
    data: {
      salonId: salon.id,
      customerId: createdCustomers[1].id, // Anita Deshmukh
      staffId: staff2.id,
      appointmentDate: todayStr,
      startTime: '11:00 AM',
      endTime: '11:45 AM',
      status: 'SERVICE_STARTED',
      paymentStatus: 'PENDING',
      totalAmount: 600,
      notes: 'Requested low steam during facial.',
    },
  });
  await prisma.appointmentService.create({
    data: { appointmentId: appt2.id, serviceId: s4.id, price: 600, durationMinutes: 45 },
  });

  // Appointment 3: Arrived customer
  const appt3 = await prisma.appointment.create({
    data: {
      salonId: salon.id,
      customerId: createdCustomers[3].id, // Pooja Mehta
      staffId: staff3.id,
      appointmentDate: todayStr,
      startTime: '12:00 PM',
      endTime: '12:30 PM',
      status: 'ARRIVED',
      paymentStatus: 'PENDING',
      totalAmount: 400,
    },
  });
  await prisma.appointmentService.create({
    data: { appointmentId: appt3.id, serviceId: s6.id, price: 400, durationMinutes: 30 },
  });

  // Appointment 4: Confirmed upcoming appointment
  const appt4 = await prisma.appointment.create({
    data: {
      salonId: salon.id,
      customerId: createdCustomers[7].id, // Sneha Kulkarni
      staffId: staff3.id,
      appointmentDate: todayStr,
      startTime: '02:30 PM',
      endTime: '03:15 PM',
      status: 'CONFIRMED',
      paymentStatus: 'PENDING',
      totalAmount: 500,
    },
  });
  await prisma.appointmentService.create({
    data: { appointmentId: appt4.id, serviceId: s7.id, price: 500, durationMinutes: 45 },
  });

  // Appointment 5: Pending appointment
  const appt5 = await prisma.appointment.create({
    data: {
      salonId: salon.id,
      customerId: createdCustomers[10].id, // Rohan Gupta
      staffId: staff1.id,
      appointmentDate: todayStr,
      startTime: '05:00 PM',
      endTime: '05:30 PM',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      totalAmount: 300,
    },
  });
  await prisma.appointmentService.create({
    data: { appointmentId: appt5.id, serviceId: s1.id, price: 300, durationMinutes: 30 },
  });

  console.log('✅ Demo Database Seeding Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('Super Admin Credentials : 9999999999 / admin123');
  console.log('Salon Owner Credentials : 9876543210 / owner123');
  console.log('Customer Credentials    : 9819011111 (Rahul Sharma)');
  console.log('Salon Name              : Glow Beauty Salon');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
