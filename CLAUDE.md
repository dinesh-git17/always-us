# CLAUDE.md — Engineering Contract

**Project:** Always Us — Native iOS App
**Stack:** React 19+, TypeScript 5+ (strict), Vite 7+, Capacitor 8+, iOS (Swift/UIKit)
**Platform:** iOS (native via Capacitor)

---

## 1. Non-Negotiable Rules

### 1.1 TypeScript

- `strict: true` is immutable — no silencing errors via config
- `any` is banned — use `unknown` if type genuinely unknown
- All functions: explicit return types and parameter types
- Props interfaces: exported and named `{ComponentName}Props`
- `as` assertions require inline comment justification — never use `as any`

### 1.2 Code Cleanliness

- **No console.log** — ESLint will fail
- **No inline styles** — CSS modules or Tailwind only (document exceptions)
- **No commented-out code** — delete it, git history exists
- **No magic numbers** — use named constants or design tokens

### 1.3 Accessibility (WCAG AA)

- Keyboard accessible with visible focus indicators (never bare `outline: none`)
- Semantic HTML: proper heading hierarchy (h1→h2→h3), landmarks, button vs anchor
- ARIA: `aria-label` for icon-only buttons, no redundant ARIA
- Color contrast: 4.5:1 normal text, 3:1 large text/UI components
- Images: alt text required (empty `alt=""` for decorative)
- Touch targets: minimum 44x44pt for iOS

### 1.4 iOS/Capacitor Standards

- Test on physical iOS device — simulator is not sufficient for final validation
- Handle iOS safe areas properly (notch, home indicator)
- Respect iOS Human Interface Guidelines where applicable
- Use Capacitor plugins for native features — avoid web-only fallbacks for core functionality
- Build must succeed with `npm run cap:sync` before push

### 1.5 Performance

- Bundle limits: route < 200KB gzipped, first-load JS < 150KB
- Lazy load below-fold content, dynamic imports for heavy components
- Optimize for iOS WebView rendering performance
- Avoid layout thrashing — batch DOM reads/writes
- Profile memory usage — iOS WebViews have stricter limits

### 1.6 AI Attribution (Strictly Forbidden)

- Never mention "Claude", "AI", "assistant", "generated", "Anthropic" in commits, PRs, or code
- Write commit messages as human developer — no AI attribution comments
- Pre-commit hooks enforce this

---

## 2. Git Workflow

### 2.1 Branch Flow

```bash
git checkout main && git pull origin main    # Always start fresh
# Make changes, then create branch BEFORE committing:
git checkout -b feature/descriptive-name
```

### 2.2 Commit Format (Conventional Commits)

```
<type>(<scope>): <subject>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
**Scopes:** `ios`, `ui`, `core`, `nav`, `auth`, `data`, `config`, `ci`, `deps`

```bash
git commit -m "feat(ui): add relationship timeline component"
```

### 2.3 Branch Naming

| Prefix      | Purpose                   |
| ----------- | ------------------------- |
| `feature/`  | New functionality         |
| `fix/`      | Bug fixes                 |
| `perf/`     | Performance               |
| `a11y/`     | Accessibility             |
| `refactor/` | Code refactoring          |
| `hotfix/`   | Critical production fixes |

Rules: lowercase, hyphens, descriptive (not `feature/update`)

### 2.4 Branch Protection

- PR required, 1 reviewer, squash merge only
- CI must pass (lint, type-check, build, tests)
- Never commit/force-push to main

---

## 3. Code Quality

### 3.1 Automated Checks

**Pre-commit:** ESLint, Prettier, TypeScript (staged files)
**CI:** ESLint (zero warnings), type-check, build, tests

### 3.2 Rules

- Zero ESLint warnings in CI — no `eslint-disable` without justification
- Prettier config is immutable — run `npm run format` before commit
- No `@ts-ignore` without inline justification
- Build must pass locally before push

---

## 4. Component Standards

### 4.1 Structure

```typescript
import { type ReactNode } from 'react';

export interface MemoryCardProps {
  title: string;
  date: Date;
  imageUrl?: string;
  children?: ReactNode;
}

