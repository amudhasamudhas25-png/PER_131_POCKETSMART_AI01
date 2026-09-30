import fs from 'fs';
import path from 'path';
import {
  GeneratedPlanResponse,
  SavedRecommendation,
  UserProfile,
} from '../../src/types/index.ts';

interface StoredUser extends UserProfile {
  passwordHash: string;
}

interface DataStore {
  users: StoredUser[];
  history: GeneratedPlanResponse[];
  saved: SavedRecommendation[];
}

const DATA_DIR = path.resolve(process.cwd(), 'backend/data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const INITIAL_DEMO_PLANS: GeneratedPlanResponse[] = [
  {
    id: 'demo-home-plan-100k',
    plannerType: 'home',
    createdAt: '2026-09-24T10:30:00.000Z',
    title: 'Modern Living Room Interior Plan',
    summary:
      'Balanced allocation across Furniture, Lighting & Electrical, and Soft Furnishings for a modern living room with warm ambient lighting.',
    aiInsights:
      'Your current plan uses 84% (₹84,200) of your ₹1,00,000 budget, leaving ₹15,800 (16%) as a healthy reserve for installation and unexpected expenses.',
    budgetStatusMessage: 'Your plan is within budget.',
    wasOptimized: false,
    isFallback: false,
    budget: {
      total: 100000,
      allocated: 84200,
      remaining: 15800,
      utilizationPercentage: 84,
    },
    categories: [
      {
        category: 'Furniture',
        allocatedAmount: 54000,
        recommendations: [
          {
            id: 'rec-home-sofa-1',
            name: 'Modern 3-Seater Upholstered Fabric Sofa (Teak Frame)',
            category: 'Furniture',
            quantity: 1,
            estimatedUnitPrice: 42000,
            estimatedTotalPrice: 42000,
            reason:
              'Anchors the living room with durable high-density foam seating and clean low-profile armrests suited for a modern layout.',
            styleMatch: 'Warm neutral oatmeal upholstery pairs cleanly with warm lighting',
            budgetImpact: 'High — 42% of total budget (core anchor piece)',
            alternative: 'Modular 3-seater engineered wood sofa at ₹32,500',
            alternativePrice: 32500,
            sourceLabel: 'AI Recommendation',
            platformHint: 'AI Estimated Recommendation (Comparable category on IKEA / Pepperfry)',
            aiTips: [
              'Choose stain-resistant woven polyester-linen blend fabric for longevity.',
              'Measure doorway clearance before ordering a single-frame 3-seater.',
            ],
          },
          {
            id: 'rec-home-table-1',
            name: 'Minimalist Oak-Finish Center Coffee Table with Lower Shelf',
            category: 'Furniture',
            quantity: 1,
            estimatedUnitPrice: 12000,
            estimatedTotalPrice: 12000,
            reason:
              'Provides functional surface area and concealed magazine/remote storage without visually crowding the seating zone.',
            styleMatch: 'Natural oak grain complements modern warm interiors',
            budgetImpact: 'Moderate — 12% of total budget',
            alternative: 'Nesting metal-and-laminate coffee tables at ₹8,500',
            alternativePrice: 8500,
            sourceLabel: 'AI Recommendation',
            platformHint: 'AI Estimated Recommendation (Comparable category on IKEA India)',
          },
        ],
      },
      {
        category: 'Lighting & Electrical',
        allocatedAmount: 18200,
        recommendations: [
          {
            id: 'rec-home-fan-1',
            name: 'BLDC Energy-Saving Matte White Ceiling Fan',
            category: 'Electrical',
            quantity: 2,
            estimatedUnitPrice: 4600,
            estimatedTotalPrice: 9200,
            reason:
              'Silent operation with remote control and 50% lower power consumption compared to induction fans.',
            styleMatch: 'Sleek aerodynamic blades suit contemporary ceilings',
            budgetImpact: 'Low — 9.2% of budget for 2 units',
            alternative: 'Standard high-speed decorative ceiling fan at ₹2,900/unit',
            alternativePrice: 5800,
            sourceLabel: 'AI Recommendation',
            platformHint: 'AI Estimated Recommendation (Comparable category on Amazon India)',
          },
          {
            id: 'rec-home-lights-1',
            name: 'Warm White (3000K) Recessed COB & Ambient Wall Sconce Set',
            category: 'Lighting',
            quantity: 6,
            estimatedUnitPrice: 1500,
            estimatedTotalPrice: 9000,
            reason:
              'Delivers layered 3000K warm illumination across the seating perimeter as requested.',
            styleMatch: 'Warm 3000K color temperature enhances wood and fabric tones',
            budgetImpact: 'Low — 9% of budget for 6 fixtures',
            alternative: 'Surface-mounted warm LED panel pack of 6 at ₹5,400',
            alternativePrice: 5400,
            sourceLabel: 'AI Recommendation',
          },
        ],
      },
      {
        category: 'Decor & Soft Furnishings',
        allocatedAmount: 12000,
        recommendations: [
          {
            id: 'rec-home-curtains-1',
            name: 'Floor-Length Textured Linen-Blend Eyelet Curtains (9 ft)',
            category: 'Decor',
            quantity: 4,
            estimatedUnitPrice: 3000,
            estimatedTotalPrice: 12000,
            reason:
              'Softens natural daylight while providing privacy and vertical height emphasis.',
            styleMatch: 'Warm beige textured weave matches modern minimalist aesthetic',
            budgetImpact: 'Moderate — 12% of budget for 4 full-length panels',
            alternative: 'Ready-made cotton-poly blackout curtains (set of 4) at ₹7,200',
            alternativePrice: 7200,
            sourceLabel: 'AI Recommendation',
          },
        ],
      },
    ],
    tips: [
      'Choose BLDC ceiling fans to save approximately ₹1,500–₹2,000 per fan annually on electricity.',
      'Buy warm 3000K LED fixtures in a 6-pack bundle from a single lighting vendor for a 15% bulk discount.',
      'Keep your ₹15,800 remaining buffer for curtain rods, electrical wiring, and delivery charges.',
    ],
    warnings: [],
    userInputs: {
      totalBudget: 100000,
      roomType: 'Living Room',
      stylePreference: 'Modern',
      items: [
        { id: '1', name: 'Sofa', quantity: 1, category: 'Furniture' },
        { id: '2', name: 'Fan', quantity: 2, category: 'Electrical' },
        { id: '3', name: 'Lights', quantity: 6, category: 'Lighting' },
        { id: '4', name: 'Coffee Table', quantity: 1, category: 'Furniture' },
        { id: '5', name: 'Curtains', quantity: 4, category: 'Decor' },
      ],
      additionalRequirements: 'I want a modern living room with warm lighting.',
    },
  },
  {
    id: 'demo-party-plan-75k',
    plannerType: 'party',
    createdAt: '2026-09-23T14:15:00.000Z',
    title: 'Birthday Celebration for 100 Guests (Banquet Hall)',
    summary:
      'Comprehensive event budget prioritizing multi-course catering and banquet hall booking while including elegant stage decor, DJ audio, and photography.',
    aiInsights:
      'Your current plan uses 88% (₹66,000) of your ₹75,000 budget (₹660 per guest), leaving ₹9,000 as an emergency reserve.',
    budgetStatusMessage: 'Your plan is within budget.',
    wasOptimized: false,
    isFallback: false,
    budget: {
      total: 75000,
      allocated: 66000,
      remaining: 9000,
      utilizationPercentage: 88,
      costPerGuest: 660,
    },
    categories: [
      {
        category: 'Catering',
        allocatedAmount: 35000,
        recommendations: [
          {
            id: 'rec-party-cat-1',
            name: 'Full Buffet Catering (Welcome Drink, 3 Starters, 3 Mains, 2 Desserts)',
            category: 'Catering',
            quantity: 100,
            estimatedUnitPrice: 350,
            estimatedTotalPrice: 35000,
            perPersonPrice: 350,
            reason:
              'Allocates 46% of total budget to ensure generous food quality and service for 100 guests.',
            styleMatch: 'Balanced crowd-pleasing menu for a milestone birthday',
            budgetImpact: 'High — Primary hospitality cost at ₹350/guest',
            alternative: 'Bulk party tray catering via Swiggy/Zomato Catering partners at ₹280/guest (₹28,000)',
            alternativePrice: 28000,
            sourceLabel: 'AI Recommendation',
            platformHint: 'AI Estimated Recommendation (Local Caterer / Swiggy / Zomato Bulk tier)',
          },
        ],
      },
      {
        category: 'Venue',
        allocatedAmount: 15000,
        recommendations: [
          {
            id: 'rec-party-venue-1',
            name: 'AC Banquet Hall Slot (4 Hours, 100 Pax Seating & Basic Power)',
            category: 'Venue',
            quantity: 1,
            estimatedUnitPrice: 15000,
            estimatedTotalPrice: 15000,
            reason:
              'Provides climate-controlled comfort and dedicated dining layout for 100 guests.',
            styleMatch: 'Banquet Hall',
            budgetImpact: 'Moderate — 20% of total budget',
            alternative: 'Community hall or weekday lunch banquet slot at ₹11,000',
            alternativePrice: 11000,
            sourceLabel: 'AI Recommendation',
            platformHint: 'AI Estimated Recommendation (OYO Banquets / Local Venue tier)',
          },
        ],
      },
      {
        category: 'Decoration',
        allocatedAmount: 8500,
        recommendations: [
          {
            id: 'rec-party-decor-1',
            name: 'Elegant Pastel Arch Backdrop, Neon Signage & Table Centerpieces',
            category: 'Decoration',
            quantity: 1,
            estimatedUnitPrice: 8500,
            estimatedTotalPrice: 8500,
            reason:
              'Focuses visual budget on the cake-cutting stage and entrance walkway for high photo value.',
            styleMatch: 'Elegant theme',
            budgetImpact: 'Low — 11.3% of total budget',
            alternative: 'Minimalist fabric drape & warm fairy light backdrop at ₹5,500',
            alternativePrice: 5500,
            sourceLabel: 'AI Recommendation',
          },
        ],
      },
      {
        category: 'Entertainment & Photography',
        allocatedAmount: 7500,
        recommendations: [
          {
            id: 'rec-party-ent-1',
            name: 'Event Photographer (3 Hours Candid + Edited Digital Album) & PA Music System',
            category: 'Entertainment',
            quantity: 1,
            estimatedUnitPrice: 7500,
            estimatedTotalPrice: 7500,
            reason:
              'Captures high-resolution event memories and covers background music without hiring a full concert DJ rig.',
            styleMatch: 'Suited for 100-guest indoor celebration',
            budgetImpact: 'Low — 10% of total budget',
            alternative: 'Freelance student photographer + venue in-house sound system at ₹4,800',
            alternativePrice: 4800,
            sourceLabel: 'AI Recommendation',
          },
        ],
      },
    ],
    tips: [
      'Negotiate a waived hall rental fee by booking the banquet venue’s in-house catering package.',
      'Opt for a digital album rather than printed photo books to save ₹3,000–₹4,500 on photography.',
      'Confirm guaranteed minimum plates at 90 guests with a 10% buffer clause.',
    ],
    warnings: [],
    userInputs: {
      totalBudget: 75000,
      guestCount: 100,
      eventType: 'Birthday',
      venue: 'Banquet Hall',
      foodPreference: 'Mixed',
      decorationStyle: 'Elegant',
      entertainment: ['Music', 'Photography'],
      additionalRequirements: 'Include cake table lighting and family seating area.',
    },
  },
  {
    id: 'demo-jewelry-plan-30k',
    plannerType: 'jewelry',
    createdAt: '2026-09-22T17:45:00.000Z',
    title: 'Traditional Wedding Necklace Set Plan',
    summary:
      'Curated traditional gold-toned necklace set and kundan jhumka accents designed to complement a crimson silk saree with gold zari border.',
    aiInsights:
      'Your current plan uses 86% (₹25,800) of your ₹30,000 budget, leaving ₹4,200 unallocated.',
    budgetStatusMessage: 'Your plan is within budget.',
    wasOptimized: false,
    isFallback: false,
    budget: {
      total: 30000,
      allocated: 25800,
      remaining: 4200,
      utilizationPercentage: 86,
    },
    categories: [
      {
        category: 'Primary Necklace Set',
        allocatedAmount: 18500,
        recommendations: [
          {
            id: 'rec-jewel-neck-1',
            name: 'Gold-Plated Hallmarked Silver Temple Choker & Matching Jhumka Set',
            category: 'Complete Set',
            quantity: 1,
            estimatedUnitPrice: 18500,
            estimatedTotalPrice: 18500,
            material: '92.5 Sterling Silver with 22K Gold Vermeil & Kemp Stones',
            occasionSuitability: 'Wedding / Traditional Reception',
            outfitCompatibility:
              'Warm antique gold finish and ruby-toned kemp stones echo a red Banarasi silk saree with gold zari border.',
            reason:
              'Delivers authentic heirloom temple craftsmanship and precious metal value well within a ₹30,000 cap.',
            styleMatch: 'Traditional Bridal / Festive',
            budgetImpact: 'Moderate — 61.6% of total budget',
            alternative: 'High-grade brass-alloy Kundan & Pearl choker set at ₹9,800',
            alternativePrice: 9800,
            sourceLabel: 'AI Recommendation',
          },
        ],
      },
      {
        category: 'Wrist & Hair Accents',
        allocatedAmount: 7300,
        recommendations: [
          {
            id: 'rec-jewel-bangle-1',
            name: 'Pair of Antique Gold-Toned Filigree Kada Bangles with Pearl Edging',
            category: 'Bangles',
            quantity: 1,
            estimatedUnitPrice: 7300,
            estimatedTotalPrice: 7300,
            material: 'Gold-toned Silver Alloy with Cultured Pearlclusters',
            occasionSuitability: 'Wedding / Festival',
            outfitCompatibility:
              'Frames half-length blouse sleeves and balances the gold zari border without snagging delicate silk threads.',
            reason:
              'Completes the traditional bridal silhouette while keeping total spend ₹4,200 below your ceiling.',
            styleMatch: 'Traditional Minimal Accent',
            budgetImpact: 'Low — 24.3% of total budget',
            alternative: 'Set of 4 lakshmi-motif gold-plated bangles at ₹4,200',
            alternativePrice: 4200,
            sourceLabel: 'AI Recommendation',
          },
        ],
      },
    ],
    outfitAnalysis: {
      dominantColors: ['Crimson Red', 'Antique Gold Zari', 'Warm Ivory'],
      outfitStyle: 'Traditional Banarasi Silk Saree with Woven Zari Border',
      appearanceType: 'Rich Traditional Indian Formalwear',
      necklineDetails: 'Classic round/U-neck blouse allowing a mid-length choker or collar necklace',
      sleeveDetails: 'Elbow-length zari-bordered sleeves suited for statement kada bangles',
      embroideryDetails: 'Dense metallic gold brocade weave requiring warm gold/pearl jewelry tones',
      overallAesthetic: 'Regal Heritage Wedding Aesthetic',
      suitableJewelryColors: ['Antique Yellow Gold', 'Ruby Kemp Red', 'Off-White Pearl'],
      suitableJewelryStyles: ['Temple Choker Set', 'Kundan Jhumkas', 'Pearl-Edged Kada Bangles'],
    },
    tips: [
      'Choose 92.5 hallmarked silver with 22K gold vermeil to achieve fine-jewelry weight and finish under ₹30,000.',
      'Check clasp smoothness on kundan or temple pieces so they do not catch on silk zari threads.',
      'Store gold-toned silver pieces in anti-tarnish zip pouches after the wedding event.',
    ],
    warnings: [],
    userInputs: {
      budget: 30000,
      occasion: 'Wedding',
      jewelryType: 'Complete Set',
      style: 'Traditional',
      metalPreference: 'Gold',
      outfitDescription: 'Red silk saree with gold border.',
    },
  },
];

