import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { GeneratedPlanResponse } from '../types/index.ts';
import { formatINR } from '../services/api.ts';

interface BudgetVisualizationProps {
  plan: GeneratedPlanResponse;
}

const CHART_COLORS = [
  '#0F172A', // Slate 900
  '#047857', // Emerald 700
  '#B45309', // Amber 700
  '#0369A1', // Sky 700
  '#4338CA', // Indigo 700
  '#64748B', // Slate 500
];

export const BudgetVisualization: React.FC<BudgetVisualizationProps> = ({ plan }) => {
  const { budget, categories, budgetStatusMessage, wasOptimized, isFallback, fallbackNotice } = plan;

  // Build SVG donut chart segments
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const segments = categories.map((cat, index) => {
    const pct = budget.total > 0 ? Math.min(100, (cat.allocatedAmount / budget.total) * 100) : 0;
    const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += pct;
    return {
      category: cat.category,
      amount: cat.allocatedAmount,
      pct: Math.round(pct),
      color: CHART_COLORS[index % CHART_COLORS.length],
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="space-y-6">
      {/* Fallback Notice Banner (if Gemini unavailable) */}
      {isFallback && (
        <div
          role="status"
          className="flex items-start gap-3 p-4 rounded-xl border border-amber-300 bg-amber-50/80 text-amber-950 text-sm"
        >
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">
              {fallbackNotice || 'Gemini is currently unavailable. Showing fallback recommendations.'}
            </p>
            <p className="text-xs text-amber-800">
              Deterministic budget allocation rules were applied so your plan remains strictly within your {formatINR(budget.total)} cap.
            </p>
          </div>
        </div>
      )}

      {/* Budget Validation Status Banner */}
      <div
        role="status"
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border ${
          wasOptimized
            ? 'border-amber-200 bg-amber-50/60 text-slate-900'
            : 'border-emerald-200 bg-emerald-50/60 text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {wasOptimized ? (
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          )}
          <span className="text-sm font-semibold">{budgetStatusMessage}</span>
        </div>
        <div className="text-xs text-slate-600 font-mono tabular-nums">
          <span>Cap: {formatINR(budget.total)}</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>Allocated: {formatINR(budget.allocated)}</span>
          <span aria-hidden="true" className="mx-2">·</span>
          <span>Reserve: {formatINR(budget.remaining)}</span>
        </div>
      </div>

      {/* Top 4 Metric Summary Grid */}
      <div className="bg-white border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        <div className="p-5 space-y-1">
          <p className="text-xs font-medium text-slate-500">Total Budget</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {formatINR(budget.total)}
          </p>
          <p className="text-xs text-slate-500">Maximum user ceiling</p>
        </div>

        <div className="p-5 space-y-1">
          <p className="text-xs font-medium text-slate-500">Estimated Spending</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {formatINR(budget.allocated)}
          </p>
          <p className="text-xs text-slate-500">
            Across {categories.length} planned categories
          </p>
        </div>

        <div className="p-5 space-y-1">
          <p className="text-xs font-medium text-slate-500">Remaining Budget</p>
          <p className="font-mono text-2xl font-semibold text-emerald-700 tabular-nums">
            {formatINR(budget.remaining)}
          </p>
          <p className="text-xs text-slate-500">Unallocated contingency buffer</p>
        </div>

        <div className="p-5 space-y-1">
          <p className="text-xs font-medium text-slate-500">
            {budget.costPerGuest ? 'Utilization & Cost / Guest' : 'Budget Utilization'}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
              {budget.utilizationPercentage}%
            </p>
            {budget.costPerGuest && (
              <span className="font-mono text-xs text-slate-600 tabular-nums">
                · {formatINR(budget.costPerGuest)}/guest
              </span>
            )}
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-slate-900 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, budget.utilizationPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Donut Chart + Category Allocation Breakdown */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Donut Visual */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-6">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 140 140" role="img" aria-label={`Budget utilization donut chart showing ${budget.utilizationPercentage}% allocated`}>
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth="16"
              />
              {segments.map((seg) => (
                <circle
                  key={seg.category}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="16"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
                {budget.utilizationPercentage}%
              </span>
              <span className="text-[11px] text-slate-500">Allocated</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center">
            {100 - budget.utilizationPercentage}% ({formatINR(budget.remaining)}) held in reserve
          </p>
        </div>

        {/* Category Progress Rows */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Category Allocation Breakdown
            </h3>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              Total Cap: {formatINR(budget.total)}
            </span>
          </div>

          <div className="space-y-3">
            {segments.map((seg) => (
              <div key={seg.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="font-medium text-slate-800">{seg.category}</span>
                  </div>
                  <div className="font-mono tabular-nums text-slate-700">
                    <span>{formatINR(seg.amount)}</span>
                    <span aria-hidden="true" className="mx-1.5 text-slate-400">·</span>
                    <span className="text-slate-500">{seg.pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, seg.pct)}%`,
                      backgroundColor: seg.color,
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Unallocated Reserve Row */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 shrink-0" />
                  <span className="font-medium text-emerald-800">
                    Unallocated Reserve / Buffer
                  </span>
                </div>
                <div className="font-mono tabular-nums text-emerald-700">
                  <span>{formatINR(budget.remaining)}</span>
                  <span aria-hidden="true" className="mx-1.5 text-slate-400">·</span>
                  <span>{Math.max(0, 100 - budget.utilizationPercentage)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
