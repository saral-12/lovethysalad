'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Truck, Clock, Sparkles, MapPin } from 'lucide-react';

export default function UpcomingDeliveriesPage() {
  const { deliveries, user } = useAuth();

  const upcomingList = deliveries.filter(
    (d) => d.status === 'scheduled' || d.status === 'preparing' || d.status === 'out_for_delivery'
  );

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-salad-dark">
          Upcoming Deliveries
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          View your upcoming healthy meal deliveries scheduled from our Baner cloud kitchen.
        </p>
      </div>

      <div className="space-y-6">
        {upcomingList.length > 0 ? (
          upcomingList.map((delivery) => (
            <div
              key={delivery.id}
              className="p-8 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-salad-beige text-salad-primary flex items-center justify-center text-2xl">
                    🥗
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-heading text-salad-dark">
                      {delivery.product?.name || 'Avocado Quinoa Power Bowl'}
                    </h2>
                    <span className="text-xs text-salad-leaf font-semibold">
                      Baner Doorstep Delivery
                    </span>
                  </div>
                </div>

                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300 self-start sm:self-auto">
                  {delivery.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10 space-y-1">
                  <span className="text-xs text-gray-500 font-semibold block">Scheduled Date</span>
                  <div className="flex items-center gap-2 font-bold text-salad-dark">
                    <Calendar className="w-4 h-4 text-salad-primary" />
                    <span>{delivery.delivery_date}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10 space-y-1">
                  <span className="text-xs text-gray-500 font-semibold block">Delivery Address</span>
                  <div className="flex items-center gap-2 font-bold text-salad-dark truncate">
                    <MapPin className="w-4 h-4 text-salad-primary flex-shrink-0" />
                    <span className="truncate">{user?.address || 'Baner, Pune'}</span>
                  </div>
                </div>
              </div>

              {delivery.notes && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <span className="font-bold block">Custom Kitchen Notes:</span>
                  <p className="italic">"{delivery.notes}"</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 rounded-3xl bg-white border border-dashed border-gray-300 text-center space-y-3">
            <span className="text-4xl">📦</span>
            <h3 className="text-lg font-bold text-salad-dark font-heading">
              No upcoming delivery scheduled
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Your 20-meal subscription is active. Contact our kitchen team to schedule your next doorstep meal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
