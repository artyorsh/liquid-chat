# expo-template

## Repository Overview

### Technology Stack
- **Framework**: Expo + React Native
- **Language**: TypeScript
- **State Management**: MobX
- **Navigation**: React Navigation
- **Platforms**: iOS, Android
- **Architecture**: MVVM, Dependency Injection (InversifyJS)

## App Architecture (Critical Context)

### Key Integration Points
- **Architecture**: Feature modules and Dependency Injection using InversifyJS; each feature exports a `ContainerModule` bound in `src/<feature>/index.ts(x)`; each screen follows MVVM pattern.
- **State Management**: **MobX** (`mobx`, `mobx-react-lite`) — feature **view models** (`*.vm.ts` / `*.vm.tsx`) use `@observable`, `@computed`, and `@action`; UI that derives from VM state uses **`observer`**. VMs coordinate UI state and calls into services.
- **Navigation**: React Navigation is implemented behind `IRouter` (`src/router/index.ts`); screens are `React.FC` instances resolved from the container.
- **Environment**: `EXPO_PUBLIC_*` and build vars from `.env` / EAS — see `.env.example` and `app.config.ts`.
- **I18N**: **Lingui**

## Core Architecture & Structure

### Entry Points
- `index.js`: DI container assembly, `registerRootComponent`.
- `src/app.tsx`: App shell — resolves services and mounts providers.

### Provider Architecture
The application uses a small composition tree:
1. **Lingui**: Provider from `II18nService.getProviderComponent()` (`src/i18n`).
2. **Navigation window**: `IRouter.getWindow()` — primary native stack.
3. **Modal window**: `IModalService.getWindow()` — alerts / bottom sheets (`src/modal`).
4. **Global listeners**: `IProcessInfoService.startListening()` from `useEffect` in `App` (device / battery / network for logging).

### Data Layer
- **HTTP**: `IHttpClient` (`FetchJsonClient` in `src/http`) — base URL `EXPO_PUBLIC_HTTP_BASE_URL`.
- **Session & auth**: `ISessionService` in `src/auth/session` — secure storage (`SecureAuthStorage`), auth provider (mock or HTTP), and **`ParallelModuleInitializer`** for post-login startup: session-dependent **`ISessionModule`** implementations (e.g. `UserService`, push notification service) run in parallel, with `shouldFailOnModuleFailure` so only **`UserService`** failures fail the init (see `createSessionService` in `src/auth/session/index.ts`).

## Key Features & Modules

### Core Functionality
1. **Authentication**: Welcome, login, register; session restore on splash (`src/auth`, `src/splash`).
2. **Home & sample content**: Home screen, welcome header, posts list with mock datasource (`src/home`, `src/posts`).
3. **Splash**: Animated splash aligned with `expo-splash-screen` (`src/splash`).
4. **Internationalization**: Lingui — catalogs `src/i18n/locales/{locale}`; Metro transformer + Babel macro (`src/i18n`).
5. **Logging**: Transports — console, file, Grafana/Loki, Sentry (`src/log`).
6. **Push notifications**: Firebase messaging + navigation handler (`src/push-notification`).
7. **UI kit**: Unistyles-based primitives — plugin root `src` (`src/uilib`).

## Navigation & Routing

### Structure
- `src/router/index.ts`: `IRouter`, `IRoute` unions, `RouterModule` binding.
- `src/router/react-navigation/stack-tree-factory.ts`: stack construction.
- `src/router/react-navigation/react-navigation-router.ts`: React Navigation glue.
- **Route map** (in `RouterModule`): `/`, `/auth`, `/auth/login`, `/auth/register`, `/home`.
- **Lifecycle**: `IRouter.subscribe(route, { onFocus, onBlur })` for listeners.
- **Dev**: Optional performance-monitoring layout around screens when `__DEV__`.

### Key Navigators
- **Native stack**: Single full-screen stack

## State Management

