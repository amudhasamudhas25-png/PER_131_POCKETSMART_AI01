import {
  ExternalPlatformStatus,
  GeneratedPlanResponse,
  HomePlannerInput,
  JewelryPlannerInput,
  PartyPlannerInput,
  RecommendationItem,
  SavedRecommendation,
  UserProfile,
} from '../types/index.ts';

const LS_USER_KEY = 'pocketsmart_user_v1';

export const ApiService = {
  async generateHomePlan(input: HomePlannerInput): Promise<GeneratedPlanResponse> {
    const res = await fetch('/api/generate-home', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate Home Plan.');
    }
    return data;
  },

  async generatePartyPlan(input: PartyPlannerInput): Promise<GeneratedPlanResponse> {
    const res = await fetch('/api/generate-party', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate Party Plan.');
    }
    return data;
  },

  async generateJewelryPlan(input: JewelryPlannerInput): Promise<GeneratedPlanResponse> {
    const res = await fetch('/api/generate-jewelry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate Jewelry Plan.');
    }
    return data;
  },

  async generateAlternative(
    item: RecommendationItem,
    maxBudgetForItem: number,
    plannerType: string
  ): Promise<RecommendationItem> {
    const res = await fetch('/api/generate-alternative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, maxBudgetForItem, plannerType }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate alternative.');
    }
    return data;
  },

  async getHistory(): Promise<GeneratedPlanResponse[]> {
    const res = await fetch('/api/history');
    if (!res.ok) return [];
    return res.json();
  },

  async savePlanToHistory(plan: GeneratedPlanResponse): Promise<GeneratedPlanResponse> {
    const res = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    return res.json();
  },

  async deleteHistory(id: string): Promise<void> {
    await fetch(`/api/history/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async getSaved(): Promise<SavedRecommendation[]> {
    const res = await fetch('/api/saved');
    if (!res.ok) return [];
    return res.json();
  },

  async saveRecommendation(item: Omit<SavedRecommendation, 'id' | 'dateSaved'> & { id?: string }): Promise<SavedRecommendation> {
    const res = await fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    return res.json();
  },

  async deleteSaved(id: string): Promise<void> {
    await fetch(`/api/saved/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },

  async register(fullName: string, email: string, password: string): Promise<UserProfile> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }
    localStorage.setItem(LS_USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  async login(email: string, password: string): Promise<UserProfile> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials.');
    }
    localStorage.setItem(LS_USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  async getProfile(): Promise<UserProfile> {
    const cached = localStorage.getItem(LS_USER_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    const res = await fetch('/api/profile');
    const user = await res.json();
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    return user;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const user = await res.json();
    localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout(): void {
    localStorage.removeItem(LS_USER_KEY);
  },

  async getPlatformsStatus(): Promise<ExternalPlatformStatus[]> {
    try {
      const res = await fetch('/api/platforms/status');
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },
};

export function formatINR(amount: number): string {
  const num = Math.round(Number(amount) || 0);
  return `₹${num.toLocaleString('en-IN')}`;
}
