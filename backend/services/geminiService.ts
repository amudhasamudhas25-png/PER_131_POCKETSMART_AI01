import { GoogleGenAI, Type } from '@google/genai';
import {
  GeneratedPlanResponse,
  HomePlannerInput,
  PartyPlannerInput,
  JewelryPlannerInput,
  RecommendationItem,
} from '../../src/types/index.ts';
import {
  HOME_SYSTEM_INSTRUCTION,
  PARTY_SYSTEM_INSTRUCTION,
  JEWELRY_SYSTEM_INSTRUCTION,
  PLAN_RESPONSE_SCHEMA,
  buildHomePrompt,
  buildPartyPrompt,
  buildJewelryPrompt,
} from '../prompts/plannerPrompts.ts';
import { validateAndOptimizePlan } from '../utils/budgetValidator.ts';
import {
  generateFallbackHomePlan,
  generateFallbackPartyPlan,
  generateFallbackJewelryPlan,
} from './fallbackService.ts';
import {
  IKEAService,
  SwiggyService,
  AmazonService,
} from './externalPlatforms.ts';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function generateHomePlanWithGemini(
  input: HomePlannerInput
): Promise<GeneratedPlanResponse> {
  const ai = getGeminiClient();
  if (!ai) {
    return generateFallbackHomePlan(input);
  }

  try {
    const prompt = buildHomePrompt(input);
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: HOME_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: PLAN_RESPONSE_SCHEMA,
        temperature: 0.4,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return generateFallbackHomePlan(input);
    }

    const parsed = JSON.parse(rawText.trim());
    const validated = validateAndOptimizePlan(
      { ...parsed, userInputs: input, isFallback: false },
      input.totalBudget,
      'home'
    );

    validated.categories.forEach((cat) => {
      cat.recommendations = cat.recommendations.map((rec) =>
        IKEAService.enrichRecommendation(rec)
      );
    });

    return validated;
  } catch (error) {
    console.error('Gemini Home Planner error, falling back:', error);
    return generateFallbackHomePlan(input);
  }
}

export async function generatePartyPlanWithGemini(
  input: PartyPlannerInput
): Promise<GeneratedPlanResponse> {
  const ai = getGeminiClient();
  if (!ai) {
    return generateFallbackPartyPlan(input);
  }

  try {
    const prompt = buildPartyPrompt(input);
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: PARTY_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: PLAN_RESPONSE_SCHEMA,
        temperature: 0.4,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return generateFallbackPartyPlan(input);
    }

    const parsed = JSON.parse(rawText.trim());
    const validated = validateAndOptimizePlan(
      { ...parsed, userInputs: input, isFallback: false },
      input.totalBudget,
      'party',
      input.guestCount
    );

    validated.categories.forEach((cat) => {
      cat.recommendations = cat.recommendations.map((rec) =>
        SwiggyService.enrichRecommendation(rec)
      );
    });

    return validated;
  } catch (error) {
    console.error('Gemini Party Planner error, falling back:', error);
    return generateFallbackPartyPlan(input);
  }
}

export async function generateJewelryPlanWithGemini(
  input: JewelryPlannerInput
): Promise<GeneratedPlanResponse> {
  const ai = getGeminiClient();
  if (!ai) {
    return generateFallbackJewelryPlan(input);
  }

  try {
    const hasImage = Boolean(input.imageBase64 && input.imageMimeType);
    const prompt = buildJewelryPrompt(input, hasImage);

    const parts: any[] = [];
    if (hasImage && input.imageBase64 && input.imageMimeType) {
      const cleanBase64 = input.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: input.imageMimeType,
          data: cleanBase64,
        },
      });
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: JEWELRY_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: PLAN_RESPONSE_SCHEMA,
        temperature: 0.4,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return generateFallbackJewelryPlan(input);
    }

    const parsed = JSON.parse(rawText.trim());
    const validated = validateAndOptimizePlan(
      {
        ...parsed,
        userInputs: {
          ...input,
          // Avoid storing huge base64 strings inside history records
          imageBase64: input.imageBase64 ? '[Image Uploaded]' : undefined,
        },
        isFallback: false,
      },
      input.budget,
      'jewelry'
    );

    validated.categories.forEach((cat) => {
      cat.recommendations = cat.recommendations.map((rec) =>
        AmazonService.enrichRecommendation(rec)
      );
    });

    return validated;
  } catch (error) {
    console.error('Gemini Jewelry Planner error, falling back:', error);
    return generateFallbackJewelryPlan(input);
  }
}

