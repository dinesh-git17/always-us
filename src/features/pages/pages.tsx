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
import { NonRefundablePage } from '@components/NonRefundablePage';
import { Page } from '@components/Page';
import { PromisesPage } from '@components/PromisesPage';
import { SignaturesPage } from '@components/SignaturesPage';
import { TrustPage } from '@components/TrustPage';
import { WelcomePage } from '@components/WelcomePage';
import type { PageConfig } from '@features/navigation';

/**
 * Configuration for all 14 journey pages.
 * Content is placeholder text until Phase 2 implementation.
 */
export const pageConfigs: PageConfig[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    subtitle: 'Begin your journey together',
    testId: 'page-0',
  },
  {
    id: 'choice',
    title: 'We Chose Each Other',
    subtitle: 'Not by chance, but with intention.',
    testId: 'page-1',
  },
  {
    id: 'beginning',
    title: 'Where It All Began',
    subtitle: 'The start of something real.',
    testId: 'page-2',
  },
  {
    id: 'intent',
    title: 'Why I Made This',
    subtitle: 'Because what we have deserves intention.',
    testId: 'page-3',
  },
  {
    id: 'alignment',
    title: 'What This Means to Us',
    subtitle: 'A shared understanding, held with care.',
    testId: 'page-4',
  },
  {
    id: 'promises',
    title: 'What I Promise You',
    subtitle: 'Spoken with care, and meant deeply.',
    testId: 'page-5',
  },
  {
    id: 'everyday',
    title: 'How I Show Up Every Day',
    subtitle: 'In the small moments that matter most.',
    testId: 'page-6',
  },
  {
    id: 'hard-days',
    title: 'On the Hard Days',
    subtitle: 'When things feel heavy, you are not alone.',
    testId: 'page-7',
  },
  {
    id: 'trust',
    title: 'Trust and Loyalty',
    subtitle: 'So you never have to question where you stand.',
    testId: 'page-8',
  },
  {
    id: 'building',
    title: "What We're Building Together",
    subtitle: 'A future shaped with intention and care.',
    testId: 'page-9',
  },
  {
    id: 'non-refundable',
    title: 'The Non-Refundable Clause',
    subtitle: 'Chosen with intention. Kept with care.',
    testId: 'page-10',
  },
  {
    id: 'signatures',
    title: 'Signatures & Sealing',
    subtitle: 'A moment held with intention.',
    testId: 'page-11',
  },
  {
    id: 'eternal-validity',
    title: 'Eternal Validity',
    subtitle: 'Without expiration. Without conditions.',
    testId: 'page-12',
  },
  {
    id: 'finale',
    title: 'Final Words',
    subtitle: 'Where love is spoken, and meant.',
    testId: 'page-13',
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
