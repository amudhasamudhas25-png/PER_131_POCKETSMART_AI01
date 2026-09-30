import React, { useState } from 'react';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { HomeInputItem, HomePlannerInput } from '../types/index.ts';
import { validateHomeInput } from '../utils/validation.ts';
import { LoadingState } from '../components/LoadingState.tsx';
import { formatINR } from '../services/api.ts';

interface HomePlannerPageProps {
  initialInput?: HomePlannerInput;
  isLoading: boolean;
  error: string | null;
  onSubmit: (input: HomePlannerInput) => void;
}

const ROOM_OPTIONS: HomePlannerInput['roomType'][] = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Dining Room',
  'Bathroom',
  'Office',
  'Multiple Rooms',
];

const STYLE_OPTIONS: HomePlannerInput['stylePreference'][] = [
  'Modern',
  'Minimalist',
  'Traditional',
  'Luxury',
  'Contemporary',
  'Scandinavian',
  'Industrial',
  'Budget Friendly',
];

const CATEGORY_OPTIONS = [
  'Furniture',
  'Lighting',
  'Electrical',
  'Decor',
  'Appliances',
  'Storage',
  'Flooring & Rugs',
];

const DEFAULT_SAMPLE_INPUT: HomePlannerInput = {
  totalBudget: 100000,
  roomType: 'Living Room',
  stylePreference: 'Modern',
  items: [
    { id: 'item-1', name: 'Sofa', quantity: 1, category: 'Furniture', preferredPrice: 40000 },
    { id: 'item-2', name: 'Fans', quantity: 2, category: 'Electrical', preferredPrice: 4500 },
    { id: 'item-3', name: 'Lights', quantity: 6, category: 'Lighting', preferredPrice: 1500 },
    { id: 'item-4', name: 'Coffee Table', quantity: 1, category: 'Furniture', preferredPrice: 12000 },
    { id: 'item-5', name: 'Curtains', quantity: 4, category: 'Decor', preferredPrice: 3000 },
  ],
  additionalRequirements: 'I want a modern living room with warm lighting.',
};

export const HomePlannerPage: React.FC<HomePlannerPageProps> = ({
  initialInput,
  isLoading,
  error,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<HomePlannerInput>(
    initialInput || DEFAULT_SAMPLE_INPUT
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleAddItem = () => {
    const newItem: HomeInputItem = {
      id: `item-${Date.now()}`,
      name: '',
      quantity: 1,
      category: 'Furniture',
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof HomeInputItem,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    }));
  };

  const handleRemoveItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }));
  };

  const handleLoadSample = () => {
    setFieldErrors({});
    setFormData(DEFAULT_SAMPLE_INPUT);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHomeInput(formData);
    setFieldErrors(validation.errors);
    if (!validation.valid) return;
    onSubmit(formData);
  };

  if (isLoading) {
    return <LoadingState plannerLabel="Home Interior Budget Planner" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-emerald-700">
            Module 01 · Interior Allocation Engine
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">
            Home Interior Budget Planner
          </h1>
          <p className="text-sm text-slate-600">
            Tell us what you need for your home and we'll create a budget-friendly plan.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          Reset to ₹1,00,000 Demo Preset
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
        onSubmit={handleFormSubmit}
        noValidate
        className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-8"
      >
        {/* Top Row: Budget, Room Type, Style Preference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label
              htmlFor="home-budget"
              className="block text-xs font-semibold text-slate-800"
            >
              Total Budget (INR ₹)
            </label>
            <input
              id="home-budget"
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
              placeholder="100000"
              aria-invalid={Boolean(fieldErrors.totalBudget)}
              className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
            />
            <p className="text-[11px] text-slate-500">
              Current cap: {formatINR(formData.totalBudget || 0)}
            </p>
            {fieldErrors.totalBudget && (
              <p className="text-xs text-red-600">{fieldErrors.totalBudget}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="home-room"
              className="block text-xs font-semibold text-slate-800"
            >
              Room Type
            </label>
            <select
              id="home-room"
              value={formData.roomType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  roomType: e.target.value as HomePlannerInput['roomType'],
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-900"
            >
              {ROOM_OPTIONS.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
            {fieldErrors.roomType && (
              <p className="text-xs text-red-600">{fieldErrors.roomType}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="home-style"
              className="block text-xs font-semibold text-slate-800"
            >
              Style Preference
            </label>
            <select
              id="home-style"
              value={formData.stylePreference}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stylePreference: e.target.value as HomePlannerInput['stylePreference'],
                }))
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-slate-900"
            >
              {STYLE_OPTIONS.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
            {fieldErrors.stylePreference && (
              <p className="text-xs text-red-600">{fieldErrors.stylePreference}</p>
            )}
          </div>
        </div>

        {/* Dynamic Items Section */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Required Home Items & Quantities
              </h2>
              <p className="text-xs text-slate-500">
                Add each item, unit quantity, category, and optional target unit price.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          {fieldErrors.items && (
            <p className="text-xs font-medium text-red-600">{fieldErrors.items}</p>
          )}

          <div className="space-y-3">
            {formData.items.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end p-3.5 rounded-lg bg-slate-50 border border-slate-200"
              >
                <div className="sm:col-span-4 space-y-1">
                  <label className="block text-[11px] font-medium text-slate-600">
                    Item Name #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                    placeholder="e.g., Sofa, Ceiling Fan, Lights"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[11px] font-medium text-slate-600">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))
                    }
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="sm:col-span-3 space-y-1">
                  <label className="block text-[11px] font-medium text-slate-600">
                    Preferred Category
                  </label>
                  <select
                    value={item.category}
                    onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-[11px] font-medium text-slate-600">
                    Preferred Unit ₹ (Opt)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={item.preferredPrice || ''}
                    onChange={(e) =>
                      handleUpdateItem(
                        item.id,
                        'preferredPrice',
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="Optional"
                    className="w-full px-3 py-2 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-md focus:outline-none focus:border-slate-900"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={formData.items.length <= 1}
                    aria-label={`Remove item ${item.name || idx + 1}`}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-white transition-colors disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="space-y-1.5 pt-4 border-t border-slate-200">
          <label
            htmlFor="home-notes"
            className="block text-xs font-semibold text-slate-800"
          >
            Additional Requirements
          </label>
          <textarea
            id="home-notes"
            rows={3}
            value={formData.additionalRequirements}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                additionalRequirements: e.target.value,
              }))
            }
            placeholder="I want a modern living room with warm lighting."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Plan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
