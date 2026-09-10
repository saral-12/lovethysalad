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

    const supabaseKey = serviceRoleKey || supabaseAnonKey;
    const adminSupabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    let userId: string | undefined;

    // 1. If serviceRoleKey is available, use admin.createUser with auto-confirm (no emails sent, no email rate limits)
    if (serviceRoleKey) {
      try {
        const { data: createData, error: createError } = await adminSupabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            phone,
            address,
          },
        });

        if (createData?.user) {
          userId = createData.user.id;
        } else if (createError && createError.message.toLowerCase().includes('already registered')) {
          const { data: userList } = await adminSupabase.auth.admin.listUsers();
          const existingUser = userList?.users?.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase()
          );
          if (existingUser) userId = existingUser.id;
        }
      } catch (adminErr) {
        console.warn('Admin createUser fallback to standard signUp:', adminErr);
      }
    }

    // Fallback to standard signUp if admin.createUser was not used or did not set userId
    if (!userId) {
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

      if (authError && !authError.message.toLowerCase().includes('already registered') && !authError.message.toLowerCase().includes('rate limit')) {
        return NextResponse.json({ success: false, error: authError.message }, { status: 400 });
      }

      userId = authData?.user?.id;
    }

    if (userId) {
      // 2. Direct PostgreSQL insertion into profiles (Immutable profile details locked at registration)
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
        console.error('Error inserting into profiles table:', profError);
      }

      // 3. Direct PostgreSQL insertion into subscriptions (Default 20-meal plan)
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

      // 4. Direct PostgreSQL insertion into meal_preferences
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

      // 5. Direct PostgreSQL insertion into notifications
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
