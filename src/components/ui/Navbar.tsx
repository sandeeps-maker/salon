'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scissors, LayoutDashboard, Smartphone, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Customer App', href: '/app', icon: Smartphone },
    { name: 'Onboarding', href: '/onboarding', icon: UserPlus },
    { name: 'Super Admin', href: '/admin', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl gradient-teal flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Scissors className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">Salon<span className="text-brand-600">Osa</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                ₹2,999/Yr
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold border border-brand-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
