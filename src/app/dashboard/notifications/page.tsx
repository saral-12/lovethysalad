'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Bell, CheckCircle2, Info, AlertTriangle, Sparkles, Check } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useAuth();

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-salad-dark">
          Notification Center
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Recent updates regarding your subscription activation, meal deliveries, and meal balance alerts.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm max-w-3xl space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-xs">
            You're all caught up! No notifications at this time.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                notif.read
                  ? 'bg-salad-surface border-salad-leaf/10 opacity-75'
                  : 'bg-emerald-50/70 border-emerald-300 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-salad-beige text-salad-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  {notif.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-salad-fresh" />
                  ) : notif.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-salad-dark">{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-salad-fresh animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
                  <span className="text-[10px] text-gray-400 block mt-2 font-medium">
                    {new Date(notif.created_at).toLocaleDateString()} at{' '}
                    {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => markNotificationRead(notif.id)}
                  className="px-3 py-1 rounded-full bg-white hover:bg-salad-primary hover:text-white text-salad-dark text-[11px] font-bold border border-gray-200 shadow-sm transition-all whitespace-nowrap flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5 text-salad-fresh" /> Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
