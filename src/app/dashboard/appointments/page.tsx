'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock, Plus, User, UserCheck } from 'lucide-react';

export default function AppointmentsCalendarPage() {
  const [salonId, setSalonId] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetch('/api/salons')
      .then((res) => res.json())
      .then((data) => {
        const id = data.salons?.[0]?.id || '';
        setSalonId(id);
        if (id) {
          fetch(`/api/appointments?salonId=${id}`)
            .then((r) => r.json())
            .then((d) => setAppointments(d.appointments || []));
        }
      });
  }, []);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Appointment Calendar</h1>
              <p className="text-sm text-slate-500 font-medium">Prevent double booking & manage daily staff schedules</p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Selector Buttons */}
              <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex gap-1">
                {(['day', 'week', 'month'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                      view === v ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {v} View
                  </button>
                ))}
              </div>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Calendar View Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-brand-600" />
              Schedule for {selectedDate}
            </h3>

            <div className="space-y-3">
              {timeSlots.map((time) => {
                const slotAppts = appointments.filter(
                  (a) => a.appointmentDate === selectedDate && a.startTime === time
                );

                return (
                  <div key={time} className="flex items-start gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="w-24 text-xs font-bold text-slate-500 pt-1.5 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {time}
                    </div>

                    <div className="flex-1 min-h-[44px]">
                      {slotAppts.length === 0 ? (
                        <div className="text-xs text-slate-400 italic pt-1.5">No bookings (Slot available)</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {slotAppts.map((appt) => (
                            <div key={appt.id} className="p-3 rounded-xl bg-white border border-brand-200 shadow-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-slate-900 text-sm">{appt.customer?.name}</span>
                                <StatusBadge status={appt.status} size="sm" />
                              </div>
                              <p className="text-xs text-slate-600 font-medium">
                                {appt.services?.map((s: any) => s.service?.name).join(', ')}
                              </p>
                              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                                <span className="flex items-center gap-1 font-semibold text-slate-700">
                                  <UserCheck className="h-3 w-3 text-brand-600" />
                                  {appt.staff?.name}
                                </span>
                                <span className="font-bold text-slate-900">{formatCurrency(appt.totalAmount)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
