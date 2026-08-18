'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { Receipt, CheckCircle2, IndianRupee, Printer, Share2, Award, Gift, Scissors } from 'lucide-react';

export default function BillingPOSPage() {
  const [salonId, setSalonId] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);

  // POS State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedOfferCode, setSelectedOfferCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'OTHER'>('UPI');
  const [redeemPoints, setRedeemPoints] = useState(0);

  // Result Receipt State
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/salons')
      .then((res) => res.json())
      .then((data) => {
        const id = data.salons?.[0]?.id || '';
        setSalonId(id);
        if (id) {
          fetch(`/api/customers?salonId=${id}`).then((r) => r.json()).then((d) => setCustomers(d.customers || []));
          fetch(`/api/services?salonId=${id}`).then((r) => r.json()).then((d) => setServices(d.services || []));
          fetch(`/api/offers?salonId=${id}`).then((r) => r.json()).then((d) => setOffers(d.offers || []));
        }
      });
  }, []);

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const chosenServicesList = services.filter((s) => selectedServices.includes(s.id));
  const subtotal = chosenServicesList.reduce((acc, s) => acc + s.price, 0);

  // Compute Offer discount
  let offerDiscount = 0;
  const chosenOffer = offers.find((o) => o.code === selectedOfferCode);
  if (chosenOffer) {
    if (chosenOffer.discountType === 'PERCENTAGE') {
      offerDiscount = (subtotal * chosenOffer.discountValue) / 100;
    } else {
      offerDiscount = chosenOffer.discountValue;
    }
  }

  const pointsDiscount = redeemPoints * 0.5; // 1 pt = ₹0.50
  const totalDiscount = offerDiscount + pointsDiscount;
  const finalAmount = Math.max(0, subtotal - totalDiscount);

  const handleCheckout = async () => {
    if (!selectedCustomerId) return alert('Please select a customer');
    if (selectedServices.length === 0) return alert('Please select at least one service');

    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          customerId: selectedCustomerId,
          subtotal,
          discountAmount: offerDiscount,
          redeemPoints,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReceiptData({
          receiptNumber: data.receiptNumber,
          customerName: selectedCustomer?.name,
          customerPhone: selectedCustomer?.phone,
          services: chosenServicesList,
          subtotal,
          discount: totalDiscount,
          finalAmount: data.finalAmount,
          pointsEarned: data.pointsEarned,
          paymentMethod,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        });
        setIsReceiptModalOpen(true);
      } else {
        alert(data.error || 'Billing checkout failed');
      }
    } catch (err) {
      alert('Checkout error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900">POS Quick Billing</h1>
            <p className="text-sm text-slate-500 font-medium">Generate digital receipts, apply promo discounts & earn loyalty points</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Customer & Services Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Select Customer */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Select Customer *
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">-- Choose Customer from CRM --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) — {c.loyaltyAccount?.pointsBalance || 0} pts
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Services */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  2. Select Services Taken *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((s) => {
                    const isSelected = selectedServices.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleService(s.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-brand-50 border-brand-500 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-sm text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.durationMinutes} min</p>
                        </div>
                        <span className="font-extrabold text-brand-700">{formatCurrency(s.price)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Col: Bill Computation & Checkout */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl sticky top-20">
                <h3 className="text-base font-extrabold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-brand-600" />
                  Bill Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 font-medium">Subtotal</span>
                    <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
                  </div>

                  {/* Apply Offer */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                      <Gift className="h-3.5 w-3.5 text-amber-500" /> Apply Offer Code
                    </label>
                    <select
                      value={selectedOfferCode}
                      onChange={(e) => setSelectedOfferCode(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                    >
                      <option value="">No Offer Code</option>
                      {offers.map((o) => (
                        <option key={o.id} value={o.code}>
                          {o.code} ({o.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Redeem Loyalty Points */}
                  {selectedCustomer && (
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1 flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-purple-500" /> Redeem Loyalty Points (Bal: {selectedCustomer.loyaltyAccount?.pointsBalance || 0})
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={selectedCustomer.loyaltyAccount?.pointsBalance || 0}
                        value={redeemPoints}
                        onChange={(e) => setRedeemPoints(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                      />
                    </div>
                  )}

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 font-semibold">
                      <span>Total Discount</span>
                      <span>- {formatCurrency(totalDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-lg font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                    <span>Final Total</span>
                    <span className="text-brand-700">{formatCurrency(finalAmount)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['UPI', 'CASH', 'CARD', 'OTHER'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          paymentMethod === m
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl gradient-teal text-white font-bold text-base shadow-lg shadow-brand-500/20 hover:opacity-95 transition"
                >
                  Generate Digital Receipt
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Digital Receipt Modal */}
      <Modal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} title="Digital Receipt Generated">
        {receiptData && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="text-center pb-3 border-b border-slate-200">
              <h4 className="text-lg font-extrabold text-slate-900">Glow Beauty Salon</h4>
              <p className="text-xs text-slate-500">Bandra West, Mumbai • Ph: 9876543210</p>
              <p className="text-xs font-bold text-brand-600 mt-1">Receipt #{receiptData.receiptNumber}</p>
            </div>

            <div className="text-xs space-y-1 text-slate-700">
              <p><strong>Customer:</strong> {receiptData.customerName} ({receiptData.customerPhone})</p>
              <p><strong>Date:</strong> {receiptData.date}</p>
              <p><strong>Payment Method:</strong> {receiptData.paymentMethod}</p>
            </div>

            <div className="border-t border-b border-slate-200 py-3 space-y-2 text-xs">
              {receiptData.services.map((s: any) => (
                <div key={s.id} className="flex justify-between font-medium text-slate-800">
                  <span>{s.name}</span>
                  <span>{formatCurrency(s.price)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs text-right">
              <p className="text-slate-500">Subtotal: {formatCurrency(receiptData.subtotal)}</p>
              {receiptData.discount > 0 && (
                <p className="text-emerald-600 font-semibold">Discount: -{formatCurrency(receiptData.discount)}</p>
              )}
              <p className="text-base font-extrabold text-slate-900 pt-1">Total Paid: {formatCurrency(receiptData.finalAmount)}</p>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 text-center text-xs font-semibold text-purple-800">
              🎉 Earned {receiptData.pointsEarned} Loyalty Points on this visit!
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => alert('Sending receipt via WhatsApp...')}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Share2 className="h-4 w-4" /> Share WhatsApp
              </button>
              <button
                onClick={() => window.print()}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="h-4 w-4" /> Print Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
