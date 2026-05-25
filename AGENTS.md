# A* Classes Frontend

IGCSE/AS/A Level online coaching platform. Vite + React 18 + TypeScript + Tailwind + React Router v7.

## Commands

```sh
npm run dev        # Vite dev server
npm run build      # Production build
npm run preview    # Serve built app (port 4173)
npm run lint       # ESLint on all files
npm run typecheck  # tsc --noEmit -p tsconfig.app.json
```
Run `lint` before `typecheck` — typecheck is the slower, stricter check.

## Key Architecture

- **Entry**: `src/main.tsx` → wraps `<App />` in `<AuthProvider>` + `<ErrorBoundary>`
- **Routes**: All in `src/App.tsx` — `BrowserRouter` with `ScrollToTop` + `AppLayout`. Public routes render `<TopBar>`, `<Header>`, `<Footer>`, `<WhatsAppButton>`; `/admin-dashboard/*` and `/admin-login` suppress them
- **API layer (dual)**:
  - Old JS APIs via `src/api/api/api.js` (Axios instance, `icfy_token` from localStorage). Used by `authApi.js`, `reviewApi.js`, `runningClassesApi.js`
  - Newer TS APIs via `src/api/runtimeApiBase.ts` (`makeApiCall` using `fetch`, with candidate-failover). Used by `blogApi.ts`, `askApi.ts`, `tutorApi.ts`
- **Base URL resolution** (`runtimeApiBase.ts`): checks `VITE_API_BASE_URL` env var first, falls back to `https://api.astarclasses.com`. LocalStorage key `icfy_active_api_base_url` can override; stale ports `:8009`/`:8024` are auto-cleared
- **Auth context** (`src/context/AuthContext.tsx`): manages `icfy_user`, `icfy_token`, `icfy_role` in localStorage. Login tries admin first (`api/admin/auth/login`), falls back to student (`api/auth/login-password`). OTP flow: `requestOtp` → `verifyOtp`
- **Student dashboard**: not yet integrated into App.tsx routes (code exists at `src/components/student-dashboard/StudentDashboard.jsx` but no route registered); uses mock data
- **Admin dashboard**: `/admin-dashboard` and `/admin-dashboard/:section`, protected by `<AdminRoute>` component. Sections managed via URL param rendered by `AdminDashboard.tsx`
- **Docker**: multi-stage build → `serve -s dist -l 4173`, mapped to `9015:4173` in docker-compose
- **Cloudinary**: `src/utils/cloudinaryUpload.js` uses backend-signed upload flow via `getMediaSignature()`

## Conventions & Quirks

- Mixed JS/TS: components are `.tsx` or `.jsx`, API modules are `.js` in `src/api/api/`. Import JS modules with `.js` extension. Import `.jsx` modules via a global type declaration in `src/types/jsx-modules.d.ts`
- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters` — will fail CI
- ESLint targets only `**/*.{ts,tsx}`; JS files are not linted
- `lucide-react` excluded from Vite `optimizeDeps` (handled by bundler)
- `assetsInclude` configured for uppercase image extensions (`.PNG`, `.JPG`, `.JPEG`)
- Tailwind content covers `index.html` and `src/**/*.{js,ts,jsx,tsx}`
- Tiptap rich text editor used for blog content (`@tiptap/react` + extensions)
- Blog API (`blogApi.ts`) has local fallback mode — when `VITE_USE_LOCAL_BLOG_API=true` or in dev without `VITE_API_BASE_URL`, it uses localStorage-backed mock data; dev OTP is always `123456`
- Ask API (`askApi.ts`) similarly uses `VITE_USE_LOCAL_ASK_API` / local mode with localStorage fallback
- Tutors API (`tutorApi.ts`) stores fallback data in localStorage key `astar_tutors` and keeps hardcoded defaults for 8 tutors
- Blog admin APIs (`adminApi`) and public blog APIs (`blogApi`) are both in `src/api/blogApi.ts`
- `src/api/API_GUIDE.md` documents review, class, enrollment endpoints with status enums
- Student dashboard styling uses `bg-linear-to-r` (Tailwind v3.4 arbitrary gradient syntax)
- No test framework configured
