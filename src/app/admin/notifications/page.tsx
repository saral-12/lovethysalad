'use client';

import React, { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Bell, Send, Users, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

export default function AdminNotificationsPage() {
  const { notifications, customers, sendNotification } = useAdminAuth();

  const [selectedUser, setSelectedUser] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notifType, setNotifType] = useState('info');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !title || !message) return;

    setIsSubmitting(true);
    setToastMsg(null);

    const res = await sendNotification(selectedUser, title, message, notifType);

    if (res.success) {
      setToastMsg({ type: 'success', text: '✓ Notification dispatched to customer dashboard.' });
      setTitle('');
      setMessage('');
      setSelectedUser('');
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Failed to dispatch notification.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Communication & Alert Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Admin Notifications & Dispatcher
          </h1>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* DISPATCH COMPOSER (COL 5) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-400" />
              <span>Send Customer Notification</span>
            </h2>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Target Customer</label>
              <select
                required
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
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
              <label className="font-bold text-slate-300 uppercase">Notification Type</label>
              <select
                value={notifType}
                onChange={(e) => setNotifType(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
              >
                <option value="info">Info (General Update)</option>
                <option value="success">Success (Meal Delivered)</option>
                <option value="warning">Warning (Low Meals)</option>
                <option value="alert">Alert (Important)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Special Fresh Juice Included Today 🥤"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase">Message Content</label>
              <textarea
                rows={4}
                required
                placeholder="Enter notification text..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Dispatching...' : 'Dispatch Notification'}</span>
            </button>
          </form>
        </div>

        {/* ADMIN NOTIFICATION STREAM (COL 7) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              <span>System Alerts & Notifications ({notifications.length})</span>
            </h2>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No system notifications found.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-white flex items-center gap-2">
                      <span>{n.title}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
