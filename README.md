# PocketSmart AI — Your Smart Budget & Recommendation Assistant

PocketSmart AI is a full-stack, GenAI-powered budget planning and personalized recommendation assistant built for Google AI Studio. It helps users plan spending and receive budget-validated recommendations across three core modules:

1. **Home Interior Budget Planner** — Room-specific furniture, lighting, electrical, and decor allocation within a strict INR cap.
2. **Party & Event Budget Planner** — Guest-count-aware catering, venue, decoration, and entertainment budgeting with per-guest cost analysis.
3. **Jewelry Budget Planner (Multimodal Vision)** — Occasion, metal, and style-based jewelry recommendations with optional outfit image analysis using Google Gemini's multimodal capabilities.

---

## Key Features

- **Strict Budget-Cap Validation (`<= User Budget`)**: Every generated plan is validated by `validateAndOptimizePlan`. If raw estimates exceed the user's budget, PocketSmart AI automatically rebalances category allocations and item tiers so the final plan never exceeds the user's budget.
- **Honest Product-Data Labeling**: Clearly distinguishes between **AI Recommendations / AI Estimated Recommendations** and verified external vendor feeds. Never fabricates fake retail URLs, SKU IDs, or fake star ratings.
- **Multimodal Outfit Image Analysis**: Upload a JPG, JPEG, PNG, or WEBP outfit photo (or click **"Use Sample Red Silk Saree Image"**) in the Jewelry Planner for Gemini vision analysis of dominant colors, zari/embroidery work, and neckline compatibility.
- **Deterministic Fallback Mode**: If Gemini is temporarily unavailable or unconfigured, the application automatically switches to a rule-based fallback engine and displays `"Gemini is currently unavailable. Showing fallback recommendations."`
- **Interactive Budget Visualization**: SVG Donut Chart, Category Allocation horizontal progress bars, Remaining Reserve buffer, and Per-Guest Cost calculation.
- **Complete Workflow**: Landing Page → Register/Login → Dashboard → Planner Forms → Gemini Analysis → Recommendations → Item Details Modal → Find Alternatives → Save Recommendations → History → Download/Print Summary.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express (`server.ts`), Vite Middleware
- **AI Engine**: `@google/genai` SDK (`gemini-3.8-flash`) with structured `responseSchema` and multimodal `inlineData`
- **Persistence**: Server-side JSON file store (`backend/data/store.json`) pre-seeded with realistic demo data + client `localStorage` session sync

---

## Folder Structure

```text
/
├── backend/
│   ├── data/
│   │   └── store.json               # Persistent plans, saved items & users
│   ├── prompts/
│   │   └── plannerPrompts.ts        # System instructions & Gemini JSON schemas
│   ├── services/
│   │   ├── externalPlatforms.ts     # Amazon, Flipkart, IKEA, Swiggy, Zomato, OYO adapters
│   │   ├── fallbackService.ts       # Deterministic fallback recommendation engine
│   │   ├── geminiService.ts         # Server-side @google/genai integration
│   │   └── storageService.ts        # Persistent history, saved items & auth service
│   ├── tests/
│   │   └── runTests.ts              # Automated test suite
│   └── utils/
│       └── budgetValidator.ts       # Hard budget cap validator & auto-optimizer
├── src/
│   ├── assets/images/               # Generated showcase & sample saree assets
│   ├── components/
│   │   ├── BudgetVisualization.tsx  # Donut chart & category progress bars
│   │   ├── Footer.tsx
│   │   ├── ImageUploader.tsx        # Multimodal outfit image uploader
│   │   ├── LoadingState.tsx         # Multi-step animated AI progress state
│   │   ├── Navbar.tsx               # 3-zone top navigation bar
│   │   ├── PlanResultsView.tsx      # Unified recommendations, insights & export view
│   │   ├── RecommendationCard.tsx
│   │   ├── RecommendationDetailModal.tsx
│   │   └── Sidebar.tsx              # Workspace navigation sidebar
│   ├── pages/
│   │   ├── AuthPages.tsx            # Login & Register pages with validation
│   │   ├── DashboardPage.tsx        # Analytics & recent plans table
│   │   ├── HistoryPage.tsx          # Recommendation History (View, Reuse, Delete)
│   │   ├── HomePlannerPage.tsx      # Home Interior Budget Planner form
│   │   ├── JewelryPlannerPage.tsx   # Jewelry Recommendation Planner form
│   │   ├── LandingPage.tsx          # Hero, Bento features & 5-step guide
│   │   ├── PartyPlannerPage.tsx     # Party & Event Budget Planner form
│   │   ├── ProfilePage.tsx          # User settings & External API status table
│   │   ├── SavedRecommendationsPage.tsx
│   │   └── TestimonialsPage.tsx
│   ├── services/
│   │   └── api.ts                   # Client API wrapper
│   ├── types/
│   │   └── index.ts                 # Shared TypeScript interfaces
│   ├── utils/
│   │   └── validation.ts            # Shared form validation rules
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── package.json
├── README.md
└── server.ts                        # Express + Vite full-stack entry point
```

---

## Environment Variables & Gemini API Setup

Copy `.env.example` to `.env` (or configure secrets in the **Google AI Studio Settings > Secrets** panel):

```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
AUTH_SECRET="pocketsmart_demo_secret_key"
```

- `GEMINI_API_KEY` is accessed strictly on the server (`backend/services/geminiService.ts`) and is never exposed in client-side code.

---

## Installation & Commands

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start development server (Port 3000)**:
   ```bash
   npm run dev
   ```
3. **Run automated verification tests**:
   ```bash
   npm test
   ```
4. **Type-check & build for production**:
   ```bash
   npm run lint
   npm run build
   ```

---

## How to Demo & Test Each Planner

1. **Home Planner Demo**:
   - Navigate to **Home Planner** (pre-loaded with ₹1,00,000, Living Room, Modern style, and 5 items: Sofa × 1, Fans × 2, Lights × 6, Coffee Table × 1, Curtains × 4).
   - Click **Generate AI Plan** to inspect the category allocation, Donut chart, AI Insights, and itemized recommendations.
2. **Party Planner Demo**:
   - Navigate to **Party Planner** (pre-loaded with ₹75,000, 100 Guests, Birthday, Banquet Hall).
   - Click **Generate Party Plan** to see per-guest catering math and venue/decor allocations.
3. **Jewelry Planner (Multimodal) Demo**:
   - Navigate to **Jewelry Planner** (pre-loaded with ₹30,000, Wedding, Traditional, Red silk saree with gold border).
   - Click **"Use Sample Red Silk Saree Image"** (or upload your own photo) and click **Generate Jewelry Recommendations** to view Gemini's outfit color/embroidery analysis and matched jewelry pieces.
