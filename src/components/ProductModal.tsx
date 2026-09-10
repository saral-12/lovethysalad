'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';
import { X, Sparkles, Check, Flame, Dumbbell, Wheat, Droplet } from 'lucide-react';
import Link from 'next/link';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-salad-leaf/10 max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-salad-dark shadow-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto custom-scrollbar">
            {/* Header Image */}
            <div className="relative h-64 sm:h-72 w-full bg-salad-beige">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                {product.customization_available && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 mb-2 rounded-full text-xs font-semibold bg-salad-fresh/90 text-white shadow-md">
                    <Sparkles className="w-3.5 h-3.5" /> Customizable Meal
                  </span>
                )}
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {product.name}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-base">
                {product.description}
              </p>

              {/* Nutrition Grid */}
              {product.nutrition && (
                <div className="bg-salad-surface rounded-2xl p-4 border border-salad-leaf/10">
                  <h4 className="text-xs font-bold text-salad-dark uppercase tracking-wider mb-3">
                    Nutritional Information (Per Serving)
                  </h4>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100">
                      <div className="flex justify-center mb-1 text-amber-500">
                        <Flame className="w-4 h-4" />
                      </div>
                      <span className="block text-lg font-bold text-salad-dark">
                        {product.nutrition.calories}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Calories</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100">
                      <div className="flex justify-center mb-1 text-emerald-600">
                        <Dumbbell className="w-4 h-4" />
                      </div>
                      <span className="block text-lg font-bold text-salad-dark">
                        {product.nutrition.protein}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Protein</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100">
                      <div className="flex justify-center mb-1 text-amber-600">
                        <Wheat className="w-4 h-4" />
                      </div>
                      <span className="block text-lg font-bold text-salad-dark">
                        {product.nutrition.carbs}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Carbs</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100">
                      <div className="flex justify-center mb-1 text-blue-500">
                        <Droplet className="w-4 h-4" />
                      </div>
                      <span className="block text-lg font-bold text-salad-dark">
                        {product.nutrition.fats}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Healthy Fats</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Ingredients */}
              <div>
                <h4 className="text-xs font-bold text-salad-dark uppercase tracking-wider mb-2">
                  Fresh Ingredients
                </h4>
                <p className="text-sm text-gray-600 bg-white p-4 rounded-xl border border-gray-200">
                  {product.ingredients}
                </p>
              </div>

              {/* Subscription Notice & CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Check className="w-4 h-4 text-salad-fresh flex-shrink-0" />
                  <span>Available in your 20-meal Love Thy Salad subscription.</span>
                </div>
                <Link
                  href="/plans"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-salad-primary hover:bg-salad-dark text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all text-center"
                >
                  Subscribe to Get This Meal
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
