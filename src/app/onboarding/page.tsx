'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import {
  Scissors,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building,
  MapPin,
  Phone,
  Clock,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '',
    email: '',
    ownerName: '',
    ownerPhone: '',
    serviceName: 'Haircut & Styling',
    servicePrice: '300',
    staffName: '',
    staffPhone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteSetup = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/salons/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || 'Royal Beauty Studio',
          logoUrl: formData.logoUrl,
          address: formData.address || 'Shop 5, Main Commercial Hub',
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone || '9876500000',
          email: formData.email,
          ownerName: formData.ownerName || 'Salon Owner',
          ownerPhone: formData.ownerPhone || formData.phone || '9876500000',
          services: [
            { name: formData.serviceName || 'Haircut & Styling', price: formData.servicePrice || 300, duration: 30 },
            { name: 'Nourishing Hair Spa', price: 800, duration: 45 },
            { name: 'Glowing Gold Facial', price: 600, duration: 45 },
          ],
          staff: [
            { name: formData.staffName || 'Main Stylist', phone: formData.staffPhone || formData.phone || '9876500000', role: 'Senior Stylist' },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep(8); // Completion step
      } else {
        alert(data.error || 'Onboarding failed');
      }
    } catch (err: any) {
      alert(err.message || 'Error completing setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* Progress Steps Header */}
        <div className="mb-8 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Step {step} of 8 — {step === 8 ? 'Complete' : 'Quick Salon Setup'}
            </span>
            <span className="text-xs font-semibold text-slate-500">{Math.round((step / 8) * 100)}% Finished</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="gradient-teal h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
          {/* Step 1: Salon Name */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Building className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">What is your Salon's Name?</h2>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                This is the public name your customers will see on receipts and the mobile booking app.
              </p>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Salon Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Royal Beauty Salon & Spa"
                className="w-full p-4 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none mb-6"
              />
              <button
                onClick={() => {
                  if (!formData.name.trim()) return alert('Please enter salon name');
                  setStep(2);
                }}
                className="w-full py-4 rounded-xl gradient-teal text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 transition"
              >
                <span>Next: Add Salon Logo</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Step 2: Salon Logo */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Add Salon Logo (Optional)</h2>
              <p className="text-slate-500 text-sm mt-1 mb-6">
                Paste an image link or leave default for instant branding.
              </p>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Logo Image URL
              </label>
              <input
                type="text"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300"
                className="w-full p-4 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none mb-6"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 py-4 rounded-xl gradient-teal text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 transition"
                >
                  <span>Next: Salon Address</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Where is your Salon Located?</h2>
              <p className="text-slate-500 text-sm mt-1 mb-6">Enter shop address so nearby customers can navigate to you.</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Street Address / Shop No.
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Shop 12, Commercial Market, Main Road"
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="w-2/3 py-4 rounded-xl gradient-teal text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 transition"
                >
                  <span>Next: Contact Details</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Phone & Email */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Contact Number & Owner Profile</h2>
              <p className="text-slate-500 text-sm mt-1 mb-6">Used for salon owner dashboard login & WhatsApp notifications.</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="e.g. Anish Gupta"
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Salon WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="w-1/3 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (!formData.phone.trim()) return alert('Please enter phone number');
                    setStep(5);
                  }}
                  className="w-2/3 py-4 rounded-xl gradient-teal text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 transition"
                >
                  <span>Next: Opening Hours</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Opening Hours */}
          {step === 5 && (
            <div className="animate-fadeIn">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Set Salon Working Hours</h2>
              <p className="text-slate-500 text-sm mt-1 mb-6">Default slot timing for customer online bookings.</p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-800">Monday — Saturday</span>
                  <span className="font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-lg">09:00 AM - 08:00 PM</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-800">Sunday</span>
                  <span className="font-medium text-slate-500">Optional / By Appointment</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(4)}
                  className="w-1/3 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(6)}
                  className="w-2/3 py-4 rounded-xl gradient-teal text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 transition"
                >
                  <span>Next: Add Initial Services</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Services */}
          {step === 6 && (
            <div className="animate-fadeIn">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <Scissors className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Add First Service</h2>
              <p className="text-slate-500 text-sm mt-1 mb-6">You can add more services anytime from your dashboard.</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="serviceName"
                    value={formData.serviceName}
                    onChange={handleChange}
                    placeholder="Haircut & Styling"
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="servicePrice"
                    value={formData.servicePrice}
                    onChange={handleChange}
                    placeholder="300"
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(5)}
                  className="w-1/3 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(7)}
                  className="w-2/3 py-4 rounded-xl gradient-teal text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 transition"
                >
                  <span>Next: Add Staff</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 7: Staff */}
          {step === 7 && (
            <div className="animate-fadeIn">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <UserCheck className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Add Main Stylist / Staff</h2>
              <p className="text-slate-500 text-sm mt-1 mb-6">Staff members will receive appointment assignments.</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Staff Member Name
                  </label>
                  <input
                    type="text"
                    name="staffName"
                    value={formData.staffName}
                    onChange={handleChange}
                    placeholder="Priya Sharma"
                    className="w-full p-3.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(6)}
                  className="w-1/3 py-4 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleCompleteSetup}
                  disabled={loading}
                  className="w-2/3 py-4 rounded-xl gradient-teal text-white font-bold flex items-center justify-center gap-2 hover:opacity-95 transition shadow-lg shadow-brand-500/20"
                >
                  {loading ? (
                    <span>Creating Salon Profile...</span>
                  ) : (
                    <>
                      <span>Complete Setup & Start</span>
                      <CheckCircle2 className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 8: Success */}
          {step === 8 && (
            <div className="text-center py-6 animate-fadeIn">
              <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900">Congratulations! 🎉</h2>
              <p className="text-slate-600 mt-2 mb-8 max-w-md mx-auto">
                Your salon <span className="font-bold text-slate-900">{formData.name}</span> is live on SalonOsa! You can now start taking bookings and billing walk-in customers.
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full py-4 rounded-xl gradient-teal text-white font-bold text-base shadow-xl hover:scale-[1.02] transition"
              >
                Go to Salon Owner Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
