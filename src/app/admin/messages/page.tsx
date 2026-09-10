'use client';

import React from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { MessageSquare, Mail, Phone, Calendar, CheckCircle2, Clock } from 'lucide-react';

export default function AdminMessagesPage() {
  const { messages, toggleMessageStatus, isLoading } = useAdminAuth();

  const handleToggle = async (msgId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'new' ? 'read' : 'new';
    await toggleMessageStatus(msgId, nextStatus);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Customer Inquiries & Messages
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Contact Form Submissions ({messages.length})
          </h1>
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-4">Sender Info</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Message Content</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading contact form submissions...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 space-y-2">
                    <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-semibold">No contact form submissions recorded yet.</p>
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-bold text-white whitespace-nowrap">
                      {msg.name}
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{msg.email}</span>
                      </div>
                      {msg.phone && (
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{msg.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-slate-300 max-w-xs leading-relaxed">
                      {msg.message}
                    </td>
                    <td className="p-4 text-slate-400 font-medium whitespace-nowrap">
                      {new Date(msg.created_at || Date.now()).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          msg.status === 'new'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => msg.id && handleToggle(msg.id, msg.status || 'new')}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition-all"
                      >
                        Mark as {msg.status === 'new' ? 'Read' : 'New'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
