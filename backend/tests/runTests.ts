import assert from 'assert';
import { validateAndOptimizePlan } from '../utils/budgetValidator.ts';
import {
  generateFallbackHomePlan,
  generateFallbackPartyPlan,
  generateFallbackJewelryPlan,
} from '../services/fallbackService.ts';
import {
  validateHomeInput,
  validatePartyInput,
  validateJewelryInput,
} from '../../src/utils/validation.ts';
import { StorageService } from '../services/storageService.ts';

function runTestSuite() {
  console.log('Running PocketSmart AI Verification Suite...\n');

  // 1. Budget Calculation & Overflow Detection Test
  {
    const userBudget = 50000;
    const overflowingPlan = {
      title: 'Overflow Test Plan',
      categories: [
        {
          category: 'Furniture',
          allocatedAmount: 75000,
          recommendations: [
            {
              id: 't1',
              name: 'Luxury Sofa',
              category: 'Furniture',
              quantity: 1,
              estimatedUnitPrice: 55000,
              estimatedTotalPrice: 55000,
              reason: 'Test',
              styleMatch: 'Modern',
              budgetImpact: 'High',
              alternative: 'Modular Sofa',
              sourceLabel: 'AI Recommendation' as const,
            },
            {
              id: 't2',
              name: 'Dining Table',
              category: 'Furniture',
              quantity: 1,
              estimatedUnitPrice: 20000,
              estimatedTotalPrice: 20000,
              reason: 'Test',
              styleMatch: 'Modern',
              budgetImpact: 'Moderate',
              alternative: 'Compact Table',
              sourceLabel: 'AI Recommendation' as const,
            },
          ],
        },
      ],
    };

    const result = validateAndOptimizePlan(overflowingPlan, userBudget, 'home');
    assert.strictEqual(result.wasOptimized, true, 'Should detect budget overflow');
    assert.ok(
      result.budget.allocated <= userBudget,
      `Expected allocated (${result.budget.allocated}) <= ${userBudget}`
    );
    assert.strictEqual(
      result.budgetStatusMessage,
      'We optimized your plan to stay within your budget.'
    );
    console.log('✓ Test 1 Passed: Budget overflow detection and automatic optimization (<= ₹50,000)');
  }

  // 2. Fallback Home, Party, and Jewelry Recommendation Generation
  {
    const homePlan = generateFallbackHomePlan({
      totalBudget: 50000,
      roomType: 'Living Room',
      stylePreference: 'Modern',
      items: [
        { id: '1', name: 'Sofa', quantity: 1, category: 'Furniture' },
        { id: '2', name: 'Lights', quantity: 4, category: 'Lighting' },
      ],
      additionalRequirements: 'Warm lighting',
    });
    assert.ok(homePlan.budget.allocated <= 50000);
    assert.strictEqual(homePlan.isFallback, true);

    const partyPlan = generateFallbackPartyPlan({
      totalBudget: 50000,
      guestCount: 100,
      eventType: 'Birthday',
      venue: 'Banquet Hall',
      foodPreference: 'Mixed',
      decorationStyle: 'Elegant',
      entertainment: ['Music'],
      additionalRequirements: '',
    });
    assert.ok(partyPlan.budget.allocated <= 50000);
    assert.ok((partyPlan.budget.costPerGuest || 0) <= 500);

    const jewelryPlan = generateFallbackJewelryPlan({
      budget: 25000,
      occasion: 'Wedding',
      jewelryType: 'Necklace',
      style: 'Traditional',
      metalPreference: 'Gold',
      outfitDescription: 'Red silk saree',
    });
    assert.ok(jewelryPlan.budget.allocated <= 25000);
    console.log('✓ Test 2 Passed: Deterministic fallback plans for Home, Party, and Jewelry stay within budget');
  }

  // 3. Form Validation Tests (Budget = 0 and missing fields)
  {
    const invalidHome = validateHomeInput({
      totalBudget: 0,
      roomType: 'Living Room',
      stylePreference: 'Modern',
      items: [],
    });
    assert.strictEqual(invalidHome.valid, false);
    assert.ok(invalidHome.errors.totalBudget);
    assert.ok(invalidHome.errors.items);

    const invalidParty = validatePartyInput({
      totalBudget: 50000,
      guestCount: 0,
      eventType: 'Birthday',
      venue: 'Hotel',
    });
    assert.strictEqual(invalidParty.valid, false);
    assert.ok(invalidParty.errors.guestCount);

    const invalidJewelry = validateJewelryInput({
      budget: -100,
      occasion: 'Wedding',
      style: 'Traditional',
    });
    assert.strictEqual(invalidJewelry.valid, false);
    assert.ok(invalidJewelry.errors.budget);
    console.log('✓ Test 3 Passed: Form validation catches ₹0 budget, invalid quantities, and missing fields');
  }

  // 4. History & Saved Storage Tests
  {
    const historyBefore = StorageService.getHistory();
    assert.ok(historyBefore.length >= 3, 'Should have initial demo plans');
    const savedBefore = StorageService.getSaved();
    assert.ok(savedBefore.length >= 2, 'Should have initial saved recommendations');
    console.log('✓ Test 4 Passed: Persistent History and Saved Recommendations storage verified');
  }

  console.log('\nAll PocketSmart AI tests passed successfully!');
}

runTestSuite();
