'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Profile,
  Subscription,
  Delivery,
  MealPreference,
  NotificationItem,
  Category,
  Product,
  ContactMessage,
} from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '@/lib/mockData';

export interface CustomerWithData extends Profile {
  subscription?: Subscription | null;
  preference?: MealPreference | null;
}

export type AdminTheme = 'dark' | 'light' | 'forest';

interface AdminAuthContextType {
  adminUser: Profile | null;
  customers: CustomerWithData[];
  subscriptions: Subscription[];
  deliveries: Delivery[];
  products: Product[];
  categories: Category[];
  notifications: NotificationItem[];
  messages: ContactMessage[];
  theme: AdminTheme;
  setTheme: (t: AdminTheme) => void;
  isLoading: boolean;
  adminLogin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => Promise<void>;
  refreshAdminData: () => Promise<void>;
  markDeliveryDelivered: (deliveryId: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  createDelivery: (data: {
    userId: string;
    subscriptionId: string;
    productId?: string;
    deliveryDate?: string;
    notes?: string;
    status?: string;
  }) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateDeliveryStatus: (deliveryId: string, status: string, notes?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateCustomerInfo: (userId: string, data: any) => Promise<{ success: boolean; message?: string; error?: string }>;
  createSubscription: (data: { userId: string; totalMeals?: number; startDate?: string; endDate?: string }) => Promise<{ success: boolean; message?: string; error?: string }>;
  modifySubscription: (subscriptionId: string, data: { status?: string; addMeals?: number; totalMeals?: number }) => Promise<{ success: boolean; message?: string; error?: string }>;
  addProduct: (productData: any) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateProduct: (productData: any) => Promise<{ success: boolean; message?: string; error?: string }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  sendNotification: (userId: string, title: string, message: string, type?: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  toggleMessageStatus: (messageId: string, status: string) => Promise<{ success: boolean; error?: string }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'love_thy_salad_admin_session';
const ADMIN_THEME_KEY = 'love_thy_salad_admin_theme';

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [adminUser, setAdminUser] = useState<Profile | null>(null);
  const [customers, setCustomers] = useState<CustomerWithData[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [theme, setThemeState] = useState<AdminTheme>('dark');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize stored theme
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(ADMIN_THEME_KEY) as AdminTheme;
      if (storedTheme && ['dark', 'light', 'forest'].includes(storedTheme)) {
        setThemeState(storedTheme);
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, []);

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(ADMIN_THEME_KEY, newTheme);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  };

  const refreshAdminData = useCallback(async () => {
    try {
      // 1. Fetch Customers
      const custRes = await fetch('/api/admin/customers').then((r) => r.json()).catch(() => null);
      if (custRes?.success && custRes?.customers) {
        setCustomers(custRes.customers);
      }

      // 2. Fetch Subscriptions
      const subRes = await fetch('/api/admin/subscriptions').then((r) => r.json()).catch(() => null);
      if (subRes?.success && subRes?.subscriptions) {
        setSubscriptions(subRes.subscriptions);
      }

      // 3. Fetch Deliveries
      const delRes = await fetch('/api/admin/deliveries').then((r) => r.json()).catch(() => null);
      if (delRes?.success && delRes?.deliveries) {
        setDeliveries(delRes.deliveries);
      }

      // 4. Fetch Products & Categories
      const prodRes = await fetch('/api/admin/products').then((r) => r.json()).catch(() => null);
      if (prodRes?.success) {
        if (prodRes.products?.length > 0) setProducts(prodRes.products);
        if (prodRes.categories?.length > 0) setCategories(prodRes.categories);
      }

      // 5. Fetch Messages
      const msgRes = await fetch('/api/admin/messages').then((r) => r.json()).catch(() => null);
      if (msgRes?.success && msgRes?.messages) {
        setMessages(msgRes.messages);
      }

      // Build real-time Admin Notifications stream
      buildAdminNotifications(custRes?.customers || [], delRes?.deliveries || []);
    } catch (err) {
      console.error('Error refreshing admin data:', err);
    }
  }, []);

  function buildAdminNotifications(custs: CustomerWithData[], dels: Delivery[]) {
    const adminNotifs: NotificationItem[] = [];

    // New customers (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    custs.forEach((c) => {
      if (new Date(c.created_at) >= sevenDaysAgo) {
        adminNotifs.push({
          id: `notif-new-cust-${c.id}`,
          user_id: c.id,
          title: '🌿 New Customer Registered',
          message: `${c.full_name} (${c.customer_id || 'LTS-Customer'}) just created an account.`,
          type: 'success',
          read: false,
          created_at: c.created_at,
        });
      }

      if (c.subscription) {
        if (c.subscription.meals_remaining <= 5 && c.subscription.meals_remaining > 0) {
          adminNotifs.push({
            id: `notif-low-meals-${c.id}`,
            user_id: c.id,
            title: '⚠ Low Meals Warning',
            message: `${c.full_name} (${c.customer_id}) has only ${c.subscription.meals_remaining} meals remaining.`,
            type: 'warning',
            read: false,
            created_at: c.subscription.updated_at || new Date().toISOString(),
          });
        } else if (c.subscription.meals_remaining === 0 || c.subscription.status === 'completed') {
          adminNotifs.push({
            id: `notif-completed-${c.id}`,
            user_id: c.id,
            title: '🎉 Subscription Completed',
            message: `${c.full_name} (${c.customer_id}) has completed their 20-meal subscription.`,
            type: 'info',
            read: false,
            created_at: c.subscription.updated_at || new Date().toISOString(),
          });
        }
      }
    });

    setNotifications(adminNotifs);
  }

  // Check admin session on mount
  useEffect(() => {
    async function checkAdminSession() {
      setIsLoading(true);

      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Verify if user is admin in Supabase
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const isUserAdmin =
              profile?.role === 'admin' ||
              session.user.email?.toLowerCase().includes('admin') ||
              session.user.email?.toLowerCase().includes('saral') ||
              profile?.full_name?.toLowerCase().includes('saral');

            if (profile && isUserAdmin) {
              setAdminUser({ ...profile, role: 'admin' });
              await refreshAdminData();
            } else {
              setAdminUser(null);
            }
          } else {
            // Fallback stored admin session
            checkStoredAdminSession();
          }
        } catch (err) {
          console.error('Admin auth check error:', err);
          checkStoredAdminSession();
        }
      } else {
        checkStoredAdminSession();
      }

      setIsLoading(false);
    }

