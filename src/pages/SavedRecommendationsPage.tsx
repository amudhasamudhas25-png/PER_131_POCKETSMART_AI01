import React, { useState } from 'react';
import { Eye, Trash2, Bookmark } from 'lucide-react';
import {
  PageView,
  PlannerType,
  RecommendationItem,
  SavedRecommendation,
} from '../types/index.ts';
import { formatINR } from '../services/api.ts';

interface SavedRecommendationsPageProps {
  saved: SavedRecommendation[];
  onViewDetails: (item: RecommendationItem) => void;
  onRemoveSaved: (id: string) => void;
  onNavigate: (page: PageView) => void;
}

export const SavedRecommendationsPage: React.FC<SavedRecommendationsPageProps> = ({
  saved,
  onViewDetails,
  onRemoveSaved,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | PlannerType>('all');

  const filtered = saved.filter(
    (s) => filter === 'all' || s.plannerType === filter
  );

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-emerald-700">
            Bookmarked Shortlist
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">
            Saved Recommendations
          </h1>
          <p className="text-sm text-slate-600">
            Compare individual AI recommendations you have saved across Home, Party, and Jewelry plans.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          {(['all', 'home', 'party', 'jewelry'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer whitespace-nowrap ${
                filter === tab
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'all' ? 'All Saved' : tab}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <Bookmark className="w-6 h-6 text-slate-400 mx-auto" />
          <h3 className="font-display text-lg font-semibold text-slate-900">
            No saved recommendations in this category
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Generate a plan and click "Save" on any recommendation card to shortlist items for quick comparison.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700 capitalize">
                      {item.plannerType} Planner
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Saved{' '}
                      {new Date(item.dateSaved).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <span className="font-mono tabular-nums">Qty: {item.quantity}</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-lg font-semibold text-slate-900">
                    {item.name}
                  </h2>
                  <p className="font-mono text-lg font-semibold text-emerald-700 tabular-nums shrink-0">
                    {formatINR(item.estimatedTotalPrice)}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.reason}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onViewDetails({
                      id: item.id,
                      name: item.name,
                      category: item.category,
                      quantity: item.quantity,
                      estimatedUnitPrice: item.estimatedUnitPrice,
                      estimatedTotalPrice: item.estimatedTotalPrice,
                      reason: item.reason,
                      styleMatch: item.styleMatch,
                      budgetImpact: item.budgetImpact,
                      alternative: item.alternative,
                      sourceLabel: (item.sourceLabel as any) || 'AI Recommendation',
                      aiTips: item.aiTips,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveSaved(item.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
