'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Toast } from '@/components/Toast';
import { User, Mail, Phone, MapPin, Save, ShieldCheck, Calendar, Sparkles } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      full_name: fullName,
      phone,
      address,
    });
    setIsSaving(false);
    setToastMessage('Your profile information has been saved successfully!');
  };

  const initial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-salad-dark">
          My Profile
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          View and manage your account credentials and doorstep delivery address in Baner, Pune.
        </p>
      </div>

      {/* LOGGED IN USER AVATAR & SUMMARY BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-salad-dark via-emerald-950 to-salad-dark text-white p-6 sm:p-8 shadow-xl border border-salad-fresh/20 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-salad-fresh text-salad-dark font-extrabold text-3xl flex items-center justify-center shadow-lg border-2 border-white/80 flex-shrink-0">
          {initial}
        </div>

        <div className="space-y-2 text-center sm:text-left flex-grow">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold font-heading text-white">
              {user?.full_name || 'Valued Customer'}
            </h2>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-salad-fresh text-salad-dark">
              {user?.role || 'Customer'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-300">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-salad-light" />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-salad-light" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>

          {user?.address && (
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-salad-light pt-1">
              <MapPin className="w-3.5 h-3.5 text-salad-fresh flex-shrink-0" />
              <span className="truncate max-w-md">{user.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* EDITABLE PROFILE FORM */}
      <div className="p-8 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-xl font-bold font-heading text-salad-dark">
            Account Details & Delivery Address
          </h3>
          <span className="text-xs font-semibold text-salad-leaf flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Live Supabase Synced
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
                Email Address (Account ID)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-100 border border-gray-200 text-sm text-gray-500 cursor-not-allowed font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
              Baner Delivery Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              <textarea
                rows={3}
                placeholder="Flat / Building, Street / Landmark, Baner, Pune - 411045"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 rounded-2xl bg-salad-primary hover:bg-salad-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>

      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
