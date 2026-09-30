export type PlannerType = 'home' | 'party' | 'jewelry';

export type PageView =
  | 'landing'
  | 'testimonials'
  | 'register'
  | 'login'
  | 'dashboard'
  | 'home-planner'
  | 'home-recommendations'
  | 'party-planner'
  | 'party-recommendations'
  | 'jewelry-planner'
  | 'jewelry-recommendations'
  | 'history'
  | 'saved'
  | 'profile';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  currency: string;
  defaultStyle: string;
  createdAt: string;
}

export interface HomeInputItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  preferredPrice?: number;
}

export interface HomePlannerInput {
  totalBudget: number;
  roomType:
    | 'Living Room'
    | 'Bedroom'
    | 'Kitchen'
    | 'Dining Room'
    | 'Bathroom'
    | 'Office'
    | 'Multiple Rooms';
  stylePreference:
    | 'Modern'
    | 'Minimalist'
    | 'Traditional'
    | 'Luxury'
    | 'Contemporary'
    | 'Scandinavian'
    | 'Industrial'
    | 'Budget Friendly';
  items: HomeInputItem[];
  additionalRequirements: string;
}

export interface PartyPlannerInput {
  totalBudget: number;
  guestCount: number;
  eventType:
    | 'Birthday'
    | 'Wedding'
    | 'Engagement'
    | 'Anniversary'
    | 'Corporate Event'
    | 'Baby Shower'
    | 'College Event'
    | 'House Party'
    | 'Other';
  venue:
    | 'Home'
    | 'Hotel'
    | 'Restaurant'
    | 'Banquet Hall'
    | 'Outdoor'
    | 'Community Hall'
    | 'Other';
  foodPreference: 'Vegetarian' | 'Non-Vegetarian' | 'Mixed';
  decorationStyle:
    | 'Simple'
    | 'Elegant'
    | 'Traditional'
    | 'Modern'
    | 'Luxury'
    | 'Theme Based';
  entertainment: string[];
  additionalRequirements: string;
}

export interface JewelryPlannerInput {
  budget: number;
  occasion:
    | 'Wedding'
    | 'Engagement'
    | 'Birthday'
    | 'Party'
    | 'Festival'
    | 'Office'
    | 'Casual'
    | 'Traditional Event';
  jewelryType:
    | 'Necklace'
    | 'Earrings'
    | 'Bracelet'
    | 'Ring'
    | 'Bangles'
    | 'Complete Set'
    | 'Any';
  style:
    | 'Traditional'
    | 'Modern'
    | 'Minimal'
    | 'Elegant'
    | 'Bridal'
    | 'Statement'
    | 'Contemporary';
  metalPreference:
    | 'Gold'
    | 'Silver'
    | 'Diamond'
    | 'Pearl'
    | 'Artificial'
    | 'No Preference';
  outfitDescription: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface OutfitImageAnalysis {
  dominantColors: string[];
  outfitStyle: string;
  appearanceType: string;
  necklineDetails: string;
  sleeveDetails: string;
  embroideryDetails: string;
  overallAesthetic: string;
  suitableJewelryColors: string[];
  suitableJewelryStyles: string[];
}

export interface RecommendationItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  reason: string;
  styleMatch: string;
  budgetImpact: string;
  alternative: string;
  alternativePrice?: number;
  material?: string;
  occasionSuitability?: string;
  outfitCompatibility?: string;
  perPersonPrice?: number;
  sourceLabel: 'AI Recommendation' | 'AI Estimated Recommendation' | 'Sample Recommendation' | 'Verified Partner API';
  platformHint?: string;
  aiTips?: string[];
}

export interface BudgetCategoryAllocation {
  category: string;
  allocatedAmount: number;
  recommendations: RecommendationItem[];
}

export interface BudgetSummary {
  total: number;
  allocated: number;
  remaining: number;
  utilizationPercentage: number;
  costPerGuest?: number;
}

export interface GeneratedPlanResponse {
  id: string;
  plannerType: PlannerType;
  createdAt: string;
  title: string;
  summary: string;
  aiInsights: string;
  budgetStatusMessage: 'Your plan is within budget.' | 'We optimized your plan to stay within your budget.';
  wasOptimized: boolean;
  isFallback: boolean;
  fallbackNotice?: string;
  budget: BudgetSummary;
  categories: BudgetCategoryAllocation[];
  tips: string[];
  warnings: string[];
  outfitAnalysis?: OutfitImageAnalysis;
  userInputs: HomePlannerInput | PartyPlannerInput | JewelryPlannerInput;
}

export interface SavedRecommendation {
  id: string;
  name: string;
  plannerType: PlannerType;
  category: string;
  quantity: number;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  reason: string;
  styleMatch: string;
  budgetImpact: string;
  alternative: string;
  sourceLabel: string;
  dateSaved: string;
  aiTips?: string[];
}

export interface ExternalPlatformStatus {
  platform: string;
  domain: 'home' | 'party' | 'jewelry';
  configured: boolean;
  mode: 'AI Estimated Recommendation' | 'Live API Connected';
}
