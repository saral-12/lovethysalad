import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// GET /api/admin/products — Fetch products & categories
export async function GET() {
  try {
    const supabase = getAdminClient();
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    const { data: categories, error: catErr } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (prodErr || catErr) {
      return NextResponse.json({ success: false, error: prodErr?.message || catErr?.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, products, categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/products — Add new product or category
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Add Category
    if (body.type === 'category') {
      const { name, description, image_url, active = true } = body;
      if (!name) {
        return NextResponse.json({ success: false, error: 'Category name is required.' }, { status: 400 });
      }

      const { data: cat, error } = await supabase
        .from('categories')
        .insert({ name, description, image_url, active })
        .select('*')
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, category: cat, message: '✓ Category added successfully.' });
    }

    // 2. Add Product
    const {
      name,
      categoryId,
      description,
      ingredients,
      nutrition,
      imageUrl,
      customizationAvailable = true,
      active = true,
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ success: false, error: 'Product name and Category ID are required.' }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        category_id: categoryId,
        description,
        ingredients,
        nutrition: nutrition || { calories: 300, protein: '15g', carbs: '30g', fats: '10g' },
        image_url: imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        customization_available: customizationAvailable,
        active,
      })
      .select('*, category:categories(*)')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product, message: '✓ Product added to menu.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// PATCH /api/admin/products — Edit existing product or category
export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || (!body.productId && !body.categoryId)) {
      return NextResponse.json({ success: false, error: 'Product ID or Category ID is required.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // 1. Edit Category
    if (body.type === 'category' && body.categoryId) {
      const { categoryId, name, description, image_url, active } = body;
      const updatePayload: any = { updated_at: new Date().toISOString() };
      if (name !== undefined) updatePayload.name = name;
      if (description !== undefined) updatePayload.description = description;
      if (image_url !== undefined) updatePayload.image_url = image_url;
      if (active !== undefined) updatePayload.active = active;

      const { data: cat, error } = await supabase
        .from('categories')
        .update(updatePayload)
        .eq('id', categoryId)
        .select('*')
        .single();

      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, category: cat, message: '✓ Category updated.' });
    }

    // 2. Edit Product
    const {
      productId,
      name,
      categoryId,
      description,
      ingredients,
      nutrition,
      imageUrl,
      customizationAvailable,
      active,
    } = body;

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (name !== undefined) updatePayload.name = name;
    if (categoryId !== undefined) updatePayload.category_id = categoryId;
    if (description !== undefined) updatePayload.description = description;
    if (ingredients !== undefined) updatePayload.ingredients = ingredients;
    if (nutrition !== undefined) updatePayload.nutrition = nutrition;
    if (imageUrl !== undefined) updatePayload.image_url = imageUrl;
    if (customizationAvailable !== undefined) updatePayload.customization_available = customizationAvailable;
    if (active !== undefined) updatePayload.active = active;

    const { data: product, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', productId)
      .select('*, category:categories(*)')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product, message: '✓ Product updated.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}

// DELETE /api/admin/products — Soft delete product (set active = false)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID parameter is required.' }, { status: 400 });
    }

    const supabase = getAdminClient();

    // Perform soft deletion so historical delivery records retain original product ID
    const { data: product, error } = await supabase
      .from('products')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product, message: '✓ Product deactivated from menu.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
