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

**END OF DOCUMENT**

This is the engineering contract for Always Us. When in doubt, err on the side of strictness.