export function MemoryCard({ title, date, imageUrl, children }: MemoryCardProps): JSX.Element {
  return (
    <article className="memory-card">
      {imageUrl && <img src={imageUrl} alt="" className="memory-card__image" />}
      <h3 className="memory-card__title">{title}</h3>
      <time className="memory-card__date">{date.toLocaleDateString()}</time>
      {children}
    </article>
  );
}
```

### 4.2 Rules

- Functional components only — hooks for state/lifecycle
- Named exports for components/utilities, default exports for pages only
- Use `React.memo` only after profiling proves need
- Colocate related files: `ComponentName/ComponentName.tsx`, `index.ts`

---

## 5. Styling

- CSS modules or utility classes — no inline styles
- Design tokens for colors, spacing, typography
- Mobile-first: base styles for mobile, scale up for larger screens
- Dark mode support required
- Class naming: BEM or utility-based (be consistent)
- Respect iOS system font and sizing preferences

---

## 6. Naming Conventions

| Type             | Convention           | Example           |
| ---------------- | -------------------- | ----------------- |
| Components       | PascalCase           | `MemoryCard.tsx`  |
| Utilities        | camelCase            | `formatDate.ts`   |
| Non-components   | kebab-case           | `api-client.ts`   |
| Constants        | UPPER_SNAKE          | `API_URL`         |
| Booleans         | is/has/should prefix | `isLoading`       |
| Handlers         | handle/on prefix     | `handleTap`       |
| Props interfaces | `{Name}Props`        | `MemoryCardProps` |

---

## 7. Testing

**Coverage targets:** Utilities 80%, Components 70%, Overall 75%

```typescript
// Utility test
describe('formatDate', () => {
  it('formats date correctly', () => {
    expect(formatDate(new Date('2025-12-22'))).toBe('12/22/2025');
  });
});

// Component test
describe('MemoryCard', () => {
  it('renders title correctly', () => {
    render(<MemoryCard title="Our First Date" date={new Date()} />);
    expect(screen.getByRole('heading')).toHaveTextContent('Our First Date');
  });
});
```

**Commands:** `npm run test`, `npm run test:coverage`

---

## 8. Error Handling

- Never expose internal errors to users
- User-facing messages: actionable, warm tone appropriate for personal app
- Graceful degradation when offline
- Log errors for debugging, but sanitize sensitive data

---

## 9. Comments

- Comments explain **WHY**, not **WHAT**
- JSDoc for public APIs only
- No emojis, casual language, or "I think" commentary
- TODO format: `// TODO(username): description`

---

## 10. Architecture

```
src/
├── components/    # React components (colocated with tests)
├── hooks/         # Custom React hooks
├── lib/           # Utilities, constants, types
├── pages/         # Route-level components
├── services/      # API clients, data layer
└── styles/        # Global styles, design tokens
public/            # Static assets
ios/               # Capacitor iOS project (do not edit manually unless necessary)
```

- Use absolute imports: `@/components/MemoryCard`
- Components: UI only, no business logic
- Utilities: pure functions, thoroughly tested

---

## 11. Deployment

- All CI checks must pass — no exceptions
- Test on physical iOS device before release
- Production builds from main only
- Use TestFlight for beta distribution

---

## 12. Enforcement

- CI failures block merge — no override
- Every PR requires review
- Reviewer verifies: code quality, tests, accessibility, performance, compliance

---

## 13. Codebase Reference

### 13.1 Directory Structure (Actual)

