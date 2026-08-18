'use client';
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/ui/Navbar';
import { Sidebar } from '@/components/ui/Sidebar';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { Scissors, Plus, Clock, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function ServicesCatalogPage() {
  const [salonId, setSalonId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newService, setNewService] = useState({
    name: '',
    categoryName: 'Hair Services',
    price: '400',
    durationMinutes: '30',
    rebookingDays: '30',
    description: '',
  });

  const fetchData = async () => {
    const salonRes = await fetch('/api/salons');
    const salonData = await salonRes.json();
    const id = salonData.salons?.[0]?.id || '';
    setSalonId(id);
    if (id) {
      const res = await fetch(`/api/services?salonId=${id}`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
        setServices(data.services || []);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonId,
          ...newService,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        fetchData();
      } else {
        alert(data.error || 'Failed to add service');
      }
    } catch (err) {
      alert('Error adding service');
    }
  };

  const filteredServices =
    selectedCategory === 'ALL'
      ? services
      : services.filter((s) => s.category?.name === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Services Catalog</h1>
              <p className="text-sm text-slate-500 font-medium">Manage salon service pricing, durations & recommended rebooking periods</p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md flex items-center gap-2 hover:opacity-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add New Service</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Categories ({services.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat.name
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.name} ({cat.services?.length || 0})
              </button>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="h-36 bg-slate-100 relative">
                  <img
                    src={service.imageUrl || 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300'}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-brand-700 font-extrabold text-xs shadow-md">
                    {formatCurrency(service.price)}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">
                    {service.category?.name || 'General'}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">{service.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{service.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-600 mt-4 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {service.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1 font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                      <RotateCcw className="h-3 w-3" />
                      Rebook: {service.rebookingDays} days
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add Service Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Salon Service">
        <form onSubmit={handleAddService} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Service Name *</label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              placeholder="e.g. Keratin Hair Treatment"
              className="w-full p-3 rounded-xl border border-slate-300"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Category</label>
              <select
                value={newService.categoryName}
                onChange={(e) => setNewService({ ...newService, categoryName: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 font-medium"
              >
                <option value="Hair Services">Hair Services</option>
                <option value="Facial & Skin Care">Facial & Skin Care</option>
                <option value="Manicure & Pedicure">Manicure & Pedicure</option>
                <option value="Makeup & Spa">Makeup & Spa</option>
                <option value="Bridal Packages">Bridal Packages</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={newService.durationMinutes}
                onChange={(e) => setNewService({ ...newService, durationMinutes: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Rebook Window (Days)</label>
              <input
                type="number"
                value={newService.rebookingDays}
                onChange={(e) => setNewService({ ...newService, rebookingDays: e.target.value })}
                placeholder="30"
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              placeholder="Brief service highlights..."
              className="w-full p-3 rounded-xl border border-slate-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl gradient-teal text-white font-bold text-sm shadow-md hover:opacity-95 transition"
          >
            Save Service to Catalog
          </button>
        </form>
      </Modal>
    </div>
  );
}