export async function generateAlternativeForItem(
  item: RecommendationItem,
  maxBudgetForItem: number,
  plannerType: string
): Promise<RecommendationItem> {
  const ai = getGeminiClient();
  const safeCap = Math.max(100, Math.round(maxBudgetForItem || item.estimatedTotalPrice));

  if (!ai) {
    const newTotal = Math.max(100, Math.floor(safeCap * 0.85));
    const newUnit = Math.max(50, Math.floor(newTotal / Math.max(1, item.quantity)));
    return {
      ...item,
      id: `alt-${Date.now()}`,
      name: item.alternative || `Value-Optimized ${item.name}`,
      estimatedUnitPrice: newUnit,
      estimatedTotalPrice: newUnit * item.quantity,
      reason: `Lower-cost alternative generated within ₹${safeCap.toLocaleString('en-IN')} cap to free up additional budget reserve.`,
      alternative: `Original option: ${item.name} (₹${item.estimatedTotalPrice.toLocaleString('en-IN')})`,
      sourceLabel: 'Sample Recommendation',
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Suggest a smart, budget-conscious alternative for the following ${plannerType} item in INR (₹).
Current Item: ${item.name} (Category: ${item.category}, Qty: ${item.quantity}, Current Total: ₹${item.estimatedTotalPrice})
Maximum Allowed Total Price: ₹${safeCap}
Return a fresh recommendation that costs less than or equal to ₹${safeCap}.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            estimatedUnitPrice: { type: Type.NUMBER },
            estimatedTotalPrice: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            styleMatch: { type: Type.STRING },
            budgetImpact: { type: Type.STRING },
            alternative: { type: Type.STRING },
          },
          required: [
            'name',
            'estimatedUnitPrice',
            'estimatedTotalPrice',
            'reason',
            'styleMatch',
            'budgetImpact',
            'alternative',
          ],
        },
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    const qty = Math.max(1, item.quantity);
    let unitPrice = Math.min(
      Math.floor(safeCap / qty),
      Math.max(50, Math.round(Number(parsed.estimatedUnitPrice) || item.estimatedUnitPrice * 0.85))
    );
    const totalPrice = unitPrice * qty;

    return {
      ...item,
      id: `alt-${Date.now()}`,
      name: parsed.name || `Alternative ${item.name}`,
      estimatedUnitPrice: unitPrice,
      estimatedTotalPrice: totalPrice,
      reason: parsed.reason || item.reason,
      styleMatch: parsed.styleMatch || item.styleMatch,
      budgetImpact: parsed.budgetImpact || 'Reduced cost — frees up additional budget reserve',
      alternative: parsed.alternative || `Previous selection: ${item.name}`,
      sourceLabel: 'AI Recommendation',
    };
  } catch {
    const newTotal = Math.max(100, Math.floor(safeCap * 0.85));
    const newUnit = Math.max(50, Math.floor(newTotal / Math.max(1, item.quantity)));
    return {
      ...item,
      id: `alt-${Date.now()}`,
      name: item.alternative || `Value-Optimized ${item.name}`,
      estimatedUnitPrice: newUnit,
      estimatedTotalPrice: newUnit * item.quantity,
      reason: `Alternative option calibrated within ₹${safeCap.toLocaleString('en-IN')}.`,
    };
  }
}
