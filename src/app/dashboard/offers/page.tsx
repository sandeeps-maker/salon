'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { Modal } from '@/components/ui/Modal';
import { Gift, Plus, Tag, Calendar, Percent } from 'lucide-react';

export default function OffersPage() {
  const [salonId, setSalonId] = useState('');
  const [offers, setOffers] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newOffer, setNewOffer] = useState({
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENTAGE',
    discountValue: '20',
    maxUsage: '100',
  });

  const fetchData = async () => {
    const salonRes = await fetch('/api/salons');
    const salonData = await salonRes.json();
    const id = salonData.salons?.[0]?.id || '';
    setSalonId(id);
    if (id) {
      const res = await fetch(`/api/offers?salonId=${id}`);
      const data = await res.json();
      if (data.success) setOffers(data.offers || []);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salonId, ...newOffer }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to create offer');
      }
    } catch (err) {
      alert('Error creating offer');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Offers & Promo Codes</h1>
              <p className="text-sm text-slate-500 font-medium">Create promotional discounts visible on customer mobile app & POS billing</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md flex items-center gap-2 hover:opacity-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>+ Create Offer</span>
            </button>
          </div>

          {/* Offers Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 font-mono font-bold text-xs border border-amber-200 flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {offer.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    Active Offer
                  </span>
                </div>
                <h4 className="text-lg font-extrabold text-slate-900">{offer.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{offer.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-brand-700 text-sm">
                    {offer.discountType === 'PERCENTAGE' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                  </span>
                  <span className="text-slate-500 font-medium">
                    Used: <strong>{offer.usedCount} / {offer.maxUsage}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add Offer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Offer Code">
        <form onSubmit={handleAddOffer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Promo Code *</label>
            <input
              type="text"
              value={newOffer.code}
              onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value.toUpperCase() })}
              placeholder="e.g. FESTIVE20"
              className="w-full p-3 rounded-xl border border-slate-300 font-mono font-bold"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Offer Title *</label>
            <input
              type="text"
              value={newOffer.name}
              onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
              placeholder="Festive Special 20% OFF"
              className="w-full p-3 rounded-xl border border-slate-300"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Discount Type</label>
              <select
                value={newOffer.discountType}
                onChange={(e) => setNewOffer({ ...newOffer, discountType: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 font-medium"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Discount Value *</label>
              <input
                type="number"
                value={newOffer.discountValue}
                onChange={(e) => setNewOffer({ ...newOffer, discountValue: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Description</label>
            <input
              type="text"
              value={newOffer.description}
              onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
              placeholder="Valid on all haircut and facial services"
              className="w-full p-3 rounded-xl border border-slate-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md hover:opacity-95 transition"
          >
            Launch Promo Code
          </button>
        </form>
      </Modal>
    </div>
  );
}