```
src/
├── app/
│   └── AppShell/                    # Root layout with safe areas
│       ├── AppShell.tsx             # Header (ProgressIndicator), Main (DeckNavigator), Overlay (EpigraphLayer, ControlLayer)
│       └── AppShell.module.css
├── components/
│   ├── AlignmentPage/               # Page 5: "What This Means to Us"
│   ├── BeginningPage/               # Page 3: "Where It All Began"
│   ├── Button/                      # Primary button component
│   ├── ChoicePage/                  # Page 2: "We Chose Each Other"
│   ├── EverydayPage/                # Page 7: "How I Show Up Every Day"
│   ├── HardDaysPage/                # Page 8: "On the Hard Days"
│   ├── IntentPage/                  # Page 4: "Why I Made This"
│   ├── PromisesPage/                # Page 6: "What I Promise You"
│   ├── TrustPage/                   # Page 8: "Trust and Loyalty"
│   ├── BuildingPage/                # Page 9: "What We're Building Together"
│   ├── NonRefundablePage/           # Page 10: "The Non-Refundable Clause"
│   ├── SignaturesPage/              # Page 11: "Signatures & Sealing"
│   ├── EternalValidityPage/         # Page 12: "Eternal Validity"
│   ├── FinalPage/                   # Page 13: "Final Words"
│   ├── ControlLayer/                # Navigation tap zones with chevrons
│   ├── EpigraphLayer/               # Rotating quote overlay at bottom of pages
│   ├── ErrorBoundary.tsx            # Error handling wrapper
│   ├── Page/                        # Generic page wrapper
│   ├── ProgressIndicator/           # Top progress bar (hidden on page 0)
│   └── WelcomePage/                 # Page 1: Intro with staggered text
├── features/
│   ├── navigation/
│   │   ├── components/DeckNavigator/ # Page transition manager with Framer Motion
│   │   ├── hooks/
│   │   │   ├── useNavigation.ts      # Navigation context hook
│   │   │   └── useSwipeGesture.ts    # Horizontal swipe detection
│   │   ├── store/journeyStore.ts     # Zustand store with localStorage persistence
│   │   ├── constants.ts              # TOTAL_STEPS, thresholds, NO_BACK_UNTIL_STEP
│   │   ├── types.ts                  # JourneyState, NavigationContext, PageConfig
│   │   └── index.ts                  # Public exports
│   └── pages/
│       └── pages.tsx                 # Page registry and renderPages()
├── hooks/
│   ├── useBackgroundAudio.ts         # Ambient audio playback (triggers on page 1)
│   ├── useBodyScrollLock.ts          # Prevents iOS rubber-band scrolling
│   └── useSplashScreen.ts            # Capacitor splash screen lifecycle
├── lib/
│   ├── motion/
│   │   ├── motionVariants.ts         # Animation configs and variants
│   │   └── index.ts
│   ├── quotes/
│   │   ├── quotes.ts                 # Quote data and category types
│   │   ├── quoteStore.ts             # Session-scoped Zustand store for quote selection
│   │   └── index.ts
│   └── storage/
│       ├── storage.ts                # Cross-platform localStorage wrapper
│       └── index.ts
├── styles/
│   ├── variables.css                 # Design tokens (colors, spacing, typography)
│   ├── safe-area.css                 # iOS safe area utilities
│   └── index.css                     # Global styles entry point
└── App.tsx                           # Root component
```

### 13.2 Navigation System

**Journey Store** (`src/features/navigation/store/journeyStore.ts`):

- Zustand store with `persist` middleware
- **Persisted:** `maxStepReached`, `isComplete`
- **Not persisted:** `currentStepIndex` (always starts at 0), `direction`
- Actions: `next()`, `prev()`, `goTo(index)`, `markComplete()`, `reset()`

**Navigation Hook** (`src/features/navigation/hooks/useNavigation.ts`):

```typescript
interface NavigationContext {
  currentStepIndex: number; // 0-13
  totalSteps: number; // 14
  canGoNext: boolean;
  canGoPrev: boolean; // false for steps 0-2 (opening narrative)
  isComplete: boolean;
  direction: 1 | -1;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
}
```

**Navigation Constants** (`src/features/navigation/constants.ts`):

- `TOTAL_STEPS = 14`
- `NO_BACK_UNTIL_STEP = 1` — Backward navigation disabled only from page 1 to page 0
- `SWIPE_THRESHOLD_DISTANCE = 50` — Minimum swipe distance in pixels
- `SWIPE_EDGE_ZONE = 20` — Edge zone where swipe is ignored (iOS back gesture)

**DeckNavigator** (`src/features/navigation/components/DeckNavigator/`):

- Uses `AnimatePresence` with `mode="popLayout"` for transitions
- Parallax stack animation: new page slides over exiting page
- Spring physics: `stiffness: 260, damping: 30`
- Haptic feedback via `@capacitor/haptics` on page change

### 13.3 Page Registration

**Page Config** (`src/features/pages/pages.tsx`):

