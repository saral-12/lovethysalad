import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// GET /api/admin/deliveries — Fetch all deliveries with customer & product metadata
export async function GET(req: Request) {
  try {
    const supabase = getAdminClient();
    const { data: deliveries, error } = await supabase
      .from('deliveries')
      .select(`
        *,
        product:products(*),
        user:profiles(*)
      `)
      .order('delivery_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin deliveries:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deliveries });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/deliveries — Schedule a new delivery for a customer
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const { userId, subscriptionId, productId, deliveryDate, notes, status = 'scheduled' } = body;

    if (!userId || !subscriptionId) {
      return NextResponse.json({ success: false, error: 'User ID and Subscription ID are required.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Verify subscription is active and has meals remaining
    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (subError || !sub) {
      return NextResponse.json({ success: false, error: 'Active subscription not found for this customer.' }, { status: 404 });
    }

    if (sub.meals_remaining <= 0 || sub.status === 'completed') {
      return NextResponse.json({ success: false, error: 'Subscription completed. No meals remaining to schedule delivery.' }, { status: 400 });
    }

    // 2. Insert new delivery record
    const { data: delivery, error: insertError } = await supabase
      .from('deliveries')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        product_id: productId || null,
        delivery_date: deliveryDate || new Date().toISOString().split('T')[0],
        status,
        notes: notes || null,
      })
      .select(`*, product:products(*), user:profiles(*)`)
      .single();

    if (insertError) {
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, delivery, message: 'Delivery scheduled successfully.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// PATCH /api/admin/deliveries — Update delivery status (e.g. Mark as Delivered)
export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.deliveryId) {
      return NextResponse.json({ success: false, error: 'Delivery ID is required.' }, { status: 400 });
    }

    const { deliveryId, status, adminId, notes } = body;
    const supabase = getAdminClient();

    // 1. Fetch current delivery record
    const { data: currentDelivery, error: fetchErr } = await supabase
      .from('deliveries')
      .select('*, subscription:subscriptions(*)')
      .eq('id', deliveryId)
      .single();

    if (fetchErr || !currentDelivery) {
      return NextResponse.json({ success: false, error: 'Delivery record not found.' }, { status: 404 });
    }

    // 2. Double-delivery protection
    if (status === 'delivered' && currentDelivery.status === 'delivered') {
      return NextResponse.json({
        success: false,
        error: 'This delivery has already been completed. No duplicate meal was deducted.',
        alreadyDelivered: true,
      }, { status: 400 });
    }

    // 3. Zero-meals protection if transitioning to delivered
    if (status === 'delivered') {
      const sub = currentDelivery.subscription;
      if (!sub || sub.meals_remaining <= 0 || sub.status === 'completed') {
        return NextResponse.json({
          success: false,
          error: 'Subscription Completed — No Meals Remaining.',
          noMealsRemaining: true,
        }, { status: 400 });
      }
    }

    // 4. Update delivery status
    const updatePayload: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (notes !== undefined) updatePayload.notes = notes;

    if (status === 'delivered') {
      updatePayload.delivered_at = new Date().toISOString();
      if (adminId) updatePayload.delivered_by = adminId;
    }

    const { data: updatedDelivery, error: updateErr } = await supabase
      .from('deliveries')
      .update(updatePayload)
      .eq('id', deliveryId)
      .select('*, product:products(*), user:profiles(*)')
      .single();

    if (updateErr) {
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    // 5. Fetch refreshed subscription metrics (trigger automatically updated the table)
    const { data: refreshedSub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', currentDelivery.subscription_id)
      .single();

    return NextResponse.json({
      success: true,
      delivery: updatedDelivery,
      subscription: refreshedSub,
      message: status === 'delivered' ? '✓ Delivery marked as delivered. 1 meal deducted.' : `Delivery status updated to ${status}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
