'use client';

import React, { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Settings, ShieldCheck, Save, Building, Bell, CreditCard, Palette, Sun, Moon, Trees } from 'lucide-react';

export default function AdminSettingsPage() {
  const { adminUser, theme, setTheme } = useAdminAuth();

  const [threshold, setThreshold] = useState(5);
  const [defaultMeals, setDefaultMeals] = useState(20);
  const [outletName, setOutletName] = useState('Doorstep Cloud Kitchen Baner');
  const [city, setCity] = useState('Baner, Pune');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMsg('✓ Admin business settings updated successfully.');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Operational Parameters & Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Admin Business Settings
          </h1>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <span>{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="text-xs text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ADMIN PROFILE CARD (COL 6) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Administrator Profile</span>
            </h2>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase">
              Role: Admin
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Full Name</span>
              <span className="font-extrabold text-white text-base block mt-0.5">
                {adminUser?.full_name || 'Love Thy Salad Admin'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Email Address</span>
              <span className="font-bold text-emerald-400 text-sm block mt-0.5">{adminUser?.email}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Security Clearance</span>
              <span className="font-semibold text-slate-300 block mt-0.5">
                Full Database & Service Role Management Access
              </span>
            </div>
          </div>
        </div>

        {/* THEME PREFERENCE CARD (COL 6) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-emerald-400" />
              <span>Admin Portal Theme</span>
            </h2>
            <span className="text-xs text-emerald-400 font-bold uppercase">
              Current: {theme}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                theme === 'dark'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-lg'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Moon className="w-6 h-6 mx-auto text-indigo-400" />
              <div className="text-xs font-bold">Dark Slate</div>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                theme === 'light'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-lg'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Sun className="w-6 h-6 mx-auto text-amber-400" />
              <div className="text-xs font-bold">Executive Light</div>
            </button>

            <button
              onClick={() => setTheme('forest')}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                theme === 'forest'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-lg'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
            >
              <Trees className="w-6 h-6 mx-auto text-emerald-400" />
              <div className="text-xs font-bold">Midnight Forest</div>
            </button>
          </div>
        </div>

        {/* BUSINESS THRESHOLDS CARD (COL 6) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-emerald-400" />
              <span>Kitchen & Subscription Thresholds</span>
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Outlet Name</label>
              <input
                type="text"
                value={outletName}
                onChange={(e) => setOutletName(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Location / Delivery Zone</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Low-Meal Alert Threshold</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value) || 5)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Default Subscription Meals</label>
                <input
                  type="number"
                  value={defaultMeals}
                  onChange={(e) => setDefaultMeals(parseInt(e.target.value) || 20)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