```typescript
// Add new page to pageConfigs array
export const pageConfigs: PageConfig[] = [
  { id: 'welcome', title: 'Welcome', subtitle: '...', testId: 'page-0' },
  { id: 'choice', title: 'We Chose Each Other', subtitle: '...', testId: 'page-1' },
  { id: 'beginning', title: 'Where It All Began', subtitle: '...', testId: 'page-2' },
  // ... more pages
];

// Register custom components in renderPages()
export function renderPages(): ReactElement[] {
  return pageConfigs.map((config) => {
    if (config.id === 'welcome') return <WelcomePage key={config.id} testId={config.testId} />;
    if (config.id === 'choice') return <ChoicePage key={config.id} testId={config.testId} />;
    if (config.id === 'beginning') return <BeginningPage key={config.id} testId={config.testId} />;
    // Default: generic Page component
    return <Page key={config.id} title={config.title} subtitle={config.subtitle} testId={config.testId} />;
  });
}
```

### 13.4 Animation System

**Animation Configs** (`src/lib/motion/motionVariants.ts`):

| Config                  | Use Case           | Initial Delay | Stagger | Y Offset | Easing        |
| ----------------------- | ------------------ | ------------- | ------- | -------- | ------------- |
| `REASSURANCE_ANIMATION` | Most content pages | 0.3s          | 0.25s   | 10px     | easeOutQuad   |
| `VOW_ANIMATION`         | Page 5 (Promises)  | 0.3s          | 0.6s    | 10px     | easeOutQuad   |
| `EVERYDAY_ANIMATION`    | Page 6 (Everyday)  | 0.2s          | 0.25s   | 10px     | easeOutSine   |
| `ANCHOR_ANIMATION`      | Page 7 (Hard Days) | 0.3s          | 0.5s    | 10px     | easeOutCubic  |
| `FOUNDATION_ANIMATION`  | Page 8 (Trust)     | 0.3s          | 0.4s    | 8px      | easeOutQuad   |
| `HORIZON_ANIMATION`     | Page 9 (Building)  | 0.3s          | 0.3s    | 12px     | easeOutCubic  |
| `SMILE_ANIMATION`       | Page 10 (Clause)   | 0.2s          | 0.2s    | 10px     | easeOutQuint  |
| `CEREMONIAL_ANIMATION`  | Page 11 (Sealing)  | 0.5s          | 0.8s    | 8px      | easeInOutSine |
| `TIMELESS_ANIMATION`    | Page 12 (Eternal)  | 0.4s          | 0.7s    | 5px      | easeInOutQuad |
| `FINALE_ANIMATION`      | Page 13 (Final)    | 0.5s          | 0.8s    | 5px      | easeInOutSine |
| `GROUNDING_ANIMATION`   | Legacy (unused)    | 0.3s          | 0.2s    | 20px     | easeOutQuart  |
| `UNFOLDING_ANIMATION`   | Legacy (unused)    | 0.2s          | 0.3s    | 10px     | easeOutCubic  |

> **Standard:** Most content pages use `REASSURANCE_ANIMATION`. Page 5 uses `VOW_ANIMATION` (0.6s stagger). Page 6 uses `EVERYDAY_ANIMATION` (fluid). Page 7 uses `ANCHOR_ANIMATION` (grounding). Page 8 uses `FOUNDATION_ANIMATION` (steady). Page 9 uses `HORIZON_ANIMATION` (optimistic). Page 10 uses `SMILE_ANIMATION` (playful, with closer beat). Page 11 uses `CEREMONIAL_ANIMATION` (reverent, high-damping, with pause beat). Page 12 uses `TIMELESS_ANIMATION` (enduring, gentle drift). Page 13 uses `FINALE_ANIMATION` (slowest, final exhale, with signature beat).

**Pre-built Variants:**

