export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string; // Supabase Auth UUID
  customer_id?: string; // LTS-01, LTS-02, ...
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  ingredients: string;
  nutrition: NutritionInfo;
  image_url: string;
  customization_available: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export type SubscriptionStatus = 'active' | 'completed' | 'paused';

export interface Subscription {
  id: string;
  user_id: string;
  user?: Profile;
  total_meals: number;
  meals_delivered: number;
  meals_remaining: number;
  status: SubscriptionStatus;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export type DeliveryStatus = 'scheduled' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Delivery {
  id: string;
  subscription_id: string;
  user_id: string;
  user?: Profile;
  customer?: Profile;
  delivered_by_profile?: Profile;
  product_id?: string;
  product?: Product;
  delivery_date: string;
  status: DeliveryStatus;
  notes?: string;
  delivered_at?: string;
  delivered_by?: string;
  created_at: string;
  updated_at: string;
}

export interface MealPreference {
  id: string;
  user_id: string;
  dietary_preferences?: string;
  ingredients_to_avoid?: string;
  allergies?: string;
  spice_preference?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  created_at: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status?: 'new' | 'read';
  created_at?: string;
}
