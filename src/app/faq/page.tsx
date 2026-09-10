'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChevronDown, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FaqPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is Love Thy Salad?',
      a: 'Love Thy Salad is a premium healthy food cloud kitchen based in Baner, Pune. Founded and operated by Smiti Olga Khattri, we specialize in organic salads, cold pressed juices, soups, whole-wheat wraps, and chia oats jars delivered fresh to your door.',
    },
    {
      q: 'What does the 20-meal subscription include?',
      a: 'One subscription unlocks 20 total meal deliveries. You get complete access to our full menu across all six categories (Salads, Juices, Soups, Wraps, Oats Jars, and Smoothies).',
    },
    {
      q: 'What meals can I choose?',
      a: 'You can choose any item from our active menu! Whether you want a protein-packed Avocado Quinoa Bowl on Monday or a Green Goddess Detox Juice on Tuesday, your 20-meal balance covers all menu items.',
    },
    {
      q: 'Can I customize my meals and ingredient preferences?',
      a: 'Absolutely. Inside your customer dashboard under "Meal Preferences", you can set dietary restrictions (e.g. Vegetarian, High Protein), specify ingredients to avoid (e.g. raw onions, peanuts), set spice level preferences, and leave custom notes for kitchen prep.',
    },
    {
      q: 'How are my 20 meals counted and deducted?',
      a: 'Our database tracks actual MEAL DELIVERIES, not calendar days. When our team completes a doorstep delivery, your remaining meal count decrements by 1 (e.g. 20 → 19 → 18). If you do not request a delivery on a given day, your balance remains unchanged.',
    },
    {
      q: 'How can I see my remaining meals?',
      a: 'Simply log into your Love Thy Salad Customer Dashboard. Your main overview card displays Total Meals (20), Meals Delivered, Meals Remaining, and a completion progress percentage.',
    },
    {
      q: 'Can I see my full delivery history?',
      a: 'Yes! The "My Meals" tab in your customer dashboard lists all past and upcoming deliveries, complete with dates, meal items, status badges (Scheduled, Preparing, Out for Delivery, Delivered), and custom notes.',
    },
    {
      q: 'Where does Love Thy Salad operate?',
      a: 'We operate out of Baner, Pune and deliver directly to residential homes, apartments, and office spaces throughout Baner and surrounding Pune locations.',
    },
    {
      q: 'Can I visit the kitchen for dine-in or pickup?',
      a: 'No. Love Thy Salad is strictly a cloud kitchen facility in Baner, Pune designed exclusively for doorstep delivery. We do not have a customer visit or physical dine-in facility.',
    },
    {
      q: 'What happens when my remaining meals reach 0?',
      a: 'When your remaining meals hit 0, your subscription status changes to "Completed" 🎉. You can seamlessly click "Start Another Subscription" from your dashboard to renew your 20-meal plan anytime.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-salad-bg">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* HERO */}
        <section className="py-16 gradient-hero-bg text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 shadow-soft-sm border border-salad-leaf/20 text-salad-dark text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-salad-leaf" />
              <span>Everything You Need To Know</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-salad-dark tracking-tight">
              Frequently Asked Questions
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Clear answers about our 20-meal subscription, Baner cloud kitchen operations, and meal delivery balance tracking.
            </p>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left font-bold text-salad-dark text-base sm:text-lg flex justify-between items-center gap-4 hover:text-salad-primary transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-salad-beige text-salad-primary flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                      Q{idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-salad-leaf transform transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 pl-17">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-8 text-center bg-white p-8 rounded-3xl border border-salad-leaf/10 shadow-soft-sm space-y-4">
            <h3 className="text-xl font-bold text-salad-dark font-heading">
              Have More Questions?
            </h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Our team in Baner, Pune is happy to help you select the best subscription options.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-salad-primary text-white font-bold text-xs shadow hover:bg-salad-dark transition-all"
            >
              <span>Get In Touch With Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
