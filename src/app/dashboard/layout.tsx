'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Box,
  Utensils,
  Calendar,
  Sliders,
  User,
  Bell,
  LogOut,
  Leaf,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, notifications, logout, isLoading } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-salad-bg text-salad-dark font-semibold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-salad-leaf border-t-transparent animate-spin" />
          <span>Loading Customer Portal...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'My Subscription', href: '/dashboard/subscription', icon: <Box className="w-5 h-5" /> },
    { name: 'My Meals', href: '/dashboard/meals', icon: <Utensils className="w-5 h-5" /> },
    { name: 'Upcoming Deliveries', href: '/dashboard/upcoming', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Meal Preferences', href: '/dashboard/preferences', icon: <Sliders className="w-5 h-5" /> },
    { name: 'Profile', href: '/dashboard/profile', icon: <User className="w-5 h-5" /> },
    {
      name: 'Notifications',
      href: '/dashboard/notifications',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  return (
    <div className="min-h-screen flex bg-salad-bg text-salad-charcoal">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-salad-dark text-white flex-col justify-between p-6 fixed inset-y-0 left-0 z-30 shadow-2xl">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-salad-fresh flex items-center justify-center text-salad-dark shadow-md">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl text-white tracking-tight leading-none">
                Love Thy Salad
              </span>
              <span className="text-[10px] font-semibold text-salad-light tracking-widest uppercase">
                Customer Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-salad-fresh text-salad-dark font-bold shadow-md'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="p-3 rounded-2xl bg-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-salad-fresh text-salad-dark font-bold flex items-center justify-center text-sm">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-bold text-white truncate">
                {user.full_name}
              </span>
              <span className="block text-[10px] text-gray-300 truncate">
                {user.email}
              </span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900 text-rose-200 text-xs font-bold transition-all border border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-salad-dark text-white px-4 py-3 flex items-center justify-between shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-salad-fresh flex items-center justify-center text-salad-dark">
            <Leaf className="w-4 h-4 fill-current" />
          </div>
          <span className="font-heading font-bold text-lg text-white">
            Love Thy Salad
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/notifications"
            className="p-2 rounded-xl bg-white/10 text-white relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-xl bg-white/10 text-white"
          >
            {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-xs bg-salad-dark text-white h-full p-6 flex flex-col justify-between space-y-6 pt-16">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive ? 'bg-salad-fresh text-salad-dark font-bold' : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => {
                setMobileDrawerOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-950/40 text-rose-200 text-xs font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-72 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-10 min-h-screen">
        {children}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around shadow-lg">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/dashboard' ? 'text-salad-primary' : 'text-gray-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </Link>
        <Link
          href="/dashboard/subscription"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/dashboard/subscription' ? 'text-salad-primary' : 'text-gray-500'
          }`}
        >
          <Box className="w-5 h-5" />
          <span>Plan</span>
        </Link>
        <Link
          href="/dashboard/meals"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/dashboard/meals' ? 'text-salad-primary' : 'text-gray-500'
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span>Meals</span>
        </Link>
        <Link
          href="/dashboard/profile"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/dashboard/profile' ? 'text-salad-primary' : 'text-gray-500'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
}
