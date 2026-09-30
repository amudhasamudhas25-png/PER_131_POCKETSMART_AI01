import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { JewelryPlannerInput } from '../types/index.ts';
import { validateJewelryInput } from '../utils/validation.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import { ImageUploader } from '../components/ImageUploader.tsx';
import { formatINR } from '../services/api.ts';

interface JewelryPlannerPageProps {
  initialInput?: JewelryPlannerInput;
  isLoading: boolean;
  error: string | null;
  onSubmit: (input: JewelryPlannerInput) => void;
}

const OCCASION_OPTIONS: JewelryPlannerInput['occasion'][] = [
  'Wedding',
  'Engagement',
  'Birthday',
  'Party',
  'Festival',
  'Office',
  'Casual',
  'Traditional Event',
];

const JEWELRY_TYPES: JewelryPlannerInput['jewelryType'][] = [
  'Necklace',
  'Earrings',
  'Bracelet',
  'Ring',
  'Bangles',
  'Complete Set',
  'Any',
];

const STYLE_OPTIONS: JewelryPlannerInput['style'][] = [
  'Traditional',
  'Modern',
  'Minimal',
  'Elegant',
  'Bridal',
  'Statement',
  'Contemporary',
];

const METAL_OPTIONS: JewelryPlannerInput['metalPreference'][] = [
  'Gold',
  'Silver',
  'Diamond',
  'Pearl',
  'Artificial',
  'No Preference',
];

const DEFAULT_JEWELRY_SAMPLE: JewelryPlannerInput = {
  budget: 30000,
  occasion: 'Wedding',
  jewelryType: 'Complete Set',
  style: 'Traditional',
  metalPreference: 'Gold',
  outfitDescription: 'Red silk saree with gold border.',
};

export const JewelryPlannerPage: React.FC<JewelryPlannerPageProps> = ({
  initialInput,
  isLoading,
  error,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<JewelryPlannerInput>(
    initialInput || DEFAULT_JEWELRY_SAMPLE
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateJewelryInput(formData);
    setFieldErrors(validation.errors);
    if (!validation.valid) return;
    onSubmit(formData);
  };

  if (isLoading) {
    return <LoadingState plannerLabel="Jewelry Recommendation Planner" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-emerald-700">
            Module 03 · Multimodal Outfit & Jewelry Matcher
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">
            Jewelry Recommendation Planner
          </h1>
          <p className="text-sm text-slate-600">
            Get personalized jewelry recommendations matched to your budget, occasion, style, and optional outfit photo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFieldErrors({});
            setFormData(DEFAULT_JEWELRY_SAMPLE);
          }}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          Reset to ₹30,000 Wedding Demo
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
              htmlFor="jewelry-budget"
              className="block text-xs font-semibold text-slate-800"
            >
              Budget (INR ₹)
            </label>
            <input
              id="jewelry-budget"
              type="number"
              min={500}
              step={500}
              value={formData.budget || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  budget: Number(e.target.value),
                }))
              }
              placeholder="25000"
              aria-invalid={Boolean(fieldErrors.budget)}
              className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
            />
            <p className="text-[11px] text-slate-500">
              Current cap: {formatINR(formData.budget || 0)}
            </p>
            {fieldErrors.budget && (
              <p className="text-xs text-red-600">{fieldErrors.budget}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="jewelry-occasion"
              className="block text-xs font-semibold text-slate-800"
            >
              Occasion
            </label>
            <select
              id="jewelry-occasion"
              value={formData.occasion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  occasion: e.target.value as JewelryPlannerInput['occasion'],
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-900"
            >
              {OCCASION_OPTIONS.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="jewelry-type"
              className="block text-xs font-semibold text-slate-800"
            >
              Jewelry Type
            </label>
            <select
              id="jewelry-type"
              value={formData.jewelryType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  jewelryType: e.target.value as JewelryPlannerInput['jewelryType'],
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-900"
            >
              {JEWELRY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label
              htmlFor="jewelry-style"
              className="block text-xs font-semibold text-slate-800"
            >
              Style
            </label>
            <select
              id="jewelry-style"
              value={formData.style}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  style: e.target.value as JewelryPlannerInput['style'],
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-900"
            >
              {STYLE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="jewelry-metal"
              className="block text-xs font-semibold text-slate-800"
            >
              Metal Preference
            </label>
            <select
              id="jewelry-metal"
              value={formData.metalPreference}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  metalPreference: e.target.value as JewelryPlannerInput['metalPreference'],
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-900"
            >
              {METAL_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Outfit Description */}
        <div className="space-y-1.5 pt-4 border-t border-slate-200">
          <label
            htmlFor="jewelry-outfit"
            className="block text-xs font-semibold text-slate-800"
          >
            Outfit Description
          </label>
          <textarea
            id="jewelry-outfit"
            rows={3}
            value={formData.outfitDescription}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                outfitDescription: e.target.value,
              }))
            }
            placeholder="Red silk saree with gold border."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
          />
        </div>

        {/* Multimodal Outfit Image Uploader */}
        <div className="pt-4 border-t border-slate-200">
          <ImageUploader
            imageBase64={formData.imageBase64}
            onImageChange={(base64, mimeType) =>
              setFormData((prev) => ({
                ...prev,
                imageBase64: base64,
                imageMimeType: mimeType,
              }))
            }
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Jewelry Recommendations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
