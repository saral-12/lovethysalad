'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Box, CheckCircle2, Calendar, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MySubscriptionPage() {
  const { user, subscription, deliveries } = useAuth();

  const totalMeals = subscription?.total_meals ?? 20;
  const mealsDelivered = subscription?.meals_delivered ?? 0;
  const mealsRemaining = Math.max(0, totalMeals - mealsDelivered);
  const progressPercent = Math.round((mealsDelivered / totalMeals) * 100);
  const isCompleted = mealsRemaining === 0;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-salad-dark">
          My Subscription
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Detailed breakdown of your 20-meal subscription status, balance, and consumption timeline.
        </p>
      </div>

      {/* Subscription Card */}
      <div className="rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-salad-leaf uppercase tracking-wider">
                Active Plan
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-salad-dark text-salad-fresh text-xs font-mono font-extrabold tracking-widest border border-salad-fresh/30">
                {user?.customer_id || 'LTS-01'}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-salad-dark">
              20 Meal Subscription Plan
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-salad-leaf" />
                <span>Start Date: {subscription?.start_date || 'September 1, 2026'}</span>
              </div>
              <span className="font-bold text-salad-dark">
                Customer ID: {user?.customer_id || 'LTS-01'}
              </span>
            </div>
          </div>

          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${
              isCompleted
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
          >
            {isCompleted ? 'Completed 🎉' : '🟢 Active'}
          </span>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10">
            <span className="text-3xl font-bold font-heading text-salad-dark block">
              {totalMeals}
            </span>
            <span className="text-[10px] uppercase font-bold text-gray-500">Total Meals</span>
          </div>

          <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10">
            <span className="text-3xl font-bold font-heading text-emerald-600 block">
              {mealsDelivered}
            </span>
            <span className="text-[10px] uppercase font-bold text-gray-500">Delivered</span>
          </div>

          <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10">
            <span className="text-3xl font-bold font-heading text-amber-600 block">
              {mealsRemaining}
            </span>
            <span className="text-[10px] uppercase font-bold text-gray-500">Remaining</span>
          </div>

          <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10">
            <span className="text-3xl font-bold font-heading text-blue-600 block">
              {progressPercent}%
            </span>
            <span className="text-[10px] uppercase font-bold text-gray-500">Progress</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs font-bold text-salad-dark">
            <span>Progress Indicator</span>
            <span>{mealsDelivered} / {totalMeals} Meals ({progressPercent}%)</span>
          </div>
          <div className="w-full h-3.5 rounded-full bg-gray-200 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-salad-fresh rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Complete Meal Consumption History */}
      <div className="rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm p-8 space-y-6">
        <h3 className="text-xl font-bold text-salad-dark font-heading">
          Meal Delivery Consumption History
        </h3>

        <div className="space-y-3">
          {deliveries.length > 0 ? (
            deliveries.map((delivery, idx) => (
              <div
                key={delivery.id}
                className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-salad-beige text-salad-primary flex items-center justify-center font-bold text-xs">
                    #{deliveries.length - idx}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-salad-dark">
                      {delivery.product?.name || 'Healthy Meal Bowl'}
                    </h4>
                    <span className="text-xs text-gray-500 block">
                      Date: {delivery.delivery_date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {delivery.notes && (
                    <span className="text-xs text-gray-500 italic hidden md:inline">
                      "{delivery.notes}"
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      delivery.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : delivery.status === 'preparing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {delivery.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 text-center py-6">
              No meal deliveries recorded yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