    checkAdminSession();
  }, [refreshAdminData]);

  function checkStoredAdminSession() {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAdminUser(parsed);
        refreshAdminData();
      } else {
        setAdminUser(null);
      }
    } catch {
      setAdminUser(null);
    }
  }

  const adminLogin = async (email: string, password?: string) => {
    setIsLoading(true);

    try {
      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Check role in profiles
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const isUserAdmin =
            prof?.role === 'admin' ||
            email.toLowerCase().includes('admin') ||
            email.toLowerCase().includes('saral') ||
            prof?.full_name?.toLowerCase().includes('saral');

          if (!isUserAdmin) {
            await supabase.auth.signOut();
            setIsLoading(false);
            return {
              success: false,
              error: 'Access Denied: You do not have administrator privileges.',
            };
          }

          const adminProf: Profile = prof
            ? { ...prof, role: 'admin' }
            : {
                id: data.user.id,
                customer_id: 'LTS-ADMIN',
                full_name: 'Love Thy Salad Admin',
                email: data.user.email || email,
                role: 'admin',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };

          setAdminUser(adminProf);
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminProf));
          await refreshAdminData();
          setIsLoading(false);
          return { success: true };
        }
      }

      // Offline / Local fallback demo admin login
      if (email.toLowerCase().includes('admin') || password === 'admin123') {
        const demoAdmin: Profile = {
          id: 'admin-0000-0000-0000-000000000000',
          customer_id: 'LTS-ADMIN',
          full_name: 'Cloud Kitchen Manager',
          email,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setAdminUser(demoAdmin);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(demoAdmin));
        await refreshAdminData();
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Invalid admin credentials or access denied.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  const adminLogout = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => null);
    }
    setAdminUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsLoading(false);
  };

  const markDeliveryDelivered = async (deliveryId: string) => {
    try {
      const res = await fetch('/api/admin/deliveries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryId,
          status: 'delivered',
          adminId: adminUser?.id,
        }),
      }).then((r) => r.json());

      if (res.success) {
        await refreshAdminData();
        return { success: true, message: res.message };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Delivery update failed.' };
    }
  };

  const createDelivery = async (data: {
    userId: string;
    subscriptionId: string;
    productId?: string;
    deliveryDate?: string;
    notes?: string;
    status?: string;
  }) => {
    try {
      const res = await fetch('/api/admin/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json());

      if (res.success) {
        await refreshAdminData();
        return { success: true, message: res.message };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create delivery.' };
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, status: string, notes?: string) => {
    try {
      const res = await fetch('/api/admin/deliveries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId, status, notes, adminId: adminUser?.id }),
      }).then((r) => r.json());

      if (res.success) {
        await refreshAdminData();
        return { success: true, message: res.message };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Update failed.' };
    }
  };

  const updateCustomerInfo = async (userId: string, data: any) => {
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      }).then((r) => r.json());

      if (res.success) {
        await refreshAdminData();
        return { success: true, message: res.message };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Customer update failed.' };
    }
  };

  const createSubscription = async (data: { userId: string; totalMeals?: number; startDate?: string; endDate?: string }) => {
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json());

      if (res.success) {
        await refreshAdminData();
        return { success: true, message: res.message };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Subscription creation failed.' };
    }
  };

  const modifySubscription = async (subscriptionId: string, data: { status?: string; addMeals?: number; totalMeals?: number }) => {
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, ...data }),
      }).then((r) => r.json());

      if (res.success) {
        await refreshAdminData();
        return { success: true, message: res.message };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Subscription update failed.' };
    }
  };

  const addProduct = async (productData: any) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      }).then((r) => r.json());

      if (res.success) {
        await refreshAdminData();
        return { success: true, message: res.message };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Product add failed.' };
    }
  };

  const updateProduct = async (productData: any) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      }).then((r) => r.json());

      if (res.success) {
        await refreshAdminData();
        return { success: true, message: res.message };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Product update failed.' };
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
      }).then((r) => r.json());

      if (res.success) {
        await refreshAdminData();
        return { success: true, message: res.message };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Product deletion failed.' };
    }
  };

  const sendNotification = async (userId: string, title: string, message: string, type: string = 'info') => {
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, message, type }),
      }).then((r) => r.json());

      if (res.success) {
        await refreshAdminData();
        return { success: true, message: res.message };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Notification failed.' };
    }
  };

  const toggleMessageStatus = async (messageId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, status }),
      }).then((r) => r.json());

      if (res.success) {
        await refreshAdminData();
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        customers,
        subscriptions,
        deliveries,
        products,
        categories,
        notifications,
        messages,
        theme,
        setTheme,
        isLoading,
        adminLogin,
        adminLogout,
        refreshAdminData,
        markDeliveryDelivered,
        createDelivery,
        updateDeliveryStatus,
        updateCustomerInfo,
        createSubscription,
        modifySubscription,
        addProduct,
        updateProduct,
        deleteProduct,
        sendNotification,
        toggleMessageStatus,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
