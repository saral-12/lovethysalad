import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// POST /api/admin/notifications — Send custom in-app notification to customer
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.userId || !body.title || !body.message) {
      return NextResponse.json({ success: false, error: 'User ID, title, and message are required.' }, { status: 400 });
    }

    const { userId, title, message, type = 'info' } = body;
    const supabase = getAdminClient();

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        read: false,
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, notification, message: '✓ Notification sent to customer.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
