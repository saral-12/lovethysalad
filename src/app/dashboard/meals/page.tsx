'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Utensils, Calendar, Search, ShieldCheck } from 'lucide-react';

export default function MyMealsPage() {
  const { deliveries } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredDeliveries = deliveries.filter((d) => {
    if (filterStatus === 'all') return true;
    return d.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-salad-dark">
            My Meals & Delivery History
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete record of your scheduled, preparing, out-for-delivery, and delivered meals.
          </p>
        </div>

        {/* Filter Pill */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'scheduled', 'preparing', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                filterStatus === status
                  ? 'bg-salad-primary text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-salad-beige border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Deliveries Table / Cards */}
      <div className="rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm overflow-hidden p-6 space-y-4">
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            Deliveries are managed and marked delivered by our Baner kitchen delivery team. Customers cannot manually alter delivery statuses.
          </span>
        </div>

        {filteredDeliveries.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-xs">
            No deliveries found for this status.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="p-5 rounded-2xl bg-salad-surface border border-salad-leaf/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-salad-beige text-salad-primary flex items-center justify-center flex-shrink-0 text-xl">
                    🥗
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-salad-dark">
                      {delivery.product?.name || 'Avocado Quinoa Power Bowl'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-salad-leaf" />
                        {delivery.delivery_date}
                      </span>
                      {delivery.notes && (
                        <span className="italic text-gray-600">
                          Notes: "{delivery.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize ${
                      delivery.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : delivery.status === 'preparing'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : delivery.status === 'out_for_delivery'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}
                  >
                    {delivery.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
