'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Users, Search, Filter, ArrowRight, ShieldCheck, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function AdminCustomersPage() {
  const { customers, isLoading } = useAdminAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (cust.customer_id && cust.customer_id.toLowerCase().includes(q)) ||
        cust.full_name.toLowerCase().includes(q) ||
        cust.email.toLowerCase().includes(q) ||
        (cust.phone && cust.phone.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      const sub = cust.subscription;
      const remaining = sub?.meals_remaining ?? 20;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'active') return sub?.status === 'active';
      if (statusFilter === 'completed') return sub?.status === 'completed' || remaining === 0;
      if (statusFilter === 'paused') return sub?.status === 'paused';
      if (statusFilter === 'low_meals') return remaining <= 5 && remaining > 0;
      if (statusFilter === 'new') {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return new Date(cust.created_at) >= sevenDaysAgo;
      }

      return true;
    });
  }, [customers, searchQuery, statusFilter]);

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Customer Directory & Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            All Registered Customers ({filteredCustomers.length})
          </h1>
        </div>
      </div>

      {/* SEARCH BAR & FILTERS */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Customer ID (e.g. LTS-01), Name, Email, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            >
              <option value="all">All Customers</option>
              <option value="active">Active Subscription</option>
              <option value="low_meals">Low Meals Remaining (≤ 5)</option>
              <option value="new">New Customers (Last 7 Days)</option>
              <option value="completed">Completed Subscriptions</option>
              <option value="paused">Paused Subscriptions</option>
            </select>
          </div>
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Subscription Plan</th>
                <th className="p-4 text-center">Delivered</th>
                <th className="p-4 text-center">Remaining</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Loading customer profiles from Supabase...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 space-y-2">
                    <Users className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-semibold">No customers match your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const sub = cust.subscription;
                  const delivered = sub?.meals_delivered ?? 0;
                  const remaining = sub?.meals_remaining ?? 20;

                  return (
                    <tr key={cust.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-extrabold text-emerald-400 text-sm whitespace-nowrap">
                        {cust.customer_id || 'LTS-01'}
                      </td>
                      <td className="p-4 font-semibold text-white">
                        <div className="text-sm">{cust.full_name}</div>
                        <div className="text-[10px] text-slate-400">Joined {new Date(cust.created_at).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4 text-slate-300 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{cust.email}</span>
                        </div>
                        {cust.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Phone className="w-3 h-3 text-slate-500" />
                            <span>{cust.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-slate-200">
                        20 Meal Plan
                      </td>
                      <td className="p-4 text-center font-bold text-slate-300">
                        {delivered}
                      </td>
                      <td className="p-4 text-center font-extrabold">
                        <span
                          className={
                            remaining <= 5 ? 'text-red-400 animate-pulse' : 'text-amber-400'
                          }
                        >
                          {remaining}
                        </span>
                        <span className="text-slate-500 text-[10px]"> / 20</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                            sub?.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : sub?.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {sub?.status || 'Active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/customers/${cust.id}`}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all inline-flex items-center gap-1"
                        >
                          <span>View Profile</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
