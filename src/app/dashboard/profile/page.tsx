'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Toast } from '@/components/Toast';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

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

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-salad-dark">
          My Profile
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your contact details and doorstep delivery address in Baner, Pune.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm max-w-3xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-100 border border-gray-200 text-sm text-gray-500 cursor-not-allowed"
              />
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
            <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
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
