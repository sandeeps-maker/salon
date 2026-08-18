'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Home,
  Calendar,
  Gift,
  User,
  Scissors,
  Clock,
  CheckCircle2,
  Star,
  Award,
  Smartphone,
  ChevronRight,
  Sparkles,
  MapPin,
  Phone,
  Search,
  Plus,
} from 'lucide-react';

export default function CustomerMobileAppPage() {
  const [phone, setPhone] = useState('9819011111'); // Rahul Sharma demo
  const [customer, setCustomer] = useState<any>(null);
  const [salons, setSalons] = useState<any[]>([]);
  const [selectedSalon, setSelectedSalon] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'appointments' | 'offers' | 'profile'>('home');
  const [isSimulatorFrame, setIsSimulatorFrame] = useState(true);

  // Booking Flow State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('02:30 PM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Review Submission State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchCustomerData = async () => {
    try {
      const salonRes = await fetch('/api/salons');
      const salonData = await salonRes.json();
      if (salonData.success && salonData.salons.length > 0) {
        setSalons(salonData.salons);
        const mainSalon = salonData.salons[0];

        // Fetch detailed salon
        const detailRes = await fetch(`/api/salons?id=${mainSalon.id}`);
        const detailData = await detailRes.json();
        if (detailData.success) setSelectedSalon(detailData.salon);

        // Fetch customer profile
        const custRes = await fetch(`/api/customers?salonId=${mainSalon.id}`);
        const custData = await custRes.json();
        if (custData.success && custData.customers.length > 0) {
          // Find Rahul Sharma or first customer
          const rahul = custData.customers.find((c: any) => c.phone === '9819011111') || custData.customers[0];
          
          // Fetch full customer with appts
          const fullRes = await fetch(`/api/customers?id=${rahul.id}`);
          const fullData = await fullRes.json();
          if (fullData.success) setCustomer(fullData.customer);
        }
      }
    } catch (err) {
      console.error('Error loading mobile customer app data:', err);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleConfirmBooking = async () => {
    if (!selectedSalon || !selectedService) return;
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId: selectedSalon.id,
          customerId: customer?.id,
          customerName: customer?.name || 'Rahul Sharma',
          customerPhone: customer?.phone || '9819011111',
          staffId: selectedStaff ? selectedStaff.id : (selectedSalon.staff?.[0]?.id || ''),
          serviceIds: [selectedService.id],
          appointmentDate: bookingDate,
          startTime: bookingTime,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingSuccess(false);
          setIsBookingOpen(false);
          fetchCustomerData();
          setActiveTab('appointments');
        }, 1500);
      } else {
        alert(data.error || 'Booking failed');
      }
    } catch (err) {
      alert('Error placing booking');
    }
  };

  const handleReviewSubmit = async (appointmentId: string) => {
    if (!selectedSalon || !customer) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId: selectedSalon.id,
          customerId: customer.id,
          appointmentId,
          rating: reviewRating,
          comment: reviewComment || 'Great service experience!',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewSubmitted(true);
        fetchCustomerData();
      }
    } catch (err) {
      alert('Error submitting review');
    }
  };

  const latestAppt = customer?.appointments?.[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />

      {/* Frame Toggle Header Bar */}
      <div className="bg-slate-800 border-b border-slate-700 py-2.5 px-4 text-center flex items-center justify-between max-w-7xl mx-auto w-full text-xs">
        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
          <Smartphone className="h-4 w-4 text-roseGold-400" />
          Customer React Native App Demo Mode
        </span>

        <button
          onClick={() => setIsSimulatorFrame(!isSimulatorFrame)}
          className="px-3 py-1 rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/40 font-bold hover:bg-brand-500/30 transition"
        >
          {isSimulatorFrame ? 'Switch to Full Screen' : 'Switch to iPhone Frame'}
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 py-8 px-4 flex justify-center items-center">
        <div
          className={`w-full bg-white text-slate-900 shadow-2xl transition-all duration-300 overflow-hidden ${
            isSimulatorFrame
              ? 'max-w-[400px] h-[820px] rounded-[48px] border-[12px] border-slate-800 flex flex-col relative'
              : 'max-w-xl rounded-3xl min-h-[750px] border border-slate-200'
          }`}
        >
          {/* Top Mobile Status Notch Bar */}
          {isSimulatorFrame && (
            <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between text-[11px] font-bold tracking-wider">
              <span>09:41</span>
              <div className="h-4 w-20 bg-slate-800 rounded-full mx-auto" />
              <span>5G 100%</span>
            </div>
          )}

          {/* App Header Bar */}
          <div className="bg-gradient-to-r from-brand-600 to-teal-700 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-sm border border-white/30">
                {customer?.name?.[0] || 'R'}
              </div>
              <div>
                <p className="text-xs text-brand-100 font-medium">Hello 👋</p>
                <p className="text-sm font-extrabold">{customer?.name || 'Rahul Sharma'}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-bold border border-white/20">
              <Award className="h-3.5 w-3.5 text-amber-300" />
              <span>{customer?.loyaltyAccount?.pointsBalance || 350} pts</span>
            </div>
          </div>

          {/* Tab Content Views */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4 no-scrollbar">
            {/* TAB 1: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-4 animate-fadeIn">
                {/* Active Salon Banner */}
                {selectedSalon && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                    <img
                      src={selectedSalon.logoUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200'}
                      alt={selectedSalon.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-extrabold text-sm text-slate-900">{selectedSalon.name}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-brand-600" /> {selectedSalon.city} • Bandra West
                      </p>
                    </div>
                  </div>
                )}

                {/* Upcoming Live Appointment Card */}
                {latestAppt && (
                  <div className="p-4 rounded-2xl gradient-dark text-white shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                        Live Appointment Status
                      </span>
                      <StatusBadge status={latestAppt.status} size="sm" />
                    </div>

                    <div>
                      <p className="font-extrabold text-base">
                        {latestAppt.services?.map((s: any) => s.service?.name).join(', ') || 'Salon Service'}
                      </p>
                      <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                        <Clock className="h-3.5 w-3.5 text-brand-400" />
                        {latestAppt.appointmentDate} at {latestAppt.startTime}
                      </p>
                    </div>

                    {/* Live Tracker Milestone Progress */}
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-[11px] text-slate-400 mb-2">Live Progress Status:</p>
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span className={latestAppt.status !== 'CANCELLED' ? 'text-brand-400' : ''}>Booked</span>
                        <span>→</span>
                        <span className={['CONFIRMED', 'ARRIVED', 'SERVICE_STARTED', 'COMPLETED'].includes(latestAppt.status) ? 'text-brand-400' : ''}>
                          Confirmed
                        </span>
                        <span>→</span>
                        <span className={['ARRIVED', 'SERVICE_STARTED', 'COMPLETED'].includes(latestAppt.status) ? 'text-purple-400' : ''}>
                          Arrived
                        </span>
                        <span>→</span>
                        <span className={['SERVICE_STARTED', 'COMPLETED'].includes(latestAppt.status) ? 'text-indigo-400' : ''}>
                          Started
                        </span>
                        <span>→</span>
                        <span className={latestAppt.status === 'COMPLETED' ? 'text-emerald-400' : ''}>
                          Completed
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Book Services List */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-sm text-slate-900">Popular Salon Services</h3>
                    <span className="text-[11px] font-bold text-brand-700">1-Click Book</span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedSalon?.services?.slice(0, 4).map((service: any) => (
                      <div
                        key={service.id}
                        onClick={() => {
                          setSelectedService(service);
                          setIsBookingOpen(true);
                        }}
                        className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-brand-500 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                            <Scissors className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-slate-900">{service.name}</p>
                            <p className="text-[11px] text-slate-500">{service.durationMinutes} mins</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-xs text-brand-700">{formatCurrency(service.price)}</p>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            Book Slot
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: APPOINTMENTS & REVIEWS */}
            {activeTab === 'appointments' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="font-extrabold text-sm text-slate-900">My Appointment History</h3>

                {customer?.appointments?.map((appt: any) => (
                  <div key={appt.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{appt.appointmentDate}</span>
                      <StatusBadge status={appt.status} size="sm" />
                    </div>

                    <div>
                      <p className="font-bold text-xs text-slate-800">
                        {appt.services?.map((s: any) => s.service?.name).join(', ') || 'Hair Service'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Stylist: {appt.staff?.name || 'Priya Sharma'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="font-extrabold text-slate-900">{formatCurrency(appt.totalAmount)}</span>

                      {appt.status === 'COMPLETED' && !appt.review && !reviewSubmitted && (
                        <button
                          onClick={() => handleReviewSubmit(appt.id)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm"
                        >
                          <Star className="h-3 w-3 fill-white" /> Rate Experience
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: OFFERS & REWARDS */}
            {activeTab === 'offers' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-200">My Loyalty Balance</p>
                  <p className="text-2xl font-extrabold mt-1">{customer?.loyaltyAccount?.pointsBalance || 350} Points</p>
                  <p className="text-xs text-purple-100 mt-1">Reward Value: <strong>₹{(customer?.loyaltyAccount?.pointsBalance || 350) * 0.5} OFF</strong></p>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900">Active Salon Offers</h3>
                {selectedSalon?.offers?.map((offer: any) => (
                  <div key={offer.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-mono font-bold text-xs">
                        {offer.code}
                      </span>
                      <span className="text-xs font-extrabold text-brand-700">
                        {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-slate-900">{offer.name}</p>
                    <p className="text-[11px] text-slate-500">{offer.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                  <div className="h-16 w-16 rounded-full bg-brand-500 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
                    {customer?.name?.[0] || 'R'}
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">{customer?.name || 'Rahul Sharma'}</h4>
                  <p className="text-xs text-slate-500">{customer?.phone || '9819011111'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Total Salon Visits</span>
                    <span className="font-bold text-slate-900">{customer?.totalVisits || 8} Visits</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-semibold">Total Spent</span>
                    <span className="font-bold text-brand-700">{formatCurrency(customer?.totalSpend || 7850)}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 font-semibold">Preferred Salon</span>
                    <span className="font-bold text-slate-900">Glow Beauty Salon</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom App Navigation Bar */}
          <div className="bg-white border-t border-slate-200 p-2 flex items-center justify-around text-[10px] font-bold text-slate-500">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === 'home' ? 'text-brand-600 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === 'appointments' ? 'text-brand-600 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>Appointments</span>
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === 'offers' ? 'text-brand-600 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <Gift className="h-5 w-5" />
              <span>Offers</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 transition ${
                activeTab === 'profile' ? 'text-brand-600 font-extrabold' : 'hover:text-slate-800'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Service Booking Sheet Overlay */}
      {isBookingOpen && selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 text-slate-900 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base">Book {selectedService.name}</h3>
              <button onClick={() => setIsBookingOpen(false)} className="text-slate-400 font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Available Slot</label>
                <div className="grid grid-cols-3 gap-2">
                  {['10:00 AM', '12:00 PM', '02:30 PM', '04:00 PM', '06:00 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingTime(slot)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        bookingTime === slot ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleConfirmBooking}
                className="w-full py-3.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md hover:opacity-95 transition"
              >
                {bookingSuccess ? 'Booking Confirmed! 🎉' : `Confirm Booking • ${formatCurrency(selectedService.price)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
