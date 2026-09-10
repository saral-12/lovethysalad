'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  Users,
  CreditCard,
  Truck,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Edit,
  Save,
  Bell,
  Utensils,
  AlertCircle,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const customerIdParam = params?.id as string;

  const {
    customers,
    deliveries,
    updateCustomerInfo,
    markDeliveryDelivered,
    createDelivery,
    sendNotification,
    refreshAdminData,
  } = useAdminAuth();

  const customer = useMemo(() => {
    return customers.find((c) => c.id === customerIdParam);
  }, [customers, customerIdParam]);

  const customerDeliveries = useMemo(() => {
    if (!customer) return [];
    return deliveries.filter((d) => d.user_id === customer.id || d.user?.id === customer.id);
  }, [deliveries, customer]);

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(customer?.full_name || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [address, setAddress] = useState(customer?.address || '');

  // Preference states
  const [dietary, setDietary] = useState(customer?.preference?.dietary_preferences || '');
  const [avoid, setAvoid] = useState(customer?.preference?.ingredients_to_avoid || '');
  const [allergies, setAllergies] = useState(customer?.preference?.allergies || '');
  const [spice, setSpice] = useState(customer?.preference?.spice_preference || 'Medium');

  // Modal states
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync state when customer loads
  React.useEffect(() => {
    if (customer) {
      setFullName(customer.full_name);
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
      setDietary(customer.preference?.dietary_preferences || 'Balanced Healthy');
      setAvoid(customer.preference?.ingredients_to_avoid || '');
      setAllergies(customer.preference?.allergies || '');
      setSpice(customer.preference?.spice_preference || 'Medium');
    }
  }, [customer]);

  if (!customer) {
    return (
      <div className="space-y-6">
        <Link href="/admin/customers" className="inline-flex items-center gap-2 text-xs text-emerald-400 font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers</span>
        </Link>
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">Customer Record Not Found</h2>
          <p className="text-xs text-slate-400">The requested profile ID does not exist in Supabase.</p>
        </div>
      </div>
    );
  }

  const sub = customer.subscription;
  const totalMeals = sub?.total_meals ?? 20;
  const deliveredMeals = sub?.meals_delivered ?? 0;
  const remainingMeals = sub?.meals_remaining ?? 20;
  const progressPct = Math.round((deliveredMeals / totalMeals) * 100);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToastMsg(null);

    const res = await updateCustomerInfo(customer.id, {
      fullName,
      phone,
      address,
      preferences: {
        dietary_preferences: dietary,
        ingredients_to_avoid: avoid,
        allergies,
        spice_preference: spice,
      },
    });

    if (res.success) {
      setToastMsg({ type: 'success', text: '✓ Customer profile and preferences updated.' });
      setIsEditing(false);
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Failed to update customer.' });
    }
    setIsSaving(false);
  };

  const handleScheduleDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sub) return;

    setIsSaving(true);
    setToastMsg(null);

    const res = await createDelivery({
      userId: customer.id,
      subscriptionId: sub.id,
      notes: 'Scheduled via Admin Customer Details',
    });

    if (res.success) {
      setToastMsg({ type: 'success', text: '✓ Delivery scheduled for today.' });
      setShowDeliveryModal(false);
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Failed to schedule delivery.' });
    }
    setIsSaving(false);
  };

  const handleSendNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;

    setIsSaving(true);
    setToastMsg(null);

    const res = await sendNotification(customer.id, notifTitle, notifMessage, 'info');

    if (res.success) {
      setToastMsg({ type: 'success', text: '✓ In-app notification delivered to customer.' });
      setShowNotifModal(false);
      setNotifTitle('');
      setNotifMessage('');
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Failed to send notification.' });
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* NAVIGATION & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Customers</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              {customer.full_name}
            </h1>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold">
              {customer.customer_id || 'LTS-01'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowDeliveryModal(true)}
            disabled={remainingMeals <= 0}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Delivery</span>
          </button>
          <button
            onClick={() => setShowNotifModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs flex items-center gap-1.5 transition-all"
          >
            <Bell className="w-4 h-4 text-emerald-400" />
            <span>Send Notification</span>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs flex items-center gap-1.5 transition-all"
          >
            <Edit className="w-4 h-4 text-amber-400" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {toastMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
            toastMsg.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border-red-500/30 text-red-300'
          }`}
        >
          <span>{toastMsg.text}</span>
          <button onClick={() => setToastMsg(null)} className="text-xs text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: PERSONAL INFO & PREFERENCES (COL 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* PERSONAL INFORMATION CARD */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Personal Information</span>
              </h2>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Read-Only ID Protected
              </span>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Customer ID (Read Only)</label>
                  <input
                    type="text"
                    readOnly
                    value={customer.customer_id || 'LTS-01'}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 font-bold cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase">Delivery Address</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Customer ID</span>
                    <span className="font-extrabold text-emerald-400 text-sm block mt-0.5">
                      {customer.customer_id || 'LTS-01'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Full Name</span>
                    <span className="font-bold text-white text-sm block mt-0.5">{customer.full_name}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Email Address</span>
                    <span className="font-semibold text-slate-200 block mt-0.5">{customer.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[10px]">Phone</span>
                    <span className="font-semibold text-slate-200 block mt-0.5">{customer.phone || 'Not provided'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Delivery Address</span>
                  <span className="font-semibold text-slate-200 block mt-0.5">{customer.address || 'Baner, Pune'}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Registration Date</span>
                  <span className="font-semibold text-slate-300 block mt-0.5">
                    {new Date(customer.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* MEAL PREFERENCES CARD */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-400" />
                <span>Customer Meal Preferences</span>
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Dietary Preferences</span>
                  <span className="font-bold text-white block mt-0.5">{dietary}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Spice Preference</span>
                  <span className="font-bold text-emerald-400 block mt-0.5">{spice}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Ingredients to Avoid</span>
                <span className="font-semibold text-slate-300 block mt-0.5">
                  {avoid || 'None specified'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">Allergies / Restrictions</span>
                <span className="font-semibold text-red-300 block mt-0.5">
                  {allergies || 'No known allergies'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SUBSCRIPTION & MEAL COUNTER (COL 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <span>20-Meal Plan Progress</span>
              </h2>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold uppercase">
                {sub?.status || 'Active'}
              </span>
            </div>

            <div className="text-center space-y-2 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-5xl font-extrabold font-heading text-amber-400 block">
                {remainingMeals}
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-300 block">
                Meals Remaining
              </span>
              <p className="text-xs text-slate-400 pt-1">
                {deliveredMeals} of {totalMeals} Meals Delivered ({progressPct}%)
              </p>
            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden border border-slate-700">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>0 Delivered</span>
                <span>{totalMeals} Total Meals</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/40 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Subscription ID:</span>
                <span className="font-mono text-emerald-400 font-bold">{sub?.id ? sub.id.substring(0, 8) + '...' : 'Active'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Start Date:</span>
                <span className="font-bold text-white">{sub?.start_date || 'Today'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold">Tracking Type:</span>
                <span className="font-bold text-emerald-400">Meal Balance (Not Days)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DELIVERY HISTORY TABLE SECTION */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-lg font-extrabold font-heading text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            <span>Delivery History ({customerDeliveries.length})</span>
          </h2>
          <span className="text-xs text-slate-400 font-semibold">
            Tracked via Doorstep Cloud Kitchen Dispatch
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3">Delivery Date</th>
                <th className="p-3">Meal / Product</th>
                <th className="p-3">Notes</th>
                <th className="p-3">Status</th>
                <th className="p-3">Delivered Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {customerDeliveries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No delivery records found for this customer profile yet.
                  </td>
                </tr>
              ) : (
                customerDeliveries.map((del) => {
                  const isDelivered = del.status === 'delivered';
                  const deliveredBy = del.delivered_by_profile?.full_name || (del.delivered_by ? 'Admin' : null);

                  return (
                    <tr key={del.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 font-semibold text-white whitespace-nowrap">
                        {del.delivery_date}
                      </td>
                      <td className="p-3 font-bold text-slate-200">
                        {del.product?.name || 'Avocado Quinoa Power Bowl'}
                      </td>
                      <td className="p-3 text-slate-400 italic">
                        {del.notes || '—'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isDelivered
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : del.status === 'preparing'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : del.status === 'out_for_delivery'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {del.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400 font-medium text-[11px]">
                        {isDelivered ? (
                          <span>
                            {del.delivered_at && new Date(del.delivered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {deliveredBy && <span className="ml-1 text-emerald-400">by {deliveredBy}</span>}
                          </span>
                        ) : (
                          'Scheduled'
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE DELIVERY MODAL */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl p-6 space-y-6 text-white">
            <h3 className="text-xl font-extrabold font-heading text-white">Create Meal Delivery</h3>
            <p className="text-xs text-slate-400">
              Schedule a meal delivery for {customer.full_name} ({customer.customer_id}). Live remaining meals: {remainingMeals}.
            </p>

            <form onSubmit={handleScheduleDelivery} className="space-y-4">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all"
              >
                {isSaving ? 'Scheduling...' : 'Confirm Delivery Schedule'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeliveryModal(false)}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-bold"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SEND NOTIFICATION MODAL */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl p-6 space-y-6 text-white">
            <h3 className="text-xl font-extrabold font-heading text-white">Send Customer Notification</h3>

            <form onSubmit={handleSendNotif} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Notification Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Menu Recommendation 🥗"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Message Content</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter your message for this customer..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all"
              >
                {isSaving ? 'Sending...' : 'Send Notification'}
              </button>
              <button
                type="button"
                onClick={() => setShowNotifModal(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-white font-bold"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
