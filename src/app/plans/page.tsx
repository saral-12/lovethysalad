'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  RotateCcw,
  Sliders,
} from 'lucide-react';

export default function PlansPage() {
  return (
    <div className="min-h-screen flex flex-col bg-salad-bg">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* HERO */}
        <section className="py-16 lg:py-20 gradient-hero-bg text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 shadow-soft-sm border border-salad-leaf/20 text-salad-dark text-xs sm:text-sm font-semibold">
              <Zap className="w-4 h-4 text-salad-accent" />
              <span>Flagship Subscription Plan</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-salad-dark tracking-tight">
              20 Meals. One Healthy Habit.
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              A flexible, balance-backed healthy meal subscription designed to fit your routine in Baner, Pune.
            </p>
          </div>
        </section>

        {/* MAIN PLAN CARD */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-br from-salad-dark via-emerald-950 to-salad-dark text-white p-8 sm:p-12 shadow-2xl overflow-hidden border border-salad-fresh/30">
              <div className="absolute top-0 right-0 w-80 h-80 bg-salad-fresh/10 rounded-full blur-3xl" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-salad-fresh/20 text-salad-light text-xs font-bold uppercase tracking-wider">
                    Most Popular Subscription
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                    20 MEAL SUBSCRIPTION
                  </h2>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    Enjoy 20 meal deliveries across your favorite healthy categories. Customize ingredients, set dietary preferences, and track your remaining balance live from your dashboard.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-5 h-5 text-salad-fresh flex-shrink-0" />
                      <span><strong>20 Total Meal Deliveries</strong> included per subscription.</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-5 h-5 text-salad-fresh flex-shrink-0" />
                      <span>Full menu choices: Salads 🥗, Juices 🥤, Soups 🍲, Wraps 🌯, Oats 🥣 & Smoothies 🥤</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-5 h-5 text-salad-fresh flex-shrink-0" />
                      <span><strong>Customization Available:</strong> Ingredient preferences, allergens & spice levels.</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-200">
                      <CheckCircle2 className="w-5 h-5 text-salad-fresh flex-shrink-0" />
                      <span><strong>Live Database Tracking:</strong> Meal count decrements only upon actual delivery.</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-salad-fresh hover:bg-emerald-400 text-salad-dark font-extrabold text-base shadow-xl transition-all"
                    >
                      <span>Get Started & Subscribe</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="glass-card p-6 sm:p-8 rounded-3xl bg-white/10 border border-white/20 text-center space-y-6">
                    <span className="text-xs uppercase tracking-widest text-salad-light font-bold">
                      Subscription Summary
                    </span>
                    <div>
                      <span className="text-6xl font-extrabold font-heading text-white block">
                        20
                      </span>
                      <span className="text-sm font-semibold text-gray-300">
                        Meals Delivered To Doorstep
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-gray-300 space-y-1">
                      <p className="font-semibold text-white">Cloud Kitchen Baner, Pune</p>
                      <p>Hygienic prep • Eco-packaging</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MEAL BALANCE TRACKING EXPLANATION */}
        <section className="py-20 bg-salad-surface">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-salad-leaf uppercase tracking-widest">
                Transparent & Fair
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark">
                How Your 20 Meals Are Tracked
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                We track actual <strong>MEALS</strong>, not calendar days. Your remaining meal balance only decrements when a meal is physically delivered to your doorstep.
              </p>
            </div>

            {/* Visual Tracking Sequence */}
            <div className="p-8 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm space-y-8">
              <h3 className="text-lg font-bold text-salad-dark text-center font-heading">
                Meal Delivery Consumption Flow
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center items-center">
                <div className="p-5 rounded-2xl bg-salad-beige border border-salad-leaf/20">
                  <span className="text-2xl font-bold text-salad-dark block font-heading">20 Meals</span>
                  <span className="text-[11px] text-gray-600 uppercase font-semibold">Total Plan Balance</span>
                </div>

                <div className="flex justify-center text-salad-fresh font-bold text-xl">
                  ↓ 1 Delivered
                </div>

                <div className="p-5 rounded-2xl bg-salad-surface border border-salad-leaf/20">
                  <span className="text-2xl font-bold text-salad-primary block font-heading">19 Meals</span>
                  <span className="text-[11px] text-gray-600 uppercase font-semibold">Remaining Balance</span>
                </div>

                <div className="flex justify-center text-salad-fresh font-bold text-xl">
                  ↓ Next Delivery
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-2xl font-bold text-emerald-800 block font-heading">18 Meals</span>
                  <span className="text-[11px] text-emerald-700 uppercase font-semibold">Remaining Balance</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10 text-xs text-gray-600 text-center leading-relaxed">
                <strong>Important Note:</strong> If you skip a day or request a temporary delivery pause, your remaining meal count remains completely unchanged. You never lose a meal balance!
              </div>
            </div>
          </div>
        </section>

        {/* CUSTOMIZATION HIGHLIGHT */}
        <section id="customization" className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-salad-leaf uppercase tracking-widest">
                Customer Freedom
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark">
                Meal Customization Included
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl bg-salad-surface border border-salad-leaf/10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-salad-beige flex items-center justify-center text-salad-primary">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-salad-dark font-heading">
                  Dietary & Ingredient Preferences
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Specify High Protein, Vegan, Keto, or Vegetarian preferences. Add ingredients to avoid such as raw onions, nuts, or specific oils.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-salad-surface border border-salad-leaf/10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-salad-beige flex items-center justify-center text-salad-primary">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-salad-dark font-heading">
                  Dashboard Management
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Update your preferences anytime inside your customer portal. Changes persist immediately in our database for future kitchen prep.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-salad-primary text-white font-bold text-base shadow-lg hover:bg-salad-dark transition-all"
              >
                <span>Start Your 20 Meal Subscription</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
