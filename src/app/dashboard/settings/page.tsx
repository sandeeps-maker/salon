'use client';
import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { MessageSquare, Settings as SettingsIcon, ShieldCheck, Key, Phone, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [waApiKey, setWaApiKey] = useState('demo_whatsapp_key_77812');
  const [waPhoneId, setWaPhoneId] = useState('+91 98765 43210');
  const [autoReminders, setAutoReminders] = useState(true);
  const [rebookingReminders, setRebookingReminders] = useState(true);

  const handleSave = () => {
    alert('WhatsApp notification credentials saved securely!');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <SettingsIcon className="h-6 w-6 text-brand-600" />
              WhatsApp & Salon Settings
            </h1>
            <p className="text-sm text-slate-500 font-medium">Configure WhatsApp API credentials and automated notification preferences</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
              WhatsApp Notification Credentials
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
                  <Key className="h-3.5 w-3.5 text-slate-400" /> WhatsApp API Secret Key / Token
                </label>
                <input
                  type="password"
                  value={waApiKey}
                  onChange={(e) => setWaApiKey(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> Registered WhatsApp Phone Number / ID
                </label>
                <input
                  type="text"
                  value={waPhoneId}
                  onChange={(e) => setWaPhoneId(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Automated Message Triggers</h4>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <p className="font-bold text-sm text-slate-900">Instant Booking Confirmation Alerts</p>
                  <p className="text-xs text-slate-500">Send instant confirmation when customer books appointment</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoReminders}
                  onChange={(e) => setAutoReminders(e.target.checked)}
                  className="h-5 w-5 rounded text-brand-600 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <p className="font-bold text-sm text-slate-900">Smart Rebooking Follow-Up Reminders</p>
                  <p className="text-xs text-slate-500">Send 30/45 day haircut & facial rebooking alerts</p>
                </div>
                <input
                  type="checkbox"
                  checked={rebookingReminders}
                  onChange={(e) => setRebookingReminders(e.target.checked)}
                  className="h-5 w-5 rounded text-brand-600 focus:ring-brand-500"
                />
              </label>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md hover:opacity-95 transition"
            >
              Save Credentials & Preferences
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
