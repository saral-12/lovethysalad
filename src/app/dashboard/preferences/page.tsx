'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Toast } from '@/components/Toast';
import { Sliders, Save, CheckCircle2 } from 'lucide-react';

export default function MealPreferencesPage() {
  const { preferences, updatePreferences } = useAuth();

  const [dietary, setDietary] = useState(preferences?.dietary_preferences || '');
  const [avoid, setAvoid] = useState(preferences?.ingredients_to_avoid || '');
  const [allergies, setAllergies] = useState(preferences?.allergies || '');
  const [spice, setSpice] = useState(preferences?.spice_preference || 'Medium');
  const [notes, setNotes] = useState(preferences?.notes || '');

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (preferences) {
      setDietary(preferences.dietary_preferences || '');
      setAvoid(preferences.ingredients_to_avoid || '');
      setAllergies(preferences.allergies || '');
      setSpice(preferences.spice_preference || 'Medium');
      setNotes(preferences.notes || '');
    }
  }, [preferences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updatePreferences({
      dietary_preferences: dietary,
      ingredients_to_avoid: avoid,
      allergies,
      spice_preference: spice,
      notes,
    });
    setIsSaving(false);
    setToastMessage('Your meal preferences have been updated and saved to the database!');
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-salad-dark">
          My Meal Preferences
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Customize your meal ingredients, allergen restrictions, and spice preferences for kitchen prep.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white border border-salad-leaf/10 shadow-soft-sm max-w-3xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
              Dietary Preferences
            </label>
            <input
              type="text"
              placeholder="e.g. Vegetarian, High Protein, Low Sodium, Vegan"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
              Ingredients to Avoid
            </label>
            <input
              type="text"
              placeholder="e.g. Raw onions, Soy sauce, Mushrooms"
              value={avoid}
              onChange={(e) => setAvoid(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
              Allergies / Restrictions
            </label>
            <input
              type="text"
              placeholder="e.g. Peanuts, Gluten, Dairy, Shellfish"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
              Spice Preference
            </label>
            <select
              value={spice}
              onChange={(e) => setSpice(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary"
            >
              <option value="Mild">Mild (Non-spicy)</option>
              <option value="Medium">Medium (Balanced)</option>
              <option value="Spicy">Spicy (Zesty kick)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-salad-dark mb-1.5 uppercase">
              Additional Notes for Kitchen
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Please send dressing in a separate container, prefer deliveries around noon."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-salad-surface border border-gray-200 text-sm text-salad-dark focus:outline-none focus:ring-2 focus:ring-salad-primary resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 rounded-2xl bg-salad-primary hover:bg-salad-dark text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Preferences...' : 'Save Preferences'}</span>
          </button>
        </form>
      </div>

      <Toast
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
