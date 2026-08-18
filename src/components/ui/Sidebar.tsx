'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Receipt,
  Users,
  Scissors,
  UserCheck,
  RotateCcw,
  Gift,
  Award,
  Star,
  BarChart3,
  Settings,
  MessageSquare,
} from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Billing POS', href: '/dashboard/billing', icon: Receipt },
    { name: 'Customers CRM', href: '/dashboard/crm', icon: Users },
    { name: 'Services Catalog', href: '/dashboard/services', icon: Scissors },
    { name: 'Staff Management', href: '/dashboard/staff', icon: UserCheck },
    { name: 'Smart Rebooking', href: '/dashboard/rebooking', icon: RotateCcw, badge: 'Auto' },
    { name: 'Offers & Discounts', href: '/dashboard/offers', icon: Gift },
    { name: 'Loyalty System', href: '/dashboard/loyalty', icon: Award },
    { name: 'Reviews', href: '/dashboard/reviews', icon: Star },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'WhatsApp & Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div>
        <div className="mb-4 px-3 py-2 bg-gradient-to-r from-brand-50 to-teal-50 rounded-xl border border-brand-100">
          <p className="text-xs font-semibold text-brand-800 uppercase tracking-wider">Active Salon</p>
          <p className="text-sm font-extrabold text-slate-900 truncate">Glow Beauty Salon</p>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-700 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>₹2,999/Yr Active</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-500 text-white font-semibold shadow-md shadow-brand-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 text-center">
        <p className="font-semibold text-slate-700">SalonOsa v1.0 MVP</p>
        <p>Simple • Fast • Affordable</p>
      </div>
    </aside>
  );
};
