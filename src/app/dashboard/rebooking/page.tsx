'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { formatDate } from '@/lib/utils';
import { RotateCcw, Send, MessageSquare, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function SmartRebookingPage() {
  const [salonId, setSalonId] = useState('');
  const [dueCustomers, setDueCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/api/salons')
      .then((res) => res.json())
      .then((data) => {
        const id = data.salons?.[0]?.id || '';
        setSalonId(id);
        if (id) {
          fetch(`/api/rebooking?salonId=${id}`)
            .then((r) => r.json())
            .then((d) => {
              if (d.success) setDueCustomers(d.dueCustomers || []);
              setLoading(false);
            });
        }
      });
  }, []);

  const handleSendReminder = async (cust: any) => {
    try {
      const res = await fetch('/api/rebooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          customerId: cust.customerId,
          customerName: cust.name,
          phone: cust.phone,
          serviceName: cust.lastService,
          daysAgo: cust.daysAgo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSentMap({ ...sentMap, [cust.customerId]: true });
      } else {
        alert(data.error || 'Failed to send reminder');
      }
    } catch (err) {
      alert('Error sending reminder');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <RotateCcw className="h-6 w-6 text-brand-600" />
              Smart Rebooking Engine
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Automatically identify customers due for their next haircut (30d) or facial (45d) and send 1-click WhatsApp reminders.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 text-white mb-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold mb-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Repeat Business Generator</span>
              </div>
              <h3 className="text-xl font-extrabold">Generate 25-35% More Repeat Visits</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Salons using SalonOsa's Smart Rebooking report ₹12,000+ extra monthly revenue simply by reminding customers when their service is due!
              </p>
            </div>
            <div className="text-center px-4 py-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
              <p className="text-2xl font-extrabold text-amber-400">{dueCustomers.length}</p>
              <p className="text-xs text-slate-300 font-medium">Customers Due Now</p>
            </div>
          </div>

          {/* Due Customers List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Customers Due for Rebooking</h3>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
                {dueCustomers.length} Reminders Available
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 text-sm">Scanning customer visit logs...</div>
            ) : dueCustomers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                All customer rebookings are currently up to date! Great job keeping your salon full.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-sm">
                {dueCustomers.map((cust) => {
                  const isSent = sentMap[cust.customerId];
                  return (
                    <div key={cust.customerId} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-50 transition">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          cust.isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {cust.daysAgo}d
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{cust.name}</h4>
                          <p className="text-xs text-slate-500">
                            Last visit: {formatDate(cust.lastVisitDate)} ({cust.daysAgo} days ago) • Service: <strong className="text-slate-700">{cust.lastService}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          cust.isOverdue
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {cust.isOverdue ? 'Overdue for Rebooking' : 'Due for Visit'}
                        </span>

                        {isSent ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="h-4 w-4" /> WhatsApp Sent!
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSendReminder(cust)}
                            className="px-4 py-2 rounded-xl gradient-teal text-white font-bold text-xs shadow-sm hover:opacity-95 transition flex items-center gap-1.5"
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span>Send WhatsApp Reminder</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
