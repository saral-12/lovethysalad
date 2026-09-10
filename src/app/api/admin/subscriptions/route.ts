import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// GET /api/admin/subscriptions — Fetch all subscriptions with customer profiles
export async function GET(req: Request) {
  try {
    const supabase = getAdminClient();
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*, user:profiles(*)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, subscriptions });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/subscriptions — Create a new subscription for a customer
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.userId) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    const { userId, totalMeals = 20, startDate, endDate, status = 'active' } = body;
    const supabase = getAdminClient();

    const { data: sub, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        total_meals: totalMeals,
        meals_delivered: 0,
        meals_remaining: totalMeals,
        status,
        start_date: startDate || new Date().toISOString().split('T')[0],
        end_date: endDate || null,
      })
      .select('*, user:profiles(*)')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, subscription: sub, message: 'Subscription created successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// PATCH /api/admin/subscriptions — Modify subscription (Pause, Resume, Cancel, Complete, Add Meals)
export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.subscriptionId) {
      return NextResponse.json({ success: false, error: 'Subscription ID is required.' }, { status: 400 });
    }

    const { subscriptionId, status, addMeals, totalMeals } = body;
    const supabase = getAdminClient();

    // 1. Fetch current subscription
    const { data: currentSub, error: fetchErr } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (fetchErr || !currentSub) {
      return NextResponse.json({ success: false, error: 'Subscription not found.' }, { status: 404 });
    }

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (status) updatePayload.status = status;

    if (addMeals && typeof addMeals === 'number') {
      const newTotal = currentSub.total_meals + addMeals;
      const newRemaining = currentSub.meals_remaining + addMeals;
      updatePayload.total_meals = newTotal;
      updatePayload.meals_remaining = newRemaining;
      if (newRemaining > 0 && currentSub.status === 'completed') {
        updatePayload.status = 'active';
      }
    } else if (totalMeals && typeof totalMeals === 'number') {
      updatePayload.total_meals = totalMeals;
      updatePayload.meals_remaining = Math.max(0, totalMeals - currentSub.meals_delivered);
    }

    const { data: updatedSub, error: updateErr } = await supabase
      .from('subscriptions')
      .update(updatePayload)
      .eq('id', subscriptionId)
      .select('*, user:profiles(*)')
      .single();

    if (updateErr) {
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      subscription: updatedSub,
      message: '✓ Subscription updated successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
