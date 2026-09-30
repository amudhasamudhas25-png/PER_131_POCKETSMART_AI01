import React from 'react';
import { X, Bookmark, RefreshCw, ArrowLeft } from 'lucide-react';
import { RecommendationItem } from '../types/index.ts';
import { formatINR } from '../services/api.ts';

interface RecommendationDetailModalProps {
  item: RecommendationItem | null;
  isSaved: boolean;
  isGeneratingAlt: boolean;
  onClose: () => void;
  onSave: (item: RecommendationItem) => void;
  onGenerateAlternative: (item: RecommendationItem) => void;
}

export const RecommendationDetailModal: React.FC<RecommendationDetailModalProps> = ({
  item,
  isSaved,
  isGeneratingAlt,
  onClose,
  onSave,
  onGenerateAlternative,
}) => {
  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
    >
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{item.category}</span>
              <span aria-hidden="true">·</span>
              <span>{item.sourceLabel || 'AI Recommendation'}</span>
            </div>
            <h3
              id="detail-modal-title"
              className="font-display text-2xl font-semibold text-slate-900"
            >
              {item.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details dialog"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Numeric Cost Breakdown */}
        <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-200 text-sm">
          <div>
            <p className="text-xs text-slate-500">Estimated Unit Price</p>
            <p className="font-mono text-lg font-semibold text-slate-900 tabular-nums mt-0.5">
              {formatINR(item.estimatedUnitPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Quantity</p>
            <p className="font-mono text-lg font-semibold text-slate-900 tabular-nums mt-0.5">
              {item.quantity} {item.quantity === 1 ? 'Unit' : 'Units'}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Estimated Cost</p>
            <p className="font-mono text-lg font-semibold text-emerald-700 tabular-nums mt-0.5">
              {formatINR(item.estimatedTotalPrice)}
            </p>
          </div>
        </div>

        {/* Detailed Fields */}
        <div className="space-y-4 text-sm">
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-900">
              Why PocketSmart AI Recommends This
            </h4>
            <p className="text-slate-600 leading-relaxed">{item.reason}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-slate-900">Style Match</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.styleMatch}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-slate-900">Budget Impact</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.budgetImpact}</p>
            </div>
          </div>

          {item.outfitCompatibility && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-slate-900">
                Outfit & Occasion Compatibility
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.outfitCompatibility}
                {item.occasionSuitability ? ` · Suitable for ${item.occasionSuitability}` : ''}
              </p>
            </div>
          )}

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="text-xs font-semibold text-slate-900">
              Suggested Lower-Cost / Alternative Option
            </h4>
            <p className="text-xs text-slate-700">{item.alternative}</p>
          </div>

          {item.aiTips && item.aiTips.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-900">
                AI-Generated Buying & Negotiation Tips
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-4">
                {item.aiTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Recommendations</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onGenerateAlternative(item)}
              disabled={isGeneratingAlt}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAlt ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAlt ? 'Generating...' : 'Generate Alternative'}</span>
            </button>

            <button
              type="button"
              onClick={() => onSave(item)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap ${
                isSaved
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Saved to List' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
