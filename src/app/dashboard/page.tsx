'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Box,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Award,
  Calendar,
  Utensils,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardOverviewPage() {
  const { user, subscription, deliveries } = useAuth();

  // Dynamic greeting calculation
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Compute metrics directly from DB / state
  const totalMeals = subscription?.total_meals ?? 20;
  const mealsDelivered = subscription?.meals_delivered ?? 0;
  const mealsRemaining = Math.max(0, totalMeals - mealsDelivered);
  const progressPercent = Math.round((mealsDelivered / totalMeals) * 100);
  const isCompleted = mealsRemaining === 0 || subscription?.status === 'completed';
  const isLowMeals = mealsRemaining <= 5 && mealsRemaining > 0;

  // Upcoming delivery
  const upcomingDelivery = deliveries.find(
    (d) => d.status === 'scheduled' || d.status === 'preparing' || d.status === 'out_for_delivery'
  );

  // Recent delivered meals
  const recentMeals = deliveries
    .filter((d) => d.status === 'delivered')
    .slice(0, 3);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER WITH DYNAMIC GREETING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-salad-dark tracking-tight">
            {greeting}, {user?.full_name?.split(' ')[0]} 👋
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold text-salad-dark uppercase tracking-wider">Customer ID</span>
            <span className="px-3 py-1 rounded-xl bg-salad-dark text-salad-fresh text-xs font-mono font-extrabold tracking-widest border border-salad-fresh/30 shadow-sm">
              {user?.customer_id || 'LTS-01'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Here is a look at your Love Thy Salad subscription journey.
          </p>
        </div>

        <Link
          href="/plans"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-salad-primary text-white text-xs font-bold shadow hover:bg-salad-dark transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-salad-accent" />
          <span>Subscription Details</span>
        </Link>
      </div>

      {/* 2. DYNAMIC SMART BANNERS */}
      {/* LOW MEAL BANNER (Remaining <= 5 and > 0) */}
      {isLowMeals && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
              🌿
            </div>
            <div>
              <h3 className="font-extrabold text-base text-amber-900">
                You're almost there! 🌿
              </h3>
              <p className="text-xs text-amber-800 font-medium">
                You have only <strong>{mealsRemaining} meals remaining</strong> in your current subscription.
              </p>
            </div>
          </div>
          <Link
            href="/plans"
            className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow transition-all whitespace-nowrap"
          >
            Explore Your Next Plan
          </Link>
        </motion.div>
      )}

      {/* COMPLETED SUBSCRIPTION BANNER (Remaining == 0) */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-emerald-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl border-2 border-salad-fresh"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-salad-fresh text-salad-dark flex items-center justify-center font-bold text-xl flex-shrink-0">
              🎉
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                You've Completed Your 20 Meals! 🎉
              </h3>
              <p className="text-xs text-salad-light font-medium">
                Congratulations on completing your healthy journey with Love Thy Salad.
              </p>
            </div>
          </div>
          <Link
            href="/plans"
            className="px-6 py-3 rounded-full bg-salad-fresh hover:bg-emerald-400 text-salad-dark text-xs font-extrabold shadow-lg transition-all whitespace-nowrap"
          >
            Start Another Subscription
          </Link>
        </motion.div>
      )}

      {/* 3. MAIN SUBSCRIPTION OVERVIEW CARD */}
      <div className="relative rounded-3xl bg-gradient-to-br from-salad-dark via-emerald-950 to-salad-dark text-white p-8 sm:p-10 shadow-2xl overflow-hidden border border-salad-fresh/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-salad-fresh">
              YOUR SUBSCRIPTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-1">
              20 Meal Healthy Plan
            </h2>
          </div>

          <span
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              isCompleted
                ? 'bg-amber-500 text-salad-dark'
                : 'bg-salad-fresh text-salad-dark'
            }`}
          >
            {isCompleted ? 'Subscription Completed 🎉' : '🟢 Active Plan'}
          </span>
        </div>

        {/* Highlighted 3 Big Numbers */}
        <div className="grid grid-cols-3 gap-4 text-center py-4 border-y border-white/10">
          <div className="p-3">
            <span className="text-3xl sm:text-5xl font-extrabold font-heading text-white block">
              {totalMeals}
            </span>
            <span className="text-[11px] uppercase font-bold text-gray-300 tracking-wider">
              TOTAL MEALS
            </span>
          </div>

          <div className="p-3 border-x border-white/10">
            <span className="text-3xl sm:text-5xl font-extrabold font-heading text-salad-fresh block">
              {mealsDelivered}
            </span>
            <span className="text-[11px] uppercase font-bold text-salad-light tracking-wider">
              DELIVERED
            </span>
          </div>

          <div className="p-3">
            <span className="text-3xl sm:text-5xl font-extrabold font-heading text-amber-400 block">
              {mealsRemaining}
            </span>
            <span className="text-[11px] uppercase font-bold text-amber-300 tracking-wider">
              REMAINING
            </span>
          </div>
        </div>

        {/* Progress Bar Component */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-300">Overall Progress</span>
            <span className="text-salad-fresh">
              {mealsDelivered} / {totalMeals} completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-4 rounded-full bg-black/40 p-0.5 border border-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-salad-fresh to-emerald-400 shadow-glow"
            />
          </div>
        </div>
      </div>

      {/* 4. DASHBOARD SUMMARY CARDS (4 CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-salad-beige text-salad-primary flex items-center justify-center flex-shrink-0">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-salad-dark block font-heading">
              {totalMeals}
            </span>
            <span className="text-xs font-semibold text-gray-500">Total Meals</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-salad-dark block font-heading">
              {mealsDelivered}
            </span>
            <span className="text-xs font-semibold text-gray-500">Delivered</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-salad-dark block font-heading">
              {mealsRemaining}
            </span>
            <span className="text-xs font-semibold text-gray-500">Remaining</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-salad-dark block font-heading">
              {progressPercent}%
            </span>
            <span className="text-xs font-semibold text-gray-500">Completed</span>
          </div>
        </div>
      </div>

      {/* 5. UPCOMING DELIVERY & RECENT MEALS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Next Delivery Card */}
        <div className="lg:col-span-6 p-8 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-salad-dark">
              <Truck className="w-5 h-5 text-salad-leaf" />
              <h3 className="text-xl font-bold font-heading">Next Delivery</h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-salad-beige text-salad-primary">
              Doorstep Baner
            </span>
          </div>

          {upcomingDelivery ? (
            <div className="p-5 rounded-2xl bg-salad-surface border border-salad-leaf/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-salad-dark">
                  {upcomingDelivery.product?.name || 'Avocado Quinoa Power Bowl'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                  {upcomingDelivery.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Scheduled for: {upcomingDelivery.delivery_date}</span>
              </div>
              {upcomingDelivery.notes && (
                <div className="text-xs text-gray-600 italic bg-white p-2.5 rounded-xl border border-gray-200">
                  Notes: "{upcomingDelivery.notes}"
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-salad-surface text-center space-y-2 border border-dashed border-gray-300">
              <span className="text-2xl">📦</span>
              <p className="text-sm font-semibold text-salad-dark">
                No upcoming delivery scheduled.
              </p>
              <p className="text-xs text-gray-500">
                Contact our kitchen team to schedule your next 20-meal item delivery.
              </p>
            </div>
          )}

          <Link
            href="/dashboard/upcoming"
            className="w-full py-3 rounded-2xl bg-salad-surface hover:bg-salad-primary hover:text-white text-salad-dark font-bold text-xs text-center transition-all border border-salad-leaf/10 flex items-center justify-center gap-1.5"
          >
            <span>View Delivery Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recent Meals Snippet */}
        <div className="lg:col-span-6 p-8 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-salad-dark">
              <Utensils className="w-5 h-5 text-salad-leaf" />
              <h3 className="text-xl font-bold font-heading">Recent Meals Delivered</h3>
            </div>
            <Link
              href="/dashboard/meals"
              className="text-xs font-bold text-salad-primary hover:underline"
            >
              View All Meals
            </Link>
          </div>

          <div className="space-y-3">
            {recentMeals.length > 0 ? (
              recentMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🥗</span>
                    <div>
                      <h4 className="text-xs font-bold text-salad-dark">
                        {meal.product?.name || 'Healthy Salad'}
                      </h4>
                      <span className="text-[10px] text-gray-500 block">
                        Delivered on {meal.delivery_date}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Delivered
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 rounded-2xl bg-salad-surface text-center space-y-2 border border-dashed border-gray-300">
                <p className="text-xs text-gray-500">No meals have been delivered yet.</p>
              </div>
            )}
          </div>

          <Link
            href="/dashboard/meals"
            className="w-full py-3 rounded-2xl bg-salad-surface hover:bg-salad-primary hover:text-white text-salad-dark font-bold text-xs text-center transition-all border border-salad-leaf/10 flex items-center justify-center gap-1.5"
          >
            <span>View Full Meal History</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
