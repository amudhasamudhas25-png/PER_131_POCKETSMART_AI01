import React, { useState } from 'react';
import {
  Download,
  Printer,
  RefreshCw,
  PlusCircle,
  History as HistoryIcon,
  BookmarkCheck,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import {
  GeneratedPlanResponse,
  PageView,
  PartyPlannerInput,
  RecommendationItem,
  SavedRecommendation,
} from '../types/index.ts';
import { BudgetVisualization } from './BudgetVisualization.tsx';
import { RecommendationCard } from './RecommendationCard.tsx';
import { formatINR } from '../services/api.ts';

interface PlanResultsViewProps {
  plan: GeneratedPlanResponse;
  savedItems: SavedRecommendation[];
  generatingAltId: string | null;
  isRegenerating: boolean;
  onSaveItem: (item: RecommendationItem) => void;
  onViewDetails: (item: RecommendationItem) => void;
  onFindAlternative: (item: RecommendationItem) => void;
  onRemoveItem: (itemId: string) => void;
  onRegeneratePlan: () => void;
  onSavePlan: () => void;
  onStartNewPlan: () => void;
  onNavigate: (page: PageView) => void;
}

export const PlanResultsView: React.FC<PlanResultsViewProps> = ({
  plan,
  savedItems,
  generatingAltId,
  isRegenerating,
  onSaveItem,
  onViewDetails,
  onFindAlternative,
  onRemoveItem,
  onRegeneratePlan,
  onSavePlan,
  onStartNewPlan,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [planSavedFeedback, setPlanSavedFeedback] = useState(false);

  const categoriesList = ['All', ...plan.categories.map((c) => c.category)];

  const filteredCategories =
    selectedCategory === 'All'
      ? plan.categories
      : plan.categories.filter((c) => c.category === selectedCategory);

  const handleDownloadSummary = () => {
    const lines: string[] = [
      '====================================================================',
      'POCKETSMART AI — YOUR SMART BUDGET & RECOMMENDATION ASSISTANT',
      '====================================================================',
      `Plan Title:        ${plan.title}`,
      `Planner Type:      ${plan.plannerType.toUpperCase()} PLANNER`,
      `Date Generated:    ${new Date(plan.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}`,
      `Budget Validation: ${plan.budgetStatusMessage}`,
      '',
      '--- BUDGET SUMMARY ---',
      `Total Budget:      ${formatINR(plan.budget.total)}`,
      `Estimated Spend:   ${formatINR(plan.budget.allocated)}`,
      `Remaining Reserve: ${formatINR(plan.budget.remaining)}`,
      `Utilization:       ${plan.budget.utilizationPercentage}%`,
    ];

    if (plan.budget.costPerGuest) {
      lines.push(`Cost Per Guest:    ${formatINR(plan.budget.costPerGuest)}`);
    }

    lines.push('', '--- USER INPUTS ---');
    lines.push(JSON.stringify(plan.userInputs, null, 2));

    lines.push('', '--- POCKETSMART AI INSIGHTS ---');
    lines.push(plan.aiInsights);

    lines.push('', '--- CATEGORY ALLOCATIONS & RECOMMENDATIONS ---');
    plan.categories.forEach((cat) => {
      lines.push(`\n[${cat.category.toUpperCase()}] — Allocated: ${formatINR(cat.allocatedAmount)}`);
      cat.recommendations.forEach((rec, idx) => {
        lines.push(
          `  ${idx + 1}. ${rec.name} (Qty: ${rec.quantity}) — Unit: ${formatINR(
            rec.estimatedUnitPrice
          )} | Total: ${formatINR(rec.estimatedTotalPrice)}`
        );
        lines.push(`     Source: ${rec.sourceLabel}`);
        lines.push(`     Reason: ${rec.reason}`);
        lines.push(`     Style Match: ${rec.styleMatch}`);
        lines.push(`     Alternative: ${rec.alternative}`);
      });
    });

    lines.push('', '--- MONEY SAVING TIPS ---');
    plan.tips.forEach((tip, i) => {
      lines.push(`${i + 1}. ${tip}`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PocketSmart-${plan.plannerType}-plan-${plan.budget.total}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSavePlanClick = () => {
    onSavePlan();
    setPlanSavedFeedback(true);
    setTimeout(() => setPlanSavedFeedback(false), 2500);
  };

  const partyInputs =
    plan.plannerType === 'party' ? (plan.userInputs as PartyPlannerInput) : null;

  return (
    <div className="space-y-8">
      {/* Top Banner: Your PocketSmart Plan is Ready! */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-emerald-700">
              Your PocketSmart Plan is Ready!
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {new Date(plan.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1
            className="font-display text-2xl md:text-3xl font-semibold text-slate-900"
            style={{ textWrap: 'balance' }}
          >
            {plan.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">{plan.summary}</p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 no-print">
          <button
            type="button"
            onClick={handleSavePlanClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>{planSavedFeedback ? 'Plan Saved!' : 'Save Plan'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSummary}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Summary</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={onRegeneratePlan}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
          </button>

          <button
            type="button"
            onClick={onStartNewPlan}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Generate New Plan</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('history')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>View History</span>
          </button>
        </div>
      </div>

      {/* Party Specific Event Summary Strip */}
      {partyInputs && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-500">Event Type: </span>
            <span className="font-semibold text-slate-900">{partyInputs.eventType}</span>
          </div>
          <div>
            <span className="text-slate-500">Guests: </span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {partyInputs.guestCount} Pax
            </span>
          </div>
          <div>
            <span className="text-slate-500">Venue: </span>
            <span className="font-semibold text-slate-900">{partyInputs.venue}</span>
          </div>
          <div>
            <span className="text-slate-500">Food Preference: </span>
            <span className="font-semibold text-slate-900">{partyInputs.foodPreference}</span>
          </div>
          <div>
            <span className="text-slate-500">Cost per Guest: </span>
            <span className="font-mono font-semibold text-emerald-700 tabular-nums">
              {formatINR(
                plan.budget.costPerGuest ||
                  Math.round(plan.budget.allocated / Math.max(1, partyInputs.guestCount))
              )}
            </span>
          </div>
        </div>
      )}

      {/* Jewelry Specific Multimodal Outfit Analysis Panel */}
      {plan.outfitAnalysis && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Gemini Outfit & Style Compatibility Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Extracted visual and stylistic attributes used to personalize your jewelry selection
              </p>
            </div>
            <span className="text-xs text-slate-500">
              {plan.outfitAnalysis.overallAesthetic}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-semibold text-slate-800">Dominant Colors & Palette</p>
              <p className="text-slate-600">
                {plan.outfitAnalysis.dominantColors?.join(' · ') || 'Warm traditional tones'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-slate-800">Neckline & Sleeve Framing</p>
              <p className="text-slate-600">
                {plan.outfitAnalysis.necklineDetails} · {plan.outfitAnalysis.sleeveDetails}
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-slate-800">Embroidery & Suitable Metals</p>
              <p className="text-slate-600">
                {plan.outfitAnalysis.embroideryDetails} · Best with{' '}
                {plan.outfitAnalysis.suitableJewelryColors?.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Core Budget Visualization (Summary + Donut + Category Bars) */}
      <BudgetVisualization plan={plan} />

      {/* PocketSmart AI Insights & Money-Saving Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>PocketSmart AI Insights</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{plan.aiInsights}</p>
          </div>
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono tabular-nums">
            Efficiency Ratio: {plan.budget.utilizationPercentage}% Allocated ·{' '}
            {100 - plan.budget.utilizationPercentage}% Contingency Reserve
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Money-Saving Tips for Your Plan</span>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            {plan.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-semibold text-slate-400 mt-0.5 tabular-nums">
                  0{idx + 1}.
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Category Filter Control + Recommendation Cards */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-900">
              Personalized AI Recommendations
            </h2>
            <p className="text-xs text-slate-500">
              All items are labeled as AI Recommendations with estimated prices calibrated to your budget.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto no-print">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredCategories.map((catGroup) => (
          <div key={catGroup.category} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-semibold text-slate-900">
                {catGroup.category}
              </h3>
              <span className="font-mono text-xs font-semibold text-slate-600 tabular-nums">
                Category Subtotal: {formatINR(catGroup.allocatedAmount)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {catGroup.recommendations.map((rec) => {
                const isSaved = savedItems.some(
                  (s) => s.id === rec.id || s.name === rec.name
                );
                return (
                  <RecommendationCard
                    key={rec.id}
                    item={rec}
                    plannerType={plan.plannerType}
                    isSaved={isSaved}
                    isGeneratingAlt={generatingAltId === rec.id}
                    onSave={onSaveItem}
                    onViewDetails={onViewDetails}
                    onFindAlternative={onFindAlternative}
                    onRemove={onRemoveItem}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
