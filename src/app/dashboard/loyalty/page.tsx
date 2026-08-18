'use client';
import React, { useState } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { Award, IndianRupee, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoyaltyPage() {
  const [pointsPer100, setPointsPer100] = useState(5);
  const [pointValue, setPointValue] = useState(0.5);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Award className="h-6 w-6 text-purple-600" />
              Simple Loyalty Rewards Engine
            </h1>
            <p className="text-sm text-slate-500 font-medium">Reward customers with points on every visit to drive long-term customer retention</p>
          </div>

          {/* Simple Config Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Loyalty Point Rules Configuration</h3>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-2 text-xs text-purple-900">
              <p className="font-bold flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-purple-600" /> Active MVP Loyalty Rules:
              </p>
              <p>• Every <strong>₹100 spent</strong> = <strong>5 Points Earned</strong></p>
              <p>• 1 Point = <strong>₹0.50 Value</strong> (e.g. 100 Points = ₹50 Discount at POS Checkout)</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Points per ₹100 Spent</label>
                <input
                  type="number"
                  value={pointsPer100}
                  onChange={(e) => setPointsPer100(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Point Redemption Value (₹)</label>
                <input
                  type="number"
                  step="0.1"
                  value={pointValue}
                  onChange={(e) => setPointValue(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-slate-900"
                />
              </div>
            </div>

            <button
              onClick={() => alert('Loyalty rules updated successfully!')}
              className="w-full py-3.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md hover:opacity-95 transition"
            >
              Save Loyalty Settings
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
