'use client';
import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import {
  Scissors,
  Calendar,
  RotateCcw,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  Receipt,
  MessageSquare,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-semibold mb-6">
          <Sparkles className="h-4 w-4 text-brand-400 animate-spin" />
          <span>Built Exclusively for Small & Medium Indian Salons</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Manage Your Salon. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-teal-200 to-roseGold-400">
            Get More Repeat Customers.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal">
          Simple, fast, and affordable salon management SaaS. Appointments, Customer CRM, POS Billing, WhatsApp Updates, and Smart Rebooking — all for just <span className="font-bold text-amber-400">₹2,999 / Year</span>.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-xl gradient-teal text-white font-bold text-base shadow-xl shadow-brand-500/30 hover:scale-105 transition flex items-center gap-2"
          >
            <span>Open Salon Owner Dashboard</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/app"
            className="px-8 py-4 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-base hover:bg-slate-700 hover:text-white transition flex items-center gap-2"
          >
            <Smartphone className="h-5 w-5 text-roseGold-400" />
            <span>Try Customer Mobile App</span>
          </Link>
          <Link
            href="/onboarding"
            className="px-6 py-4 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-base hover:bg-amber-500/30 transition flex items-center gap-2"
          >
            <Zap className="h-5 w-5 text-amber-400" />
            <span>Start 10-Min Onboarding</span>
          </Link>
        </div>

        {/* Value Prop Banner */}
        <div className="mt-16 p-6 rounded-2xl bg-slate-800/80 border border-slate-700 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-extrabold text-brand-400">₹2,999</p>
            <p className="text-xs text-slate-400 font-medium">Per Year (All-Inclusive)</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-400">&lt; 10 Mins</p>
            <p className="text-xs text-slate-400 font-medium">Salon Setup Time</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-purple-400">1-Click</p>
            <p className="text-xs text-slate-400 font-medium">WhatsApp Rebooking</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-roseGold-400">0%</p>
            <p className="text-xs text-slate-400 font-medium">Hidden Commission</p>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-slate-950 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Everything Your Salon Needs to Scale
            </h2>
            <p className="mt-4 text-slate-400">
              Designed specifically for Indian salon owners — zero technical complexity, instant WhatsApp engagement, and guaranteed customer retention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/50 transition group">
              <div className="h-12 w-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Appointment Pipeline</h3>
              <p className="text-slate-400 text-sm">
                Prevent double-booking with day/week calendars. Track live customer status from Booked → Confirmed → Arrived → Service Started → Completed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition group">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <RotateCcw className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Rebooking Engine</h3>
              <p className="text-slate-400 text-sm">
                Automatically remind customers when their haircut (30 days) or facial (45 days) is due with 1-click WhatsApp booking links.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-roseGold-500/50 transition group">
              <div className="h-12 w-12 rounded-xl bg-roseGold-500/10 text-roseGold-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Customer Mobile App</h3>
              <p className="text-slate-400 text-sm">
                Give your customers a premium mobile experience. OTP login, service selection, staff choice, live status tracking, and 5-star review submission.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition group">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Receipt className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">POS Billing & Digital Receipts</h3>
              <p className="text-slate-400 text-sm">
                1-click billing with UPI, Cash, or Card. Instant discount application, loyalty points deduction, and digital receipt generation.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition group">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">WhatsApp Notification Gateway</h3>
              <p className="text-slate-400 text-sm">
                Automated WhatsApp notifications for booking confirmations, arrival check-in, service completion thank-you notes, and festival offers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition group">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Loyalty & Offers Engine</h3>
              <p className="text-slate-400 text-sm">
                Reward repeat visitors with points (₹100 = 5 pts). Launch percentage & fixed discount promo codes for new customer acquisition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Quick Switcher Footer */}
      <footer className="py-12 bg-slate-900 border-t border-slate-800 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-brand-400 uppercase tracking-widest mb-4">
            Interactive Multi-Tenant Demo Ready
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <p className="text-xs text-slate-400 uppercase font-bold">Salon Owner Demo</p>
              <p className="text-sm font-semibold text-white mt-1">Glow Beauty Salon</p>
              <p className="text-xs text-slate-300 mt-1">Phone: <code className="text-brand-300">9876543210</code></p>
              <Link href="/dashboard" className="mt-3 inline-block text-xs font-bold text-brand-400 hover:underline">
                Launch Owner Portal &rarr;
              </Link>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <p className="text-xs text-slate-400 uppercase font-bold">Customer App Demo</p>
              <p className="text-sm font-semibold text-white mt-1">Rahul Sharma</p>
              <p className="text-xs text-slate-300 mt-1">Phone: <code className="text-brand-300">9819011111</code></p>
              <Link href="/app" className="mt-3 inline-block text-xs font-bold text-roseGold-400 hover:underline">
                Launch Mobile App Simulator &rarr;
              </Link>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <p className="text-xs text-slate-400 uppercase font-bold">Super Admin SaaS Demo</p>
              <p className="text-sm font-semibold text-white mt-1">Platform Admin</p>
              <p className="text-xs text-slate-300 mt-1">Phone: <code className="text-brand-300">9999999999</code></p>
              <Link href="/admin" className="mt-3 inline-block text-xs font-bold text-amber-400 hover:underline">
                Launch Super Admin Panel &rarr;
              </Link>
            </div>
          </div>
          <p className="mt-8 text-xs text-slate-500">
            SalonOsa SaaS Platform • Built with Next.js 14, TypeScript, Tailwind CSS & Prisma ORM.
          </p>
        </div>
      </footer>
    </div>
  );
}
