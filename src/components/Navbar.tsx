'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Leaf, User, LayoutDashboard, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Our Plans', href: '/plans' },
    { name: 'Menu', href: '/menu' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Get In Touch', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav py-3 shadow-soft-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LEFT: Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-salad-primary to-salad-fresh flex items-center justify-center shadow-md shadow-salad-primary/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-white transform group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl sm:text-2xl text-salad-dark tracking-tight leading-none group-hover:text-salad-primary transition-colors">
                Love Thy Salad
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-salad-leaf uppercase">
                Baner • Pune
              </span>
            </div>
          </Link>

          {/* CENTER: Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-salad-leaf/10 shadow-soft-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-salad-primary text-white shadow-sm font-semibold'
                      : 'text-gray-700 hover:text-salad-primary hover:bg-salad-beige/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-salad-primary/30 text-salad-dark hover:bg-salad-beige text-sm font-semibold transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-salad-leaf" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-gray-700 hover:text-salad-primary hover:bg-salad-beige/50 text-sm font-semibold transition-all"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}

            <Link
              href="/plans"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-salad-primary to-salad-leaf hover:from-salad-dark hover:to-salad-primary text-white text-sm font-semibold shadow-md shadow-salad-primary/20 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>Start Your Healthy Journey</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* MOBILE: Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              <Link
                href="/dashboard"
                className="p-2 rounded-full bg-salad-beige text-salad-dark text-xs font-semibold flex items-center gap-1"
              >
                <LayoutDashboard className="w-4 h-4 text-salad-leaf" />
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-white shadow-soft-sm text-salad-dark hover:bg-salad-beige transition-colors border border-gray-200"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden glass-card border-b border-salad-leaf/10 overflow-hidden shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-3 rounded-2xl text-base font-semibold transition-all ${
                        isActive
                          ? 'bg-salad-primary text-white'
                          : 'text-gray-700 hover:bg-salad-beige'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="w-full py-3 rounded-2xl bg-salad-beige text-salad-dark font-semibold text-center flex items-center justify-center gap-2"
                  >
                    <LayoutDashboard className="w-5 h-5 text-salad-leaf" />
                    <span>Go to Customer Dashboard</span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="w-full py-3 rounded-2xl border border-gray-300 text-gray-700 font-semibold text-center"
                  >
                    Login to Account
                  </Link>
                )}

                <Link
                  href="/plans"
                  className="w-full py-3.5 rounded-2xl bg-salad-primary text-white font-semibold text-center shadow-md"
                >
                  Start Your Healthy Journey 🌿
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
