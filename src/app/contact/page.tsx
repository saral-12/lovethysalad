'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';
import { useAuth } from '@/context/AuthContext';
import { Mail, MapPin, Send, ShieldCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const { submitContactMessage } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setToastType('error');
      setToastMessage('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    const res = await submitContactMessage(formData);
    setIsSubmitting(false);

    if (res.success) {
      setToastType('success');
      setToastMessage('Thank you! Your message has been sent successfully.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Failed to submit message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-salad-bg">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* HERO */}
        <section className="py-12 gradient-hero-bg text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-3">
            <span className="text-xs font-bold text-salad-leaf uppercase tracking-widest">
              We'd Love To Hear From You
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-salad-dark tracking-tight">
              Let's Talk 🌿
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto text-base">
              Have questions about our 20-meal subscription or dietary customizations? Drop us a message below.
            </p>
          </div>
        </section>

        {/* MAIN SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 p-8 rounded-3xl bg-salad-dark text-white shadow-2xl space-y-8 border border-salad-fresh/20"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-salad-fresh">
                  Cloud Kitchen Information
                </span>
                <h2 className="text-3xl font-extrabold font-heading text-white mt-1">
                  Love Thy Salad
                </h2>
                <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                  Healthy Food Cloud Kitchen based in Baner, Pune.
                </p>
              </div>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-salad-fresh flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">Founder & Owner</span>
                    <span className="font-bold text-white">Smiti Olga Khattri</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-salad-fresh flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">Kitchen Location</span>
                    <span className="font-bold text-white">Baner, Pune, Maharashtra</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-salad-fresh flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-400 block font-semibold">Email Address</span>
                    <a
                      href="mailto:smiti.olgakhattri@gmail.com"
                      className="font-bold text-salad-light hover:underline"
                    >
                      smiti.olgakhattri@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-xs text-gray-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-salad-fresh font-bold">
                  <ShieldCheck className="w-4 h-4" /> Doorstep Delivery Kitchen
                </div>
                <p>
                  Love Thy Salad operates exclusively as a cloud kitchen delivery service. There is no physical customer dine-in or visit facility.
                </p>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 p-8 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold text-salad-dark font-heading">
                  Send Us A Message
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Fill out the details below and our team will get back to you promptly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you with your meal plan?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-salad-primary hover:bg-salad-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
