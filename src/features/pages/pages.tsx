import type { ReactElement } from 'react';

import { AlignmentPage } from '@components/AlignmentPage';
import { BeginningPage } from '@components/BeginningPage';
import { BuildingPage } from '@components/BuildingPage';
import { ChoicePage } from '@components/ChoicePage';
import { EternalValidityPage } from '@components/EternalValidityPage';
import { EverydayPage } from '@components/EverydayPage';
import { FinalPage } from '@components/FinalPage';
import { HardDaysPage } from '@components/HardDaysPage';
import { IntentPage } from '@components/IntentPage';
import { LovePage } from '@components/LovePage';
import { NonRefundablePage } from '@components/NonRefundablePage';
import { Page } from '@components/Page';
import { PromisesPage } from '@components/PromisesPage';
import { SignaturesPage } from '@components/SignaturesPage';
import { TrustPage } from '@components/TrustPage';
import { WelcomePage } from '@components/WelcomePage';
import { WheneverPage } from '@components/WheneverPage';
import type { PageConfig } from '@features/navigation';

/**
 * Configuration for all 16 journey pages.
 * Content is placeholder text until Phase 2 implementation.
 *
 * quoteCategory: Controls which epigraph quotes appear on each page.
 * Pages with null quoteCategory show no epigraph (excluded pages).
 *
 * epigraphDelay: Calculated as (last element delay + animation duration + 0.3s buffer).
 * This ensures quotes appear after page content finishes animating.
 */
export const pageConfigs: PageConfig[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    subtitle: 'Begin your journey together',
    testId: 'page-0',
    quoteCategory: 'intro',
    epigraphDelay: 7.9, // 9 elements × 0.8s stagger + 0.8s duration + 0.3s buffer
  },
  {
    id: 'choice',
    title: 'We Chose Each Other',
    subtitle: 'Not by chance, but with intention.',
    testId: 'page-1',
    quoteCategory: 'we_chose_each_other',
    epigraphDelay: 2.5, // REASSURANCE: 6 elements, last delay 1.4s + 0.8s + 0.3s
  },
  {
    id: 'beginning',
    title: 'Where It All Began',
    subtitle: 'The start of something real.',
    testId: 'page-2',
    quoteCategory: 'where_it_all_began',
    epigraphDelay: 2.5, // REASSURANCE: 6 elements
  },
  {
    id: 'intent',
    title: 'Why I Made This',
    subtitle: 'Because what we have deserves intention.',
    testId: 'page-3',
    quoteCategory: 'why_i_made_this',
    epigraphDelay: 2.25, // REASSURANCE: 5 elements, last delay 1.15s + 0.8s + 0.3s
  },
  {
    id: 'alignment',
    title: 'What This Means to Us',
    subtitle: 'A shared understanding, held with care.',
    testId: 'page-4',
    quoteCategory: 'what_this_means_to_us',
    epigraphDelay: 2.5, // REASSURANCE: 6 elements
  },
  {
    id: 'promises',
    title: 'What I Promise You',
    subtitle: 'Spoken with care, and meant deeply.',
    testId: 'page-5',
    quoteCategory: 'what_i_promise_you',
    epigraphDelay: 4.5, // VOW: 7 elements, last delay 3.4s + 0.8s + 0.3s
  },
  {
    id: 'everyday',
    title: 'How I Show Up Every Day',
    subtitle: 'In the small moments that matter most.',
    testId: 'page-6',
    quoteCategory: null, // Excluded from epigraphs
  },
  {
    id: 'hard-days',
    title: 'On the Hard Days',
    subtitle: 'When things feel heavy, you are not alone.',
    testId: 'page-7',
    quoteCategory: 'on_the_hard_days',
    epigraphDelay: 3.5, // ANCHOR: 6 elements, last delay 2.4s + 0.8s + 0.3s
  },
  {
    id: 'trust',
    title: 'Trust and Loyalty',
    subtitle: 'So you never have to question where you stand.',
    testId: 'page-8',
    quoteCategory: null, // Excluded from epigraphs
  },
  {
    id: 'building',
    title: "What We're Building Together",
    subtitle: 'A future shaped with intention and care.',
    testId: 'page-9',
    quoteCategory: null, // Excluded from epigraphs
  },
  {
    id: 'non-refundable',
    title: 'The Non-Refundable Clause',
    subtitle: 'Chosen with intention. Kept with care.',
    testId: 'page-10',
    quoteCategory: 'non_refundable_clause',
    epigraphDelay: 2.4, // SMILE: 6 elements with closer, last delay 1.5s + 0.6s + 0.3s
  },
  {
    id: 'signatures',
    title: 'Signatures & Sealing',
    subtitle: 'A moment held with intention.',
    testId: 'page-11',
    quoteCategory: 'signatures_and_sealing',
    epigraphDelay: 6.35, // CEREMONIAL: 6 elements with pause, last delay 4.85s + 1.2s + 0.3s
  },
  {
    id: 'eternal-validity',
    title: 'Eternal Validity',
    subtitle: 'Without expiration. Without conditions.',
    testId: 'page-12',
    quoteCategory: 'eternal_validity',
    epigraphDelay: 4.85, // TIMELESS: 6 elements, last delay 3.35s + 1.2s + 0.3s
  },
  {
    id: 'finale',
    title: 'Final Words',
    subtitle: 'Where love is spoken, and meant.',
    testId: 'page-13',
    quoteCategory: 'final_words',
    epigraphDelay: 7.95, // FINALE: 7 elements with signature, last delay 6.15s + 1.5s + 0.3s
  },
  {
    id: 'whenever',
    title: 'Whenever You Need This',
    subtitle: '',
    testId: 'page-14',
    quoteCategory: 'whenever_you_need_this',
    epigraphDelay: 4.85, // TIMELESS: 6 elements, last delay 3.35s + 1.2s + 0.3s
  },
  {
    id: 'love',
    title: 'I love you',
    subtitle: '',
    testId: 'page-15',
    quoteCategory: null, // No epigraph - intimate close
  },
];

