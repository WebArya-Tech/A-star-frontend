# A* Classes Frontend

IGCSE/AS/A Level online coaching platform. Vite + React 18 + TypeScript + Tailwind v3.4 + React Router v7.

## Commands

```sh
npm run dev        # Vite dev server (proxies /api/* and /admin/api/* to https://api.astarclasses.com)
npm run build      # Production build
npm run preview    # Serve built app (port 4173)
npm run lint       # ESLint on **/*.{ts,tsx} only — JS files excluded
npm run typecheck  # tsc --noEmit -p tsconfig.app.json
```
Run `lint` before `typecheck` — typecheck is stricter (`strict: true`, `noUnusedLocals`, `noUnusedParameters`).

## Key Architecture

- **Entry**: `src/main.tsx` → `<StrictMode>` > `<ErrorBoundary>` > `<AuthProvider>` > `<App />`
- **Routes**: All in `src/App.tsx` — `BrowserRouter` + `ScrollToTop` + `AppLayout`. Public routes render `<TopBar>`, `<Header>`, `<Footer>`, `<WhatsAppButton>`; `/admin-dashboard/*` and `/admin-login` suppress them
- **API layer (dual)**:
  - Older JS APIs in `src/api/api/` (Axios, `api.js`): `authApi.js`, `reviewApi.js`, `runningClassesApi.js`, `testimonialApi.js`, `blogApi.js`, `teacherApi.js`, `contactApi.js`, etc.
  - Newer TS APIs in `src/api/` (fetch-based `runtimeApiBase.ts`): `blogApi.ts`, `askApi.ts`, `tutorApi.ts`, `contactApi.ts`, `demoApi.ts`, `runningClassesApi.ts`, `testimonialApi.ts`
- **Base URL resolution**: In dev both layers use `window.location.origin` (Vite proxy). In prod `VITE_API_BASE_URL` env var or fallback `https://api.astarclasses.com`. The `runtimeApiBase.ts` functions `getApiBaseCandidates`/`setActiveApiBaseUrl` are now no-ops (single URL). `blogApi.ts`, `tutorApi.ts`, `testimonialApi.ts`, `runningClassesApi.ts` still call them vestigially.
- **Vite proxy** (`vite.config.ts`): `/api/*` and `/admin/api/*` → `https://api.astarclasses.com` with `changeOrigin: true, secure: false`
- **Auth** (`src/context/AuthContext.tsx`): manages `icfy_user`, `icfy_token`, `icfy_role` in localStorage. Login tries admin first (`api/admin/auth/login`), falls back to student (`api/auth/login-password`). OTP flow: `requestOtp` → `verifyOtp`
- **Admin dashboard**: `/admin-dashboard` and `/admin-dashboard/:section`, protected by `<AdminRoute>`. Sections driven by URL param via `AdminDashboard.tsx`
- **Student dashboard**: code at `src/components/student-dashboard/StudentDashboard.jsx` but **no route in App.tsx** — uses mock data
- **Docker**: multi-stage `node:20-alpine` → `serve -s dist -l 4173`, mapped to `9015:4173`

## Conventions & Quirks

- **Mixed JS/TS**: components are `.tsx` or `.jsx`; older API modules are `.js` in `src/api/api/`. Import `.js` files with `.js` extension. Import `.jsx` via global type declaration in `src/types/jsx-modules.d.ts`
- **TS strict**: `noUnusedLocals` + `noUnusedParameters` enabled — will fail typecheck if violated
- **ESLint**: targets `**/*.{ts,tsx}` only; JS files are ignored by lint
- **Vite config**: `assetsInclude` for `**/*.{PNG,JPG,JPEG}`; `lucide-react` excluded from `optimizeDeps`; KaTeX in `RichDescriptionEditor.tsx` and `Ask.tsx` via `katex` + `@types/katex`
- **`bg-linear-to-r`**: used across many pages — not a v3 built-in, works via arbitrary value support
- **Tailwind config** is minimal (no custom plugins, no extended theme)
- **Blog API** (`src/api/blogApi.ts`): has local fallback mode — when `VITE_USE_LOCAL_BLOG_API=true` or in dev without `VITE_API_BASE_URL`, uses localStorage-backed mock data. Local mode OTP is always `123456`. Both admin and public blog endpoints in single file
- **Ask API** (`src/api/askApi.ts`): respects `VITE_USE_LOCAL_ASK_API` env var for localStorage fallback
- **Demo API** (`src/api/demoApi.ts`): respects `VITE_USE_LOCAL_DEMO_API` env var for localStorage fallback
- **Tutors API** (`src/api/tutorApi.ts`): localStorage key `astar_tutors`; hardcoded defaults for 8 tutors
- **`swagger.json`** at root — API docs, not used by code
- **`@supabase/supabase-js`** in dependencies but never imported anywhere — dead
- **No test framework configured**
