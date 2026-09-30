import { Type, Schema } from '@google/genai';
import {
  HomePlannerInput,
  PartyPlannerInput,
  JewelryPlannerInput,
} from '../../src/types/index.ts';

export const HOME_SYSTEM_INSTRUCTION = `You are PocketSmart AI's Home Interior Budget Assistant. Analyze the user's home requirements and create practical, budget-conscious recommendations. Never exceed the provided budget.
Rules:
1. Total allocated amount across all categories (including a Reserve category) MUST be less than or equal to the user's totalBudget.
2. Balance functionality, style preference, item quantities, and budget constraints.
3. If the budget is tight, prioritize essential requested items and practical materials. If the budget is generous, offer higher-grade finishes while keeping a 10-15% reserve.
4. Never fabricate real-time product URLs, product IDs, star ratings, or claim live retail availability. All items are AI Estimated Recommendations.
5. For every recommendation provide a concrete lower-cost or comparable alternative option and 2 practical buying tips.`;

export const PARTY_SYSTEM_INSTRUCTION = `You are PocketSmart AI's Event Budget Assistant. Create a practical event plan based on guest count, event type, venue and budget. Allocate spending intelligently and never exceed the budget.
Rules:
1. Total allocated amount across Venue, Food/Catering, Decoration, Entertainment, Additional Services, and Emergency Reserve MUST never exceed the user's totalBudget.
2. Prioritize essential food/catering (calculating realistic per-guest pricing for the guestCount) and venue costs before optional entertainment.
3. Reference appropriate service types (e.g., local catering or bulk food delivery platforms like Swiggy/Zomato for casual events, or hospitality options like OYO/banquet halls for venues) strictly as general category suggestions without claiming live availability or fake listings.
4. Provide 3-5 practical money-saving tips tailored to the event type and guest count.`;

export const JEWELRY_SYSTEM_INSTRUCTION = `You are PocketSmart AI's Jewelry Recommendation Assistant. Recommend jewelry based on budget, occasion, style and outfit information. If an image is provided, analyze only visible characteristics and use them to personalize recommendations.
Rules:
1. Total estimated cost of recommended jewelry items MUST never exceed the user's budget.
2. If an outfit image is attached, inspect only visible traits: dominant colors, fabric/outfit style, traditional vs modern appearance, neckline/sleeve details if visible, and embroidery/border work. Do not claim certainty about details that are not visible.
3. Never fabricate real marketplace URLs, SKU numbers, or live inventory claims.
4. For each piece, explain why it complements the outfit and occasion, its budget impact, and a practical alternative.`;

export const PLAN_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'Concise descriptive title for the generated budget plan.',
    },
    summary: {
      type: Type.STRING,
      description: 'Executive summary of the budget allocation and strategy.',
    },
    aiInsights: {
      type: Type.STRING,
      description: 'Quantitative insight on budget utilization, reserve buffer, and cost efficiency.',
    },
    categories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: 'Category name (e.g. Lighting, Furniture, Catering, Venue, Necklace, Reserve).',
          },
          allocatedAmount: {
            type: Type.NUMBER,
            description: 'Amount in INR allocated to this category.',
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                quantity: { type: Type.INTEGER },
                estimatedUnitPrice: { type: Type.NUMBER },
                estimatedTotalPrice: { type: Type.NUMBER },
                reason: { type: Type.STRING },
                styleMatch: { type: Type.STRING },
                budgetImpact: {
                  type: Type.STRING,
                  description: 'Low, Moderate, or High impact with brief explanation.',
                },
                alternative: {
                  type: Type.STRING,
                  description: 'Specific lower-cost or alternative option with estimated price.',
                },
                alternativePrice: { type: Type.NUMBER },
                material: { type: Type.STRING },
                occasionSuitability: { type: Type.STRING },
                outfitCompatibility: { type: Type.STRING },
                perPersonPrice: { type: Type.NUMBER },
                platformHint: {
                  type: Type.STRING,
                  description: 'Optional category reference e.g. IKEA / Local Carpenter / Swiggy Catering (labeled as estimate).',
                },
                aiTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'name',
                'category',
                'quantity',
                'estimatedUnitPrice',
                'estimatedTotalPrice',
                'reason',
                'styleMatch',
                'budgetImpact',
                'alternative',
              ],
            },
          },
        },
        required: ['category', 'allocatedAmount', 'recommendations'],
      },
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 5 actionable money-saving tips specific to this plan.',
    },
    warnings: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Any budget constraint notes or trade-offs.',
    },
    outfitAnalysis: {
      type: Type.OBJECT,
      properties: {
        dominantColors: { type: Type.ARRAY, items: { type: Type.STRING } },
        outfitStyle: { type: Type.STRING },
        appearanceType: { type: Type.STRING },
        necklineDetails: { type: Type.STRING },
        sleeveDetails: { type: Type.STRING },
        embroideryDetails: { type: Type.STRING },
        overallAesthetic: { type: Type.STRING },
        suitableJewelryColors: { type: Type.ARRAY, items: { type: Type.STRING } },
        suitableJewelryStyles: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
  },
  required: ['title', 'summary', 'aiInsights', 'categories', 'tips', 'warnings'],
};

