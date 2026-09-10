'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Toast } from '@/components/Toast';
import { Leaf, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('error');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setToastType('error');
      setToastMessage('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setIsSubmitting(true);
    const res = await login(demoEmail, 'password123');
    setIsSubmitting(false);
    if (res.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-salad-bg p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-salad-leaf/10 grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* LEFT SIDE: BRANDING VISUAL */}
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

            <div className="pt-8 space-y-3">
              <span className="text-xs uppercase tracking-widest text-salad-fresh font-bold">
                Customer Portal
              </span>
              <h2 className="text-3xl font-extrabold font-heading text-white leading-tight">
                Nourish Your Routine Daily.
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Access your 20-meal subscription tracking, meal delivery history, and preference settings in one place.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 flex items-center gap-2 text-xs text-salad-light">
            <ShieldCheck className="w-4 h-4 text-salad-fresh" />
            <span>Baner, Pune Healthy Food Cloud Kitchen</span>
          </div>

          {/* Glowing background accent */}
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-salad-fresh/20 rounded-full blur-3xl" />
        </div>

        {/* RIGHT SIDE: LOGIN FORM */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold font-heading text-salad-dark">
                Welcome Back 🌿
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Enter your credentials to manage your Love Thy Salad account.
              </p>
            </div>

            {/* Quick Demo Credentials Assistant */}
            <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/20 space-y-2">
              <span className="text-[11px] font-bold text-salad-leaf uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-salad-accent" /> Quick Demo Account Access
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('demo@lovethysalad.com')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-salad-primary hover:text-white text-salad-dark text-xs font-semibold border border-gray-200 shadow-sm transition-all"
                >
                  Active Plan (13 Meals Left)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('ananya@example.com')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-salad-primary hover:text-white text-salad-dark text-xs font-semibold border border-gray-200 shadow-sm transition-all"
                >
                  Low Plan (5 Meals Left)
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('rohan@example.com')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-salad-primary hover:text-white text-salad-dark text-xs font-semibold border border-gray-200 shadow-sm transition-all"
                >
                  Completed (0 Left)
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="smiti@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-salad-dark uppercase">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-salad-primary hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-salad-primary hover:bg-salad-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Login to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
            <span>Don't have a subscription account yet? </span>
            <Link href="/signup" className="font-bold text-salad-primary hover:underline">
              Sign Up & Start 20 Meal Plan
            </Link>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