### State by concern
- **Session**: `ISessionService`, secure storage (`src/auth/session`).
- **User / profile**: `IUserService` (`src/user`).
- **Sample domain data**: `IPostsDatasource` / VMs (`src/posts`, `src/home`).
- **Forms / screen state**: MobX view models per feature.

### Feature modules
Side effects and domain logic live under **`src/<feature>/`** and are registered as **`ContainerModule`s** plus MobX view models **`<feature>.vm.ts(x)`** and `@observables` — there is **no** shared `src/actions/` directory.

### Example
**Screen VM wiring:** `HomeScreenModule` builds `HomeVM` with `IPostsDatasource` and a posts list factory from the container (`src/home/index.ts`). **Session startup:** `createSessionService` composes `ParallelModuleInitializer` with the session modules resolved from DI (`src/auth/session/index.ts`).

## Build & Deployment

### CI/CD Workflows
Key GitHub Actions workflows:
- `validate.yml`: Push to `main` / `workflow_dispatch` — `bun i`, lint, `tsc`, Jest, `expo-doctor`.
- `validate-preview.yml`: Pull requests — same steps + `eas update` preview for the head branch.
- `build.yml`: Schedule / `workflow_dispatch` — EAS builds (Android `preview`, iOS `ios-simulator`).
- `claude.yml`: Claude Code Action on `@claude` (needs `ANTHROPIC_API_KEY`).

## Related Repositories

- [nestjs-simple-auth](https://github.com/artyorsh/nestjs-simple-auth) — example auth API for `EXPO_PUBLIC_HTTP_BASE_URL`.
- [grafana-mobile-o11y](https://github.com/artyorsh/grafana-mobile-o11y) — optional Grafana/Loki logging stack (`EXPO_PUBLIC_LOG_GRAFANA_HOST`).

See also `readme.md` and `.env.example`.

## Development Practices

### React Native Best Practices

- Use the `.cursor/rules/imported/agent-skills/react-native-best-practices.mdc` skill when working on performance-sensitive code. This ensures code respects established best practices from the start, resulting in more consistent code, fewer review iterations, and better resilience against regressions.
- Use **[`.cursor/skills/`](./.cursor/skills/)** when working with deployments, Expo EAS, building native modules or upgrading Expo.

### Code Quality
- **TypeScript**: extends Expo base; decorators enabled for MobX.
- **ESLint**: Linter.

### Post-Edit Checklist (IMPORTANT)
**ALWAYS run these steps after making code changes, before committing:**
1. **ESLint**: `bun run lint` (staged files also run through lint-staged).
2. **TypeScript**: `bun run build` (`tsc`).
3. **Tests**: `bun run test` for affected behavior.

### Testing
- **Unit Tests**: Jest with React Native Testing Library; patterns in `src/**/*.spec.ts(x)`.

## Special Considerations

### Mobile-Specific Notes
- **Push**: Firebase Cloud Messaging via `@react-native-firebase/messaging`; permission helpers under `src/push-notification/`.
- **Theming**: `react-native-unistyles` v3 (`src/uilib`).

## Documentation Resources

### Help Documentation
- **Expo**: https://docs.expo.dev/llms
- **Lingui**: https://lingui.dev/ai-tools#context-files
- **Unistyles**: https://www.unistyl.es/v3/llms/info

## Command Reference

### Common Tasks
```bash
# Install dependencies
bun i

# Linting
bun run lint

# Type checking (tsc, CI gate)
bun run build

# Testing
bun run test
```

### Platform Builds
```bash
# Expo / Metro
bun run start

# iOS
bun run ios

# Android
bun run android
```

## Development Environment

### Dev Server
- **Location**: Runs on HOST machine (not in VM)
- **URL**: http://localhost:8081
- **Start command**: `bun run start` (Expo dev server / Metro).

## Architecture Decisions

### React Native New Architecture
- Use the New Architecture defaults shipped with the pinned Expo SDK / RN (`package.json`); Hermes via Expo toolchain.

### Push Notifications
- `@react-native-firebase/messaging` (Expo config plugins);
- Mock providers under `push-notification/expo-go-compat/` when running in Expo Go.