- `reassuranceTextVariants` — Standard for most content pages (calm, grounded)
- `vowTextVariants` — Slower reveal for promise pages (deliberate delivery)
- `everydayTextVariants` — Fluid reveal for daily presence pages (continuous flow)
- `anchorTextVariants` — Grounding reveal for emotionally heavy pages (stability)
- `foundationTextVariants` — Steady reveal for trust/certainty pages (unwavering)
- `horizonTextVariants` — Lifting reveal for future-focused pages (optimistic growth)
- `smileTextVariants` — Crisp reveal for playful pages (decisive, snappy)
- `ceremonialTextVariants` — Reverent reveal for sealing pages (high-damping, stillness)
- `timelessTextVariants` — Enduring reveal for permanence pages (gentle drift, extended fade)
- `finaleTextVariants` — Final exhale for conclusion page (slowest animation, meditative)
- `fadeInVariants` — Simple opacity fade for UI elements
- `breathingVariants` — Subtle opacity loop for "alive" feeling during pauses (1.0 → 0.85 → 1.0 over 4s)
- `standardTextVariants` — Legacy (grounding style)
- `reflectiveTextVariants` — Legacy (unfolding style)

**Delay Calculators:**

```typescript
calculateReassuranceDelay(elementIndex: number): number   // Standard for most content pages
calculateVowDelay(elementIndex: number): number           // Page 5 (slower stagger)
calculateEverydayDelay(elementIndex: number): number      // Page 6 (fluid flow)
calculateAnchorDelay(elementIndex: number): number        // Page 7 (grounding)
calculateFoundationDelay(elementIndex: number): number    // Page 8 (steady certainty)
calculateHorizonDelay(elementIndex: number): number       // Page 9 (optimistic growth)
calculateSmileDelay(elementIndex: number): number         // Page 10 (playful, fast)
calculateSmileCloserDelay(elementIndex: number): number   // Page 10 closer (+0.4s beat)
calculateCeremonialDelay(elementIndex: number): number    // Page 11 (reverent, slow)
calculateCeremonialPauseDelay(elementIndex: number): number // Page 11 pause (+1.0s beat)
calculateTimelessDelay(elementIndex: number): number       // Page 12 (enduring, gentle)
calculateFinaleDelay(elementIndex: number): number         // Page 13 (slowest, meditative)
calculateFinaleSignatureDelay(elementIndex: number): number // Page 13 signature (+1.5s beat)
calculateStaggerDelay(elementIndex: number, config: AnimationConfig): number  // Generic
calculateGroundingDelay(elementIndex: number): number     // Legacy
calculateUnfoldingDelay(elementIndex: number): number     // Legacy
```

**Creating Custom Variants:**

```typescript
import { createTextVariants, type AnimationConfig } from '@lib/motion';

const customConfig: AnimationConfig = {
  initialDelay: 0.4,
  duration: 0.8,
  paragraphStagger: 0.25,
  titleSubtitleStagger: 0.1,
  yOffset: 15,
  ease: [0.25, 1, 0.5, 1], // easeOutQuart
};

const customVariants = createTextVariants(customConfig);
```

### 13.5 Design Tokens

**Colors** (`src/styles/variables.css`):

```css
--color-primary: #8b2942; /* Warm burgundy */
--color-primary-hover: #6d2035;
--color-accent: #b76e79; /* Rose gold */
--color-accent-soft: #d4a5ad; /* Pale rose */
--color-background: #faf7f2; /* Cream */
--color-text: #2d2926; /* Dark brown */
--color-text-muted: #5a524c; /* Warm grey, darkened for low-light legibility */
--color-border: #e8ddd4; /* Light brown */
```

**Typography:**

```css
--font-family: Inter, system-ui, -apple-system, ...;
--font-family-serif: 'Playfair Display', Georgia, ...;
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--line-height: 1.5;
--line-height-body: 1.7;
```

**Spacing:**

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

### 13.6 Content Page Pattern

**Standard content page structure:**

> **IMPORTANT:** All content pages must use center-aligned text and the standard `reassuranceTextVariants` animation for visual consistency.

