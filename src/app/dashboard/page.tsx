'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import {
  Calendar,
  IndianRupee,
  Clock,
  CheckCircle2,
  UserPlus,
  RotateCcw,
  Plus,
  UserCheck,
  Search,
  MessageSquare,
  Sparkles,
  Receipt,
} from 'lucide-react';

export default function DashboardOverview() {
  const [salonId, setSalonId] = useState('salon-demo-id'); // Glow Beauty Salon
  const [appointments, setAppointments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [isCustModalOpen, setIsCustModalOpen] = useState(false);

  // New Appointment Form state
  const [newAppt, setNewAppt] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    staffId: '',
    serviceId: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    startTime: '11:00 AM',
  });

  // New Customer Form state
  const [newCust, setNewCust] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'Female',
  });

  const fetchData = async () => {
    try {
      // First get demo salon ID
      const salonRes = await fetch('/api/salons');
      const salonData = await salonRes.json();
      const demoSalon = salonData.salons?.[0];
      const targetId = demoSalon ? demoSalon.id : salonId;
      setSalonId(targetId);

      // Fetch appointments
      const apptRes = await fetch(`/api/appointments?salonId=${targetId}`);
      const apptData = await apptRes.json();
      if (apptData.success) setAppointments(apptData.appointments);

      // Fetch customers
      const custRes = await fetch(`/api/customers?salonId=${targetId}`);
      const custData = await custRes.json();
      if (custData.success) setCustomers(custData.customers);

      // Fetch services & staff
      const servRes = await fetch(`/api/services?salonId=${targetId}`);
      const servData = await servRes.json();
      if (servData.success) setServices(servData.services);

      const staffRes = await fetch(`/api/staff?salonId=${targetId}`);
      const staffData = await staffRes.json();
      if (staffData.success) setStaff(staffData.staff);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          customerId: newAppt.customerId || undefined,
          customerName: newAppt.customerName,
          customerPhone: newAppt.customerPhone,
          staffId: newAppt.staffId || (staff[0]?.id || ''),
          serviceIds: [newAppt.serviceId || (services[0]?.id || '')],
          appointmentDate: newAppt.appointmentDate,
          startTime: newAppt.startTime,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsApptModalOpen(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to create appointment');
      }
    } catch (err) {
      alert('Error creating appointment');
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          ...newCust,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCustModalOpen(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to add customer');
      }
    } catch (err) {
      alert('Error adding customer');
    }
  };

  // Metrics computation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appointmentDate === todayStr);
  const todayRevenue = appointments
    .filter((a) => a.paymentStatus === 'PAID' || a.status === 'COMPLETED')
    .reduce((acc, a) => acc + a.totalAmount, 0);

  const pendingCount = todayAppointments.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED').length;
  const completedCount = todayAppointments.filter((a) => a.status === 'COMPLETED').length;
  const newCustomersCount = customers.filter((c) => c.totalVisits <= 1).length;
  const repeatCustomersCount = customers.filter((c) => c.totalVisits > 1).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Salon Overview</h1>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Today's Live Appointments & Salon Metrics • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsApptModalOpen(true)}
                className="px-4 py-2.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md shadow-brand-500/20 hover:opacity-95 transition flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>+ New Appointment</span>
              </button>
              <button
                onClick={() => setIsApptModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-md shadow-purple-600/20 hover:bg-purple-700 transition flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                <span>+ Walk-in Billing</span>
              </button>
              <button
                onClick={() => setIsCustModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-300 font-semibold text-sm hover:bg-slate-50 transition flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4 text-brand-600" />
                <span>+ New Customer</span>
              </button>
            </div>
          </div>

          {/* 6 Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Appts</span>
                <Calendar className="h-4 w-4 text-brand-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{todayAppointments.length}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Booked for today</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Revenue</span>
                <IndianRupee className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{formatCurrency(todayRevenue)}</p>
              <p className="text-[11px] font-medium text-emerald-600 mt-1">+15% vs yesterday</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-amber-600">{pendingCount}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Awaiting service</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed</span>
                <CheckCircle2 className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-2xl font-extrabold text-purple-600">{completedCount}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Served today</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">New Cust.</span>
                <UserPlus className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl font-extrabold text-blue-600">{newCustomersCount}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">First visit</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Repeat Cust.</span>
                <RotateCcw className="h-4 w-4 text-roseGold-500" />
              </div>
              <p className="text-2xl font-extrabold text-roseGold-600">{repeatCustomersCount}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1">Loyal visitors</p>
            </div>
          </div>

          {/* Today's Live Appointments Pipeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Today's Appointment Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">Click status buttons to advance appointment through live workflow</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">
                {appointments.length} Total Appointments
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 text-sm">Loading appointments...</div>
            ) : appointments.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No appointments for today yet. Click <strong>+ New Appointment</strong> to add one!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Staff</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4 text-right">Quick Pipeline Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {appointments.map((appt) => {
                      const serviceName = appt.services?.map((s: any) => s.service?.name).join(', ') || 'Salon Service';
                      return (
                        <tr key={appt.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {appt.startTime}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-900">{appt.customer?.name || 'Customer'}</p>
                            <p className="text-xs text-slate-500">{appt.customer?.phone}</p>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-800">{serviceName}</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                              <UserCheck className="h-3.5 w-3.5 text-brand-600" />
                              {appt.staff?.name || 'Any Staff'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={appt.status} />
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {formatCurrency(appt.totalAmount)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {appt.status === 'CONFIRMED' || appt.status === 'PENDING' ? (
                              <button
                                onClick={() => handleStatusChange(appt.id, 'ARRIVED')}
                                className="px-3 py-1.5 rounded-lg bg-purple-500 text-white font-semibold text-xs hover:bg-purple-600 transition"
                              >
                                Mark Arrived
                              </button>
                            ) : appt.status === 'ARRIVED' ? (
                              <button
                                onClick={() => handleStatusChange(appt.id, 'SERVICE_STARTED')}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition animate-pulse"
                              >
                                Start Service
                              </button>
                            ) : appt.status === 'SERVICE_STARTED' ? (
                              <button
                                onClick={() => handleStatusChange(appt.id, 'COMPLETED')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition"
                              >
                                Complete Service
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium">Completed</span>
                            )}
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

      {/* New Appointment Modal */}
      <Modal isOpen={isApptModalOpen} onClose={() => setIsApptModalOpen(false)} title="Create New Appointment">
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Select Customer</label>
            <select
              value={newAppt.customerId}
              onChange={(e) => {
                const selected = customers.find((c) => c.id === e.target.value);
                setNewAppt({
                  ...newAppt,
                  customerId: e.target.value,
                  customerName: selected ? selected.name : '',
                  customerPhone: selected ? selected.phone : '',
                });
              }}
              className="w-full p-3 rounded-xl border border-slate-300 font-medium"
            >
              <option value="">-- Choose Existing Customer or Enter Below --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          {!newAppt.customerId && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  value={newAppt.customerName}
                  onChange={(e) => setNewAppt({ ...newAppt, customerName: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full p-3 rounded-xl border border-slate-300"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="text"
                  value={newAppt.customerPhone}
                  onChange={(e) => setNewAppt({ ...newAppt, customerPhone: e.target.value })}
                  placeholder="9819011111"
                  className="w-full p-3 rounded-xl border border-slate-300"
                  required
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Select Service</label>
              <select
                value={newAppt.serviceId}
                onChange={(e) => setNewAppt({ ...newAppt, serviceId: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 font-medium"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - ₹{s.price}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Assign Staff</label>
              <select
                value={newAppt.staffId}
                onChange={(e) => setNewAppt({ ...newAppt, staffId: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 font-medium"
              >
                {staff.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={newAppt.appointmentDate}
                onChange={(e) => setNewAppt({ ...newAppt, appointmentDate: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Time Slot</label>
              <select
                value={newAppt.startTime}
                onChange={(e) => setNewAppt({ ...newAppt, startTime: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="06:30 PM">06:30 PM</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md hover:opacity-95 transition"
          >
            Confirm & Send WhatsApp Alert
          </button>
        </form>
      </Modal>

      {/* New Customer Modal */}
      <Modal isOpen={isCustModalOpen} onClose={() => setIsCustModalOpen(false)} title="Add New Customer CRM Record">
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Customer Name *</label>
            <input
              type="text"
              value={newCust.name}
              onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
              placeholder="e.g. Kavita Singh"
              className="w-full p-3 rounded-xl border border-slate-300"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Mobile Phone *</label>
            <input
              type="text"
              value={newCust.phone}
              onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
              placeholder="9820099999"
              className="w-full p-3 rounded-xl border border-slate-300"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={newCust.email}
              onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
              placeholder="kavita@gmail.com"
              className="w-full p-3 rounded-xl border border-slate-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md hover:opacity-95 transition"
          >
            Save Customer Profile
          </button>
        </form>
      </Modal>
    </div>
  );
}
