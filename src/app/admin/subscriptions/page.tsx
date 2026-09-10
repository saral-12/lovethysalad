'use client';

import React, { useState, useMemo } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { CreditCard, Search, PlusCircle, PauseCircle, PlayCircle, XCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const { subscriptions, customers, createSubscription, modifySubscription, isLoading } = useAdminAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [totalMeals, setTotalMeals] = useState(20);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const cust = sub.user;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (cust?.customer_id && cust.customer_id.toLowerCase().includes(q)) ||
        (cust?.full_name && cust.full_name.toLowerCase().includes(q)) ||
        (sub.id && sub.id.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (statusFilter === 'all') return true;
      return sub.status === statusFilter;
    });
  }, [subscriptions, searchQuery, statusFilter]);

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    setIsSubmitting(true);
    setToastMsg(null);

    const res = await createSubscription({
      userId: selectedCustomer,
      totalMeals,
    });

    if (res.success) {
      setToastMsg({ type: 'success', text: '✓ 20-Meal Subscription created successfully.' });
      setShowCreateModal(false);
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Failed to create subscription.' });
    }
    setIsSubmitting(false);
  };

  const handleStatusChange = async (subscriptionId: string, newStatus: string) => {
    setToastMsg(null);
    const res = await modifySubscription(subscriptionId, { status: newStatus });
    if (res.success) {
      setToastMsg({ type: 'success', text: `✓ Subscription status updated to ${newStatus}.` });
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Failed to update subscription.' });
    }
  };

  const handleAddMeals = async (subscriptionId: string) => {
    setToastMsg(null);
    const res = await modifySubscription(subscriptionId, { addMeals: 5 });
    if (res.success) {
      setToastMsg({ type: 'success', text: '✓ Added +5 meals to subscription balance.' });
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Failed to add meals.' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Subscription Lifecycle Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Customer Subscriptions ({filteredSubscriptions.length})
          </h1>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New 20-Meal Subscription</span>
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

      {/* SEARCH BAR & FILTERS */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Customer Name, Customer ID (e.g. LTS-01), or Sub ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="md:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* SUBSCRIPTIONS TABLE */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Plan Name</th>
                <th className="p-4 text-center">Total Meals</th>
                <th className="p-4 text-center">Delivered</th>
                <th className="p-4 text-center">Remaining</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Loading subscriptions...
                  </td>
                </tr>
              ) : filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 space-y-2">
                    <CreditCard className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-semibold">No subscriptions match your query.</p>
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const cust = sub.user;
                  return (
                    <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-semibold text-white">
                        <div>{cust?.full_name || 'Customer'}</div>
                        <div className="text-[10px] text-emerald-400 font-extrabold">{cust?.customer_id || 'LTS-01'}</div>
                      </td>
                      <td className="p-4 font-bold text-slate-200">
                        20-Meal Plan
                      </td>
                      <td className="p-4 text-center font-bold text-slate-300">
                        {sub.total_meals}
                      </td>
                      <td className="p-4 text-center font-bold text-emerald-400">
                        {sub.meals_delivered}
                      </td>
                      <td className="p-4 text-center font-extrabold text-amber-400">
                        {sub.meals_remaining}
                      </td>
                      <td className="p-4 text-slate-300 font-medium">
                        {sub.start_date || 'Today'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            sub.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : sub.status === 'paused'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : sub.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        {sub.status === 'active' ? (
                          <button
                            onClick={() => handleStatusChange(sub.id, 'paused')}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[11px] transition-all"
                          >
                            Pause
                          </button>
                        ) : sub.status === 'paused' ? (
                          <button
                            onClick={() => handleStatusChange(sub.id, 'active')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-[11px] transition-all"
                          >
                            Resume
                          </button>
                        ) : null}

                        <button
                          onClick={() => handleAddMeals(sub.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition-all"
                        >
                          +5 Meals
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE SUBSCRIPTION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl p-6 space-y-6 text-white">
            <h3 className="text-xl font-extrabold font-heading text-white">Create Customer Subscription</h3>

            <form onSubmit={handleCreateSubscription} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Select Customer</label>
                <select
                  required
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                >
                  <option value="">Select a customer profile...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name} ({c.customer_id || 'LTS-01'}) — {c.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Total Subscription Meals</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={totalMeals}
                  onChange={(e) => setTotalMeals(parseInt(e.target.value) || 20)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all"
              >
                {isSubmitting ? 'Creating...' : 'Activate Subscription'}
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
