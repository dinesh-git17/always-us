import type { ReactElement } from 'react';

import { Page } from '@components/Page';
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
    id: 'partner-setup',
    title: 'Partner Setup',
    subtitle: 'Connect with your partner',
    testId: 'page-1',
  },
  {
    id: 'our-story',
    title: 'Our Story',
    subtitle: 'How it all began',
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
 * Each page is a placeholder until Phase 2 content implementation.
 */
export function renderPages(): ReactElement[] {
  return pageConfigs.map((config) => (
    <Page key={config.id} title={config.title} subtitle={config.subtitle} testId={config.testId} />
  ));
}
