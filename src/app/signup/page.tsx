'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Toast } from '@/components/Toast';
import { TermsModal } from '@/components/TermsModal';
import { Leaf, Lock, Mail, User, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    agreeTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      setToastType('error');
      setToastMessage('You must agree to the terms and conditions to sign up.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setToastType('error');
      setToastMessage('Passwords do not match. Please verify your password.');
      return;
    }

    setIsSubmitting(true);
    const res = await signup(
      formData.fullName,
      formData.email,
      formData.phone,
      formData.password,
      formData.address
    );
    setIsSubmitting(false);

    if (res.success) {
      setToastType('success');
      setToastMessage('Account created successfully! Your 20-meal subscription is active.');
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Failed to create account. Please check your details and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-salad-bg p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-salad-leaf/10 grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
        {/* LEFT SIDE: BRAND VISUAL */}
        <div className="lg:col-span-5 bg-gradient-to-br from-salad-dark via-emerald-950 to-salad-dark p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-salad-fresh flex items-center justify-center text-salad-dark shadow-md">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-white">
                Love Thy Salad
              </span>
            </Link>

            <div className="pt-6 space-y-4">
              <span className="text-xs uppercase tracking-widest text-salad-fresh font-bold">
                20 Meal Subscription Signup
              </span>
              <h2 className="text-3xl font-extrabold font-heading text-white leading-tight">
                Start Your Healthy Journey 🌿
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Create your account to unlock 20 fresh meal deliveries, ingredient customization, and live balance tracking in Baner, Pune.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-salad-light">
            <ShieldCheck className="w-4 h-4 text-salad-fresh" />
            <span>Baner, Pune Cloud Kitchen Delivery</span>
          </div>

          <div className="absolute -top-10 -left-10 w-60 h-60 bg-salad-fresh/15 rounded-full blur-3xl" />
        </div>

        {/* RIGHT SIDE: SIGNUP FORM */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold font-heading text-salad-dark">
                Create Customer Account
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Enter your details to activate your 20-meal subscription.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-salad-dark mb-1 uppercase">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Smiti Khattri"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-xs text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-salad-dark mb-1 uppercase">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-xs text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-salad-dark mb-1 uppercase">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-xs text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-salad-dark mb-1 uppercase">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-xs text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-salad-dark mb-1 uppercase">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-xs text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-salad-dark mb-1 uppercase">
                  Baner Delivery Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <textarea
                    required
                    rows={2}
                    placeholder="Flat / Building, Street / Landmark, Baner, Pune - 411045"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-salad-surface border border-gray-200 text-xs text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="w-4 h-4 rounded text-salad-primary focus:ring-salad-primary border-gray-300"
                />
                <label htmlFor="terms" className="text-xs text-gray-600 select-none">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setIsTermsOpen(true)}
                    className="text-salad-primary font-bold hover:underline"
                  >
                    terms and conditions
                  </button>.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-salad-primary hover:bg-salad-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Activate Subscription & Go to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-2 border-t border-gray-100 text-center text-xs text-gray-600">
            <span>Already have an account? </span>
            <Link href="/login" className="font-bold text-salad-primary hover:underline">
              Log in here
            </Link>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onAccept={() => setFormData((prev) => ({ ...prev, agreeTerms: true }))}
      />
    </div>
  );
}
