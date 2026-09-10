'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Leaf,
  ShieldCheck,
  Heart,
  Sparkles,
  MapPin,
  Utensils,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  const philosophyCards = [
    {
      title: 'Fresh First',
      desc: 'We source crisp greens, ripe fruits, and organic produce daily so every meal delivers peak natural flavor and crunch.',
      icon: <Leaf className="w-6 h-6 text-salad-fresh" />,
    },
    {
      title: 'Health Made Simple',
      desc: 'No confusing jargon or extreme diets. We focus on clean, balanced meals that easily fit into your daily routine.',
      icon: <Heart className="w-6 h-6 text-rose-500" />,
    },
    {
      title: 'Taste Matters',
      desc: 'Healthy food should never be boring. Our house-made dressings, marinades, and fresh herbs elevate every bite.',
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    },
    {
      title: 'Made With Care',
      desc: 'Prepared in our clean, hygienic cloud kitchen in Baner under strict quality and safety standards.',
      icon: <Utensils className="w-6 h-6 text-salad-primary" />,
    },
    {
      title: 'Your Preferences Matter',
      desc: 'Tailor your ingredients, avoid specific allergens, and set spice levels to make your meal subscription uniquely yours.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-salad-bg">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* HERO */}
        <section className="py-16 lg:py-24 gradient-hero-bg relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 shadow-soft-sm border border-salad-leaf/20 text-salad-dark text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-salad-accent" />
              <span>Our Story & Philosophy</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-salad-dark tracking-tight">
              Meet Love Thy Salad 🌿
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Founded and operated by <strong className="text-salad-dark">Smiti Olga Khattri</strong>, Love Thy Salad is a premium healthy food cloud kitchen based in Baner, Pune dedicated to nourishing everyday lives.
            </p>
          </div>
        </section>

        {/* STORY SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <span className="text-xs font-bold text-salad-leaf uppercase tracking-widest">
                  Our Beginnings
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark leading-tight">
                  Bringing Freshness & Vitality To Baner, Pune
                </h2>

                <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                  Love Thy Salad was born out of a simple realization: finding fresh, wholesome, delicious, and consistent healthy food in Pune shouldn't feel like a struggle.
                </p>

                <p className="text-gray-600 leading-relaxed text-base">
                  Operating as a specialized cloud kitchen in Baner, we focus exclusively on crafting nutrient-rich salads, cold pressed juices, warm soups, whole-wheat wraps, and oat jars. Because we operate purely via delivery, every ounce of our focus goes into ingredient quality, kitchen hygiene, and doorstep speed.
                </p>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Cloud Kitchen Operation Notice:</strong> Love Thy Salad is a delivery kitchen with no physical customer dine-in or visit facility. All meals are delivered fresh directly to your location in Baner and surrounding Pune areas.
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80"
                  alt="Fresh Healthy Food Preparation in Baner"
                  className="w-full h-[450px] object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY SECTION (5 CARDS) */}
        <section className="py-20 bg-salad-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-bold text-salad-leaf uppercase tracking-widest">
                Our Core Principles
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark">
                Our Kitchen Philosophy
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {philosophyCards.map((card, idx) => (
                <div
                  key={card.title}
                  className="p-8 rounded-3xl bg-white shadow-soft-sm border border-salad-leaf/10 hover:shadow-soft-md transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-salad-beige flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-salad-dark font-heading mb-3">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OWNER & LOCATION */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-block p-4 rounded-full bg-salad-beige text-salad-dark">
              <MapPin className="w-8 h-8 text-salad-primary" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark">
              Baner, Pune Cloud Kitchen
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-base">
              Owned and led by <strong className="text-salad-dark">Smiti Olga Khattri</strong>, our team is passionate about building long-term customer trust through clean preparation, transparent subscription tracking, and responsive customer service.
            </p>

            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/plans"
                className="px-8 py-4 rounded-full bg-salad-primary hover:bg-salad-dark text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>View Our 20 Meal Subscription</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
