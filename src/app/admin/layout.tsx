'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Truck,
  UtensilsCrossed,
  BarChart3,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  Salad,
  ChevronRight,
  Shield,
  Palette,
  Sun,
  Moon,
  Trees,
  Calendar,
  Clock,
} from 'lucide-react';
import { AdminTheme } from '@/context/AdminAuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { adminUser, adminLogout, notifications, isLoading, theme, setTheme, refreshAdminData, markAllNotificationsAsRead } = useAdminAuth();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<Date | null>(null);

  // Live ticking date and time ticker
  React.useEffect(() => {
    setCurrentDateTime(new Date());
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Daily refresh effect: auto-refresh operational metrics on midnight date transition
  const lastDateRef = React.useRef<string>('');
  React.useEffect(() => {
    lastDateRef.current = new Date().toISOString().split('T')[0];
    const dailyCheck = setInterval(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      if (lastDateRef.current && lastDateRef.current !== todayStr) {
        lastDateRef.current = todayStr;
        refreshAdminData();
      }
    }, 10000);
    return () => clearInterval(dailyCheck);
  }, [refreshAdminData]);

  // If page is /admin/login, render without sidebar/layout wrapper
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Guard admin layout — redirect unauthenticated or non-admin users
  if (!isLoading && !adminUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center space-y-6 text-white shadow-2xl">
          <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold font-heading text-white">
            Admin Access Required
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            You must be logged in as an administrator to access the Love Thy Salad business dashboard.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all"
            >
              Go to Admin Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'Deliveries', href: '/admin/deliveries', icon: Truck },
    { name: 'Menu & Food', href: '/admin/menu', icon: UtensilsCrossed },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell, badge: notifications.length },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* TOP HEADER NAVBAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Salad className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold font-heading text-base tracking-tight text-white block leading-none">
                Love Thy Salad
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mt-0.5">
                Admin SaaS Hub
              </span>
            </div>
          </Link>
        </div>

        {/* LIVE REAL-TIME DATE & TIME DISPLAY */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs shadow-inner">
          <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {currentDateTime
                ? currentDateTime.toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Loading date...'}
            </span>
          </div>
          <span className="text-slate-600 font-bold">|</span>
          <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {currentDateTime
                ? currentDateTime.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })
                : ''}
            </span>
          </div>
        </div>

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowNotifMenu(false);
              }}
              title="Change Admin Portal Theme"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : theme === 'forest' ? (
                <Trees className="w-5 h-5 text-emerald-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-400" />
              )}
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-3 z-50 space-y-2">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 block px-2">
                  Portal Color Theme
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setTheme('dark');
                      setShowThemeMenu(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      theme === 'dark' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span>Dark Slate Theme</span>
                    </div>
                    {theme === 'dark' && <span>✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setTheme('light');
                      setShowThemeMenu(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      theme === 'light' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Executive Light</span>
                    </div>
                    {theme === 'light' && <span>✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      setTheme('forest');
                      setShowThemeMenu(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      theme === 'forest' ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Trees className="w-4 h-4 text-emerald-400" />
                      <span>Midnight Forest</span>
                    </div>
                    {theme === 'forest' && <span>✓</span>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                const nextState = !showNotifMenu;
                setShowNotifMenu(nextState);
                setShowThemeMenu(false);
                if (nextState) {
                  markAllNotificationsAsRead();
                }
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white relative transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] flex items-center justify-center border-2 border-slate-900 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-4 z-50 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Admin Notifications ({notifications.length})
                  </span>
                  <Link
                    href="/admin/notifications"
                    onClick={() => setShowNotifMenu(false)}
                    className="text-[11px] font-bold text-emerald-400 hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No new notifications</p>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs space-y-1"
                      >
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Badge */}
          <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="text-right">
              <span className="text-xs font-bold text-white block leading-tight">
                {adminUser?.full_name || 'Admin Manager'}
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 block">
                {adminUser?.email}
              </span>
            </div>
            <button
              onClick={() => adminLogout().then(() => router.push('/admin/login'))}
              title="Logout from Admin"
              className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16 flex-grow">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 fixed left-0 top-16 bottom-0 flex-col justify-between p-4 z-30 overflow-y-auto">
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isActive ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Business Info Card */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-2 mt-6">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
              Cloud Kitchen Status
            </span>
            <p className="font-bold text-white">Baner, Pune Outlet</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Operations Active</span>
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {isMobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <div className="relative w-72 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between z-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Salad className="w-6 h-6 text-emerald-400" />
                  <span className="font-extrabold text-white text-sm">Love Thy Salad Admin</span>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 flex-grow">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={() => adminLogout().then(() => router.push('/admin/login'))}
                className="w-full py-3 rounded-2xl bg-red-500/20 text-red-300 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* MAIN CONTENT CANVAS */}
        <main className="flex-grow lg:ml-64 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
