import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PartyPlannerInput } from '../types/index.ts';
import { validatePartyInput } from '../utils/validation.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import { formatINR } from '../services/api.ts';

interface PartyPlannerPageProps {
  initialInput?: PartyPlannerInput;
  isLoading: boolean;
  error: string | null;
  onSubmit: (input: PartyPlannerInput) => void;
}

const EVENT_TYPES: PartyPlannerInput['eventType'][] = [
  'Birthday',
  'Wedding',
  'Engagement',
  'Anniversary',
  'Corporate Event',
  'Baby Shower',
  'College Event',
  'House Party',
  'Other',
];

const VENUE_OPTIONS: PartyPlannerInput['venue'][] = [
  'Home',
  'Hotel',
  'Restaurant',
  'Banquet Hall',
  'Outdoor',
  'Community Hall',
  'Other',
];

const FOOD_OPTIONS: PartyPlannerInput['foodPreference'][] = [
  'Vegetarian',
  'Non-Vegetarian',
  'Mixed',
];

const DECOR_OPTIONS: PartyPlannerInput['decorationStyle'][] = [
  'Simple',
  'Elegant',
  'Traditional',
  'Modern',
  'Luxury',
  'Theme Based',
];

const ENTERTAINMENT_OPTIONS = [
  'DJ',
  'Music',
  'Live Performance',
  'Games',
  'Photography',
  'Videography',
  'None',
];

const DEFAULT_PARTY_SAMPLE: PartyPlannerInput = {
  totalBudget: 75000,
  guestCount: 100,
  eventType: 'Birthday',
  venue: 'Banquet Hall',
  foodPreference: 'Mixed',
  decorationStyle: 'Elegant',
  entertainment: ['Music', 'Photography'],
  additionalRequirements:
    'Prioritize multi-course buffet catering, stage backdrop lighting, and family seating.',
};

export const PartyPlannerPage: React.FC<PartyPlannerPageProps> = ({
  initialInput,
  isLoading,
  error,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<PartyPlannerInput>(
    initialInput || DEFAULT_PARTY_SAMPLE
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const toggleEntertainment = (option: string) => {
    setFormData((prev) => {
      if (option === 'None') {
        return { ...prev, entertainment: ['None'] };
      }
      const withoutNone = prev.entertainment.filter((x) => x !== 'None');
      const exists = withoutNone.includes(option);
      const updated = exists
        ? withoutNone.filter((x) => x !== option)
        : [...withoutNone, option];
      return { ...prev, entertainment: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validatePartyInput(formData);
    setFieldErrors(validation.errors);
    if (!validation.valid) return;
    onSubmit(formData);
  };

  if (isLoading) {
    return <LoadingState plannerLabel="Party & Event Budget Planner" />;
  }

  const estPerGuest =
    formData.guestCount > 0
      ? Math.round((formData.totalBudget || 0) / formData.guestCount)
      : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-emerald-700">
            Module 02 · Event & Catering Allocation Engine
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">
            Party & Event Budget Planner
          </h1>
          <p className="text-sm text-slate-600">
            Allocate your event budget intelligently across venue, catering, decor, and entertainment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFieldErrors({});
            setFormData(DEFAULT_PARTY_SAMPLE);
          }}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          Reset to ₹75,000 (100 Pax) Demo
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label
              htmlFor="party-budget"
              className="block text-xs font-semibold text-slate-800"
            >
              Total Budget (INR ₹)
            </label>
            <input
              id="party-budget"
              type="number"
              min={1000}
              step={1000}
              value={formData.totalBudget || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  totalBudget: Number(e.target.value),
                }))
              }
              placeholder="50000"
              aria-invalid={Boolean(fieldErrors.totalBudget)}
              className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
            />
            {fieldErrors.totalBudget && (
              <p className="text-xs text-red-600">{fieldErrors.totalBudget}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="party-guests"
              className="block text-xs font-semibold text-slate-800"
            >
              Guest Count
            </label>
            <input
              id="party-guests"
              type="number"
              min={1}
              value={formData.guestCount || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  guestCount: Number(e.target.value),
                }))
              }
              placeholder="100"
              aria-invalid={Boolean(fieldErrors.guestCount)}
              className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
            />
            <p className="text-[11px] text-slate-500 font-mono tabular-nums">
              Max Cap / Guest: {formatINR(estPerGuest)}
            </p>
            {fieldErrors.guestCount && (
              <p className="text-xs text-red-600">{fieldErrors.guestCount}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="party-event"
              className="block text-xs font-semibold text-slate-800"
            >
              Event Type
            </label>
            <select
              id="party-event"
              value={formData.eventType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  eventType: e.target.value as PartyPlannerInput['eventType'],
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-900"
            >
              {EVENT_TYPES.map((ev) => (
                <option key={ev} value={ev}>
                  {ev}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label
              htmlFor="party-venue"
              className="block text-xs font-semibold text-slate-800"
            >
              Venue
            </label>
            <select
              id="party-venue"
              value={formData.venue}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  venue: e.target.value as PartyPlannerInput['venue'],
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-900"
            >
              {VENUE_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="party-food"
              className="block text-xs font-semibold text-slate-800"
            >
              Food Preference
            </label>
            <select
              id="party-food"
              value={formData.foodPreference}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  foodPreference: e.target.value as PartyPlannerInput['foodPreference'],
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-900"
            >
              {FOOD_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="party-decor"
              className="block text-xs font-semibold text-slate-800"
            >
              Decoration Style
            </label>
            <select
              id="party-decor"
              value={formData.decorationStyle}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  decorationStyle: e.target.value as PartyPlannerInput['decorationStyle'],
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-900"
            >
              {DECOR_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Entertainment Checkboxes */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <label className="block text-xs font-semibold text-slate-800">
            Entertainment & Media Services
          </label>
          <div className="flex flex-wrap gap-3">
            {ENTERTAINMENT_OPTIONS.map((opt) => {
              const checked = formData.entertainment.includes(opt);
              return (
                <label
                  key={opt}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                    checked
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleEntertainment(opt)}
                    className="sr-only"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="space-y-1.5 pt-4 border-t border-slate-200">
          <label
            htmlFor="party-notes"
            className="block text-xs font-semibold text-slate-800"
          >
            Additional Requirements
          </label>
          <textarea
            id="party-notes"
            rows={3}
            value={formData.additionalRequirements}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                additionalRequirements: e.target.value,
              }))
            }
            placeholder="Specify dietary needs, stage setup, return gifts, or timing preferences..."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Party Plan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