const INITIAL_SAVED: SavedRecommendation[] = [
  {
    id: 'saved-demo-1',
    name: 'Modern 3-Seater Upholstered Fabric Sofa (Teak Frame)',
    plannerType: 'home',
    category: 'Furniture',
    quantity: 1,
    estimatedUnitPrice: 42000,
    estimatedTotalPrice: 42000,
    reason:
      'Anchors the living room with durable high-density foam seating and clean low-profile armrests suited for a modern layout.',
    styleMatch: 'Warm neutral oatmeal upholstery pairs cleanly with warm lighting',
    budgetImpact: 'High — 42% of total budget (core anchor piece)',
    alternative: 'Modular 3-seater engineered wood sofa at ₹32,500',
    sourceLabel: 'AI Recommendation',
    dateSaved: '2026-09-24T10:35:00.000Z',
  },
  {
    id: 'saved-demo-2',
    name: 'Gold-Plated Hallmarked Silver Temple Choker & Matching Jhumka Set',
    plannerType: 'jewelry',
    category: 'Complete Set',
    quantity: 1,
    estimatedUnitPrice: 18500,
    estimatedTotalPrice: 18500,
    reason:
      'Delivers authentic heirloom temple craftsmanship and precious metal value well within a ₹30,000 cap.',
    styleMatch: 'Traditional Bridal / Festive',
    budgetImpact: 'Moderate — 61.6% of total budget',
    alternative: 'High-grade brass-alloy Kundan & Pearl choker set at ₹9,800',
    sourceLabel: 'AI Recommendation',
    dateSaved: '2026-09-22T17:50:00.000Z',
  },
];

