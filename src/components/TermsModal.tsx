'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, Check } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-salad-leaf/10 max-h-[85vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-6 bg-gradient-to-r from-salad-dark via-emerald-950 to-salad-dark text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-salad-fresh flex items-center justify-center text-salad-dark font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-white">
                  Terms & Conditions
                </h3>
                <span className="text-xs text-salad-light">Love Thy Salad • Baner, Pune</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-6 text-sm text-gray-700 leading-relaxed">
            <div className="p-4 rounded-2xl bg-salad-surface border border-salad-leaf/10 text-xs text-salad-dark font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-salad-fresh flex-shrink-0" />
              <span>Effective Date: September 2026 • Cloud Kitchen Baner, Pune</span>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-salad-dark text-base font-heading">
                1. Cloud Kitchen & Delivery Policy
              </h4>
              <p>
                Love Thy Salad is exclusively a healthy food cloud kitchen based in Baner, Pune (Owner: Smiti Olga Khattri). All meals are prepared in our hygienic facility and delivered directly to your designated address. <strong>There is no physical dine-in or customer visit facility.</strong>
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-salad-dark text-base font-heading">
                2. 20-Meal Subscription & Tracking Rules
              </h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
                <li>Each subscription contains a total balance of <strong>20 Meal Deliveries</strong>.</li>
                <li>The system tracks actual <strong>MEALS DELIVERED</strong>, not calendar days.</li>
                <li>Your remaining meal balance decrements by 1 ONLY when a meal is physically delivered to your doorstep.</li>
                <li>When your remaining meals reach 0, your subscription status changes to "Completed". You can renew anytime.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-salad-dark text-base font-heading">
                3. Meal Customization & Dietary Notes
              </h4>
              <p>
                Customers can specify ingredient preferences, ingredients to avoid, spice levels, and dietary notes inside their customer portal. While we make every effort to accommodate preferences, customers with severe medical allergies must specify their restrictions clearly.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-salad-dark text-base font-heading">
                4. Delivery Area & Hygiene Standards
              </h4>
              <p>
                Deliveries are restricted to Baner and immediate surrounding Pune areas. All meals are packaged in eco-friendly, tamper-evident containers for optimal safety and freshness.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-salad-dark text-base font-heading">
                5. Contact & Support
              </h4>
              <p>
                For questions regarding your meal plan, contact Founder Smiti Olga Khattri via email at <a href="mailto:smiti.olgakhattri@gmail.com" className="text-salad-primary font-bold hover:underline">smiti.olgakhattri@gmail.com</a>.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-6 bg-salad-surface border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              By accepting, you agree to the 20-meal subscription tracking rules.
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-all"
              >
                Close
              </button>
              {onAccept && (
                <button
                  onClick={() => {
                    onAccept();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-salad-primary hover:bg-salad-dark text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-salad-fresh" />
                  <span>Accept Terms</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