```typescript
// src/components/ExamplePage/ExamplePage.tsx
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { reassuranceTextVariants, calculateReassuranceDelay } from '@lib/motion';
import styles from './ExamplePage.module.css';

const TITLE = 'Page Title';
const SUBTITLE = 'Page subtitle text.';
const BODY_PARAGRAPHS = ['Paragraph 1...', 'Paragraph 2...'] as const;

export interface ExamplePageProps {
  testId?: string;
}

export function ExamplePage({ testId = 'page-X' }: ExamplePageProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;

  return (
    <article className={styles.page} data-testid={testId} data-scrollable aria-label={TITLE}>
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1 className={styles.title} variants={reassuranceTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'} animate="visible"
            custom={calculateReassuranceDelay(0)}>{TITLE}</motion.h1>
          <motion.p className={styles.subtitle} variants={reassuranceTextVariants}
            initial={shouldAnimate ? 'hidden' : 'visible'} animate="visible"
            custom={calculateReassuranceDelay(1)}>{SUBTITLE}</motion.p>
        </header>
        <div className={styles.content}>
          {BODY_PARAGRAPHS.map((p, i) => (
            <motion.p key={p.slice(0, 20)} className={styles.body} variants={reassuranceTextVariants}
              initial={shouldAnimate ? 'hidden' : 'visible'} animate="visible"
              custom={calculateReassuranceDelay(i + 2)}>{p}</motion.p>
          ))}
        </div>
      </div>
    </article>
  );
}
```

**Standard CSS module pattern:**

```css
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--spacing-xl) var(--spacing-lg);
  padding-left: calc(var(--spacing-lg) + env(safe-area-inset-left, 0px));
  padding-right: calc(var(--spacing-lg) + env(safe-area-inset-right, 0px));
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 120px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.container {
  max-width: 480px;
  margin: 0 auto;
}
.header {
  margin-bottom: var(--spacing-2xl);
}
.title {
  font-family: var(--font-family-serif);
  font-size: 2rem;
  color: var(--color-primary);
  text-align: center;
}
.subtitle {
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.01em;
  color: var(--color-text-muted);
  text-align: center;
}
.content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}
.body {
  font-family: var(--font-family);
  line-height: 1.6;
  color: var(--color-text);
  text-align: center;
}
```

### 13.7 Path Aliases

```typescript
// tsconfig.app.json paths
"@app/*": ["src/app/*"]
"@components/*": ["src/components/*"]
"@features/*": ["src/features/*"]
"@hooks/*": ["src/hooks/*"]
"@lib/*": ["src/lib/*"]
"@styles/*": ["src/styles/*"]
```

### 13.8 Implementation Progress

**Completed Pages:**

- [x] Page 0: Welcome (WelcomePage) — Staggered "Exhale" entrance (unique)
- [x] Page 1: "We Chose Each Other" (ChoicePage) — Reassurance animation, centered
- [x] Page 2: "Where It All Began" (BeginningPage) — Reassurance animation, centered
- [x] Page 3: "Why I Made This" (IntentPage) — Reassurance animation, centered
- [x] Page 4: "What This Means to Us" (AlignmentPage) — Reassurance animation, centered
- [x] Page 5: "What I Promise You" (PromisesPage) — Vow animation (0.6s stagger), centered
- [x] Page 6: "How I Show Up Every Day" (EverydayPage) — Everyday animation (0.25s stagger, easeOutSine), centered
- [x] Page 7: "On the Hard Days" (HardDaysPage) — Anchor animation (0.5s stagger, easeOutCubic), centered
- [x] Page 8: "Trust and Loyalty" (TrustPage) — Foundation animation (0.4s stagger, easeOutQuad), centered
- [x] Page 9: "What We're Building Together" (BuildingPage) — Horizon animation (0.3s stagger, easeOutCubic), centered
- [x] Page 10: "The Non-Refundable Clause" (NonRefundablePage) — Smile animation (0.2s stagger, easeOutQuint), centered, closer has +0.4s beat
- [x] Page 11: "Signatures & Sealing" (SignaturesPage) — Ceremonial animation (0.8s stagger, easeInOutSine), centered, pause has +1.0s beat
- [x] Page 12: "Eternal Validity" (EternalValidityPage) — Timeless animation (0.7s stagger, easeInOutQuad), centered
- [x] Page 13: "Final Words" (FinalPage) — Finale animation (0.8s stagger, easeInOutSine), centered, signature has +1.5s beat

**All pages implemented.**

**Visual Consistency:**

