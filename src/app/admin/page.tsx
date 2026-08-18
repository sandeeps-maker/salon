'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import { ShieldCheck, Building, IndianRupee, Users, CheckCircle2, AlertTriangle, Power } from 'lucide-react';

export default function SuperAdminPage() {
  const [salons, setSalons] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/salons');
      const data = await res.json();
      if (data.success) {
        setSalons(data.salons || []);
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleStatus = async (salonId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const res = await fetch('/api/admin/salons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salonId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) fetchData();
    } catch (err) {
      alert('Error updating salon status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>SaaS Platform Control Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Super Admin Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Manage salon tenants, subscriptions, platform revenue & access controls</p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 font-bold text-xs text-brand-300">
            Plan Price: ₹2,999 / Year
          </div>
        </div>

        {/* Metrics Banner */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Salons Onboarded</span>
              <p className="text-3xl font-extrabold text-white mt-1">{metrics.totalSalons}</p>
              <p className="text-xs text-slate-400 mt-1">Indian salon partners</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase">Active Subscriptions</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-1">{metrics.activeSalons}</p>
              <p className="text-xs text-emerald-400 mt-1">100% Paid & Verified</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase">Total ARR Platform Revenue</span>
              <p className="text-3xl font-extrabold text-brand-400 mt-1">{formatCurrency(metrics.totalRevenue)}</p>
              <p className="text-xs text-brand-300 mt-1">Annual Recurring Revenue</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-800 border border-slate-700">
              <span className="text-xs font-bold text-slate-400 uppercase">Subscription Status</span>
              <p className="text-3xl font-extrabold text-purple-400 mt-1">₹2,999 / Yr</p>
              <p className="text-xs text-purple-300 mt-1">Single Plan MVP Model</p>
            </div>
          </div>
        )}

        {/* Salons Table */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white">Registered Salon Tenants</h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-700 text-slate-200">
              {salons.length} Tenants
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading salon tenants...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <th className="py-3.5 px-4">Salon Name</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Owner Contact</th>
                    <th className="py-3.5 px-4">Subscription Plan</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Access Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 text-sm">
                  {salons.map((s) => {
                    const sub = s.subscriptions?.[0];
                    return (
                      <tr key={s.id} className="hover:bg-slate-700/50 transition">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={s.logoUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100'}
                              alt={s.name}
                              className="h-10 w-10 rounded-xl object-cover"
                            />
                            <div>
                              <p className="font-bold text-white">{s.name}</p>
                              <p className="text-xs text-slate-400">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-slate-300 text-xs">
                          {s.city}, {s.state}
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-slate-300">
                          <p>{s.phone}</p>
                        </td>
                        <td className="py-4 px-4 text-xs">
                          <p className="font-bold text-brand-400">{sub?.planName || 'SalonMitra Annual'}</p>
                          <p className="text-[11px] text-slate-400">Exp: {sub?.expiryDate ? new Date(sub.expiryDate).toLocaleDateString('en-IN') : '2027-01-01'}</p>
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleToggleStatus(s.id, s.status)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition inline-flex items-center gap-1 ${
                              s.status === 'ACTIVE'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            }`}
                          >
                            <Power className="h-3.5 w-3.5" />
                            {s.status === 'ACTIVE' ? 'Suspend Tenant' : 'Approve Salon'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
