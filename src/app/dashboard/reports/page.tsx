'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, TrendingUp, Users, Calendar, IndianRupee, Scissors } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<any>(null);

  useEffect(() => {
    fetch('/api/salons')
      .then((res) => res.json())
      .then((data) => {
        const id = data.salons?.[0]?.id || '';
        if (id) {
          fetch(`/api/reports?salonId=${id}`)
            .then((r) => r.json())
            .then((d) => {
              if (d.success) setReports(d.reports);
            });
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">Salon Reports & Business Analytics</h1>
            <p className="text-sm text-slate-500 font-medium">Daily & monthly metrics on appointments, revenue, repeat customers, and top services</p>
          </div>

          {reports && (
            <div className="space-y-6">
              {/* Summary Metrics Banner */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">Monthly Total Revenue</span>
                  <p className="text-2xl font-extrabold text-brand-700 mt-1">{formatCurrency(reports.monthly.totalRevenue)}</p>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">↑ +18% growth</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Monthly Appointments</span>
                  <p className="text-2xl font-extrabold text-purple-700 mt-1">{reports.monthly.totalAppointments}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Avg 1.5 appts/hour</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">New Customers</span>
                  <p className="text-2xl font-extrabold text-blue-600 mt-1">{reports.monthly.newCustomersCount}</p>
                  <p className="text-xs font-semibold text-blue-600 mt-1">First-time visitors</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">Repeat Customers</span>
                  <p className="text-2xl font-extrabold text-roseGold-600 mt-1">{reports.monthly.repeatCustomersCount}</p>
                  <p className="text-xs font-semibold text-roseGold-600 mt-1">High-loyalty visitors</p>
                </div>
              </div>

              {/* Top Performing Services List */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-brand-600" />
                  Top Revenue Services This Month
                </h3>
                <div className="space-y-3">
                  {reports.monthly.topServices.map((s: any, idx: number) => (
                    <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="h-7 w-7 rounded-lg bg-brand-100 text-brand-700 font-extrabold text-xs flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-slate-900">{s.name}</span>
                      </div>
                      <span className="font-extrabold text-slate-900">{formatCurrency(s.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