- Most content pages (1-4) use `reassuranceTextVariants` and `calculateReassuranceDelay`
- Page 5 (Promises) uses `vowTextVariants` and `calculateVowDelay` (first promise appears immediately, then 0.6s stagger)
- Page 6 (Everyday) uses `everydayTextVariants` and `calculateEverydayDelay` for fluid flow
- Page 7 (Hard Days) uses `anchorTextVariants` and `calculateAnchorDelay` for grounding
- Page 8 (Trust) uses `foundationTextVariants` and `calculateFoundationDelay` for steady certainty
- Page 9 (Building) uses `horizonTextVariants` and `calculateHorizonDelay` for optimistic growth
- Page 10 (Clause) uses `smileTextVariants` with `calculateSmileCloserDelay` for final element beat
- Page 11 (Sealing) uses `ceremonialTextVariants` with breathing animation on pause element
- Page 12 (Eternal) uses `timelessTextVariants` with `calculateTimelessDelay` for enduring permanence
- Page 13 (Final) uses `finaleTextVariants` with breathing animation on signature element
- All content pages use center-aligned text (title, subtitle, body)
- Page 0 (Welcome) is unique with its own animation style
- WelcomePage and SignaturesPage use optical vertical centering (~45% from top)
- If prompt says otherwise or strays from consistency, stop and ask to confirm

**Typography Polish:**

- Body text uses `--font-weight-light` (300) for softer, book-like quality
- Body line-height increased to `--line-height-body` (1.7) for generous leading
- Subtitles use lighter weight and improved line-height for better readability
- Serif titles use optical alignment (`margin-left: -0.03em`) to correct visual indentation
- Subtitle color darkened from `#6b635b` to `#5a524c` for low-light legibility

**Breathing Animation:**

- `breathingVariants` provides subtle opacity loop (1.0 → 0.85 → 1.0 over 4s)
- Applied to SignaturesPage pause element and FinalPage signature element
- Starts after entrance animation completes to signal app is "alive"
- Respects prefers-reduced-motion preference

**Navigation Rules:**

- Page 0 → 1: Forward only (Welcome is one-way entry point)
- Pages 1+: Full bidirectional navigation enabled

**Epigraph System:**

The Epigraph system displays rotating romantic quotes at the bottom of specific pages. Quotes are selected randomly once per app session and remain consistent for that session.

- **Included Pages:** Welcome (0), We Chose Each Other (1), Where It All Began (2), Why I Made This (3), What This Means to Us (4), What I Promise You (5), On the Hard Days (7), The Non-Refundable Clause (10), Signatures & Sealing (11), Eternal Validity (12), Final Words (13)
- **Excluded Pages:** How I Show Up Every Day (6), Trust and Loyalty (8), What We're Building Together (9)
- **Animation:** Ethereal fade-in with y-offset drift (duration: 1.2s, easeInOutSine)
- **Timing:** Each page has a custom `epigraphDelay` calculated as (last element delay + animation duration + 0.3s buffer) to ensure quotes appear after page content finishes animating
- **Typography:** Inter, Italic, Light weight (300), 0.75rem, muted color
- **Session Persistence:** Quotes randomize on app launch but stay consistent during the session

**Background Audio System:**

The background audio system provides an ambient emotional undercurrent throughout the journey experience.

- **Trigger:** Audio begins when user navigates from page 0 (Welcome) to page 1
- **Fade-In:** Slow 4-second linear fade-in to prevent startling onset
- **Volume:** Capped at 18% (sits behind user's internal monologue)
- **Looping:** Seamless gapless playback enabled
- **Lifecycle:** Pauses immediately on app background, resumes with 500ms fade on foreground
- **Persistence:** Once started, continues playing even if user navigates back to page 0
- **Asset:** `public/background-music.mp3`
- **Hook:** `useBackgroundAudio` in `src/hooks/useBackgroundAudio.ts`

### 13.9 Documentation Maintenance

> **IMPORTANT:** Before pushing code, update this section (13.8) with any implementation progress:
>
> - Mark newly completed pages with `[x]`
> - Add new animation configs to section 13.4 if created
> - Update navigation rules if modified
> - Add new components to directory structure (13.1) if created
>
> This keeps the documentation in sync and saves exploration time in future sessions.

---

**END OF DOCUMENT**

This is the engineering contract for Always Us. When in doubt, err on the side of strictness.
