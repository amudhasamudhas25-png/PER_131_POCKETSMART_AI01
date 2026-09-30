import React from 'react';
import { ArrowRight, Plus, Bookmark, Eye } from 'lucide-react';
import {
  GeneratedPlanResponse,
  PageView,
  SavedRecommendation,
  UserProfile,
} from '../types/index.ts';
import { formatINR } from '../services/api.ts';

interface DashboardPageProps {
  user: UserProfile | null;
  history: GeneratedPlanResponse[];
  saved: SavedRecommendation[];
  onNavigate: (page: PageView) => void;
  onOpenPlan: (plan: GeneratedPlanResponse) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  history,
  saved,
  onNavigate,
  onOpenPlan,
}) => {
  const homePlansCount = history.filter((h) => h.plannerType === 'home').length;
  const partyPlansCount = history.filter((h) => h.plannerType === 'party').length;
  const jewelryPlansCount = history.filter((h) => h.plannerType === 'jewelry').length;
  const totalPlannedBudget = history.reduce((sum, h) => sum + (h.budget?.total || 0), 0);
  const totalAllocatedSpend = history.reduce((sum, h) => sum + (h.budget?.allocated || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner + Quick Action Buttons */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-slate-500">
            PocketSmart AI Workspace
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">
            Welcome back, {user?.fullName || 'Aarav Sharma'}
          </h1>
          <p className="text-sm text-slate-600">
            Manage your Home, Party, and Jewelry budget plans or launch a new AI-assisted session.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('home-planner')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Home Plan</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('party-planner')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Plan a Party</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('jewelry-planner')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>Find Jewelry</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('history')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>View History</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Strip */}
      <div className="bg-white border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        <div className="p-5 space-y-1">
          <p className="text-xs text-slate-500">Total Plans Created</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {history.length}
          </p>
        </div>
        <div className="p-5 space-y-1">
          <p className="text-xs text-slate-500">Home Plans</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {homePlansCount}
          </p>
        </div>
        <div className="p-5 space-y-1">
          <p className="text-xs text-slate-500">Party Plans</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {partyPlansCount}
          </p>
        </div>
        <div className="p-5 space-y-1">
          <p className="text-xs text-slate-500">Jewelry Plans</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {jewelryPlansCount}
          </p>
        </div>
        <div className="p-5 space-y-1">
          <p className="text-xs text-slate-500">Total Planned Budget</p>
          <p className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
            {formatINR(totalPlannedBudget)}
          </p>
        </div>
        <div className="p-5 space-y-1">
          <p className="text-xs text-slate-500">Saved Recommendations</p>
          <p className="font-mono text-2xl font-semibold text-emerald-700 tabular-nums">
            {saved.length}
          </p>
        </div>
      </div>

      {/* 3 Core Planner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">Module 01</p>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Home Planner
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Budget-based home interior planning. Allocate spending across furniture, lighting, appliances, and soft furnishings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('home-planner')}
            className="inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <span>Open Home Interior Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">Module 02</p>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Party Planner
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Event budget planning. Calculate per-guest catering, venue booking, decor themes, and entertainment with a contingency reserve.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('party-planner')}
            className="inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <span>Open Party & Event Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5">
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500">Module 03</p>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Jewelry Planner
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jewelry recommendations matched to your budget, occasion, metal preference, and optional uploaded outfit image.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('jewelry-planner')}
            className="inline-flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <span>Open Jewelry Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Budgets & Plans Table + Saved Recommendations Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Recent Budget Plans & Activity
              </h3>
              <p className="text-xs text-slate-500">
                Total allocated {formatINR(totalAllocatedSpend)} across {formatINR(totalPlannedBudget)} planned budgets
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline cursor-pointer"
            >
              View All History
            </button>
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="text-sm font-medium text-slate-700">No budget plans generated yet</p>
              <p className="text-xs text-slate-500">
                Select Home, Party, or Jewelry Planner above to create your first AI budget plan.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                    <th className="py-3 px-4 font-semibold">Plan & Module</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold text-right">Budget Cap</th>
                    <th className="py-3 px-4 font-semibold text-right">Estimated Spend</th>
                    <th className="py-3 px-4 font-semibold text-right">Reserve</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {history.slice(0, 5).map((plan) => (
                    <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{plan.title}</p>
                        <p className="text-slate-500 capitalize">{plan.plannerType} Planner</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 tabular-nums whitespace-nowrap">
                        {new Date(plan.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right text-slate-900 tabular-nums whitespace-nowrap">
                        {formatINR(plan.budget.total)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right text-slate-700 tabular-nums whitespace-nowrap">
                        {formatINR(plan.budget.allocated)} ({plan.budget.utilizationPercentage}%)
                      </td>
                      <td className="py-3.5 px-4 font-mono text-right text-emerald-700 font-medium tabular-nums whitespace-nowrap">
                        {formatINR(plan.budget.remaining)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onOpenPlan(plan)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Open</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Saved Recommendations Column */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Saved Recommendations
                </h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('saved')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline cursor-pointer"
              >
                Manage All
              </button>
            </div>

            {saved.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No individual items bookmarked yet. Click "Save" on any recommendation card to pin it here.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {saved.slice(0, 4).map((item) => (
                  <div key={item.id} className="py-3 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-slate-900 leading-snug">
                        {item.name}
                      </p>
                      <span className="font-mono text-xs font-semibold text-slate-900 tabular-nums shrink-0">
                        {formatINR(item.estimatedTotalPrice)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 capitalize">
                      {item.plannerType} Planner · {item.category}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('saved')}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            View All Saved Items ({saved.length})
          </button>
        </div>
      </div>
    </div>
  );
};
