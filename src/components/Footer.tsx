'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, Mail, MapPin, Heart, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-salad-dark text-white pt-16 pb-12 border-t border-salad-leaf/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-salad-fresh flex items-center justify-center text-salad-dark">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-white">
                Love Thy Salad
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premium healthy food cloud kitchen serving fresh, organic, and thoughtfully prepared salads, wraps, soups, and juices in Baner, Pune.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-salad-light text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> 100% Cloud Kitchen Delivery Only
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-salad-light font-heading">
              Quick Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-salad-fresh transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-salad-fresh transition-colors">
                  About Us & Story
                </Link>
              </li>
              <li>
                <Link href="/plans" className="hover:text-salad-fresh transition-colors">
                  20 Meal Subscription Plan
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-salad-fresh transition-colors">
                  Explore Fresh Menu
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-salad-fresh transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-salad-fresh transition-colors">
                  Get In Touch
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-salad-fresh transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Business Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-salad-light font-heading">
              Cloud Kitchen Details
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-salad-fresh flex-shrink-0 mt-0.5" />
                <span>Baner, Pune, Maharashtra 411045</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-salad-fresh flex-shrink-0" />
                <a
                  href="mailto:smiti.olgakhattri@gmail.com"
                  className="hover:text-salad-fresh transition-colors underline decoration-salad-fresh/40"
                >
                  smiti.olgakhattri@gmail.com
                </a>
              </li>
              <li className="text-xs text-gray-400 pt-1">
                Founder & Owner: <strong className="text-white">Smiti Olga Khattri</strong>
              </li>
              <li className="text-xs text-amber-300/80 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/20">
                Notice: We operate purely via doorstep delivery. No physical dine-in or pickup facility available.
              </li>
            </ul>
          </div>

          {/* Col 4: Member Portal */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-salad-light font-heading">
              Customer Portal
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              Already a subscriber? Access your dashboard to view remaining meal counts, delivery status, and meal preferences.
            </p>
            <div className="space-y-2">
              <Link
                href="/login"
                className="block w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-center text-sm transition-all border border-white/20"
              >
                Customer Login
              </Link>
              <Link
                href="/signup"
                className="block w-full py-2.5 rounded-xl bg-salad-fresh hover:bg-emerald-400 text-salad-dark font-bold text-center text-sm shadow-md transition-all"
              >
                Sign Up for 20 Meal Plan
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Love Thy Salad. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for everyday wellness in Baner, Pune.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
