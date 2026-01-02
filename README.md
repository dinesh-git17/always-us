# Always-Us

A React + TypeScript mobile application built with Capacitor for iOS.

## Prerequisites

- **Node.js**: v24.x or higher (see `.nvmrc`)
- **npm**: v10.x or higher
- **Xcode**: 15.x or higher (for iOS development)
- **CocoaPods**: For iOS dependency management

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Sync with iOS
npm run cap:sync

# Open in Xcode
npm run cap:ios
```

## Project Structure

```
always-us/
├── ios/                    # Native iOS project (Capacitor)
├── public/                 # Static assets
├── src/
│   ├── app/               # App-level configuration, providers, routing
│   ├── assets/            # Images, fonts, and static files
│   ├── components/        # Shared/reusable UI components
│   ├── config/            # App configuration and constants
│   ├── features/          # Feature-based modules (domain logic + views)
│   ├── hooks/             # Global custom React hooks
│   ├── lib/               # Third-party library wrappers
│   ├── styles/            # Global styles and CSS variables
│   ├── types/             # Shared TypeScript type definitions
│   └── utils/             # Utility functions and helpers
├── .husky/                # Git hooks configuration
├── capacitor.config.ts    # Capacitor configuration
├── eslint.config.js       # ESLint configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite bundler configuration
```

### Directory Details

| Directory     | Purpose                                                                    |
| ------------- | -------------------------------------------------------------------------- |
| `app/`        | Application shell, providers (context), and routing configuration          |
| `assets/`     | Static assets that get processed by the bundler                            |
| `components/` | Shared UI components used across multiple features                         |
| `config/`     | Environment-specific configuration and constants                           |
| `features/`   | Self-contained feature modules with their own components, hooks, and logic |
| `hooks/`      | Reusable React hooks that aren't feature-specific                          |
| `lib/`        | Wrappers around third-party libraries for easier mocking and replacement   |
| `styles/`     | Global CSS, CSS variables, and style utilities                             |
| `types/`      | Shared TypeScript interfaces and type definitions                          |
| `utils/`      | Pure utility functions (formatters, validators, etc.)                      |

## Available Scripts

| Command                | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Start Vite development server        |
| `npm run build`        | Build for production                 |
| `npm run lint`         | Run ESLint                           |
| `npm run lint:fix`     | Run ESLint with auto-fix             |
| `npm run format`       | Format code with Prettier            |
| `npm run format:check` | Check code formatting                |
| `npm run type-check`   | Run TypeScript type checking         |
| `npm run cap:sync`     | Build and sync with native platforms |
| `npm run cap:ios`      | Open iOS project in Xcode            |

## Code Quality

### Linting & Formatting

- **ESLint**: Strict TypeScript rules with React Hooks enforcement
- **Prettier**: Consistent code formatting
- **Husky + lint-staged**: Pre-commit hooks for automated checks

### TypeScript Standards

- Strict mode enabled
- No implicit `any` types allowed
- All function parameters and returns must be typed
- Prefer type imports: `import type { Foo } from './foo'`

### Naming Conventions

| Type             | Convention                  | Example                   |
| ---------------- | --------------------------- | ------------------------- |
| Components       | PascalCase                  | `UserProfile.tsx`         |
| Hooks            | camelCase with `use` prefix | `useAuth.ts`              |
| Utilities        | camelCase                   | `formatDate.ts`           |
| Types/Interfaces | PascalCase (no `I` prefix)  | `UserData`, `ButtonProps` |
| Folders          | kebab-case                  | `user-profile/`           |
| CSS files        | camelCase or kebab-case     | `button.module.css`       |

## Git Workflow

### Branching Strategy

- Feature branches: `feat/feature-name`
- Bug fixes: `fix/bug-description`
- Chores: `chore/task-description`
- Documentation: `docs/doc-description`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve login button state issue
chore: update dependencies
docs: add API documentation
```

## iOS Development

### Building for iOS

```bash
# 1. Build the web app
npm run build

# 2. Sync with iOS
npx cap sync ios

# 3. Open in Xcode
npx cap open ios

# 4. Build and run in Simulator (via Xcode)
```

### Configuration

The iOS app is configured in `capacitor.config.ts`:

- **App ID**: `com.alwaysus.app`
- **App Name**: `Always-Us`
- **Web Directory**: `dist`

## Path Aliases

Import aliases are configured for cleaner imports:

```typescript
// Instead of
import { Button } from '../../../components/Button';

// Use
import { Button } from '@components/Button';
```

Available aliases:

- `@app/*` → `src/app/*`
- `@assets/*` → `src/assets/*`
- `@components/*` → `src/components/*`
- `@config/*` → `src/config/*`
- `@features/*` → `src/features/*`
- `@hooks/*` → `src/hooks/*`
- `@lib/*` → `src/lib/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`
- `@styles/*` → `src/styles/*`

## Environment Variables

Environment variables are managed through `.env` files:

- `.env` - Default environment variables
- `.env.local` - Local overrides (git-ignored)
- `.env.development` - Development-specific
- `.env.production` - Production-specific

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## License

Private - All rights reserved.
