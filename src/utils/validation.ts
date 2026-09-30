import {
  HomePlannerInput,
  PartyPlannerInput,
  JewelryPlannerInput,
} from '../types/index.ts';

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateHomeInput(input: Partial<HomePlannerInput>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.totalBudget || Number(input.totalBudget) <= 0) {
    errors.totalBudget = 'Please enter a valid total budget greater than ₹0.';
  }
  if (!input.roomType || input.roomType.trim() === '') {
    errors.roomType = 'Room type is required.';
  }
  if (!input.stylePreference || input.stylePreference.trim() === '') {
    errors.stylePreference = 'Style preference is required.';
  }
  if (!input.items || input.items.length === 0) {
    errors.items = 'Please add at least one item to your room plan.';
  } else {
    const invalidQty = input.items.some(
      (i) => !i.name || i.name.trim() === '' || !i.quantity || Number(i.quantity) <= 0
    );
    if (invalidQty) {
      errors.items = 'Every item must have a valid name and a quantity greater than 0.';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validatePartyInput(input: Partial<PartyPlannerInput>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.totalBudget || Number(input.totalBudget) <= 0) {
    errors.totalBudget = 'Please enter a valid event budget greater than ₹0.';
  }
  if (!input.guestCount || Number(input.guestCount) <= 0) {
    errors.guestCount = 'Guest count must be greater than 0.';
  }
  if (!input.eventType || input.eventType.trim() === '') {
    errors.eventType = 'Event type is required.';
  }
  if (!input.venue || input.venue.trim() === '') {
    errors.venue = 'Venue selection is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateJewelryInput(input: Partial<JewelryPlannerInput>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.budget || Number(input.budget) <= 0) {
    errors.budget = 'Please enter a valid jewelry budget greater than ₹0.';
  }
  if (!input.occasion || input.occasion.trim() === '') {
    errors.occasion = 'Occasion is required.';
  }
  if (!input.style || input.style.trim() === '') {
    errors.style = 'Style preference is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
