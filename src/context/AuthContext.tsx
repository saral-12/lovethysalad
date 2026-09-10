'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  DEMO_USER_ACTIVE,
  DEMO_SUBSCRIPTION_ACTIVE,
  DEMO_DELIVERIES,
  DEMO_PREFERENCES,
  DEMO_NOTIFICATIONS,
} from '@/lib/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: Profile | null;
  subscription: Subscription | null;
  deliveries: Delivery[];
  preferences: MealPreference | null;
  notifications: NotificationItem[];
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    fullName: string,
    email: string,
    phone: string,
    password: string,
    address: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePreferences: (prefs: Partial<MealPreference>) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  submitContactMessage: (msg: ContactMessage) => Promise<{ success: boolean; error?: string }>;
  refreshDashboardData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'love_thy_salad_user',
  SUBSCRIPTION: 'love_thy_salad_sub',
  DELIVERIES: 'love_thy_salad_deliveries',
  PREFERENCES: 'love_thy_salad_prefs',
  NOTIFICATIONS: 'love_thy_salad_notifications',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [preferences, setPreferences] = useState<MealPreference | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [categories] = useState<Category[]>(SEED_CATEGORIES);
  const [products] = useState<Product[]>(SEED_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session and storage on mount
  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);

      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await loadSupabaseUserData(session.user.id);
          } else {
            loadStoredUserData();
          }
        } catch (err) {
          console.error('Supabase init error, using local state:', err);
          loadStoredUserData();
        }
      } else {
        loadStoredUserData();
      }

      setIsLoading(false);
    }

    initAuth();

    // Listen for auth state changes
    if (isSupabaseConfigured) {
      const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
            await loadSupabaseUserData(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            loadStoredUserData();
          }
        }
      );

      return () => {
        authListener.unsubscribe();
      };
    }
  }, []);

  function loadStoredUserData() {
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const storedSub = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
      const storedDeliveries = localStorage.getItem(STORAGE_KEYS.DELIVERIES);
      const storedPrefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      const storedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setSubscription(storedSub ? JSON.parse(storedSub) : null);
        setDeliveries(storedDeliveries ? JSON.parse(storedDeliveries) : []);
        setPreferences(storedPrefs ? JSON.parse(storedPrefs) : null);
        setNotifications(storedNotifs ? JSON.parse(storedNotifs) : []);
      } else {
        setUser(null);
        setSubscription(null);
        setDeliveries([]);
        setPreferences(null);
        setNotifications([]);
      }
    } catch (e) {
      console.warn('Storage error:', e);
      setUser(null);
      setSubscription(null);
      setDeliveries([]);
      setPreferences(null);
      setNotifications([]);
    }
  }

  function saveLocalState(
    u: Profile | null,
    s: Subscription | null,
    d: Delivery[],
    p: MealPreference | null,
    n: NotificationItem[]
  ) {
    try {
      if (u) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEYS.USER);

      if (s) localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(s));
      else localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);

      localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(d));
      if (p) localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(p));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(n));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  async function loadSupabaseUserData(userId: string) {
    try {
      // 1. Fetch or create Profile in Supabase
      let userProf: Profile | null = null;
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

      if (prof) {
        userProf = prof as Profile;
      } else {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const newProfData: Profile = {
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Customer',
            email: authUser.email || '',
            phone: authUser.user_metadata?.phone || '',
            address: authUser.user_metadata?.address || '',
            role: 'customer',
            created_at: authUser.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          const { data: insertedProf } = await supabase
            .from('profiles')
            .upsert(newProfData)
            .select()
            .single();

          userProf = (insertedProf as Profile) || newProfData;
        }
      }
      if (userProf) setUser(userProf);

      // 2. Fetch or create Active Subscription in Supabase
      let userSub: Subscription | null = null;
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (subs && subs.length > 0) {
        userSub = subs[0] as Subscription;
      } else {
        const defaultSub = {
          user_id: userId,
          total_meals: 20,
          meals_delivered: 0,
          meals_remaining: 20,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
        };
        const { data: createdSub } = await supabase
          .from('subscriptions')
          .insert(defaultSub)
          .select()
          .single();

        if (createdSub) userSub = createdSub as Subscription;
      }
      if (userSub) setSubscription(userSub);

      // 3. Fetch Deliveries
      const { data: delivs } = await supabase
        .from('deliveries')
        .select('*, product:products(*)')
        .eq('user_id', userId)
        .order('delivery_date', { ascending: false });

      const userDelivs = delivs ? (delivs as Delivery[]) : [];
      setDeliveries(userDelivs);

      // 4. Fetch or create Meal Preferences in Supabase
      let userPrefs: MealPreference | null = null;
      const { data: prefs } = await supabase
        .from('meal_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (prefs) {
        userPrefs = prefs as MealPreference;
      } else {
        const defaultPref = {
          user_id: userId,
          dietary_preferences: 'Balanced Healthy',
          spice_preference: 'Medium',
        };
        const { data: createdPref } = await supabase
          .from('meal_preferences')
          .insert(defaultPref)
          .select()
          .single();

        if (createdPref) userPrefs = createdPref as MealPreference;
      }
      if (userPrefs) setPreferences(userPrefs);

      // 5. Fetch or create Notifications in Supabase
      let userNotifs: NotificationItem[] = [];
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (notifs && notifs.length > 0) {
        userNotifs = notifs as NotificationItem[];
      } else {
        const defaultNotif = {
          user_id: userId,
          title: 'Welcome to Love Thy Salad! 🌿',
          message: 'Your 20-meal subscription has been activated. Enjoy fresh healthy meals in Baner, Pune.',
          type: 'success',
        };
        const { data: createdNotif } = await supabase
          .from('notifications')
          .insert(defaultNotif)
          .select()
          .single();

        if (createdNotif) userNotifs = [createdNotif as NotificationItem];
      }
      setNotifications(userNotifs);

      // Save to local storage as fallback cache
      saveLocalState(userProf, userSub, userDelivs, userPrefs, userNotifs);
    } catch (err) {
      console.error('Error fetching/saving Supabase user data:', err);
    }
  }

  const login = async (email: string, password?: string) => {
    if (isSupabaseConfigured && password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        await loadSupabaseUserData(data.user.id);
        return { success: true };
      }
    }

    // Local authentication fallback
    const lowerEmail = email.toLowerCase().trim();
    const newUser: Profile = {
      id: 'u_' + Date.now(),
      full_name: lowerEmail.includes('smiti') ? 'Smiti Khattri' : lowerEmail.split('@')[0],
      email: lowerEmail,
      phone: '+91 98765 43210',
      address: 'Baner, Pune',
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newSub: Subscription = {
      id: 'sub_' + Date.now(),
      user_id: newUser.id,
      total_meals: 20,
      meals_delivered: 0,
      meals_remaining: 20,
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newPref: MealPreference = {
      id: 'pref_' + Date.now(),
      user_id: newUser.id,
      dietary_preferences: 'Balanced Healthy',
      spice_preference: 'Medium',
    };

    const newNotifs: NotificationItem[] = [
      {
        id: 'notif_' + Date.now(),
        user_id: newUser.id,
        title: 'Welcome Back 🌿',
        message: 'Your 20-meal subscription is active.',
        type: 'success',
        read: false,
        created_at: new Date().toISOString(),
      },
    ];

    setUser(newUser);
    setSubscription(newSub);
    setDeliveries([]);
    setPreferences(newPref);
    setNotifications(newNotifs);

    saveLocalState(newUser, newSub, [], newPref, newNotifs);
    return { success: true };
  };

  const signup = async (
    fullName: string,
    email: string,
    phone: string,
    password: string,
    address: string
  ) => {
    if (isSupabaseConfigured) {
      try {
        const apiRes = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, phone, password, address }),
        });

        const apiData = await apiRes.json();
        if (!apiRes.ok || !apiData.success) {
          return {
            success: false,
            error: apiData?.error || 'Failed to create account. Please try again.',
          };
        }

        // Auto sign-in or establish user session
        const loginRes = await login(email, password);
        if (loginRes.success) {
          return { success: true, message: apiData.message, customer_id: apiData.customer_id };
        }

        if (apiData?.userId) {
          await loadSupabaseUserData(apiData.userId);
          return { success: true, message: apiData.message, customer_id: apiData.customer_id };
        }

        return { success: true, message: apiData.message, customer_id: apiData.customer_id };
      } catch (err: any) {
        console.error('Customer signup API error:', err);
        return {
          success: false,
          error: err.message || 'Network error during registration. Please try again.',
        };
      }
    }

    // Local registration fallback
    const newUserId = 'u_' + Date.now();
    const newProf: Profile = {
      id: newUserId,
      customer_id: 'LTS-01',
      full_name: fullName,
      email,
      phone,
      address,
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newSub: Subscription = {
      id: 'sub_' + Date.now(),
      user_id: newUserId,
      total_meals: 20,
      meals_delivered: 0,
      meals_remaining: 20,
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newPref: MealPreference = {
      id: 'pref_' + Date.now(),
      user_id: newUserId,
      dietary_preferences: 'Balanced Healthy',
      spice_preference: 'Medium',
    };

    const newNotifs: NotificationItem[] = [
      {
        id: 'notif_welcome',
        user_id: newUserId,
        title: 'Welcome to Love Thy Salad! 🌿',
        message: 'Your 20-meal subscription has been activated. Your healthy journey starts here!',
        type: 'success',
        read: false,
        created_at: new Date().toISOString(),
      },
    ];

    setUser(newProf);
    setSubscription(newSub);
    setDeliveries([]);
    setPreferences(newPref);
    setNotifications(newNotifs);

    saveLocalState(newProf, newSub, [], newPref, newNotifs);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSubscription(null);
    setDeliveries([]);
    setPreferences(null);
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
    localStorage.removeItem(STORAGE_KEYS.DELIVERIES);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  };

  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured) {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/login`,
      });
      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          return {
            success: false,
            error: 'Supabase email rate limit reached (3 per hour limit on default SMTP). Disable "Confirm Email" in Supabase Auth settings or try again later.',
          };
        }
        return { success: false, error: error.message };
      }
    }
    return { success: true };
  };

  const updatePreferences = async (updated: Partial<MealPreference>) => {
    if (!user) return;
    const newPrefs = { ...preferences, ...updated, user_id: user.id } as MealPreference;
    setPreferences(newPrefs);

    if (isSupabaseConfigured) {
      await supabase.from('meal_preferences').upsert({
        user_id: user.id,
        ...updated,
        updated_at: new Date().toISOString(),
      });
    }

    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(newPrefs));
    } catch (e) {
      console.warn(e);
    }
  };

  const updateProfile = async (updated: Partial<Profile>) => {
    if (!user) return;
    const newProfile = { ...user, ...updated } as Profile;
    setUser(newProfile);

    if (isSupabaseConfigured) {
      await supabase.from('profiles').update({
        full_name: updated.full_name,
        phone: updated.phone,
        address: updated.address,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newProfile));
    } catch (e) {
      console.warn(e);
    }
  };

  const markNotificationRead = async (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);

    if (isSupabaseConfigured) {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  const submitContactMessage = async (msg: ContactMessage) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('contact_messages').insert({
        name: msg.name,
        email: msg.email,
        phone: msg.phone,
        message: msg.message,
      });
      if (error) return { success: false, error: error.message };
    }
    return { success: true };
  };

  const refreshDashboardData = async () => {
    if (user && isSupabaseConfigured) {
      await loadSupabaseUserData(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        deliveries,
        preferences,
        notifications,
        categories,
        products,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        updatePreferences,
        updateProfile,
        markNotificationRead,
        submitContactMessage,
        refreshDashboardData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
