import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request payload.' },
        { status: 400 }
      );
    }

    const { fullName, email, phone, password, address } = body;

    // 1. Validate required customer information
    if (!fullName || !email || !password || !phone || !address) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields (Full Name, Email, Phone, Password, Address).' },
        { status: 400 }
      );
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 3. Validate password length
    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    // If Supabase environment variables are missing (local dummy testing fallback)
    if (!supabaseUrl || supabaseUrl.includes('dummy')) {
      return NextResponse.json({
        success: true,
        message: 'Account created in offline development mode.',
        isLocalFallback: true,
      });
    }

    // 4. Use SERVICE ROLE KEY to bypass client RLS & email rate limits safely on the server
    const supabaseKey = serviceRoleKey || supabaseAnonKey;
    const adminSupabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    let userId: string | undefined;

    // 5. Create the Supabase Auth user using Admin API with email_confirm: true
    if (serviceRoleKey) {
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

      if (createError) {
        console.error('Server Admin createUser error:', createError);
        if (
          createError.message.toLowerCase().includes('already registered') ||
          createError.message.toLowerCase().includes('already exists')
        ) {
          return NextResponse.json(
            { success: false, error: 'An account with this email address already exists. Please log in instead.' },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { success: false, error: createError.message || 'Failed to create user account.' },
          { status: 400 }
        );
      }

      userId = createData?.user?.id;
    } else {
      // Fallback if SERVICE_ROLE_KEY is not defined in local environment
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
        console.error('Server signUp fallback error:', authError);
        if (authError.message.toLowerCase().includes('already registered')) {
          return NextResponse.json(
            { success: false, error: 'An account with this email address already exists. Please log in instead.' },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { success: false, error: authError.message },
          { status: 400 }
        );
      }

      userId = authData?.user?.id;
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User registration failed. Could not obtain user ID.' },
        { status: 500 }
      );
    }

    try {
      // 6. Create customer's profile row
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
        console.error('Server error creating profile row:', profError);
      }

      // 7. Create default 20-meal subscription (total_meals: 20, meals_delivered: 0, meals_remaining: 20, status: active)
      const { data: existingSub } = await adminSupabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingSub) {
        const { error: subErr } = await adminSupabase.from('subscriptions').insert({
          user_id: userId,
          total_meals: 20,
          meals_delivered: 0,
          meals_remaining: 20,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
        });

        if (subErr) console.error('Server error creating subscription row:', subErr);
      }

      // 8. Create meal preferences
      const { data: existingPref } = await adminSupabase
        .from('meal_preferences')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingPref) {
        const { error: prefErr } = await adminSupabase.from('meal_preferences').insert({
          user_id: userId,
          dietary_preferences: 'Balanced Healthy',
          spice_preference: 'Medium',
        });

        if (prefErr) console.error('Server error creating meal preferences row:', prefErr);
      }

      // 9. Create welcome notification
      const { data: existingNotif } = await adminSupabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingNotif) {
        const { error: notifErr } = await adminSupabase.from('notifications').insert({
          user_id: userId,
          title: 'Welcome to Love Thy Salad! 🌿',
          message: 'Your 20-meal subscription has been activated. Enjoy fresh healthy meals delivered to your doorstep in Baner, Pune.',
          type: 'success',
        });

        if (notifErr) console.error('Server error creating notification row:', notifErr);
      }
    } catch (dbErr) {
      console.error('Server database insertion error:', dbErr);
    }

    // 10. Return success response
    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Your 20-meal subscription is now active.',
      userId,
    });
  } catch (err: any) {
    console.error('API Signup exception:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'An unexpected error occurred during signup.' },
      { status: 500 }
    );
  }
}