export function buildHomePrompt(input: HomePlannerInput): string {
  const itemsList = input.items
    .map(
      (i) =>
        `- ${i.name} (Qty: ${i.quantity}, Category: ${i.category}${
          i.preferredPrice ? `, Target Unit Price: ₹${i.preferredPrice}` : ''
        })`
    )
    .join('\n');

  return `Create a complete Home Interior Budget Plan in INR (₹) within the user's strict budget.

User Requirements:
- Total Budget: ₹${input.totalBudget}
- Room Type: ${input.roomType}
- Style Preference: ${input.stylePreference}
- Requested Items:
${itemsList || '- Essential room furnishings and lighting'}
- Additional Requirements: ${input.additionalRequirements || 'None specified'}

Ensure:
1. Sum of all estimatedTotalPrice across all recommendations MUST NOT exceed ₹${input.totalBudget}.
2. Group items logically into categories (e.g., Furniture, Lighting & Electrical, Decor & Soft Furnishings, Installation & Reserve).
3. Every requested item is addressed with accurate quantities and realistic Indian market estimated prices in INR.`;
}

export function buildPartyPrompt(input: PartyPlannerInput): string {
  return `Create a complete Party & Event Budget Plan in INR (₹) within the user's strict budget.

User Requirements:
- Total Budget: ₹${input.totalBudget}
- Guest Count: ${input.guestCount} guests
- Event Type: ${input.eventType}
- Venue Preference: ${input.venue}
- Food Preference: ${input.foodPreference}
- Decoration Style: ${input.decorationStyle}
- Entertainment Selected: ${input.entertainment.length ? input.entertainment.join(', ') : 'None'}
- Additional Requirements: ${input.additionalRequirements || 'None specified'}

Ensure:
1. Total estimated cost across Venue, Catering, Decoration, Entertainment, Additional Services, and Reserve MUST NOT exceed ₹${input.totalBudget}.
2. For Catering recommendations, include perPersonPrice so that perPersonPrice * ${input.guestCount} aligns with estimatedTotalPrice.
3. Provide realistic Indian event pricing estimates in INR.`;
}

export function buildJewelryPrompt(input: JewelryPlannerInput, hasImage: boolean): string {
  return `Create a complete Jewelry Recommendation Plan in INR (₹) within the user's strict budget.

User Requirements:
- Total Budget: ₹${input.budget}
- Occasion: ${input.occasion}
- Preferred Jewelry Type: ${input.jewelryType}
- Style Preference: ${input.style}
- Metal Preference: ${input.metalPreference}
- Outfit Description: ${input.outfitDescription || 'Not provided'}
- Outfit Image Provided: ${hasImage ? 'Yes — analyze the attached image for visible colors, border/embroidery, neckline, and aesthetic.' : 'No — infer outfit compatibility from the text description and occasion.'}

Ensure:
1. Total estimated cost across all recommended jewelry pieces MUST NOT exceed ₹${input.budget}.
2. Populate outfitAnalysis based on visible image details (or text description if no image was uploaded, clearly noting what is inferred from text vs image).
3. Include material, occasionSuitability, and outfitCompatibility for every jewelry recommendation.`;
}
