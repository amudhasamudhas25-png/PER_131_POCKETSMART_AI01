import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageView } from '../types/index.ts';
import heroInteriorImg from '../assets/images/hero_interior_showcase_1790687984124.jpg';
import partyEventImg from '../assets/images/planner_party_event_1790688002878.jpg';
import jewelryShowcaseImg from '../assets/images/planner_jewelry_showcase_1790688020526.jpg';

interface LandingPageProps {
  onNavigate: (page: PageView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const scrollToFeatures = () => {
    const el = document.getElementById('features-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('dashboard');
    }
  };

  const steps = [
    {
      num: '01.',
      title: 'Enter your requirements',
      desc: 'Specify your room dimensions, event guest count, or outfit details and upload an optional reference photo.',
    },
    {
      num: '02.',
      title: 'Set your budget',
      desc: 'Define your hard spending ceiling in INR. Our budget validator guarantees total allocations never exceed your cap.',
    },
    {
      num: '03.',
      title: 'Let Gemini analyze your needs',
      desc: 'Gemini evaluates priorities, style compatibility, and unit quantities to structure category-level allocations.',
    },
    {
      num: '04.',
      title: 'Receive personalized recommendations',
      desc: 'Review itemized recommendations with estimated unit prices, style match reasoning, and lower-cost alternatives.',
    },
    {
      num: '05.',
      title: 'Compare and save your recommendations',
      desc: 'Generate instant alternatives, bookmark individual items, or export your complete budget summary.',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 pt-10 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
              <span className="text-emerald-700 font-semibold">
                Strict Budget-Cap Enforcement
              </span>
              <span aria-hidden="true">·</span>
              <span>Powered by Google Gemini</span>
            </div>

            <div className="space-y-3">
              <h1
                className="font-display text-4xl sm:text-5xl lg:text-[54px] font-semibold text-slate-900 tracking-tight leading-[1.1]"
                style={{ textWrap: 'balance' }}
              >
                PocketSmart AI
              </h1>
              <p className="font-display text-xl sm:text-2xl text-slate-700 font-medium">
                Your Smart Budget & Recommendation Assistant
              </p>
            </div>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              Plan smarter. Spend better. Get personalized AI recommendations within your budget across Home Interiors, Parties & Events, and Fine & Fashion Jewelry.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Start Planning</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={scrollToFeatures}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 border border-slate-300 bg-white hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Explore Features</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-200 grid grid-cols-3 gap-6 text-xs">
              <div>
                <p className="font-mono text-lg font-semibold text-slate-900 tabular-nums">
                  100%
                </p>
                <p className="text-slate-500">Hard budget-cap compliance</p>
              </div>
              <div>
                <p className="font-mono text-lg font-semibold text-slate-900 tabular-nums">
                  3 Modules
                </p>
                <p className="text-slate-500">Home · Party · Jewelry</p>
              </div>
              <div>
                <p className="font-mono text-lg font-semibold text-slate-900 tabular-nums">
                  8–15%
                </p>
                <p className="text-slate-500">Automated contingency buffer</p>
              </div>
            </div>
          </div>

          {/* Focal Carrier Image with Measured Scrim */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-16/10">
              <img
                src={heroInteriorImg}
                alt="Modern minimalist living room planned with PocketSmart AI"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-emerald-300 font-medium">
                      Sample Living Room Allocation · Modern Style
                    </p>
                    <p className="font-display text-xl font-semibold">
                      5 Furnishing & Lighting Groups Under ₹1,00,000
                    </p>
                  </div>
                  <div className="font-mono text-right tabular-nums">
                    <p className="text-xs text-slate-300">Allocated / Cap</p>
                    <p className="text-lg font-semibold text-white">
                      ₹84,200 / ₹1,00,000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE FEATURE CARDS (ASYMMETRIC BENTO GRID) */}
      <section id="features-section" className="max-w-[1440px] mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">
              Three Specialized Planning Modules
            </p>
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              Purpose-Built AI Planners for High-Stakes Purchases
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Every module pairs Gemini reasoning with deterministic budget validation so you never overspend.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Home Planner (Wide col-span-12 lg:col-span-6) */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between">
            <div className="aspect-16/9 bg-slate-100 overflow-hidden border-b border-slate-100">
              <img
                src={heroInteriorImg}
                alt="Home Interior Budget Planner preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs text-slate-500">
                  <span>01. Home Planner</span>
                  <span aria-hidden="true" className="mx-1.5">·</span>
                  <span>Living Room, Bedroom, Kitchen & Office</span>
                </div>
                <h3 className="font-display text-2xl font-semibold text-slate-900">
                  Home Planner
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Plan your home purchases according to your budget and style. Specify item quantities, preferred room styles, and lighting requirements to receive a complete category allocation and itemized breakdown.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  Demo Cap: ₹1,00,000 · 5 Item Groups
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('home-planner')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Launch Home Planner</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Party Planner */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between">
            <div className="aspect-4/3 bg-slate-100 overflow-hidden border-b border-slate-100">
              <img
                src={partyEventImg}
                alt="Party and Event Budget Planner preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs text-slate-500">
                  <span>02. Party Planner</span>
                  <span aria-hidden="true" className="mx-1.5">·</span>
                  <span>Per-Guest Costing</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  Party Planner
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Organize your event and intelligently allocate your budget across catering, venue, decoration, photography, and entertainment.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  10–500+ Guests
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('party-planner')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Plan an Event</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Jewelry Planner */}
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between">
            <div className="aspect-4/3 bg-slate-100 overflow-hidden border-b border-slate-100">
              <img
                src={jewelryShowcaseImg}
                alt="Jewelry Recommendation Planner preview"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-xs text-slate-500">
                  <span>03. Jewelry Planner</span>
                  <span aria-hidden="true" className="mx-1.5">·</span>
                  <span>Multimodal Vision</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-slate-900">
                  Jewelry Planner
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Find jewelry recommendations based on your occasion, outfit and style. Upload an outfit photo for Gemini vision color & neckline matching.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500 tabular-nums">
                  Vision Enabled
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('jewelry-planner')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Find Jewelry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW POCKETSMART AI WORKS */}
      <section className="max-w-[1440px] mx-auto px-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 md:p-12 space-y-8">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold text-slate-500">
              5-Step Workflow
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-slate-900">
              How PocketSmart AI Works
            </h2>
            <p className="text-sm text-slate-600">
              From initial budget entry to validated category allocations and downloadable summaries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pt-2">
            {steps.map((step) => (
              <div
                key={step.num}
                className="border-t-2 border-slate-900 pt-4 space-y-2"
              >
                <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                  {step.num}
                </span>
                <h3 className="text-sm font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF ADJACENCY & TRANSPARENCY SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-emerald-700">
              Verified User Outcome
            </p>
            <blockquote className="font-display text-xl text-slate-900 leading-relaxed">
              “Before PocketSmart AI, our living room renovation quotes ran ₹38,000 over our ₹1,00,000 limit. Using the Home Planner, we rebalanced our sofa and BLDC fan allocations and finished at ₹84,200 with ₹15,800 still in reserve.”
            </blockquote>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-900">Priya Nair</span>
              <span aria-hidden="true" className="mx-1.5">·</span>
              <span>Product Designer, Bengaluru</span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('testimonials')}
              className="font-semibold text-slate-900 hover:underline cursor-pointer"
            >
              Read More Case Studies →
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900 text-white rounded-xl p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Transparent AI Recommendation Policy</span>
            </div>
            <h3 className="font-display text-xl font-semibold">
              Clear Distinction Between AI Estimates & Partner Feeds
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              PocketSmart AI clearly labels every generated item as an "AI Recommendation" with realistic market price estimates, never fabricating fake retail links or unverified stock claims.
            </p>
          </div>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => onNavigate('home-planner')}
              className="w-full py-2.5 px-4 bg-white text-slate-900 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Try the Home Budget Planner Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
