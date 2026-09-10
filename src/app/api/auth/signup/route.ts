import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, password, address } = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || supabaseUrl.includes('dummy')) {
      return NextResponse.json({ success: true, isLocalFallback: true });
    }

    // Use Service Role Key if provided (bypasses RLS), otherwise fallback to Anon Key
    const supabaseKey = serviceRoleKey || supabaseAnonKey;
    const adminSupabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // 1. Sign up user in auth.users
    const { data: authData, error: authError } = await adminSupabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          address,
        },
      },
    });

    if (authError) {
      // If error is not a soft user exists message, return error
      if (!authError.message.toLowerCase().includes('already registered')) {
        return NextResponse.json({ success: false, error: authError.message }, { status: 400 });
      }
    }

    // Determine target User ID
    let userId = authData?.user?.id;

    if (!userId) {
      // Try to fetch user by email if already registered
      const { data: userList } = await adminSupabase.auth.admin.listUsers();
      const existingUser = userList?.users?.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase()
      );
      if (existingUser) {
        userId = existingUser.id;
      }
    }

    if (userId) {
      // 2. Insert or Update Profile row directly in Supabase PostgreSQL
      const { error: profError } = await adminSupabase.from('profiles').upsert({
        id: userId,
        full_name: fullName,
        email: email.toLowerCase().trim(),
        phone: phone || '',
        address: address || '',
        role: 'customer',
        updated_at: new Date().toISOString(),
      });

      if (profError) {
        console.error('API Signup Error updating profiles:', profError);
      }

      // 3. Insert Subscription row directly in Supabase PostgreSQL
      const { data: existingSub } = await adminSupabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingSub) {
        await adminSupabase.from('subscriptions').insert({
          user_id: userId,
          total_meals: 20,
          meals_delivered: 0,
          meals_remaining: 20,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
        });
      }

      // 4. Insert Meal Preferences directly in Supabase PostgreSQL
      const { data: existingPref } = await adminSupabase
        .from('meal_preferences')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingPref) {
        await adminSupabase.from('meal_preferences').insert({
          user_id: userId,
          dietary_preferences: 'Balanced Healthy',
          spice_preference: 'Medium',
        });
      }

      // 5. Insert Welcome Notification directly in Supabase PostgreSQL
      const { data: existingNotif } = await adminSupabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingNotif) {
        await adminSupabase.from('notifications').insert({
          user_id: userId,
          title: 'Welcome to Love Thy Salad! 🌿',
          message: 'Your 20-meal subscription has been activated. Enjoy fresh healthy meals in Baner, Pune.',
          type: 'success',
        });
      }
    }

    return NextResponse.json({ success: true, userId });
  } catch (err: any) {
    console.error('API Signup catch error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
