'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { Star, MessageSquare, User } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState('5.0');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetch('/api/salons')
      .then((res) => res.json())
      .then((data) => {
        const id = data.salons?.[0]?.id || '';
        if (id) {
          fetch(`/api/reviews?salonId=${id}`)
            .then((r) => r.json())
            .then((d) => {
              if (d.success) {
                setReviews(d.reviews || []);
                setAvgRating(d.avgRating || '5.0');
                setTotalCount(d.totalCount || 0);
              }
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
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Customer Feedback & Reviews</h1>
              <p className="text-sm text-slate-500 font-medium">Ratings collected from customers after service completion</p>
            </div>

            <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
              <Star className="h-7 w-7 text-amber-400 fill-amber-400" />
              <div>
                <p className="text-2xl font-extrabold text-slate-900 leading-none">{avgRating} / 5.0</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{totalCount} Total Reviews</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                      {rev.customer?.name?.[0] || 'C'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rev.customer?.name}</h4>
                      <p className="text-[11px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-slate-700 italic mt-2">"{rev.comment || 'Great service experience!'}"</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
