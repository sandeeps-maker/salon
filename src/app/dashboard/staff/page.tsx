'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { Modal } from '@/components/ui/Modal';
import { UserCheck, Plus, Phone, Clock, Calendar, Sparkles } from 'lucide-react';

export default function StaffManagementPage() {
  const [salonId, setSalonId] = useState('');
  const [staff, setStaff] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newStaff, setNewStaff] = useState({
    name: '',
    phone: '',
    role: 'Senior Hair Stylist & Beautician',
    workingHours: '09:00 AM - 07:00 PM',
  });

  const fetchData = async () => {
    const salonRes = await fetch('/api/salons');
    const salonData = await salonRes.json();
    const id = salonData.salons?.[0]?.id || '';
    setSalonId(id);
    if (id) {
      const res = await fetch(`/api/staff?salonId=${id}`);
      const data = await res.json();
      if (data.success) setStaff(data.staff || []);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salonId, ...newStaff }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to add staff');
      }
    } catch (err) {
      alert('Error adding staff');
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
              <h1 className="text-2xl font-extrabold text-slate-900">Staff Management</h1>
              <p className="text-sm text-slate-500 font-medium">Manage salon team members, working hours & today's assigned appointments</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md flex items-center gap-2 hover:opacity-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Staff Member</span>
            </button>
          </div>

          {/* Staff Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((st) => (
              <div key={st.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={st.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt={st.name}
                    className="h-14 w-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900">{st.name}</h4>
                    <p className="text-xs font-semibold text-brand-700 mt-0.5">{st.role}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" /> {st.phone}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 text-xs space-y-2 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" /> Working Hours:
                    </span>
                    <span className="font-bold text-slate-900">{st.workingHours}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" /> Today's Appts:
                    </span>
                    <span className="font-bold text-brand-700">{st.appointments?.length || 2} Bookings</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add Staff Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Staff Member">
        <form onSubmit={handleAddStaff} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Staff Member Name *</label>
            <input
              type="text"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              placeholder="e.g. Priya Sharma"
              className="w-full p-3 rounded-xl border border-slate-300"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Mobile Phone *</label>
            <input
              type="text"
              value={newStaff.phone}
              onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
              placeholder="9820011223"
              className="w-full p-3 rounded-xl border border-slate-300"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Role / Specialization</label>
            <input
              type="text"
              value={newStaff.role}
              onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
              placeholder="Hair Specialist & Beautician"
              className="w-full p-3 rounded-xl border border-slate-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md hover:opacity-95 transition"
          >
            Save Staff Profile
          </button>
        </form>
      </Modal>
    </div>
  );
}
