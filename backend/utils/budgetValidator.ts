import {
  BudgetCategoryAllocation,
  GeneratedPlanResponse,
  PlannerType,
} from '../../src/types/index.ts';

export function validateAndOptimizePlan(
  rawPlan: Partial<GeneratedPlanResponse>,
  userBudget: number,
  plannerType: PlannerType,
  guestCount?: number
): GeneratedPlanResponse {
  const safeBudget = Math.max(1, Number(userBudget) || 1);
  const categories: BudgetCategoryAllocation[] = Array.isArray(rawPlan.categories)
    ? rawPlan.categories.map((cat, cIdx) => {
        const recs = Array.isArray(cat.recommendations)
          ? cat.recommendations.map((rec, rIdx) => {
              const qty = Math.max(1, Math.round(Number(rec.quantity) || 1));
              let unitPrice = Math.max(50, Math.round(Number(rec.estimatedUnitPrice) || 500));
              let totalPrice = Math.round(Number(rec.estimatedTotalPrice) || unitPrice * qty);

              // Keep unitPrice and totalPrice consistent
              if (Math.abs(unitPrice * qty - totalPrice) > qty * 10) {
                unitPrice = Math.max(50, Math.round(totalPrice / qty));
                totalPrice = unitPrice * qty;
              }

              return {
                id: rec.id || `rec-${plannerType}-${Date.now()}-${cIdx}-${rIdx}`,
                name: rec.name || 'Recommended Item',
                category: rec.category || cat.category || 'General',
                quantity: qty,
                estimatedUnitPrice: unitPrice,
                estimatedTotalPrice: totalPrice,
                reason:
                  rec.reason ||
                  'Selected to balance quality, style alignment, and overall budget efficiency.',
                styleMatch: rec.styleMatch || 'High alignment with selected aesthetic',
                budgetImpact: rec.budgetImpact || 'Moderate impact within category allocation',
                alternative:
                  rec.alternative || 'Standard modular alternative at 15-20% lower cost',
                alternativePrice:
                  rec.alternativePrice || Math.round(totalPrice * 0.8),
                material: rec.material,
                occasionSuitability: rec.occasionSuitability,
                outfitCompatibility: rec.outfitCompatibility,
                perPersonPrice:
                  rec.perPersonPrice ||
                  (guestCount && guestCount > 0
                    ? Math.round(totalPrice / guestCount)
                    : undefined),
                sourceLabel: rec.sourceLabel || 'AI Recommendation',
                platformHint: rec.platformHint,
                aiTips: Array.isArray(rec.aiTips) && rec.aiTips.length > 0
                  ? rec.aiTips
                  : [
                      'Compare local vendor quotes before finalizing purchase.',
                      'Opt for bundled delivery to reduce logistics overhead.',
                    ],
              };
            })
          : [];

        const catTotal = recs.reduce((sum, r) => sum + r.estimatedTotalPrice, 0);
        return {
          category: cat.category || 'Essential Allocation',
          allocatedAmount: catTotal,
          recommendations: recs,
        };
      })
    : [];

  let totalAllocated = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);
  let wasOptimized = Boolean(rawPlan.wasOptimized);
  const warnings = Array.isArray(rawPlan.warnings) ? [...rawPlan.warnings] : [];

  // Critical Budget Validation: If totalAllocated exceeds safeBudget, automatically optimize
  if (totalAllocated > safeBudget) {
    wasOptimized = true;
    // Target 92% of budget to leave a healthy reserve buffer
    const targetSpend = Math.floor(safeBudget * 0.92);
    const scaleFactor = targetSpend / totalAllocated;

    categories.forEach((cat) => {
      cat.recommendations.forEach((rec) => {
        const scaledUnit = Math.max(
          1,
          Math.floor((rec.estimatedUnitPrice * scaleFactor) / 10) * 10 ||
            Math.floor(rec.estimatedUnitPrice * scaleFactor)
        );
        rec.estimatedUnitPrice = Math.max(1, scaledUnit);
        rec.estimatedTotalPrice = rec.estimatedUnitPrice * rec.quantity;
        rec.alternativePrice = Math.max(1, Math.floor(rec.estimatedTotalPrice * 0.82));
        if (guestCount && guestCount > 0 && rec.perPersonPrice) {
          rec.perPersonPrice = Math.max(1, Math.round(rec.estimatedTotalPrice / guestCount));
        }
      });
      cat.allocatedAmount = cat.recommendations.reduce(
        (sum, r) => sum + r.estimatedTotalPrice,
        0
      );
    });

    totalAllocated = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);

    // Final hard clamp in case of rounding edge cases
    if (totalAllocated > safeBudget) {
      let excess = totalAllocated - safeBudget;
      for (let i = categories.length - 1; i >= 0 && excess > 0; i--) {
        for (let j = categories[i].recommendations.length - 1; j >= 0 && excess > 0; j--) {
          const item = categories[i].recommendations[j];
          const maxReduce = Math.max(0, item.estimatedTotalPrice - item.quantity);
          const reduceBy = Math.min(excess, maxReduce);
          item.estimatedTotalPrice -= reduceBy;
          item.estimatedUnitPrice = Math.max(
            1,
            Math.floor(item.estimatedTotalPrice / item.quantity)
          );
          item.estimatedTotalPrice = item.estimatedUnitPrice * item.quantity;
          excess =
            categories.reduce(
              (s, c) =>
                s + c.recommendations.reduce((rs, r) => rs + r.estimatedTotalPrice, 0),
              0
            ) - safeBudget;
        }
        categories[i].allocatedAmount = categories[i].recommendations.reduce(
          (s, r) => s + r.estimatedTotalPrice,
          0
        );
      }
      totalAllocated = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);
    }

    warnings.unshift(
      'Initial estimates exceeded your target cap. PocketSmart AI automatically rebalanced allocations and selected cost-effective tier options to stay strictly within your budget.'
    );
  }

  const remaining = Math.max(0, safeBudget - totalAllocated);
  const utilizationPercentage = Math.min(
    100,
    Math.round((totalAllocated / safeBudget) * 100)
  );

  const defaultInsights = `Your current plan uses ${utilizationPercentage}% (₹${totalAllocated.toLocaleString(
    'en-IN'
  )}) of your ₹${safeBudget.toLocaleString(
    'en-IN'
  )} budget, leaving ₹${remaining.toLocaleString(
    'en-IN'
  )} (${100 - utilizationPercentage}%) as an unallocated reserve for contingencies.`;

  return {
    id: rawPlan.id || `plan-${plannerType}-${Date.now()}`,
    plannerType,
    createdAt: rawPlan.createdAt || new Date().toISOString(),
    title: rawPlan.title || `${plannerType.toUpperCase()} Budget Plan`,
    summary:
      rawPlan.summary ||
      `Personalized ${plannerType} budget allocation tailored to your ₹${safeBudget.toLocaleString('en-IN')} cap.`,
    aiInsights: rawPlan.aiInsights || defaultInsights,
    budgetStatusMessage: wasOptimized
      ? 'We optimized your plan to stay within your budget.'
      : 'Your plan is within budget.',
    wasOptimized,
    isFallback: Boolean(rawPlan.isFallback),
    fallbackNotice: rawPlan.fallbackNotice,
    budget: {
      total: safeBudget,
      allocated: totalAllocated,
      remaining,
      utilizationPercentage,
      costPerGuest:
        guestCount && guestCount > 0
          ? Math.round(totalAllocated / guestCount)
          : undefined,
    },
    categories,
    tips:
      Array.isArray(rawPlan.tips) && rawPlan.tips.length > 0
        ? rawPlan.tips
        : [
            'Prioritize core functional items first before committing to decorative upgrades.',
            'Request bundled quotes from vendors when purchasing multiple units.',
            'Keep at least 8–12% of your budget in reserve for delivery or installation costs.',
          ],
    warnings,
    outfitAnalysis: rawPlan.outfitAnalysis,
    userInputs: rawPlan.userInputs as any,
  };
}
