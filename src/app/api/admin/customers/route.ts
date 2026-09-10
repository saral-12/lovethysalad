import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// GET /api/admin/customers — Fetch all customers with subscription metrics & preferences
export async function GET(req: Request) {
  try {
    const supabase = getAdminClient();
    
    // Fetch profiles
    const { data: profiles, error: profErr } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profErr) {
      return NextResponse.json({ success: false, error: profErr.message }, { status: 500 });
    }

    // Fetch subscriptions
    const { data: subscriptions } = await supabase.from('subscriptions').select('*');

    // Fetch preferences
    const { data: preferences } = await supabase.from('meal_preferences').select('*');

    // Map metrics to each profile
    const customers = (profiles || []).map((prof) => {
      const sub = (subscriptions || []).find((s) => s.user_id === prof.id);
      const pref = (preferences || []).find((p) => p.user_id === prof.id);
      return {
        ...prof,
        subscription: sub || null,
        preference: pref || null,
      };
    });

    return NextResponse.json({ success: true, customers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// PATCH /api/admin/customers — Update customer profile or meal preferences
export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.userId) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    const { userId, fullName, phone, address, preferences } = body;
    const supabase = getAdminClient();

    // 1. Update Profile (if profile fields supplied)
    const profileUpdates: any = { updated_at: new Date().toISOString() };
    if (fullName !== undefined) profileUpdates.full_name = fullName;
    if (phone !== undefined) profileUpdates.phone = phone;
    if (address !== undefined) profileUpdates.address = address;

    const { data: updatedProfile, error: profErr } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', userId)
      .select('*')
      .single();

    if (profErr) {
      return NextResponse.json({ success: false, error: profErr.message }, { status: 500 });
    }

    // 2. Update Meal Preferences (if preferences supplied)
    let updatedPref = null;
    if (preferences) {
      const prefPayload = {
        user_id: userId,
        dietary_preferences: preferences.dietary_preferences,
        ingredients_to_avoid: preferences.ingredients_to_avoid,
        allergies: preferences.allergies,
        spice_preference: preferences.spice_preference || 'Medium',
        notes: preferences.notes,
        updated_at: new Date().toISOString(),
      };

      const { data: prefData } = await supabase
        .from('meal_preferences')
        .upsert(prefPayload, { onConflict: 'user_id' })
        .select('*')
        .single();

      updatedPref = prefData;
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      preference: updatedPref,
      message: '✓ Customer information updated successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
