'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, ShieldCheck, Lock, CheckCircle } from 'lucide-react';

export default function CustomerProfilePage() {
  const { user } = useAuth();

  const initial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-extrabold font-heading text-salad-dark">
            My Profile
          </h1>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Read-Only Credentials
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Your registered customer credentials and doorstep delivery address in Baner, Pune.
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

      {/* READ-ONLY PROFILE DATA */}
      <div className="p-8 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-xl font-bold font-heading text-salad-dark flex items-center gap-2">
              <span>Account Credentials & Address</span>
              <Lock className="w-4 h-4 text-amber-600" />
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Stored in Supabase database upon signup. Profile details cannot be modified after registration.
            </p>
          </div>
          <span className="text-xs font-semibold text-salad-leaf flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Locked Record
          </span>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
                Full Name (Registered)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value={user?.full_name || ''}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-100 border border-gray-200 text-sm text-gray-700 cursor-not-allowed font-medium"
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
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-100 border border-gray-200 text-sm text-gray-700 cursor-not-allowed font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
              Registered Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="tel"
                disabled
                value={user?.phone || 'Not provided'}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-100 border border-gray-200 text-sm text-gray-700 cursor-not-allowed font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
              Registered Baner Delivery Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
              <textarea
                rows={3}
                disabled
                value={user?.address || 'Baner, Pune'}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-100 border border-gray-200 text-sm text-gray-700 cursor-not-allowed font-medium resize-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <Lock className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold">Profile Details Locked:</span> Your customer registration credentials and doorstep delivery address are permanently linked to your 20-meal subscription in Supabase to ensure accurate cloud kitchen fulfillment in Baner, Pune.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
