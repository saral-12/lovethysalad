'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-salad-bg">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* HERO */}
        <section className="py-12 gradient-hero-bg text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 shadow-soft-sm border border-salad-leaf/20 text-salad-dark text-xs font-semibold">
              <FileText className="w-3.5 h-3.5 text-salad-leaf" />
              <span>Legal & Subscription Guidelines</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-salad-dark tracking-tight">
              Terms & Conditions
            </h1>

            <p className="text-gray-600 max-w-xl mx-auto text-base">
              Subscription rules, kitchen operation guidelines, and meal tracking policies for Love Thy Salad.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
            <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10 text-xs text-salad-dark font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-salad-fresh flex-shrink-0" />
              <span>Effective Date: September 2026 • Love Thy Salad Cloud Kitchen, Baner, Pune</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold font-heading text-salad-dark">
                1. Cloud Kitchen & Doorstep Delivery Service
              </h2>
              <p>
                Love Thy Salad is a healthy food cloud kitchen based in Baner, Pune (Owner: Smiti Olga Khattri). All meals are prepared fresh in our hygienic delivery kitchen and delivered directly to your residential or office address. <strong>There is no customer dine-in or physical visit facility available.</strong>
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold font-heading text-salad-dark">
                2. 20-Meal Subscription & Tracking Rules
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>Each subscription plan includes a total balance of <strong>20 Meal Deliveries</strong>.</li>
                <li>The system tracks actual <strong>MEALS DELIVERED</strong>, not calendar days.</li>
                <li>Your remaining meal balance decrements by 1 ONLY when a meal status is set to "delivered".</li>
                <li>When your remaining meals reach 0, your subscription status changes to "Completed". You can renew your plan anytime from your dashboard.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold font-heading text-salad-dark">
                3. Meal Customization & Dietary Restrictions
              </h2>
              <p>
                Subscribers can specify dietary preferences, ingredients to avoid, spice levels, and custom notes inside their customer portal. Our kitchen team will accommodate these notes during prep.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold font-heading text-salad-dark">
                4. Contact & Support
              </h2>
              <p>
                For questions regarding your meal plan, contact Founder Smiti Olga Khattri via email at <a href="mailto:smiti.olgakhattri@gmail.com" className="text-salad-primary font-bold hover:underline">smiti.olgakhattri@gmail.com</a>.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-salad-primary text-white font-bold text-sm shadow hover:bg-salad-dark transition-all"
              >
                <span>Back to Subscription Signup</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/faq"
                className="text-xs font-bold text-salad-leaf hover:underline"
              >
                View Frequently Asked Questions
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
