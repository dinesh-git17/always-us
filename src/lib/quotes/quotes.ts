/**
 * Romantic epigraph quotes organized by page category.
 * These quotes appear as subtle footnotes at the bottom of specific pages,
 * adding emotional depth and variation to the journey experience.
 */

/** Available quote categories mapped to page IDs */
export type QuoteCategory =
  | 'intro'
  | 'we_chose_each_other'
  | 'where_it_all_began'
  | 'why_i_made_this'
  | 'what_this_means_to_us'
  | 'what_i_promise_you'
  | 'on_the_hard_days'
  | 'non_refundable_clause'
  | 'signatures_and_sealing'
  | 'eternal_validity'
  | 'final_words'
  | 'whenever_you_need_this';

/** Map of quote categories to their quote arrays */
export const QUOTES: Record<QuoteCategory, readonly string[]> = {
  intro: [
    'Some love stories begin quietly, and mean everything.',
    "You don't have to rush. You're already home.",
    'This space exists because you do.',
    "Every time you're here, I choose you again.",
    "There's nowhere else you need to be right now.",
  ],

  we_chose_each_other: [
    'The best choices feel calm, not loud.',
    "We didn't stumble into this. We stepped into it.",
    'Choosing you was never complicated.',
    'Some things feel right without needing reasons.',
    'We met, we stayed, we chose.',
  ],

  where_it_all_began: [
    'The beginning mattered because we took our time.',
    'Trust grows where patience lives.',
    'What started softly became something real.',
    'Not rushed. Not forced. Just honest.',
    'The best foundations are built slowly.',
  ],

  why_i_made_this: [
    'Love deserves intention, not assumptions.',
    'Some things are worth making space for.',
    'I made this because you matter to me.',
    'Clarity is a form of care.',
    "This wasn't spontaneous. It was thoughtful.",
  ],

  what_this_means_to_us: [
    'Knowing where you stand brings peace.',
    'We move forward without guessing.',
    'This is what it feels like to be aligned.',
    "Love feels safer when it's understood.",
    'Us, without confusion.',
  ],

  what_i_promise_you: [
    'Promises are quiet, steady things.',
    'Care is shown, not announced.',
    'Your heart is safe here.',
    'Consistency is my favorite form of love.',
    "I don't promise perfection. I promise presence.",
  ],

  on_the_hard_days: [
    "You don't have to be strong here.",
    'Even heavy days are lighter together.',
    "I'm not going anywhere.",
    "Feel everything. I'll stay.",
    'You are never too much for me.',
  ],

  non_refundable_clause: [
    'No returns. No regrets.',
    'Still my favorite choice.',
    'Chosen once. Chosen always.',
    "I checked. This one's permanent.",
    'Some decisions only get better with time.',
  ],

  signatures_and_sealing: [
    'This moment matters.',
    'Some things are sealed without ink.',
    'Intention is its own signature.',
    'Here is where meaning settles.',
    "This isn't rushed. It's chosen.",
  ],

  eternal_validity: [
    "Some love doesn't expire.",
    "Forever doesn't have to be loud.",
    'Still here. Still choosing.',
    "Time doesn't weaken what's real.",
    'This holds, even as years pass.',
  ],

  final_words: [
    'Love, chosen and kept.',
    "You are my heart's home.",
    "I'm still choosing you.",
    'This love stays.',
  ],

  whenever_you_need_this: [
    'You can come back to this whenever your heart feels tired.',
    "Some things don't ask for urgency. They just wait.",
    "This space stays gentle, no matter how long it's been.",
    "You don't have to remember everything. This will.",
    'Whenever you need calm, this is here.',
    'Nothing here fades with time.',
    "You're always welcome back.",
  ],
} as const;

/** Map page IDs to quote categories */
export const PAGE_TO_QUOTE_CATEGORY: Record<string, QuoteCategory | null> = {
  welcome: 'intro',
  choice: 'we_chose_each_other',
  beginning: 'where_it_all_began',
  intent: 'why_i_made_this',
  alignment: 'what_this_means_to_us',
  promises: 'what_i_promise_you',
  everyday: null, // Excluded from epigraphs
  'hard-days': 'on_the_hard_days',
  trust: null, // Excluded from epigraphs
  building: null, // Excluded from epigraphs
  'non-refundable': 'non_refundable_clause',
  signatures: 'signatures_and_sealing',
  'eternal-validity': 'eternal_validity',
  finale: 'final_words',
  whenever: 'whenever_you_need_this',
  love: null, // Final page - no epigraph, just the declaration
};

/** Type for session quote selections - one quote index per category */
export type SessionQuotes = Record<QuoteCategory, number>;

/**
 * Selects a random quote index for each category.
 * This should be called once per app session to ensure consistency.
 */
export function generateSessionQuotes(): SessionQuotes {
  const categories = Object.keys(QUOTES) as QuoteCategory[];
  const selections: Partial<SessionQuotes> = {};

  for (const category of categories) {
    const quoteCount = QUOTES[category].length;
    selections[category] = Math.floor(Math.random() * quoteCount);
  }

  return selections as SessionQuotes;
}

/**
 * Retrieves the quote for a given category using the session selections.
 * Returns null if the category is null.
 */
export function getQuoteForCategory(
  category: QuoteCategory | null,
  sessionQuotes: SessionQuotes
): string | null {
  if (category === null) {
    return null;
  }

  const quotes = QUOTES[category];
  const selectedIndex = sessionQuotes[category];

  return quotes[selectedIndex];
}
