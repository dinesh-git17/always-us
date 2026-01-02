import type { ReactElement } from 'react';

import { BeginningPage } from '@components/BeginningPage';
import { ChoicePage } from '@components/ChoicePage';
import { Page } from '@components/Page';
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
    id: 'first-meeting',
    title: 'First Meeting',
    subtitle: 'The moment everything changed',
    testId: 'page-3',
  },
  {
    id: 'the-journey',
    title: 'The Journey',
    subtitle: 'Every step we took together',
    testId: 'page-4',
  },
  {
    id: 'our-traditions',
    title: 'Our Traditions',
    subtitle: 'The rituals that define us',
    testId: 'page-5',
  },
  {
    id: 'dreams-together',
    title: 'Dreams Together',
    subtitle: 'Where we see ourselves',
    testId: 'page-6',
  },
  {
    id: 'love-languages',
    title: 'Love Languages',
    subtitle: 'How we show we care',
    testId: 'page-7',
  },
  {
    id: 'commitments',
    title: 'Commitments',
    subtitle: 'What we promise to each other',
    testId: 'page-8',
  },
  {
    id: 'the-vows',
    title: 'The Vows',
    subtitle: 'Words from the heart',
    testId: 'page-9',
  },
  {
    id: 'promises',
    title: 'Promises',
    subtitle: 'Our sacred agreements',
    testId: 'page-10',
  },
  {
    id: 'witnesses',
    title: 'Witnesses',
    subtitle: 'Those who stand with us',
    testId: 'page-11',
  },
  {
    id: 'signatures',
    title: 'Signatures',
    subtitle: 'Sealing our commitment',
    testId: 'page-12',
  },
  {
    id: 'celebration',
    title: 'Celebration',
    subtitle: 'The beginning of forever',
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
