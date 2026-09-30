import React, { useEffect, useState } from 'react';
import {
  GeneratedPlanResponse,
  HomePlannerInput,
  JewelryPlannerInput,
  PageView,
  PartyPlannerInput,
  RecommendationItem,
  SavedRecommendation,
  UserProfile,
} from './types/index.ts';
import { ApiService, formatINR } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { TestimonialsPage } from './pages/TestimonialsPage.tsx';
import { AuthPages } from './pages/AuthPages.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { HomePlannerPage } from './pages/HomePlannerPage.tsx';
import { PartyPlannerPage } from './pages/PartyPlannerPage.tsx';
import { JewelryPlannerPage } from './pages/JewelryPlannerPage.tsx';
import { PlanResultsView } from './components/PlanResultsView.tsx';
import { HistoryPage } from './pages/HistoryPage.tsx';
import { SavedRecommendationsPage } from './pages/SavedRecommendationsPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { RecommendationDetailModal } from './components/RecommendationDetailModal.tsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<GeneratedPlanResponse[]>([]);
  const [saved, setSaved] = useState<SavedRecommendation[]>([]);

  // Active plan & inputs for reuse/regeneration
  const [activePlan, setActivePlan] = useState<GeneratedPlanResponse | null>(null);
  const [homeDraft, setHomeDraft] = useState<HomePlannerInput | undefined>(undefined);
  const [partyDraft, setPartyDraft] = useState<PartyPlannerInput | undefined>(undefined);
  const [jewelryDraft, setJewelryDraft] = useState<JewelryPlannerInput | undefined>(undefined);

  // Loading & Error states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingAltId, setGeneratingAltId] = useState<string | null>(null);
  const [plannerError, setPlannerError] = useState<string | null>(null);

  // Detail modal & Toast
  const [detailItem, setDetailItem] = useState<RecommendationItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  useEffect(() => {
    Promise.all([
      ApiService.getProfile(),
      ApiService.getHistory(),
      ApiService.getSaved(),
    ]).then(([profileData, historyData, savedData]) => {
      setUser(profileData);
      setHistory(historyData);
      setSaved(savedData);
      if (historyData.length > 0) {
        setActivePlan(historyData[0]);
      }
    });
  }, []);

  const handleNavigate = (page: PageView) => {
    setPlannerError(null);
    // If navigating directly to a recommendations page without an active plan of that type, select one from history if available
    if (page === 'home-recommendations') {
      const found =
        activePlan?.plannerType === 'home'
          ? activePlan
          : history.find((h) => h.plannerType === 'home');
      if (found) setActivePlan(found);
      else {
        setCurrentPage('home-planner');
        return;
      }
    } else if (page === 'party-recommendations') {
      const found =
        activePlan?.plannerType === 'party'
          ? activePlan
          : history.find((h) => h.plannerType === 'party');
      if (found) setActivePlan(found);
      else {
        setCurrentPage('party-planner');
        return;
      }
    } else if (page === 'jewelry-recommendations') {
      const found =
        activePlan?.plannerType === 'jewelry'
          ? activePlan
          : history.find((h) => h.plannerType === 'jewelry');
      if (found) setActivePlan(found);
      else {
        setCurrentPage('jewelry-planner');
        return;
      }
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- GENERATE HANDLERS ---

  const handleGenerateHome = async (input: HomePlannerInput) => {
    setPlannerError(null);
    setIsGenerating(true);
    setHomeDraft(input);
    try {
      const plan = await ApiService.generateHomePlan(input);
      setActivePlan(plan);
      setHistory((prev) => [plan, ...prev.filter((p) => p.id !== plan.id)]);
      setCurrentPage('home-recommendations');
      showToast('Home interior budget plan generated within your cap.');
    } catch (err: any) {
      setPlannerError(
        err.message ||
          'Something went wrong while generating your recommendations. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateParty = async (input: PartyPlannerInput) => {
    setPlannerError(null);
    setIsGenerating(true);
    setPartyDraft(input);
    try {
      const plan = await ApiService.generatePartyPlan(input);
      setActivePlan(plan);
      setHistory((prev) => [plan, ...prev.filter((p) => p.id !== plan.id)]);
      setCurrentPage('party-recommendations');
      showToast('Party & event budget plan generated within your cap.');
    } catch (err: any) {
      setPlannerError(
        err.message ||
          'Something went wrong while generating your party plan. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateJewelry = async (input: JewelryPlannerInput) => {
    setPlannerError(null);
    setIsGenerating(true);
    setJewelryDraft(input);
    try {
      const plan = await ApiService.generateJewelryPlan(input);
      setActivePlan(plan);
      setHistory((prev) => [plan, ...prev.filter((p) => p.id !== plan.id)]);
      setCurrentPage('jewelry-recommendations');
      showToast('Jewelry recommendations generated within your budget.');
    } catch (err: any) {
      setPlannerError(
        err.message ||
          'Something went wrong while generating your jewelry recommendations. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateActivePlan = async () => {
    if (!activePlan) return;
    if (activePlan.plannerType === 'home') {
      await handleGenerateHome(activePlan.userInputs as HomePlannerInput);
    } else if (activePlan.plannerType === 'party') {
      await handleGenerateParty(activePlan.userInputs as PartyPlannerInput);
    } else if (activePlan.plannerType === 'jewelry') {
      await handleGenerateJewelry(activePlan.userInputs as JewelryPlannerInput);
    }
  };

  // --- ITEM ACTIONS (SAVE, REMOVE, FIND ALTERNATIVE) ---

  const handleSaveItem = async (item: RecommendationItem) => {
    const existing = saved.find(
      (s) => s.id === item.id || s.name === item.name
    );
    if (existing) {
      await ApiService.deleteSaved(existing.id);
      setSaved((prev) => prev.filter((s) => s.id !== existing.id));
      showToast(`Removed "${item.name}" from Saved Recommendations.`);
      return;
    }

    const savedRecord = await ApiService.saveRecommendation({
      id: item.id,
      name: item.name,
      plannerType: activePlan?.plannerType || 'home',
      category: item.category,
      quantity: item.quantity,
      estimatedUnitPrice: item.estimatedUnitPrice,
      estimatedTotalPrice: item.estimatedTotalPrice,
      reason: item.reason,
      styleMatch: item.styleMatch,
      budgetImpact: item.budgetImpact,
      alternative: item.alternative,
      sourceLabel: item.sourceLabel || 'AI Recommendation',
      aiTips: item.aiTips,
    });
    setSaved((prev) => [savedRecord, ...prev]);
    showToast(`Saved "${item.name}" to your shortlist.`);
  };

  const handleRemoveItemFromPlan = (itemId: string) => {
    if (!activePlan) return;
    const updatedCategories = activePlan.categories
      .map((cat) => {
        const filteredRecs = cat.recommendations.filter((r) => r.id !== itemId);
        const newCatAmount = filteredRecs.reduce(
          (sum, r) => sum + r.estimatedTotalPrice,
          0
        );
        return {
          ...cat,
          allocatedAmount: newCatAmount,
          recommendations: filteredRecs,
        };
      })
      .filter((cat) => cat.recommendations.length > 0);

    const newAllocated = updatedCategories.reduce(
      (sum, c) => sum + c.allocatedAmount,
      0
    );
    const newRemaining = Math.max(0, activePlan.budget.total - newAllocated);
    const newUtilization = Math.round(
      (newAllocated / Math.max(1, activePlan.budget.total)) * 100
    );

    const updatedPlan: GeneratedPlanResponse = {
      ...activePlan,
      budget: {
        ...activePlan.budget,
        allocated: newAllocated,
        remaining: newRemaining,
        utilizationPercentage: newUtilization,
      },
      categories: updatedCategories,
      aiInsights: `Updated plan uses ${newUtilization}% (${formatINR(
        newAllocated
      )}) of your ${formatINR(
        activePlan.budget.total
      )} budget, leaving ${formatINR(newRemaining)} in reserve.`,
    };

    setActivePlan(updatedPlan);
    setHistory((prev) =>
      prev.map((h) => (h.id === updatedPlan.id ? updatedPlan : h))
    );
    ApiService.savePlanToHistory(updatedPlan);
    showToast('Item removed and budget reserve recalculated.');
  };

  const handleFindAlternative = async (item: RecommendationItem) => {
    if (!activePlan) return;
    setGeneratingAltId(item.id);
    try {
      const maxCapForItem = item.estimatedTotalPrice + activePlan.budget.remaining;
      const replacement = await ApiService.generateAlternative(
        item,
        Math.min(item.estimatedTotalPrice, maxCapForItem),
        activePlan.plannerType
      );

      const updatedCategories = activePlan.categories.map((cat) => {
        const updatedRecs = cat.recommendations.map((r) =>
          r.id === item.id ? replacement : r
        );
        const catTotal = updatedRecs.reduce(
          (sum, r) => sum + r.estimatedTotalPrice,
          0
        );
        return {
          ...cat,
          allocatedAmount: catTotal,
          recommendations: updatedRecs,
        };
      });

      const newAllocated = updatedCategories.reduce(
        (sum, c) => sum + c.allocatedAmount,
        0
      );
      const newRemaining = Math.max(0, activePlan.budget.total - newAllocated);
      const newUtilization = Math.round(
        (newAllocated / Math.max(1, activePlan.budget.total)) * 100
      );

      const updatedPlan: GeneratedPlanResponse = {
        ...activePlan,
        budget: {
          ...activePlan.budget,
          allocated: newAllocated,
          remaining: newRemaining,
          utilizationPercentage: newUtilization,
        },
        categories: updatedCategories,
      };

      setActivePlan(updatedPlan);
      if (detailItem && detailItem.id === item.id) {
        setDetailItem(replacement);
      }
      setHistory((prev) =>
        prev.map((h) => (h.id === updatedPlan.id ? updatedPlan : h))
      );
      ApiService.savePlanToHistory(updatedPlan);
      showToast(`Swapped with alternative: ${replacement.name}`);
    } catch {
      showToast('Could not generate alternative right now.');
    } finally {
      setGeneratingAltId(null);
    }
  };

  // --- HISTORY & SAVED ACTIONS ---

  const handleOpenPlan = (plan: GeneratedPlanResponse) => {
    setActivePlan(plan);
    if (plan.plannerType === 'home') {
      setCurrentPage('home-recommendations');
    } else if (plan.plannerType === 'party') {
      setCurrentPage('party-recommendations');
    } else {
      setCurrentPage('jewelry-recommendations');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReusePlan = (plan: GeneratedPlanResponse) => {
    if (plan.plannerType === 'home') {
      setHomeDraft(plan.userInputs as HomePlannerInput);
      setCurrentPage('home-planner');
    } else if (plan.plannerType === 'party') {
      setPartyDraft(plan.userInputs as PartyPlannerInput);
      setCurrentPage('party-planner');
    } else {
      setJewelryDraft(plan.userInputs as JewelryPlannerInput);
      setCurrentPage('jewelry-planner');
    }
    showToast('Loaded plan inputs into the planner form.');
  };

  const handleDeleteHistory = async (id: string) => {
    await ApiService.deleteHistory(id);
    setHistory((prev) => prev.filter((h) => h.id !== id));
    showToast('Plan removed from history.');
  };

  const handleRemoveSaved = async (id: string) => {
    await ApiService.deleteSaved(id);
    setSaved((prev) => prev.filter((s) => s.id !== id));
    showToast('Removed from Saved Recommendations.');
  };

  const isWorkspaceView =
    currentPage !== 'landing' &&
    currentPage !== 'login' &&
    currentPage !== 'register';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onLogout={() => {
          ApiService.logout();
          setUser(null);
          setCurrentPage('landing');
          showToast('Signed out successfully.');
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-md border border-slate-700 no-print"
        >
          {toastMessage}
        </div>
      )}

      {/* Main Content Area */}
      {!isWorkspaceView ? (
        <main className="flex-1">
          {currentPage === 'landing' && (
            <LandingPage onNavigate={handleNavigate} />
          )}
          {(currentPage === 'login' || currentPage === 'register') && (
            <AuthPages
              mode={currentPage}
              onNavigate={handleNavigate}
              onAuthSuccess={(loggedInUser) => {
                setUser(loggedInUser);
                setCurrentPage('dashboard');
                showToast(`Welcome, ${loggedInUser.fullName}!`);
              }}
            />
          )}
        </main>
      ) : (
        <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            savedCount={saved.length}
            historyCount={history.length}
          />

          <main className="flex-1 p-6 md:p-8 lg:p-10 min-w-0">
            {currentPage === 'dashboard' && (
              <DashboardPage
                user={user}
                history={history}
                saved={saved}
                onNavigate={handleNavigate}
                onOpenPlan={handleOpenPlan}
              />
            )}

            {currentPage === 'testimonials' && (
              <TestimonialsPage onNavigate={handleNavigate} />
            )}

            {currentPage === 'home-planner' && (
              <HomePlannerPage
                initialInput={homeDraft}
                isLoading={isGenerating}
                error={plannerError}
                onSubmit={handleGenerateHome}
              />
            )}

            {currentPage === 'party-planner' && (
              <PartyPlannerPage
                initialInput={partyDraft}
                isLoading={isGenerating}
                error={plannerError}
                onSubmit={handleGenerateParty}
              />
            )}

            {currentPage === 'jewelry-planner' && (
              <JewelryPlannerPage
                initialInput={jewelryDraft}
                isLoading={isGenerating}
                error={plannerError}
                onSubmit={handleGenerateJewelry}
              />
            )}

            {(currentPage === 'home-recommendations' ||
              currentPage === 'party-recommendations' ||
              currentPage === 'jewelry-recommendations') &&
              activePlan && (
                <PlanResultsView
                  plan={activePlan}
                  savedItems={saved}
                  generatingAltId={generatingAltId}
                  isRegenerating={isGenerating}
                  onSaveItem={handleSaveItem}
                  onViewDetails={(item) => setDetailItem(item)}
                  onFindAlternative={handleFindAlternative}
                  onRemoveItem={handleRemoveItemFromPlan}
                  onRegeneratePlan={handleRegenerateActivePlan}
                  onSavePlan={() => {
                    ApiService.savePlanToHistory(activePlan);
                    showToast('Plan saved to your Recommendation History.');
                  }}
                  onStartNewPlan={() => {
                    if (activePlan.plannerType === 'home') {
                      setCurrentPage('home-planner');
                    } else if (activePlan.plannerType === 'party') {
                      setCurrentPage('party-planner');
                    } else {
                      setCurrentPage('jewelry-planner');
                    }
                  }}
                  onNavigate={handleNavigate}
                />
              )}

            {currentPage === 'history' && (
              <HistoryPage
                history={history}
                onViewPlan={handleOpenPlan}
                onReusePlan={handleReusePlan}
                onDeletePlan={handleDeleteHistory}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'saved' && (
              <SavedRecommendationsPage
                saved={saved}
                onViewDetails={(item) => setDetailItem(item)}
                onRemoveSaved={handleRemoveSaved}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'profile' && (
              <ProfilePage
                user={user}
                onUpdateUser={(u) => setUser(u)}
                onLogout={() => {
                  ApiService.logout();
                  setUser(null);
                  setCurrentPage('landing');
                  showToast('Signed out.');
                }}
              />
            )}
          </main>
        </div>
      )}

      <Footer onNavigate={handleNavigate} />

      {/* Recommendation Details Modal */}
      <RecommendationDetailModal
        item={detailItem}
        isSaved={Boolean(
          detailItem &&
            saved.some((s) => s.id === detailItem.id || s.name === detailItem.name)
        )}
        isGeneratingAlt={Boolean(detailItem && generatingAltId === detailItem.id)}
        onClose={() => setDetailItem(null)}
        onSave={handleSaveItem}
        onGenerateAlternative={handleFindAlternative}
      />
    </div>
  );
}
