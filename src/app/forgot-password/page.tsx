'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Toast } from '@/components/Toast';
import { Leaf, Mail, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setToastType('error');
      setToastMessage('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    const res = await resetPassword(email);
    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
      setToastType('success');
      setToastMessage('Password reset instructions have been sent to your email.');
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-salad-bg p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-salad-leaf/10 p-8 space-y-6">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-salad-fresh flex items-center justify-center text-salad-dark shadow-md">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-salad-dark">
              Love Thy Salad
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold font-heading text-salad-dark pt-2">
            Reset Your Password 🔒
          </h1>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Enter your registered email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-salad-fresh mx-auto" />
            <h3 className="font-bold text-base">Check Your Inbox</h3>
            <p className="text-xs text-emerald-800 leading-relaxed">
              We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-3 rounded-2xl bg-salad-primary text-white font-bold text-xs shadow hover:bg-salad-dark transition-all text-center"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-salad-primary hover:bg-salad-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Sending Instructions...' : 'Send Password Reset Link'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
          <span>Remembered your password? </span>
          <Link href="/login" className="font-bold text-salad-primary hover:underline">
            Back to Login
          </Link>
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
