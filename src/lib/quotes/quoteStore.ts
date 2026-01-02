import { create } from 'zustand';

import type { SessionQuotes, QuoteCategory } from './quotes';
import { generateSessionQuotes, getQuoteForCategory } from './quotes';

interface QuoteState {
  /** Session quote selections - one index per category */
  sessionQuotes: SessionQuotes;
  /** Whether the store has been initialized */
  isInitialized: boolean;
}

interface QuoteActions {
  /** Get the quote for a specific category */
  getQuote: (category: QuoteCategory | null) => string | null;
}

type QuoteStore = QuoteState & QuoteActions;

/**
 * Session-scoped quote store.
 * Generates random quote selections once at app boot.
 * NOT persisted - new selections are made on each app launch.
 */
export const useQuoteStore = create<QuoteStore>()((_, get) => ({
  sessionQuotes: generateSessionQuotes(),
  isInitialized: true,

  getQuote: (category: QuoteCategory | null): string | null => {
    const { sessionQuotes } = get();
    return getQuoteForCategory(category, sessionQuotes);
  },
}));