const INITIAL_USERS: StoredUser[] = [
  {
    id: 'user-demo-1',
    fullName: 'Aarav Sharma',
    email: 'demo@pocketsmart.ai',
    passwordHash: 'demo1234',
    currency: 'INR (₹)',
    defaultStyle: 'Modern',
    createdAt: '2026-09-01T09:00:00.000Z',
  },
];

function ensureStore(): DataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial: DataStore = {
        users: INITIAL_USERS,
        history: INITIAL_DEMO_PLANS,
        saved: INITIAL_SAVED,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DataStore;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : INITIAL_USERS,
      history: Array.isArray(parsed.history) ? parsed.history : INITIAL_DEMO_PLANS,
      saved: Array.isArray(parsed.saved) ? parsed.saved : INITIAL_SAVED,
    };
  } catch {
    return {
      users: INITIAL_USERS,
      history: INITIAL_DEMO_PLANS,
      saved: INITIAL_SAVED,
    };
  }
}

function saveStore(store: DataStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to persist store:', e);
  }
}

export const StorageService = {
  getHistory(): GeneratedPlanResponse[] {
    return ensureStore().history;
  },

  addHistory(plan: GeneratedPlanResponse): GeneratedPlanResponse {
    const store = ensureStore();
    const existingIdx = store.history.findIndex((h) => h.id === plan.id);
    if (existingIdx >= 0) {
      store.history[existingIdx] = plan;
    } else {
      store.history.unshift(plan);
    }
    saveStore(store);
    return plan;
  },

  deleteHistory(id: string): boolean {
    const store = ensureStore();
    const before = store.history.length;
    store.history = store.history.filter((h) => h.id !== id);
    saveStore(store);
    return store.history.length < before;
  },

  getSaved(): SavedRecommendation[] {
    return ensureStore().saved;
  },

  addSaved(item: SavedRecommendation): SavedRecommendation {
    const store = ensureStore();
    const exists = store.saved.find(
      (s) => s.id === item.id || (s.name === item.name && s.plannerType === item.plannerType)
    );
    if (exists) {
      return exists;
    }
    store.saved.unshift(item);
    saveStore(store);
    return item;
  },

  deleteSaved(id: string): boolean {
    const store = ensureStore();
    const before = store.saved.length;
    store.saved = store.saved.filter((s) => s.id !== id);
    saveStore(store);
    return store.saved.length < before;
  },

  registerUser(fullName: string, email: string, password: string): UserProfile {
    const store = ensureStore();
    const cleanEmail = email.trim().toLowerCase();
    const existing = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      fullName: fullName.trim(),
      email: cleanEmail,
      passwordHash: password,
      currency: 'INR (₹)',
      defaultStyle: 'Modern',
      createdAt: new Date().toISOString(),
    };
    store.users.push(newUser);
    saveStore(store);
    const { passwordHash: _, ...profile } = newUser;
    return profile;
  },

  loginUser(email: string, password: string): UserProfile {
    const store = ensureStore();
    const cleanEmail = email.trim().toLowerCase();
    const found = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found || found.passwordHash !== password) {
      throw new Error('Invalid email or password.');
    }
    const { passwordHash: _, ...profile } = found;
    return profile;
  },

  getDefaultProfile(): UserProfile {
    const store = ensureStore();
    const first = store.users[0] || INITIAL_USERS[0];
    const { passwordHash: _, ...profile } = first;
    return profile;
  },

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const store = ensureStore();
    const target =
      store.users.find((u) => u.id === updates.id || u.email === updates.email) ||
      store.users[0];
    if (target) {
      if (updates.fullName) target.fullName = updates.fullName.trim();
      if (updates.email) target.email = updates.email.trim().toLowerCase();
      if (updates.currency) target.currency = updates.currency;
      if (updates.defaultStyle) target.defaultStyle = updates.defaultStyle;
      saveStore(store);
      const { passwordHash: _, ...profile } = target;
      return profile;
    }
    return this.getDefaultProfile();
  },
};
