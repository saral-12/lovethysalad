'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroAnimation } from '@/components/HeroAnimation';
import { ProductModal } from '@/components/ProductModal';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/lib/types';
import {
  Sparkles,
  ArrowRight,
  Leaf,
  CheckCircle2,
  Heart,
  Truck,
  Sliders,
  UtensilsCrossed,
  ShieldCheck,
  ChevronDown,
  Star,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const { categories, products } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const whyUsFeatures = [
    {
      icon: <Leaf className="w-6 h-6 text-salad-fresh" />,
      title: 'Fresh Ingredients',
      desc: 'Thoughtfully selected, locally sourced organic ingredients for fresh and vibrant meals.',
    },
    {
      icon: <Heart className="w-6 h-6 text-rose-500" />,
      title: 'Healthy Choices',
      desc: 'Meals designed around wholesome everyday eating without compromising on taste.',
    },
    {
      icon: <Truck className="w-6 h-6 text-amber-500" />,
      title: 'Convenient Delivery',
      desc: 'Prompt, hygienic doorstep delivery across Baner and surrounding Pune areas.',
    },
    {
      icon: <Sliders className="w-6 h-6 text-emerald-600" />,
      title: 'Customizable Meals',
      desc: 'Tailor ingredients to avoid allergies, set spice levels, and add dietary notes.',
    },
    {
      icon: <UtensilsCrossed className="w-6 h-6 text-salad-primary" />,
      title: 'Made With Care',
      desc: 'Every bowl, jar, and wrap is prepared with culinary craftsmanship and attention.',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Deshmukh',
      location: 'Pancard Club Rd, Baner',
      role: 'IT Professional',
      review:
        'The 20-meal subscription has changed my lunch routine completely! The Avocado Quinoa bowl is crisp and fresh every single day.',
      rating: 5,
    },
    {
      name: 'Vikram Mehta',
      location: 'Baner Pashan Link Rd',
      role: 'Fitness Enthusiast',
      review:
        'Love how transparent they are about nutrition. Being able to set custom ingredient notes on meals is a game changer for my diet.',
      rating: 5,
    },
    {
      name: 'Sonia & Rahul Kapoor',
      location: 'High Street, Baner',
      role: 'Working Couple',
      review:
        'Cold-pressed juices and wraps arrive right on time. Love Thy Salad makes healthy eating effortless in Baner.',
      rating: 5,
    },
  ];

  const faqItems = [
    {
      q: 'What does a Love Thy Salad subscription include?',
      a: 'One subscription includes 20 fresh meal deliveries. You can choose from our complete menu of Salads, Cold-Pressed Juices, Soups, Wraps, Oats Jars, and Smoothies.',
    },
    {
      q: 'Can I customize my meals and ingredient preferences?',
      a: 'Yes! You can specify ingredients to avoid, dietary requirements (e.g. Vegan, High Protein), and spice levels in your customer dashboard preferences.',
    },
    {
      q: 'How are my 20 meals tracked?',
      a: 'Our system tracks individual meal deliveries, NOT calendar days. Each time a meal is delivered to your door, your remaining meal balance decreases by 1 (e.g. 20 → 19 → 18).',
    },
    {
      q: 'Where does Love Thy Salad deliver?',
      a: 'We operate a dedicated healthy cloud kitchen based in Baner, Pune and deliver directly to residential & commercial addresses in Baner and neighboring areas.',
    },
    {
      q: 'Can I visit the kitchen for dine-in?',
      a: 'No. Love Thy Salad is exclusively a delivery cloud kitchen with no customer dine-in or physical visit facility.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-salad-bg">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* SECTION 1: HERO */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24 gradient-hero-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 space-y-6 text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 shadow-soft-sm border border-salad-leaf/20 text-salad-dark text-xs sm:text-sm font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-salad-fresh animate-pulse" />
                  <span>Baner, Pune’s Premium Healthy Cloud Kitchen</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-salad-dark tracking-tight leading-[1.15]">
                  Eat Fresh. <br />
                  Feel Good. <br />
                  <span className="gradient-text">Love Thy Salad.</span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Healthy, delicious meals prepared fresh with premium organic ingredients and delivered directly to your doorstep in Baner.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/plans"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-salad-primary hover:bg-salad-dark text-white font-bold text-base shadow-xl shadow-salad-primary/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Explore Our Plans</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/menu"
                    className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-salad-beige text-salad-dark font-bold text-base border border-gray-300 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                  >
                    <span>Explore Menu</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-salad-leaf/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-600 font-semibold">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-salad-fresh" />
                    <span>20 Meal Subscription</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-salad-accent" />
                    <span>Customizable Ingredients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-salad-primary" />
                    <span>Doorstep Baner Delivery</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Hero Animated Food Canvas */}
              <div className="lg:col-span-5">
                <HeroAnimation />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: WELCOME */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl group"
              >
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80"
                  alt="Love Thy Salad Fresh Preparation"
                  className="w-full h-[400px] sm:h-[480px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-salad-dark/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-salad-leaf/20 shadow-2xl">
                  <p className="text-salad-dark text-sm sm:text-base font-extrabold italic leading-relaxed">
                    "Every bowl is crafted with love, respect for nature, and a passion for vibrant living."
                  </p>
                  <span className="block mt-2.5 text-salad-primary text-xs font-extrabold uppercase tracking-wider">
                    — Smiti Olga Khattri (Founder)
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-salad-beige text-salad-primary text-xs font-bold tracking-wider uppercase">
                  Welcome to Love Thy Salad 🌿
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark leading-tight">
                  Crafting Everyday Wellness in Baner, Pune.
                </h2>

                <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                  Love Thy Salad is a dedicated healthy food cloud kitchen serving fresh, delicious, and thoughtfully prepared meals in Baner, Pune.
                </p>

                <p className="text-gray-600 leading-relaxed text-base">
                  Our goal is to make healthy eating simple, convenient, and truly enjoyable. From crisp organic salad bowls and cold pressed juices to warm soups and high-protein wraps, we believe nourishing your body should be the highlight of your day.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10">
                    <span className="block text-2xl font-bold text-salad-primary font-heading">
                      100%
                    </span>
                    <span className="text-xs font-semibold text-gray-600">Fresh & Organic</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10">
                    <span className="block text-2xl font-bold text-salad-primary font-heading">
                      20 Meals
                    </span>
                    <span className="text-xs font-semibold text-gray-600">Tracked Subscription</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 3: WHY LOVE THY SALAD (5 CARDS) */}
        <section className="py-20 bg-salad-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-bold text-salad-leaf uppercase tracking-widest">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark">
                Thoughtfully Designed For Your Health
              </h2>
              <p className="text-gray-600">
                Five pillars that make Love Thy Salad Pune’s favorite subscription choice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyUsFeatures.map((feat, idx) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-8 rounded-3xl bg-white shadow-soft-sm hover:shadow-soft-md border border-salad-leaf/10 transition-all group hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-salad-beige flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-salad-dark font-heading mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: OUR FOOD (6 CATEGORIES) */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-3">
                <span className="text-xs font-bold text-salad-leaf uppercase tracking-widest">
                  Our Culinary Offerings
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark">
                  Explore Our Menu Categories
                </h2>
              </div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-salad-primary font-bold hover:text-salad-dark text-sm"
              >
                <span>View Full Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group relative rounded-3xl overflow-hidden bg-salad-beige border border-salad-leaf/10 shadow-soft-sm hover:shadow-soft-lg transition-all flex flex-col"
                >
                  <div className="h-52 w-full overflow-hidden relative">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-salad-dark font-heading group-hover:text-salad-primary transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-gray-600 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </div>

                    <Link
                      href={`/menu?category=${encodeURIComponent(cat.name)}`}
                      className="w-full py-2.5 rounded-full bg-salad-surface hover:bg-salad-primary hover:text-white text-salad-dark font-semibold text-xs text-center border border-salad-leaf/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>View Menu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: OUR 20 MEAL PLAN */}
        <section className="py-20 bg-gradient-to-br from-salad-dark via-emerald-950 to-salad-dark text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-salad-fresh/10 rounded-full blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-salad-fresh/20 text-salad-light text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-salad-accent" /> Signature Subscription
                </div>

                <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-white leading-tight">
                  20 Meals. <br />
                  <span className="text-salad-fresh">One Healthy Habit.</span>
                </h2>

                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  Transform your daily eating routine with our flagship 20-Meal Plan. Enjoy total flexibility, transparent meal balance tracking, and fresh deliveries to your doorstep in Baner.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                    <span className="text-xl">🥗</span>
                    <span className="block text-xs font-bold text-white mt-1">Salads</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                    <span className="text-xl">🥤</span>
                    <span className="block text-xs font-bold text-white mt-1">Cold Juices</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                    <span className="text-xl">🍲</span>
                    <span className="block text-xs font-bold text-white mt-1">Warm Soups</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                    <span className="text-xl">🌯</span>
                    <span className="block text-xs font-bold text-white mt-1">Wraps</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                    <span className="text-xl">🥣</span>
                    <span className="block text-xs font-bold text-white mt-1">Oats Jars</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
                    <span className="text-xl">🥤</span>
                    <span className="block text-xs font-bold text-white mt-1">Smoothies</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <CheckCircle2 className="w-5 h-5 text-salad-fresh" />
                  <span className="text-sm font-semibold text-gray-200">
                    Full ingredient & spice customization available on every meal.
                  </span>
                </div>

                <div className="pt-4">
                  <Link
                    href="/plans"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-salad-fresh hover:bg-emerald-400 text-salad-dark font-extrabold text-base shadow-xl transition-all"
                  >
                    <span>View Our Plans</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="glass-card p-8 rounded-3xl border border-white/20 bg-white/10 text-white space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-6xl font-extrabold font-heading text-salad-fresh block">
                      20
                    </span>
                    <span className="text-xs uppercase font-bold tracking-widest text-gray-300">
                      Total Meal Deliveries
                    </span>
                  </div>

                  <div className="h-px bg-white/15" />

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Tracking System:</span>
                      <span className="font-bold text-white">Meal Balance (Not Days)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Delivery Area:</span>
                      <span className="font-bold text-white">Baner & Nearby Pune</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Kitchen Type:</span>
                      <span className="font-bold text-salad-fresh">Doorstep Cloud Kitchen</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/30 text-center border border-white/10">
                    <p className="text-xs text-gray-300">
                      "20 MEALS ──────── Your healthy journey starts here"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: HOW IT WORKS (3 STEPS) */}
        <section className="py-20 bg-salad-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-bold text-salad-leaf uppercase tracking-widest">
                Simple & Convenient
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark">
                How Love Thy Salad Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative p-8 rounded-3xl bg-white shadow-soft-sm border border-salad-leaf/10 text-center space-y-4">
                <span className="inline-block text-4xl font-extrabold text-salad-fresh/40 font-heading">
                  01
                </span>
                <h3 className="text-xl font-bold text-salad-dark font-heading">
                  Choose Your Plan
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pick our flagship 20-meal subscription designed for consistent healthy eating.
                </p>
              </div>

              <div className="relative p-8 rounded-3xl bg-white shadow-soft-sm border border-salad-leaf/10 text-center space-y-4">
                <span className="inline-block text-4xl font-extrabold text-salad-fresh/40 font-heading">
                  02
                </span>
                <h3 className="text-xl font-bold text-salad-dark font-heading">
                  Choose Your Meals
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Select from our menu of salads, juices, wraps, soups, and oat jars with custom notes.
                </p>
              </div>

              <div className="relative p-8 rounded-3xl bg-white shadow-soft-sm border border-salad-leaf/10 text-center space-y-4">
                <span className="inline-block text-4xl font-extrabold text-salad-fresh/40 font-heading">
                  03
                </span>
                <h3 className="text-xl font-bold text-salad-dark font-heading">
                  Enjoy Your Delivery
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Freshly prepared meals arrive at your doorstep in Baner. Track your balance live.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: CUSTOMIZATION */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold text-salad-leaf uppercase tracking-widest">
                  Tailored To You
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark">
                  Your Food, Your Way.
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  No two diets are identical. At Love Thy Salad, we empower you to customize your meals according to your exact lifestyle and health goals.
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-salad-fresh flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-salad-dark">Ingredient Preferences</h4>
                      <p className="text-xs text-gray-600">Choose extra greens, quinoa, paneer, or high-protein toppings.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-salad-fresh flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-salad-dark">Ingredients To Avoid</h4>
                      <p className="text-xs text-gray-600">Easily exclude raw onions, nuts, dairy, or specific oils.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-salad-fresh flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-salad-dark">Dietary & Spice Customization</h4>
                      <p className="text-xs text-gray-600">Specify Low Sodium, Vegan, Gluten-Free, or Mild/Mild Spice level.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/plans"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-salad-primary hover:bg-salad-dark text-white font-bold text-sm shadow transition-all"
                  >
                    <span>Learn More About Customization</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
                  alt="Customizable Healthy Salad Ingredients"
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: POSITIVE HEALTH */}
        <section className="py-20 bg-gradient-to-r from-salad-beige via-white to-salad-beige">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-3xl">🌿</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-salad-dark tracking-tight">
              Small Choices. Better Days.
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 italic max-w-3xl mx-auto leading-relaxed font-medium">
              "Healthy eating doesn't have to be complicated. We make it easier to choose something fresh, nourishing and delicious every single day."
            </p>
            <div className="pt-4">
              <span className="inline-block px-6 py-2 rounded-full bg-salad-primary/10 text-salad-primary font-semibold text-xs uppercase tracking-wider">
                Love Thy Salad • Baner, Pune
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 9: TESTIMONIALS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold text-salad-leaf uppercase tracking-widest">
                Customer Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark">
                Loved by Health Enthusiasts in Baner
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-salad-surface border border-salad-leaf/10 shadow-soft-sm flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex text-amber-400 gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed italic">
                      "{t.review}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-salad-leaf/10">
                    <h4 className="font-bold text-salad-dark text-sm">{t.name}</h4>
                    <span className="text-xs text-salad-leaf font-medium block">
                      {t.role} • {t.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 10: FAQ PREVIEW */}
        <section className="py-20 bg-salad-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-salad-leaf uppercase tracking-widest">
                Got Questions?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-salad-leaf/10 shadow-soft-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-6 text-left font-bold text-salad-dark text-base sm:text-lg flex justify-between items-center gap-4 hover:text-salad-primary transition-colors"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-salad-leaf transform transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-4">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-salad-primary text-white font-bold text-sm shadow hover:bg-salad-dark transition-all"
              >
                <span>View All FAQs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 11: FINAL CTA */}
        <section className="py-24 bg-gradient-to-tr from-salad-primary via-emerald-800 to-salad-dark text-white text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
            <span className="text-3xl">🥗</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight leading-tight">
              Ready to Make Healthy Eating a Habit?
            </h2>
            <p className="text-lg sm:text-xl text-salad-light max-w-2xl mx-auto font-medium">
              Fresh meals. Flexible choices. A healthier routine delivered straight to your door in Baner, Pune.
            </p>
            <div className="pt-4">
              <Link
                href="/plans"
                className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white text-salad-dark font-extrabold text-lg shadow-2xl hover:bg-salad-beige hover:scale-105 active:scale-95 transition-all"
              >
                <span>Start Your Healthy Journey</span>
                <ArrowRight className="w-5 h-5 text-salad-primary" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
