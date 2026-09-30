import {
  GeneratedPlanResponse,
  HomePlannerInput,
  PartyPlannerInput,
  JewelryPlannerInput,
  BudgetCategoryAllocation,
} from '../../src/types/index.ts';
import { validateAndOptimizePlan } from '../utils/budgetValidator.ts';

export function generateFallbackHomePlan(
  input: HomePlannerInput
): GeneratedPlanResponse {
  const budget = Math.max(1000, Number(input.totalBudget) || 50000);
  const usableBudget = Math.floor(budget * 0.88); // Keep 12% reserve

  const requestedItems =
    input.items && input.items.length > 0
      ? input.items
      : [
          { id: '1', name: '3-Seater Sofa', quantity: 1, category: 'Furniture' },
          { id: '2', name: 'Ceiling Fan', quantity: 2, category: 'Electrical' },
          { id: '3', name: 'Warm LED Panel Lights', quantity: 4, category: 'Lighting' },
          { id: '4', name: 'Coffee Table', quantity: 1, category: 'Furniture' },
          { id: '5', name: 'Blackout Curtains', quantity: 4, category: 'Decor' },
        ];

  // Assign weights based on category
  const weights = requestedItems.map((item) => {
    const cat = (item.category || '').toLowerCase();
    const name = item.name.toLowerCase();
    if (name.includes('sofa') || name.includes('bed') || name.includes('wardrobe') || cat.includes('furniture')) {
      return 4.0;
    }
    if (name.includes('table') || name.includes('desk') || name.includes('chair')) {
      return 2.2;
    }
    if (cat.includes('appliance') || name.includes('fan') || name.includes('ac')) {
      return 1.8;
    }
    return 1.0;
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;
  const groupedMap = new Map<string, BudgetCategoryAllocation>();

  requestedItems.forEach((item, idx) => {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const share = Math.floor((usableBudget * weights[idx]) / totalWeight);
    const unitPrice = Math.max(100, Math.floor(share / qty));
    const totalPrice = unitPrice * qty;
    const catName = item.category || 'Furniture & Essentials';

    if (!groupedMap.has(catName)) {
      groupedMap.set(catName, {
        category: catName,
        allocatedAmount: 0,
        recommendations: [],
      });
    }

    const group = groupedMap.get(catName)!;
    group.recommendations.push({
      id: `fb-home-${idx}-${Date.now()}`,
      name: `${input.stylePreference} ${item.name}`,
      category: catName,
      quantity: qty,
      estimatedUnitPrice: unitPrice,
      estimatedTotalPrice: totalPrice,
      reason: `Allocated proportionally for your ${input.roomType} to match a ${input.stylePreference} aesthetic while maintaining a 12% contingency reserve.`,
      styleMatch: `Matches ${input.stylePreference} palette and clean spatial proportions for ${input.roomType}`,
      budgetImpact:
        weights[idx] >= 3
          ? 'High — Primary anchor investment for the room'
          : 'Moderate — Balanced unit allocation',
      alternative: `Standard modular ${item.name} option at ~₹${Math.floor(totalPrice * 0.8).toLocaleString('en-IN')}`,
      alternativePrice: Math.floor(totalPrice * 0.8),
      sourceLabel: 'Sample Recommendation',
      platformHint: 'AI Estimated Recommendation (IKEA / Pepperfry / Local Studio tier)',
      aiTips: [
        `Compare engineered wood or powder-coated metal finishes for ${item.name} to save 15%.`,
        'Check seasonal clearance bundles when ordering multiple units.',
      ],
    });
    group.allocatedAmount += totalPrice;
  });

  const rawPlan: Partial<GeneratedPlanResponse> = {
    title: `${input.stylePreference} ${input.roomType} Budget Plan`,
    summary: `Rule-based allocation across ${groupedMap.size} categories for your ${input.roomType}, prioritizing your ${requestedItems.length} requested item groups with a built-in contingency reserve.`,
    isFallback: true,
    fallbackNotice: 'Gemini is currently unavailable. Showing fallback recommendations.',
    categories: Array.from(groupedMap.values()),
    tips: [
      `Allocate at least 10–12% of your ₹${budget.toLocaleString('en-IN')} budget for delivery, hardware, and installation.`,
      'Choose multi-purpose furniture with concealed storage to maximize utility.',
      'Purchase lighting fixtures in multi-packs to reduce per-unit cost by up to 20%.',
      'Combine soft furnishings (curtains, cushions) from wholesale textile markets.',
    ],
    warnings: [],
    userInputs: input,
  };

  return validateAndOptimizePlan(rawPlan, budget, 'home');
}

export function generateFallbackPartyPlan(
  input: PartyPlannerInput
): GeneratedPlanResponse {
  const budget = Math.max(2000, Number(input.totalBudget) || 50000);
  const guests = Math.max(1, Number(input.guestCount) || 50);

  const venueShare = input.venue === 'Home' ? 0.08 : 0.24;
  const foodShare = 0.42;
  const decorShare = 0.14;
  const entShare = input.entertainment.length > 0 && !input.entertainment.includes('None') ? 0.12 : 0.04;

  const venueCost = Math.floor(budget * venueShare);
  const foodTotal = Math.floor(budget * foodShare);
  const perPersonFood = Math.max(50, Math.floor(foodTotal / guests));
  const adjustedFoodTotal = perPersonFood * guests;
  const decorCost = Math.floor(budget * decorShare);
  const entCost = Math.floor(budget * entShare);

  const categories: BudgetCategoryAllocation[] = [
    {
      category: 'Catering',
      allocatedAmount: adjustedFoodTotal,
      recommendations: [
        {
          id: `fb-party-catering-${Date.now()}`,
          name: `${input.foodPreference} Multi-Course Event Buffet (${guests} Guests)`,
          category: 'Catering',
          quantity: guests,
          estimatedUnitPrice: perPersonFood,
          estimatedTotalPrice: adjustedFoodTotal,
          perPersonPrice: perPersonFood,
          reason: `Prioritizes guest hospitality with a complete ${input.foodPreference.toLowerCase()} spread calibrated at ₹${perPersonFood} per guest.`,
          styleMatch: `Tailored for ${input.eventType} service flow`,
          budgetImpact: 'High — Core hospitality allocation (approx. 42% of total budget)',
          alternative: `Curated live food stations / bulk catering trays via Swiggy/Zomato partners at ₹${Math.floor(perPersonFood * 0.82)}/guest`,
          alternativePrice: Math.floor(adjustedFoodTotal * 0.82),
          sourceLabel: 'Sample Recommendation',
          platformHint: 'AI Estimated Recommendation (Local Caterer / Swiggy / Zomato Bulk tier)',
          aiTips: [
            'Confirm exact headcount 48 hours prior to avoid paying for unutilized plates.',
            'Choose seasonal regional specialties to elevate taste while controlling per-plate cost.',
          ],
        },
      ],
    },
    {
      category: 'Venue',
      allocatedAmount: venueCost,
      recommendations: [
        {
          id: `fb-party-venue-${Date.now()}`,
          name:
            input.venue === 'Home'
              ? 'Home Venue Seating, Canopy & Utility Setup'
              : `${input.venue} Booking & Basic Hall Arrangement`,
          category: 'Venue',
          quantity: 1,
          estimatedUnitPrice: venueCost,
          estimatedTotalPrice: venueCost,
          reason: `Secures comfortable space and seating logistics for ${guests} attendees at a ${input.venue.toLowerCase()}.`,
          styleMatch: `Fits ${input.eventType} capacity requirements`,
          budgetImpact: 'Moderate — Essential spatial allocation',
          alternative: `Off-peak morning/afternoon slot or community hall booking at ₹${Math.floor(venueCost * 0.78).toLocaleString('en-IN')}`,
          alternativePrice: Math.floor(venueCost * 0.78),
          sourceLabel: 'Sample Recommendation',
          platformHint: 'AI Estimated Recommendation (OYO Banquets / Local Venue tier)',
        },
      ],
    },
    {
      category: 'Decoration',
      allocatedAmount: decorCost,
      recommendations: [
        {
          id: `fb-party-decor-${Date.now()}`,
          name: `${input.decorationStyle} Backdrop, Entrance Arch & Warm Ambient Lighting`,
          category: 'Decoration',
          quantity: 1,
          estimatedUnitPrice: decorCost,
          estimatedTotalPrice: decorCost,
          reason: `Creates a memorable focal stage and photo zone matching your ${input.decorationStyle} theme.`,
          styleMatch: `${input.decorationStyle} visual aesthetic`,
          budgetImpact: 'Low to Moderate — Targeted visual impact',
          alternative: `Fresh marigold/seasonal floral drapes with warm fairy lights at ₹${Math.floor(decorCost * 0.75).toLocaleString('en-IN')}`,
          alternativePrice: Math.floor(decorCost * 0.75),
          sourceLabel: 'Sample Recommendation',
        },
      ],
    },
    {
      category: 'Entertainment & Additional Services',
      allocatedAmount: entCost,
      recommendations: [
        {
          id: `fb-party-ent-${Date.now()}`,
          name:
            input.entertainment.length > 0
              ? `${input.entertainment.join(' + ')} Package`
              : 'PA Sound System & Curated Event Playlist Setup',
          category: 'Entertainment',
          quantity: 1,
          estimatedUnitPrice: entCost,
          estimatedTotalPrice: entCost,
          reason: `Covers ${
            input.entertainment.length > 0 ? input.entertainment.join(', ') : 'essential audio'
          } without straining catering or venue budgets.`,
          styleMatch: `Suited for ${input.eventType} atmosphere`,
          budgetImpact: 'Low — Controlled allocation leaving emergency reserve',
          alternative: `Portable high-output speaker rental + candid photography session at ₹${Math.floor(entCost * 0.8).toLocaleString('en-IN')}`,
          alternativePrice: Math.floor(entCost * 0.8),
          sourceLabel: 'Sample Recommendation',
        },
      ],
    },
  ];

  const rawPlan: Partial<GeneratedPlanResponse> = {
    title: `${input.eventType} Plan for ${guests} Guests`,
    summary: `Balanced event budget across Catering, ${input.venue}, ${input.decorationStyle} Decoration, and Entertainment while preserving an emergency reserve.`,
    isFallback: true,
    fallbackNotice: 'Gemini is currently unavailable. Showing fallback recommendations.',
    categories,
    tips: [
      'Bundle venue and catering with the same provider to negotiate a 10–15% package discount.',
      'Concentrate floral and lighting decor around the main stage/photo backdrop for maximum visual impact.',
      'Keep 8–10% of your total budget unallocated for last-minute guest additions or transport.',
    ],
    warnings: [],
    userInputs: input,
  };

  return validateAndOptimizePlan(rawPlan, budget, 'party', guests);
}

export function generateFallbackJewelryPlan(
  input: JewelryPlannerInput
): GeneratedPlanResponse {
  const budget = Math.max(500, Number(input.budget) || 25000);
  const primaryShare = Math.floor(budget * 0.58);
  const secondaryShare = Math.floor(budget * 0.3);

  const metalLabel =
    input.metalPreference === 'No Preference' ? 'Gold-Toned' : input.metalPreference;

  const categories: BudgetCategoryAllocation[] = [
    {
      category: `Primary ${input.jewelryType === 'Any' ? 'Necklace' : input.jewelryType}`,
      allocatedAmount: primaryShare,
      recommendations: [
        {
          id: `fb-jewel-1-${Date.now()}`,
          name: `${metalLabel} ${input.style} ${
            input.jewelryType === 'Any' ? 'Statement Necklace' : input.jewelryType
          }`,
          category: input.jewelryType === 'Any' ? 'Necklace' : input.jewelryType,
          quantity: 1,
          estimatedUnitPrice: primaryShare,
          estimatedTotalPrice: primaryShare,
          material: `${metalLabel} with artisan finish`,
          occasionSuitability: `${input.occasion}`,
          outfitCompatibility: input.outfitDescription
            ? `Complements "${input.outfitDescription}" with balanced proportions`
            : `Versatile silhouette tailored for ${input.occasion} attire`,
          reason: `Acts as the centerpiece for your ${input.occasion} look while staying comfortably under your ₹${budget.toLocaleString('en-IN')} budget.`,
          styleMatch: `${input.style} craftsmanship`,
          budgetImpact: 'Moderate — 58% of budget allocated to centerpiece',
          alternative: `Lightweight ${metalLabel} layered piece at ₹${Math.floor(primaryShare * 0.78).toLocaleString('en-IN')}`,
          alternativePrice: Math.floor(primaryShare * 0.78),
          sourceLabel: 'Sample Recommendation',
          platformHint: 'AI Estimated Recommendation',
        },
      ],
    },
    {
      category: 'Complementary Accents',
      allocatedAmount: secondaryShare,
      recommendations: [
        {
          id: `fb-jewel-2-${Date.now()}`,
          name: `Matching ${metalLabel} ${input.style} Drop Earrings & Bangle Accent`,
          category: 'Earrings & Accents',
          quantity: 1,
          estimatedUnitPrice: secondaryShare,
          estimatedTotalPrice: secondaryShare,
          material: `${metalLabel}`,
          occasionSuitability: `${input.occasion}`,
          outfitCompatibility: 'Frames the neckline and sleeves harmoniously without overcrowding',
          reason: `Completes the ensemble alongside your primary ${input.jewelryType.toLowerCase()} while leaving a 12% buffer.`,
          styleMatch: `${input.style} coordination`,
          budgetImpact: 'Low — 30% of budget allocated to coordinating pieces',
          alternative: `Minimal stud earrings at ₹${Math.floor(secondaryShare * 0.75).toLocaleString('en-IN')}`,
          alternativePrice: Math.floor(secondaryShare * 0.75),
          sourceLabel: 'Sample Recommendation',
          platformHint: 'AI Estimated Recommendation',
        },
      ],
    },
  ];

  const rawPlan: Partial<GeneratedPlanResponse> = {
    title: `${input.style} ${metalLabel} Jewelry Plan for ${input.occasion}`,
    summary: `Curated ${input.style.toLowerCase()} jewelry selection in ${metalLabel.toLowerCase()} tailored for ${input.occasion} within ₹${budget.toLocaleString('en-IN')}.`,
    isFallback: true,
    fallbackNotice: 'Gemini is currently unavailable. Showing fallback recommendations.',
    categories,
    outfitAnalysis: {
      dominantColors: ['Warm Gold', 'Crimson / Jewel Tones', 'Neutral Ivory'],
      outfitStyle: input.outfitDescription || `${input.style} ${input.occasion} Attire`,
      appearanceType: input.style,
      necklineDetails: 'Balanced neckline framing recommended',
      sleeveDetails: 'Coordinated wrist/bangle clearance',
      embroideryDetails: 'Harmonizes with woven borders or surface texture',
      overallAesthetic: `${input.style} ${input.occasion} Elegance`,
      suitableJewelryColors: [metalLabel, 'Warm Antique Gold', 'Pearl White'],
      suitableJewelryStyles: [input.style, 'Minimal Choker', 'Classic Drop Earrings'],
    },
    tips: [
      'Verify hallmark certification and making-charge breakdowns when buying precious metals.',
      'Choose versatile detachable pendants or earrings that can be styled across multiple occasions.',
      'Keep 10% of your budget reserved for polishing, sizing adjustments, or taxes.',
    ],
    warnings: [],
    userInputs: input,
  };

  return validateAndOptimizePlan(rawPlan, budget, 'jewelry');
}
