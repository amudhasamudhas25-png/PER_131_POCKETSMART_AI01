import React, { useState } from 'react';
import { Eye, RotateCcw, Trash2, Search, Plus } from 'lucide-react';
import { GeneratedPlanResponse, PageView, PlannerType } from '../types/index.ts';
import { formatINR } from '../services/api.ts';

interface HistoryPageProps {
  history: GeneratedPlanResponse[];
  onViewPlan: (plan: GeneratedPlanResponse) => void;
  onReusePlan: (plan: GeneratedPlanResponse) => void;
  onDeletePlan: (id: string) => void;
  onNavigate: (page: PageView) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onViewPlan,
  onReusePlan,
  onDeletePlan,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | PlannerType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = history.filter((item) => {
    const matchesType = filter === 'all' || item.plannerType === filter;
    const matchesQuery =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-emerald-700">
            Persistent Plan Archive
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">
            Recommendation History
          </h1>
          <p className="text-sm text-slate-600">
            Inspect, reuse, or manage your generated Home, Party, and Jewelry budget plans.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('home-planner')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Budget Plan</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
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
              {tab === 'all' ? 'All Plans' : `${tab} Plans`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by title or summary..."
            aria-label="Search recommendation history"
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {/* History List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <h3 className="font-display text-lg font-semibold text-slate-900">
            No matching budget plans found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Create a new Home Interior, Party & Event, or Jewelry plan to populate your recommendation history.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('home-planner')}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg cursor-pointer"
          >
            Start Home Planner
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((plan) => {
            const formattedDate = new Date(plan.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
            return (
              <article
                key={plan.id}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800 capitalize">
                      {plan.plannerType} Plan
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {formatINR(plan.budget.total)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{formattedDate}</span>
                  </div>

                  <h2 className="font-display text-xl font-semibold text-slate-900">
                    {plan.title}
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {plan.summary}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                  <div className="flex items-center gap-5 text-xs font-mono tabular-nums">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Budget</span>
                      <span className="font-semibold text-slate-900">
                        {formatINR(plan.budget.total)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Spent</span>
                      <span className="font-semibold text-slate-800">
                        {formatINR(plan.budget.allocated)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Remaining</span>
                      <span className="font-semibold text-emerald-700">
                        {formatINR(plan.budget.remaining)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewPlan(plan)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onReusePlan(plan)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reuse</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeletePlan(plan.id)}
                      aria-label={`Delete ${plan.title}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
