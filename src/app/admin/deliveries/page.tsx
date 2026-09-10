'use client';

import React, { useState, useMemo } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  PlusCircle,
  Calendar,
  MapPin,
  Utensils,
  Filter,
  CheckSquare,
} from 'lucide-react';

export default function AdminDeliveriesPage() {
  const {
    deliveries,
    customers,
    products,
    markDeliveryDelivered,
    updateDeliveryStatus,
    createDelivery,
    isLoading,
  } = useAdminAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'all'>('today');

  // Action states
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Create Delivery Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((del) => {
      if (dateFilter === 'today' && del.delivery_date !== todayStr) return false;

      const q = searchQuery.toLowerCase();
      const cust = del.user;
      const prod = del.product;

      const matchesSearch =
        (cust?.customer_id && cust.customer_id.toLowerCase().includes(q)) ||
        (cust?.full_name && cust.full_name.toLowerCase().includes(q)) ||
        (prod?.name && prod.name.toLowerCase().includes(q)) ||
        (del.notes && del.notes.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (statusFilter === 'all') return true;
      return del.status === statusFilter;
    });
  }, [deliveries, searchQuery, statusFilter, dateFilter, todayStr]);

  // Selected Customer Sub reference
  const activeCustomerObj = useMemo(() => {
    return customers.find((c) => c.id === selectedUser);
  }, [customers, selectedUser]);

  const handleMarkDelivered = async (deliveryId: string) => {
    setMarkingId(deliveryId);
    setToastMsg(null);

    const res = await markDeliveryDelivered(deliveryId);

    if (res.success) {
      setToastMsg({
        type: 'success',
        text: res.message || '✓ Delivery marked as delivered. 1 meal deducted from customer balance.',
      });
    } else {
      setToastMsg({
        type: 'error',
        text: res.error || 'Failed to complete delivery.',
      });
    }
    setMarkingId(null);
  };

  const handleStatusChange = async (deliveryId: string, newStatus: string) => {
    setToastMsg(null);
    const res = await updateDeliveryStatus(deliveryId, newStatus);
    if (res.success) {
      setToastMsg({ type: 'success', text: `✓ Status updated to ${newStatus}.` });
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Status update failed.' });
    }
  };

  const handleCreateDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !activeCustomerObj?.subscription) return;

    setIsSubmitting(true);
    setToastMsg(null);

    const res = await createDelivery({
      userId: selectedUser,
      subscriptionId: activeCustomerObj.subscription.id,
      productId: selectedProduct || undefined,
      deliveryDate,
      notes: deliveryNotes,
    });

    if (res.success) {
      setToastMsg({ type: 'success', text: '✓ Meal delivery scheduled successfully.' });
      setShowCreateModal(false);
      setSelectedUser('');
      setSelectedProduct('');
      setDeliveryNotes('');
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Failed to create delivery.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Cloud Kitchen Delivery Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Daily Delivery Dispatch ({filteredDeliveries.length})
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Schedule New Delivery</span>
        </button>
      </div>

      {/* FEEDBACK TOAST */}
      {toastMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
            toastMsg.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border-red-500/30 text-red-300'
          }`}
        >
          <span>{toastMsg.text}</span>
          <button onClick={() => setToastMsg(null)} className="text-xs text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* FILTERS & SEARCH */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Customer ID (e.g. LTS-01), Name, Dish name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="today">Today's Deliveries ({todayStr})</option>
              <option value="all">All Delivery Records</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="all">All Delivery Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* DELIVERIES TABLE */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-4">Customer ID & Name</th>
                <th className="p-4">Meal / Product</th>
                <th className="p-4">Delivery Address</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading delivery logs...
                  </td>
                </tr>
              ) : filteredDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 space-y-2">
                    <Truck className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-semibold">No deliveries match your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredDeliveries.map((del) => {
                  const isDelivered = del.status === 'delivered';
                  const cust = del.user;
                  const prod = del.product;

                  return (
                    <tr key={del.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-semibold text-white">
                        <div className="text-sm font-bold">{cust?.full_name || 'Customer'}</div>
                        <div className="text-xs text-emerald-400 font-extrabold">{cust?.customer_id || 'LTS-01'}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-200">
                        <div>{prod?.name || 'Avocado Quinoa Power Bowl'}</div>
                        {del.notes && <div className="text-[10px] text-slate-400 font-normal mt-0.5">Note: {del.notes}</div>}
                      </td>
                      <td className="p-4 text-slate-300">
                        {cust?.address || 'Baner, Pune'}
                      </td>
                      <td className="p-4 text-slate-300 font-medium whitespace-nowrap">
                        {del.delivery_date}
                      </td>
                      <td className="p-4">
                        <select
                          value={del.status}
                          disabled={isDelivered}
                          onChange={(e) => handleStatusChange(del.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border focus:outline-none ${
                            isDelivered
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-not-allowed'
                              : del.status === 'preparing'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : del.status === 'out_for_delivery'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="preparing">Preparing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        {isDelivered ? (
                          <span className="text-xs font-bold text-emerald-400 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Completed</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkDelivered(del.id)}
                            disabled={markingId === del.id}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all disabled:opacity-50 inline-flex items-center gap-1.5"
                          >
                            <CheckSquare className="w-4 h-4" />
                            <span>{markingId === del.id ? 'Deducting...' : '✓ Mark Delivered'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE DELIVERY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl p-6 space-y-6 text-white">
            <h3 className="text-xl font-extrabold font-heading text-white">Schedule New Meal Delivery</h3>

            <form onSubmit={handleCreateDeliverySubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Select Customer</label>
                <select
                  required
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                >
                  <option value="">Select customer profile...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.customer_id || 'LTS-01'}) — {c.subscription?.meals_remaining ?? 20} Meals Left
                    </option>
                  ))}
                </select>
                {activeCustomerObj && (
                  <p className="text-[11px] font-bold text-emerald-400 pt-1">
                    Remaining Meal Balance: {activeCustomerObj.subscription?.meals_remaining ?? 20} Meals
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Select Product / Dish</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                >
                  <option value="">Default Meal Selection</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Delivery Date</label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Delivery Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Ring bell, extra lemon dressing requested"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all"
              >
                {isSubmitting ? 'Scheduling...' : 'Confirm Delivery Schedule'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-white font-bold"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
