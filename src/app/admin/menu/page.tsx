'use client';

import React, { useState, useMemo } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { Product, Category } from '@/lib/types';
import { UtensilsCrossed, PlusCircle, Edit, Trash2, CheckCircle2, XCircle, Search, Image as ImageIcon } from 'lucide-react';

export default function AdminMenuPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct, isLoading } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Product Modal state
  const [showProdModal, setShowProdModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodIngr, setProdIngr] = useState('');
  const [prodCalories, setProdCalories] = useState(300);
  const [prodProtein, setProdProtein] = useState('15g');
  const [prodCarbs, setProdCarbs] = useState('30g');
  const [prodFats, setProdFats] = useState('10g');
  const [prodImage, setProdImage] = useState('');
  const [prodCustom, setProdCustom] = useState(true);
  const [prodActive, setProdActive] = useState(true);

  // Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.ingredients.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (selectedCatFilter === 'all') return true;
      return p.category_id === selectedCatFilter;
    });
  }, [products, searchQuery, selectedCatFilter]);

  const openAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory(categories[0]?.id || '');
    setProdDesc('');
    setProdIngr('');
    setProdCalories(300);
    setProdProtein('15g');
    setProdCarbs('30g');
    setProdFats('10g');
    setProdImage('/images/cold_pressed_juices.jpg');
    setProdCustom(true);
    setProdActive(true);
    setShowProdModal(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.category_id);
    setProdDesc(prod.description);
    setProdIngr(prod.ingredients);
    setProdCalories(prod.nutrition.calories || 300);
    setProdProtein(prod.nutrition.protein || '15g');
    setProdCarbs(prod.nutrition.carbs || '30g');
    setProdFats(prod.nutrition.fats || '10g');
    setProdImage(prod.image_url);
    setProdCustom(prod.customization_available);
    setProdActive(prod.active);
    setShowProdModal(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToastMsg(null);

    const payload = {
      productId: editingProduct?.id,
      name: prodName,
      categoryId: prodCategory,
      description: prodDesc,
      ingredients: prodIngr,
      nutrition: {
        calories: prodCalories,
        protein: prodProtein,
        carbs: prodCarbs,
        fats: prodFats,
      },
      imageUrl: prodImage,
      customizationAvailable: prodCustom,
      active: prodActive,
    };

    const res = editingProduct ? await updateProduct(payload) : await addProduct(payload);

    if (res.success) {
      setToastMsg({ type: 'success', text: res.message || '✓ Menu updated successfully.' });
      setShowProdModal(false);
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Failed to save product.' });
    }
    setIsSubmitting(false);
  };

  const handleSoftDeleteProduct = async (prodId: string) => {
    if (!confirm('Are you sure you want to deactivate this product? It will no longer appear on the customer menu, but historical delivery records will be preserved.')) {
      return;
    }

    setToastMsg(null);
    const res = await deleteProduct(prodId);
    if (res.success) {
      setToastMsg({ type: 'success', text: '✓ Product deactivated from customer menu.' });
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Failed to deactivate product.' });
    }
  };

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    setIsSubmitting(true);
    setToastMsg(null);

    const res = await addProduct({
      type: 'category',
      name: catName,
      description: catDesc,
      image_url: catImage || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    });

    if (res.success) {
      setToastMsg({ type: 'success', text: '✓ Category added.' });
      setShowCatModal(false);
      setCatName('');
      setCatDesc('');
    } else {
      setToastMsg({ type: 'error', text: res.error || 'Failed to add category.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            Customer Menu Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Menu Products & Categories
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCatModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Add Category</span>
          </button>
          <button
            onClick={openAddProduct}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Product</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {toastMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
            toastMsg.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/15 border-red-500/30 text-red-300'
          }`}
        >
          <span>{toastMsg.text}</span>
          <button onClick={() => setToastMsg(null)} className="text-xs text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* TABS */}
      <div className="flex border-b border-slate-800 gap-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-all ${
            activeTab === 'products'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 transition-all ${
            activeTab === 'categories'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="space-y-6">
          {/* SEARCH & CATEGORY FILTER */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by name, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
                />
              </div>
              <div className="md:col-span-4">
                <select
                  value={selectedCatFilter}
                  onChange={(e) => setSelectedCatFilter(e.target.value)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => {
              const catObj = categories.find((c) => c.id === prod.category_id);
              return (
                <div
                  key={prod.id}
                  className={`rounded-3xl bg-slate-900 border ${
                    prod.active ? 'border-slate-800' : 'border-red-500/30 opacity-60'
                  } shadow-xl overflow-hidden flex flex-col justify-between`}
                >
                  <div>
                    <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        {catObj?.name || 'Category'}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-extrabold text-white text-base font-heading">
                          {prod.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            prod.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {prod.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>

                      <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 space-y-1">
                        <div>
                          <span className="font-bold text-slate-400 uppercase text-[9px]">Ingredients: </span>
                          <span className="line-clamp-1">{prod.ingredients}</span>
                        </div>
                        <div className="flex gap-3 text-emerald-400 font-bold text-[10px] pt-0.5">
                          <span>{prod.nutrition.calories} kcal</span>
                          <span>P: {prod.nutrition.protein}</span>
                          <span>C: {prod.nutrition.carbs}</span>
                          <span>F: {prod.nutrition.fats}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => openEditProduct(prod)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit Dish</span>
                    </button>
                    {prod.active && (
                      <button
                        onClick={() => handleSoftDeleteProduct(prod.id)}
                        className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Deactivate</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* CATEGORIES TAB */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="h-36 rounded-2xl overflow-hidden relative bg-slate-800">
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 font-extrabold text-white font-heading text-lg">
                  {cat.name}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{cat.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* ADD/EDIT PRODUCT MODAL */}
      {showProdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl p-6 space-y-6 text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-extrabold font-heading text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Avocado Quinoa Power Bowl"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Category</label>
                <select
                  required
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief delicious description of the dish..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Ingredients</label>
                <input
                  type="text"
                  required
                  placeholder="Baby spinach, avocado, quinoa, lemon..."
                  value={prodIngr}
                  onChange={(e) => setProdIngr(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase text-[9px]">Calories</label>
                  <input
                    type="number"
                    value={prodCalories}
                    onChange={(e) => setProdCalories(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase text-[9px]">Protein</label>
                  <input
                    type="text"
                    value={prodProtein}
                    onChange={(e) => setProdProtein(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase text-[9px]">Carbs</label>
                  <input
                    type="text"
                    value={prodCarbs}
                    onChange={(e) => setProdCarbs(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 uppercase text-[9px]">Fats</label>
                  <input
                    type="text"
                    value={prodFats}
                    onChange={(e) => setProdFats(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Image URL</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodCustom}
                    onChange={(e) => setProdCustom(e.target.checked)}
                    className="rounded text-emerald-500 bg-slate-800 border-slate-700"
                  />
                  <span className="font-bold text-slate-300">Customization Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodActive}
                    onChange={(e) => setProdActive(e.target.checked)}
                    className="rounded text-emerald-500 bg-slate-800 border-slate-700"
                  />
                  <span className="font-bold text-slate-300">Active on Menu</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all"
              >
                {isSubmitting ? 'Saving Product...' : editingProduct ? 'Save Product Changes' : 'Add Product to Menu'}
              </button>
              <button
                type="button"
                onClick={() => setShowProdModal(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-white font-bold"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl rounded-3xl p-6 space-y-6 text-white">
            <h3 className="text-xl font-extrabold font-heading text-white">Add New Category</h3>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Detox Bowls"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 uppercase">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short summary of this category..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl transition-all"
              >
                {isSubmitting ? 'Saving Category...' : 'Save Category'}
              </button>
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="w-full py-2 text-xs text-slate-400 hover:text-white font-bold"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
