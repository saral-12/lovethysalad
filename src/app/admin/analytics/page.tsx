'use client';

import React, { useMemo } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { BarChart3, TrendingUp, Users, Truck, Sparkles, Utensils, PieChart, ShieldCheck } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const { customers, subscriptions, deliveries, products } = useAdminAuth();

  // Daily Business Summary
  const summary = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newCustToday = customers.filter(
      (c) => new Date(c.created_at).toISOString().split('T')[0] === todayStr
    ).length;

    const deliveredToday = deliveries.filter(
      (d) => d.status === 'delivered' && d.delivery_date === todayStr
    ).length;

    const scheduledToday = deliveries.filter(
      (d) => d.delivery_date === todayStr
    ).length;

    const activeSubscribers = subscriptions.filter((s) => s.status === 'active').length;
    const completedSubs = subscriptions.filter((s) => s.status === 'completed').length;

    return {
      newCustToday,
      deliveredToday,
      scheduledToday,
      activeSubscribers,
      completedSubs,
    };
  }, [customers, subscriptions, deliveries]);

  // Popular Menu Items Ranking (deliveries count per dish)
  const popularMeals = useMemo(() => {
    const counts: Record<string, number> = {};
    deliveries.forEach((d) => {
      const pName = d.product?.name || 'Avocado Quinoa Power Bowl';
      counts[pName] = (counts[pName] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [deliveries]);

  // Completion Rate
  const totalSubCount = subscriptions.length || 1;
  const completionRate = Math.round((summary.completedSubs / totalSubCount) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Business Intelligence & Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Love Thy Salad Analytics
          </h1>
        </div>
      </div>

      {/* DAILY BUSINESS SUMMARY */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              TODAY'S BUSINESS SUMMARY
            </span>
            <h2 className="text-lg font-extrabold text-white font-heading mt-0.5">
              Live Daily Key Indicators
            </h2>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold">
            Baner, Pune Cloud Kitchen
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">New Customers Today</span>
            <div className="text-3xl font-extrabold font-heading text-emerald-400">+{summary.newCustToday}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Meals Delivered Today</span>
            <div className="text-3xl font-extrabold font-heading text-emerald-400">{summary.deliveredToday}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Meals Scheduled</span>
            <div className="text-3xl font-extrabold font-heading text-white">{summary.scheduledToday}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Active Subscribers</span>
            <div className="text-3xl font-extrabold font-heading text-amber-400">{summary.activeSubscribers}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Subscriptions Completed</span>
            <div className="text-3xl font-extrabold font-heading text-blue-400">{summary.completedSubs}</div>
          </div>
        </div>
      </div>

      {/* POPULAR DISHES & SUBSCRIPTION METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* POPULAR MENU ITEMS RANKING (COL 7) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-400" />
              <span>Most Popular Menu Items</span>
            </h2>
            <span className="text-xs text-slate-400 font-bold">Total Deliveries Count</span>
          </div>

          <div className="space-y-4">
            {popularMeals.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No delivery logs recorded yet.</p>
            ) : (
              popularMeals.slice(0, 5).map((dish, idx) => {
                const maxCount = popularMeals[0]?.count || 1;
                const pct = Math.round((dish.count / maxCount) * 100);
                return (
                  <div key={dish.name} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">
                        {idx + 1}. {dish.name}
                      </span>
                      <span className="text-emerald-400">{dish.count} deliveries</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* METRICS & PERFORMANCE CARDS (COL 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold font-heading text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-400" />
              <span>Subscription Completion Rate</span>
            </h3>
            <div className="text-center py-6 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-2">
              <span className="text-5xl font-extrabold font-heading text-emerald-400 block">
                {completionRate}%
              </span>
              <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                Full 20-Meal Plan Fulfillment
              </span>
              <p className="text-xs text-slate-400">
                {summary.completedSubs} of {subscriptions.length} subscriptions completed.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold font-heading text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              <span>Customer Growth Trend</span>
            </h3>
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Active Customers:</span>
                <span className="font-bold text-white">{customers.length}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Delivery Coverage:</span>
                <span className="font-bold text-emerald-400">Baner & Nearby Pune</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