/**
 * Renders all journey pages as React elements.
 * Special content pages (like Welcome) use custom components.
 */
export function renderPages(): ReactElement[] {
  return pageConfigs.map((config) => {
    // Welcome page uses a dedicated component with staggered animations
    if (config.id === 'welcome') {
      return <WelcomePage key={config.id} testId={config.testId} />;
    }

    // Choice page ("We Chose Each Other") uses a dedicated component
    if (config.id === 'choice') {
      return <ChoicePage key={config.id} testId={config.testId} />;
    }

    // Beginning page ("Where It All Began") uses reflective animation timing
    if (config.id === 'beginning') {
      return <BeginningPage key={config.id} testId={config.testId} />;
    }

    // Intent page ("Why I Made This") uses reassurance animation timing
    if (config.id === 'intent') {
      return <IntentPage key={config.id} testId={config.testId} />;
    }

    // Alignment page ("What This Means to Us") uses reassurance animation timing
    if (config.id === 'alignment') {
      return <AlignmentPage key={config.id} testId={config.testId} />;
    }

    // Promises page ("What I Promise You") uses slower vow animation timing
    if (config.id === 'promises') {
      return <PromisesPage key={config.id} testId={config.testId} />;
    }

    // Everyday page ("How I Show Up Every Day") uses fluid everyday animation timing
    if (config.id === 'everyday') {
      return <EverydayPage key={config.id} testId={config.testId} />;
    }

    // Hard Days page ("On the Hard Days") uses grounding anchor animation timing
    if (config.id === 'hard-days') {
      return <HardDaysPage key={config.id} testId={config.testId} />;
    }

    // Trust page ("Trust and Loyalty") uses steady foundation animation timing
    if (config.id === 'trust') {
      return <TrustPage key={config.id} testId={config.testId} />;
    }

    // Building page ("What We're Building Together") uses optimistic horizon animation timing
    if (config.id === 'building') {
      return <BuildingPage key={config.id} testId={config.testId} />;
    }

    // Non-Refundable page ("The Non-Refundable Clause") uses playful smile animation timing
    if (config.id === 'non-refundable') {
      return <NonRefundablePage key={config.id} testId={config.testId} />;
    }

    // Signatures page ("Signatures & Sealing") uses reverent ceremonial animation timing
    if (config.id === 'signatures') {
      return <SignaturesPage key={config.id} testId={config.testId} />;
    }

    // Eternal Validity page ("Eternal Validity") uses gentle timeless animation timing
    if (config.id === 'eternal-validity') {
      return <EternalValidityPage key={config.id} testId={config.testId} />;
    }

    // Final page ("Final Words") uses the slowest finale animation timing
    if (config.id === 'finale') {
      return <FinalPage key={config.id} testId={config.testId} />;
    }

    // Whenever page ("Whenever You Need This") - transitional page before intimate close
    if (config.id === 'whenever') {
      return <WheneverPage key={config.id} testId={config.testId} />;
    }

    // Love page ("I love you, Carolina.") - the final, intimate destination
    if (config.id === 'love') {
      return <LovePage key={config.id} testId={config.testId} />;
    }

    return (
      <Page
        key={config.id}
        title={config.title}
        subtitle={config.subtitle}
        testId={config.testId}
      />
    );
  });
}
