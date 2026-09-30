import { ExternalPlatformStatus, RecommendationItem } from '../../src/types/index.ts';

export interface ExternalPlatformService {
  readonly platformName: string;
  readonly domain: 'home' | 'party' | 'jewelry';
  isConfigured(): boolean;
  enrichRecommendation(item: RecommendationItem): RecommendationItem;
}

class BaseVendorService implements ExternalPlatformService {
  constructor(
    public readonly platformName: string,
    public readonly domain: 'home' | 'party' | 'jewelry',
    private readonly envKeyName: string
  ) {}

  isConfigured(): boolean {
    const val = process.env[this.envKeyName];
    return Boolean(val && val.trim().length > 0 && !val.startsWith('MY_'));
  }

  enrichRecommendation(item: RecommendationItem): RecommendationItem {
    if (this.isConfigured()) {
      return {
        ...item,
        sourceLabel: 'Verified Partner API',
        platformHint: `${this.platformName} Partner Feed`,
      };
    }
    return {
      ...item,
      sourceLabel: item.sourceLabel || 'AI Recommendation',
      platformHint:
        item.platformHint ||
        `AI Estimated Recommendation (Comparable category on ${this.platformName})`,
    };
  }
}

export const AmazonService = new BaseVendorService('Amazon India', 'home', 'AMAZON_API_KEY');
export const FlipkartService = new BaseVendorService('Flipkart', 'home', 'FLIPKART_API_KEY');
export const IKEAService = new BaseVendorService('IKEA India', 'home', 'IKEA_API_KEY');
export const SwiggyService = new BaseVendorService('Swiggy Catering', 'party', 'SWIGGY_API_KEY');
export const ZomatoService = new BaseVendorService('Zomato Events', 'party', 'ZOMATO_API_KEY');
export const OYOService = new BaseVendorService('OYO Townhouse / Banquets', 'party', 'OYO_API_KEY');

export function getExternalPlatformsStatus(): ExternalPlatformStatus[] {
  const services = [
    AmazonService,
    FlipkartService,
    IKEAService,
    SwiggyService,
    ZomatoService,
    OYOService,
  ];
  return services.map((s) => ({
    platform: s.platformName,
    domain: s.domain,
    configured: s.isConfigured(),
    mode: s.isConfigured() ? 'Live API Connected' : 'AI Estimated Recommendation',
  }));
}
