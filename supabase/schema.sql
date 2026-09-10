-- =========================================================
-- LOVE THY SALAD — SUPABASE DATABASE SCHEMA & MIGRATION
-- Healthy Food Cloud Kitchen in Baner, Pune
-- Owner: Smiti Olga Khattri
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------
-- 1. PROFILES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ---------------------------------------------------------
-- 2. CATEGORIES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 3. PRODUCTS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  nutrition JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  customization_available BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);

-- ---------------------------------------------------------
-- 4. SUBSCRIPTIONS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_meals INTEGER DEFAULT 20 CHECK (total_meals >= 0),
  meals_delivered INTEGER DEFAULT 0 CHECK (meals_delivered >= 0),
  meals_remaining INTEGER DEFAULT 20 CHECK (meals_remaining >= 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- ---------------------------------------------------------
-- 5. DELIVERIES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  delivery_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  notes TEXT,
  delivered_at TIMESTAMPTZ,
  delivered_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliveries_sub ON public.deliveries(subscription_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_user ON public.deliveries(user_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON public.deliveries(status);
CREATE INDEX IF NOT EXISTS idx_deliveries_date ON public.deliveries(delivery_date);

-- ---------------------------------------------------------
-- 6. MEAL PREFERENCES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meal_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dietary_preferences TEXT,
  ingredients_to_avoid TEXT,
  allergies TEXT,
  spice_preference TEXT DEFAULT 'Medium',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_pref_user ON public.meal_preferences(user_id);

-- ---------------------------------------------------------
-- 7. NOTIFICATIONS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- ---------------------------------------------------------
-- 8. CONTACT MESSAGES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 9. AUTOMATIC NEW USER SIGNUP TRIGGER ON auth.users
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
  user_phone TEXT;
  user_address TEXT;
BEGIN
  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1));
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  user_address := COALESCE(NEW.raw_user_meta_data->>'address', '');

  -- 1. Insert or update user profile
  INSERT INTO public.profiles (id, full_name, email, phone, address, role)
  VALUES (NEW.id, user_full_name, NEW.email, user_phone, user_address, 'customer')
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address;

  -- 2. Automatically activate default 20-meal subscription
  INSERT INTO public.subscriptions (user_id, total_meals, meals_delivered, meals_remaining, status, start_date)
  VALUES (NEW.id, 20, 0, 20, 'active', CURRENT_DATE)
  ON CONFLICT DO NOTHING;

  -- 3. Initialize default meal preferences
  INSERT INTO public.meal_preferences (user_id, dietary_preferences, spice_preference)
  VALUES (NEW.id, 'Balanced Healthy', 'Medium')
  ON CONFLICT (user_id) DO NOTHING;

  -- 4. Create welcome notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.id,
    'Welcome to Love Thy Salad! 🌿',
    'Your 20-meal subscription has been activated. Enjoy fresh healthy meals delivered to your doorstep in Baner, Pune.',
    'success'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_signup();

-- ---------------------------------------------------------
-- 10. SERVER-SIDE TRIGGER: MEAL COUNT & DOUBLE-COUNTING PREVENTION
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_delivery_status_change()
RETURNS TRIGGER AS $$
DECLARE
  sub_record RECORD;
  new_delivered INTEGER;
  new_remaining INTEGER;
BEGIN
  -- Only trigger logic when status transitions TO 'delivered' from non-delivered state
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    SELECT * INTO sub_record FROM public.subscriptions WHERE id = NEW.subscription_id FOR UPDATE;

    IF sub_record.id IS NULL THEN
      RAISE EXCEPTION 'Associated subscription not found.';
    END IF;

    IF sub_record.meals_remaining <= 0 OR sub_record.status = 'completed' THEN
      RAISE EXCEPTION 'Cannot process delivery: Subscription has 0 meals remaining or is already completed.';
    END IF;

    -- Compute updated metrics
    new_delivered := sub_record.meals_delivered + 1;
    new_remaining := GREATEST(0, sub_record.total_meals - new_delivered);

    -- Stamp delivered_at
    NEW.delivered_at := COALESCE(NEW.delivered_at, NOW());

    -- Update subscription atomically
    UPDATE public.subscriptions
    SET 
      meals_delivered = new_delivered,
      meals_remaining = new_remaining,
      status = CASE WHEN new_remaining = 0 THEN 'completed' ELSE status END,
      updated_at = NOW()
    WHERE id = NEW.subscription_id;

    -- Add customer notification
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.user_id,
      'Meal Delivered! 🥗',
      'Your meal has been delivered fresh. You have ' || new_remaining || ' meals remaining in your plan.',
      'success'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_delivery_status_update ON public.deliveries;

CREATE TRIGGER on_delivery_status_update
BEFORE UPDATE ON public.deliveries
FOR EACH ROW
EXECUTE FUNCTION public.handle_delivery_status_change();

-- ---------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Customers can read/insert/update their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Categories & Products: Public read
CREATE POLICY "Public read active categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public read active products" ON public.products
  FOR SELECT USING (true);

-- Subscriptions: User can view, insert, and update their own subscription
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Deliveries: User can view, insert, and update their own deliveries
CREATE POLICY "Users can view own deliveries" ON public.deliveries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deliveries" ON public.deliveries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deliveries" ON public.deliveries
  FOR UPDATE USING (auth.uid() = user_id);

-- Meal Preferences: User can read/write own preferences
CREATE POLICY "Users can manage own preferences" ON public.meal_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Notifications: User can read/update own notifications
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Contact Messages: Anyone can insert a contact message
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- ---------------------------------------------------------
-- 12. SEED DATA (CATEGORIES & PRODUCTS)
-- ---------------------------------------------------------

INSERT INTO public.categories (id, name, description, image_url, active) VALUES
('c1111111-1111-1111-1111-111111111111', 'Healthy Salads', 'Nutrient-rich, crisp salads prepared with organic greens and house-made dressings.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', true),
('c2222222-2222-2222-2222-222222222222', 'Cold Pressed Juices', '100% pure raw fruit and vegetable extractions with zero added sugar or preservatives.', 'https://images.unsplash.com/photo-1622484210800-88510792892e?auto=format&fit=crop&w=800&q=80', true),
('c3333333-3333-3333-3333-333333333333', 'Soups', 'Warm, comforting, wholesome soups bursting with natural herbs and garden vegetables.', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', true),
('c4444444-4444-4444-4444-444444444444', 'Wraps', 'High-protein whole-wheat tortilla wraps stuffed with grilled greens and clean proteins.', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', true),
('c5555555-5555-5555-5555-555555555555', 'Oats Jar', 'Overnight chia-oat jars infused with almond milk, wild berries, and organic honey.', 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=800&q=80', true),
('c6666666-6666-6666-6666-666666666666', 'Smoothies', 'Thick blended superfood jars loaded with antioxidants, greek yogurt, and fresh fruit.', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.products (id, category_id, name, description, ingredients, nutrition, image_url, customization_available, active) VALUES
('f1010101-1010-1010-1010-101010101010', 'c1111111-1111-1111-1111-111111111111', 'Avocado Quinoa Power Bowl', 'Crisp romaine, avocado slices, red quinoa, cherry tomatoes, cucumbers, toasted pumpkin seeds, lemon herb vinaigrette.', 'Baby spinach, avocado, red quinoa, cherry tomatoes, cucumber, pumpkin seeds, olive oil, lemon', '{"calories": 340, "protein": "12g", "carbs": "32g", "fats": "18g"}', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', true, true),
('f1020202-1020-1020-1020-102010201020', 'c1111111-1111-1111-1111-111111111111', 'Mediterranean Grilled Paneer Salad', 'Herb-roasted cottage cheese, kalamata olives, bell peppers, baby arugula, feta crumble, balsamic glaze.', 'Paneer, arugula, bell peppers, olives, feta, balsamic reduction, oregano', '{"calories": 380, "protein": "22g", "carbs": "16g", "fats": "24g"}', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80', true, true),
('f2010101-2020-2020-2020-202020202020', 'c2222222-2222-2222-2222-222222222222', 'Green Goddess Detox Elixir', 'Cold pressed spinach, celery, green apple, cucumber, ginger, and fresh mint.', 'Spinach, celery, green apple, cucumber, ginger, mint, lime', '{"calories": 110, "protein": "2g", "carbs": "24g", "fats": "0.5g"}', 'https://images.unsplash.com/photo-1622484210800-88510792892e?auto=format&fit=crop&w=800&q=80', false, true),
('f2020202-2020-2020-2020-202020202021', 'c2222222-2222-2222-2222-222222222222', 'Sunset Glow Carrot & Ginger', 'Pure cold pressed organic carrots, Valencia orange, turmeric root, and ginger extract.', 'Carrots, orange juice, fresh turmeric, ginger, sea salt', '{"calories": 130, "protein": "2g", "carbs": "29g", "fats": "0g"}', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80', false, true),
('f3010101-3030-3030-3030-303030303030', 'c3333333-3333-3333-3333-333333333333', 'Roasted Broccoli & Almond Soup', 'Creamy soup crafted from slow-roasted broccoli florets, blanched almonds, garlic, and fresh basil.', 'Broccoli, blanched almonds, vegetable broth, olive oil, garlic, black pepper', '{"calories": 210, "protein": "8g", "carbs": "18g", "fats": "11g"}', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80', true, true),
('f4010101-4040-4040-4040-404040404040', 'c4444444-4444-4444-4444-444444444444', 'Hummus & Falafel Whole Wheat Wrap', 'House-made chickpea hummus, crispy baked falafel, shredded purple cabbage, tahini sauce in a spinach tortilla.', 'Whole wheat tortilla, falafel, chickpea hummus, purple cabbage, tahini, cucumber', '{"calories": 420, "protein": "16g", "carbs": "54g", "fats": "15g"}', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80', true, true),
('f5010101-5050-5050-5050-505050505050', 'c5555555-5555-5555-5555-555555555555', 'Wild Berry Chia Overnight Oats', 'Rolled oats soaked in unsweetened almond milk, topped with chia seeds, wild raspberries, and roasted pistachios.', 'Rolled oats, almond milk, chia seeds, raspberries, blueberries, honey, pistachios', '{"calories": 310, "protein": "10g", "carbs": "46g", "fats": "9g"}', 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=800&q=80', true, true),
('f6010101-6060-6060-6060-606060606060', 'c6666666-6666-6666-6666-666666666666', 'Tropical Dragonfruit Mango Smoothie', 'Vibrant pitaya fruit blended with ripe Alphonso mango, coconut water, and flax seeds.', 'Pink dragonfruit, Alphonso mango, coconut water, Greek yogurt, flax seed', '{"calories": 260, "protein": "7g", "carbs": "42g", "fats": "5g"}', 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80', true, true)
ON CONFLICT (id) DO NOTHING;
