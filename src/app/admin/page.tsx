'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Users,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Bell,
  Utensils,
  ChevronRight,
  Sparkles,
  Search,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const {
    customers,
    subscriptions,
    deliveries,
    notifications,
    refreshAdminData,
    isLoading,
    markDeliveryDelivered,
  } = useAdminAuth();

  const [dateFilter, setDateFilter] = useState<'7d' | '30d' | '90d'>('7d');
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute live KPI metrics directly from Supabase datasets
  const totalCustomers = useMemo(() => customers.length, [customers]);

  const newCustomersCount = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    if (dateFilter === '7d') cutoff.setDate(now.getDate() - 7);
    else if (dateFilter === '30d') cutoff.setDate(now.getDate() - 30);
    else cutoff.setDate(now.getDate() - 90);

    return customers.filter((c) => new Date(c.created_at) >= cutoff).length;
  }, [customers, dateFilter]);

  const activeSubscriptionsCount = useMemo(() => {
    return subscriptions.filter((s) => s.status === 'active').length;
  }, [subscriptions]);

  const completedSubscriptionsCount = useMemo(() => {
    return subscriptions.filter((s) => s.status === 'completed').length;
  }, [subscriptions]);

  const mealsDeliveredToday = useMemo(() => {
    return deliveries.filter((d) => d.status === 'delivered' && d.delivery_date === todayStr).length;
  }, [deliveries, todayStr]);

  const totalMealsRemaining = useMemo(() => {
    return subscriptions
      .filter((s) => s.status === 'active')
      .reduce((acc, curr) => acc + (curr.meals_remaining || 0), 0);
  }, [subscriptions]);

  // Today's Meal Activity Stats
  const todayDeliveries = useMemo(() => {
    return deliveries.filter((d) => d.delivery_date === todayStr);
  }, [deliveries, todayStr]);

  const todayActivity = useMemo(() => {
    const scheduled = todayDeliveries.filter((d) => d.status === 'scheduled').length;
    const preparing = todayDeliveries.filter((d) => d.status === 'preparing').length;
    const outForDelivery = todayDeliveries.filter((d) => d.status === 'out_for_delivery').length;
    const delivered = todayDeliveries.filter((d) => d.status === 'delivered').length;
    const remainingToday = scheduled + preparing + outForDelivery;

    return { scheduled, preparing, outForDelivery, delivered, remainingToday };
  }, [todayDeliveries]);

  // Handle Mark Delivered Action
  const handleMarkDelivered = async (deliveryId: string) => {
    setMarkingId(deliveryId);
    setFeedbackMsg(null);
    const res = await markDeliveryDelivered(deliveryId);
    if (res.success) {
      setFeedbackMsg({ type: 'success', text: res.message || '✓ Delivery marked as delivered. 1 meal deducted.' });
    } else {
      setFeedbackMsg({ type: 'error', text: res.error || 'Failed to update delivery.' });
    }
    setMarkingId(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* TOP TITLE BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Love Thy Salad Operations Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Business Overview & Daily Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refreshAdminData()}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Live Data</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST BANNER */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border-red-500/30 text-red-300'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-xs text-slate-400 hover:text-white font-normal">
            Dismiss
          </button>
        </div>
      )}

      {/* NEW CUSTOMER RECENT ALERT BANNER */}
      {notifications.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 text-white flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-400 block uppercase tracking-wider">
                {notifications[0].title}
              </span>
              <p className="text-xs text-slate-300 mt-0.5">{notifications[0].message}</p>
            </div>
          </div>
          <Link
            href="/admin/customers"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1 flex-shrink-0"
          >
            <span>View Customer</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* SECTION 1: 6 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* TOTAL CUSTOMERS */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Customers</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-white">{totalCustomers}</div>
          <span className="text-[11px] text-slate-400 font-semibold block">Registered Profiles</span>
        </div>

        {/* NEW CUSTOMERS */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">New Customers</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-emerald-400">+{newCustomersCount}</div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-400">Timeframe:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-emerald-400 rounded px-1 py-0.5 font-bold"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
          </div>
        </div>

        {/* ACTIVE SUBSCRIPTIONS */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Subs</span>
            <CreditCard className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-white">{activeSubscriptionsCount}</div>
          <span className="text-[11px] text-teal-400 font-semibold block">20-Meal Plans Active</span>
        </div>

        {/* MEALS DELIVERED TODAY */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Delivered Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-emerald-400">{mealsDeliveredToday}</div>
          <span className="text-[11px] text-slate-400 font-semibold block">Verified Today</span>
        </div>

        {/* MEALS REMAINING */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Meals Remaining</span>
            <Utensils className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-amber-400">{totalMealsRemaining}</div>
          <span className="text-[11px] text-slate-400 font-semibold block">Across Active Plans</span>
        </div>

        {/* COMPLETED SUBSCRIPTIONS */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-white">{completedSubscriptionsCount}</div>
          <span className="text-[11px] text-slate-400 font-semibold block">Fulfilled 20/20 Meals</span>
        </div>
      </div>

      {/* SECTION 2: TODAY'S MEAL ACTIVITY TRACKING */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-400" />
              <span>Today's Meal Activity</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live tracking metrics calculated directly from Supabase delivery logs for {todayStr}.
            </p>
          </div>

          <Link
            href="/admin/deliveries"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 transition-all w-fit"
          >
            <span>Manage Deliveries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Meals Scheduled</span>
            <div className="text-2xl font-extrabold font-heading text-white">{todayActivity.scheduled}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center space-y-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Meals Preparing</span>
            <div className="text-2xl font-extrabold font-heading text-amber-400">{todayActivity.preparing}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center space-y-1">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Out for Delivery</span>
            <div className="text-2xl font-extrabold font-heading text-blue-400">{todayActivity.outForDelivery}</div>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Meals Delivered</span>
            <div className="text-2xl font-extrabold font-heading text-emerald-400">{todayActivity.delivered}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Remaining Today</span>
            <div className="text-2xl font-extrabold font-heading text-white">{todayActivity.remainingToday}</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: RECENT CUSTOMERS & RECENT DELIVERIES (TWO COLUMN GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RECENT CUSTOMERS (COL 6) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Recent Customers</span>
              </h2>
              <Link
                href="/admin/customers"
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="p-3">Customer ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Remaining</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {customers.slice(0, 5).map((cust) => {
                    const remaining = cust.subscription?.meals_remaining ?? 20;
                    return (
                      <tr key={cust.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3 font-extrabold text-emerald-400">
                          {cust.customer_id || 'LTS-01'}
                        </td>
                        <td className="p-3 font-semibold text-white">
                          <div>{cust.full_name}</div>
                          <div className="text-[10px] text-slate-400">{cust.email}</div>
                        </td>
                        <td className="p-3 font-bold text-amber-400">
                          {remaining} / 20
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              cust.subscription?.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {cust.subscription?.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Link
                            href={`/admin/customers/${cust.id}`}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[11px] font-bold transition-all inline-block"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RECENT DELIVERIES (COL 6) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                <span>Today's Deliveries</span>
              </h2>
              <Link
                href="/admin/deliveries"
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Manage Deliveries</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Meal</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {deliveries.slice(0, 5).map((del) => {
                    const isDelivered = del.status === 'delivered';
                    return (
                      <tr key={del.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">
                            {del.user?.full_name || 'Customer'}
                          </div>
                          <div className="text-[10px] text-emerald-400 font-bold">
                            {del.user?.customer_id || 'LTS-01'}
                          </div>
                        </td>
                        <td className="p-3 text-slate-200 font-medium">
                          {del.product?.name || 'Avocado Quinoa Bowl'}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              isDelivered
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {del.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {isDelivered ? (
                            <span className="text-[11px] font-bold text-slate-400">Done ✓</span>
                          ) : (
                            <button
                              onClick={() => handleMarkDelivered(del.id)}
                              disabled={markingId === del.id}
                              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] transition-all disabled:opacity-50"
                            >
                              {markingId === del.id ? 'Saving...' : '✓ Delivered'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
