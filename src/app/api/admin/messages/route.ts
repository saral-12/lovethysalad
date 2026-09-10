import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// GET /api/admin/messages — Fetch all contact messages
export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// PATCH /api/admin/messages — Toggle status (new / read)
export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || !body.messageId) {
      return NextResponse.json({ success: false, error: 'Message ID is required.' }, { status: 400 });
    }

    const { messageId, status = 'read' } = body;
    const supabase = getAdminClient();

    const { data: updatedMsg, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', messageId)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageItem: updatedMsg });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
