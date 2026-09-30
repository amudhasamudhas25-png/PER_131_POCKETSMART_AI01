import React from 'react';
import { Bookmark, Eye, RefreshCw, Trash2 } from 'lucide-react';
import { PlannerType, RecommendationItem } from '../types/index.ts';
import { formatINR } from '../services/api.ts';

interface RecommendationCardProps {
  item: RecommendationItem;
  plannerType: PlannerType;
  isSaved: boolean;
  isGeneratingAlt: boolean;
  onSave: (item: RecommendationItem) => void;
  onViewDetails: (item: RecommendationItem) => void;
  onFindAlternative: (item: RecommendationItem) => void;
  onRemove?: (itemId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  item,
  isSaved,
  isGeneratingAlt,
  onSave,
  onViewDetails,
  onFindAlternative,
  onRemove,
}) => {
  return (
    <article className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5 hover:border-slate-300 transition-colors">
      <div className="space-y-3">
        {/* Clean unboxed metadata header */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-slate-700">{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>{item.sourceLabel || 'AI Recommendation'}</span>
            {item.material && (
              <>
                <span aria-hidden="true">·</span>
                <span>{item.material}</span>
              </>
            )}
          </div>
          <span className="font-mono tabular-nums text-slate-600 shrink-0">
            Qty: {item.quantity}
          </span>
        </div>

        {/* Title & Price */}
        <div className="flex items-start justify-between gap-4">
          <h4 className="font-display text-lg font-semibold text-slate-900 leading-snug">
            {item.name}
          </h4>
          <div className="text-right shrink-0">
            <p className="font-mono text-lg font-semibold text-slate-900 tabular-nums">
              {formatINR(item.estimatedTotalPrice)}
            </p>
            {item.quantity > 1 && (
              <p className="font-mono text-xs text-slate-500 tabular-nums">
                {formatINR(item.estimatedUnitPrice)} / unit
              </p>
            )}
            {item.perPersonPrice && (
              <p className="font-mono text-xs text-emerald-700 tabular-nums">
                {formatINR(item.perPersonPrice)} / guest
              </p>
            )}
          </div>
        </div>

        {/* AI Recommendation Reason */}
        <p className="text-sm text-slate-600 leading-relaxed">{item.reason}</p>

        {/* Unboxed Attribute Rows */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-slate-800 shrink-0">Style Match:</span>
            <span>{item.styleMatch}</span>
          </div>
          {item.outfitCompatibility && (
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-800 shrink-0">
                Outfit Compatibility:
              </span>
              <span>{item.outfitCompatibility}</span>
            </div>
          )}
          {item.occasionSuitability && (
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-slate-800 shrink-0">Occasion:</span>
              <span>{item.occasionSuitability}</span>
            </div>
          )}
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-slate-800 shrink-0">Budget Status:</span>
            <span className="text-emerald-700 font-medium">
              Within Cap · {item.budgetImpact}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-slate-800 shrink-0">Alternative:</span>
            <span>{item.alternative}</span>
          </div>
          {item.platformHint && (
            <div className="text-[11px] text-slate-400 pt-0.5">{item.platformHint}</div>
          )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(item)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={() => onFindAlternative(item)}
            disabled={isGeneratingAlt}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAlt ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAlt ? 'Optimizing...' : 'Find Alternatives'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSave(item)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              isSaved
                ? 'bg-emerald-700 text-white'
                : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.name}`}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
