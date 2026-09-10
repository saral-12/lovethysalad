'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductModal } from '@/components/ProductModal';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/lib/types';
import { Search, Sparkles, Flame, Dumbbell, Filter, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams?.get('category') || 'All';
  const { categories, products } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products by category & search query
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ingredients.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedCategory === 'All') return matchesSearch;

      const catObj = categories.find((c) => c.name.toLowerCase() === selectedCategory.toLowerCase());
      if (!catObj) return matchesSearch;
      return item.category_id === catObj.id && matchesSearch;
    });
  }, [products, categories, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-salad-bg">
      <Navbar />

      <main className="flex-grow pt-24 pb-20">
        {/* HEADER */}
        <section className="py-12 gradient-hero-bg text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 shadow-soft-sm border border-salad-leaf/20 text-salad-dark text-xs font-semibold">
              <Utensils className="w-3.5 h-3.5 text-salad-leaf" />
              <span>Prepared Fresh Daily • Baner, Pune</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-salad-dark tracking-tight">
              Our Healthy Food Menu
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Nourishing organic salads, cold-pressed detox juices, warm soups, wraps, oats jars, and smoothies.
            </p>

            {/* SEARCH BAR */}
            <div className="pt-4 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search meals, ingredients (e.g. Avocado, Quinoa, Tofu)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-salad-leaf/20 shadow-soft-sm text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-salad-dark"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY TABS & PRODUCT GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar mb-8">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-salad-primary text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-salad-beige border border-gray-200'
              }`}
            >
              All Meals ({products.length})
            </button>

            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-salad-primary text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-salad-beige border border-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300 p-8 space-y-4">
              <span className="text-4xl">🥗</span>
              <h3 className="text-xl font-bold text-salad-dark font-heading">
                No matching meals found
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Try searching for a different ingredient or select another menu category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 rounded-full bg-salad-primary text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group cursor-pointer rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm hover:shadow-soft-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-salad-beige">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.customization_available && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-salad-dark shadow-sm border border-salad-leaf/20 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-salad-accent" /> Customizable
                        </span>
                      )}
                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-black/60 text-white backdrop-blur-sm">
                        Subscription Eligible
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-bold text-salad-dark font-heading group-hover:text-salad-primary transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Nutrition Badges */}
                      {product.nutrition && (
                        <div className="flex items-center gap-3 pt-2 text-[11px] font-bold text-gray-700">
                          <div className="flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span>{product.nutrition.calories} kcal</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{product.nutrition.protein} protein</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button className="w-full py-2.5 rounded-full bg-salad-beige group-hover:bg-salad-primary text-salad-dark group-hover:text-white font-bold text-xs transition-colors text-center border border-salad-leaf/10">
                      View Details & Ingredients
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Detail Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-salad-bg pt-32 text-center text-salad-dark">Loading Menu...</div>}>
      <MenuContent />
    </Suspense>
  );
}
