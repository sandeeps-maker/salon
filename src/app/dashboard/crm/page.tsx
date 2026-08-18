'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, UserCheck, Calendar, IndianRupee, RotateCcw, Award, Phone, Mail, FileText } from 'lucide-react';

export default function CustomerCRMPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetch('/api/salons')
      .then((res) => res.json())
      .then((data) => {
        const id = data.salons?.[0]?.id || '';
        if (id) {
          fetch(`/api/customers?salonId=${id}`)
            .then((r) => r.json())
            .then((d) => setCustomers(d.customers || []));
        }
      });
  }, []);

  const openCustomerDetails = async (id: string) => {
    const res = await fetch(`/api/customers?id=${id}`);
    const data = await res.json();
    if (data.success) {
      setSelectedCustomer(data.customer);
      setIsDetailOpen(true);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Customer CRM Database</h1>
              <p className="text-sm text-slate-500 font-medium">Track customer visit history, total spend & preferred stylists</p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Customer CRM Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Last Visit</th>
                    <th className="py-3 px-4">Total Visits</th>
                    <th className="py-3 px-4">Total Spend</th>
                    <th className="py-3 px-4">Loyalty Balance</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{cust.name}</p>
                        <p className="text-xs text-slate-500">{cust.gender || 'Female'}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        <p>{cust.phone}</p>
                        <p className="text-xs text-slate-400">{cust.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                        {cust.lastVisitDate ? formatDate(cust.lastVisitDate) : 'Never'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand-700">
                        {cust.totalVisits} Visits
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatCurrency(cust.totalSpend)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
                          <Award className="h-3 w-3" />
                          {cust.loyaltyAccount?.pointsBalance || 0} pts
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => openCustomerDetails(cust.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Customer Profile & History Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Customer Profile & Visit History" maxWidth="lg">
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-brand-50 to-teal-50 rounded-2xl border border-brand-100 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-extrabold text-slate-900">{selectedCustomer.name}</h4>
                <p className="text-xs text-slate-600 flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {selectedCustomer.phone}</span>
                  {selectedCustomer.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {selectedCustomer.email}</span>}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 uppercase">Total Spend</p>
                <p className="text-xl font-extrabold text-brand-700">{formatCurrency(selectedCustomer.totalSpend)}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-100">
                <p className="text-slate-500 font-semibold">Total Visits</p>
                <p className="text-base font-extrabold text-slate-900">{selectedCustomer.totalVisits}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-100">
                <p className="text-slate-500 font-semibold">Loyalty Points</p>
                <p className="text-base font-extrabold text-purple-700">{selectedCustomer.loyaltyAccount?.pointsBalance || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-100">
                <p className="text-slate-500 font-semibold">Last Visit</p>
                <p className="text-xs font-bold text-slate-900 mt-1">
                  {selectedCustomer.lastVisitDate ? formatDate(selectedCustomer.lastVisitDate) : 'N/A'}
                </p>
              </div>
            </div>

            {selectedCustomer.notes && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <p className="font-bold flex items-center gap-1 mb-1"><FileText className="h-3.5 w-3.5" /> Notes:</p>
                <p>{selectedCustomer.notes}</p>
              </div>
            )}

            {/* Appointment History */}
            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Past Appointment History</h5>
              {selectedCustomer.appointments && selectedCustomer.appointments.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedCustomer.appointments.map((appt: any) => (
                    <div key={appt.id} className="p-3 rounded-xl border border-slate-200 bg-white text-xs flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{appt.appointmentDate} at {appt.startTime}</p>
                        <p className="text-slate-500 mt-0.5">
                          {appt.services?.map((s: any) => s.service?.name).join(', ')} • Stylist: {appt.staff?.name || 'Any'}
                        </p>
                      </div>
                      <span className="font-extrabold text-brand-700">{formatCurrency(appt.totalAmount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No past appointments found.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
