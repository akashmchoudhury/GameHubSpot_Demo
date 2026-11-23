# GameHubSpot — Process Log

Rolling record of every work session's intent, inputs, and outputs. Pair with `Development_log.md` for code-level version notes.

---

## Session 0.1.0 — 2026-11-23 — "Initial scaffold"

**Operator:** Claude (Opus 4.7)  
**Branch/Path:** `d:\work\Projects\GameHubSpot` (no git yet)  
**Instruction source:** `Instruction/Instruction.md`

### Intent
Build the full GameHubSpot web app in one pass from the instruction file: Next.js + Node, black-and-neon-green theme, PC/iOS/Android game catalog, cart, dummy PayPal / CashApp checkout, chatbot, horizontal ad bar, Webmernix branding, Dhaka-based legal pages, interactive animations.

### Pre-flight (per instruction section 1)
- Read `Instruction/Instruction.md` end-to-end before touching code.
- Mapped each numbered requirement to a concrete deliverable (see `Development_log.md` §Requirements matrix).
- Pre-authorized development commands with the operator: npm install/run, npx, file writes inside project root, background dev server.

### Decisions
- Framework: **Next.js 14 App Router** (TypeScript) for the "Next + Node" spec. Server Components by default, Client Components only where interactivity needs state or hooks.
- Styling: **Tailwind CSS** with a custom neon palette + Orbitron/Rajdhani display fonts; design tokens defined in `tailwind.config.ts` and `app/globals.css`.
- Animation: **framer-motion** for the hero slider, page reveals, cart drawer, chatbot, and success states.
- State: **CartProvider** (React context + `localStorage`) — no server persistence yet; consistent with dummy checkout.
- Search: Local in-memory ranking in `lib/search.ts` (no external search dep); used by both the header quick-search and the Games catalog.
- Chatbot: Rule-based intent matcher in `components/Chatbot.tsx` with page-redirect CTAs — satisfies "helping with queries and redirecting to the corresponding pages" without an external API dependency.
- Ad bar: Marquee of multiple ad slots, with the Apple PC dummy ad as slot 1.
- Image sourcing: Hot-linked Unsplash CDN placeholders — `next.config.js` whitelists them for Next/Image if migrated later.

### Actions taken
1. Wrote root config: `package.json`, `tsconfig.json`, `next.config.js`, `postcss.config.js`, `tailwind.config.ts`, `.gitignore`, `next-env.d.ts`.
2. Added dummy data: `lib/games.ts` (8 games across PC/iOS/Android with featured flags, platform splits, discounts), `lib/accessories.ts` (8 accessories across 7 categories).
3. Shared types in `lib/types.ts`; search engine in `lib/search.ts`.
4. Global layout chrome: `AdBar`, `Navbar` (with quick-search dropdown + mobile menu + animated active-tab underline), `Footer`, `CartProvider`, `CartDrawer`, `Chatbot`.
5. Pages: `/` (hero slider + featured + accessories + CTA), `/games` (search/filter/sort), `/games/[slug]` (detail + related), `/accessories`, `/cart`, `/checkout` (PayPal or CashApp dummy flow with success animation), `/about`, `/contact` (dummy send + Dhaka office block), `/terms`, `/privacy`, `not-found`.
6. Installed deps via `npm install` (background job). First attempt failed because the shell interpreted `cd /d …` as cmd syntax — reran with POSIX `cd "d:/…"` and succeeded.
7. Wrapped `/games` in `<Suspense>` to satisfy Next 14's `useSearchParams` requirement.
8. Started `next dev` on port 3030 in the background for manual verification.

### Open items for next session
- Add favicons / OG image for social share.
- Hook up a real newsletter or form endpoint if desired (currently the contact form is purely dummy).
- Optional: migrate `<img>` to `<Image>` for better LCP (requires moving placeholder images to `/public` or keeping remote patterns).
- Replace static map placeholder on contact page with a real tile layer if a key is provided.

---

## Session 0.1.1 — 2026-11-23 — "Tests + latency pass"

### Intent
Add a four-tier test suite (unit, component, integration, security) and fix perceived latency while browsing the live app.

### Decisions
- Test runner: **Vitest 2.1.9** (fast, Vite-native TS/JSX support) + **@testing-library/react 16** + **jsdom 25**.
- `@vitejs/plugin-react` pinned to `^4.3.3` to stay compatible with Vite 5 / Vitest 2 and avoid the peer-dep storm from plugin-react 6 / Vite 8 / @types/node 26.
- Tests live under `__tests__/{unit,components,integration,security}` so each tier can run in isolation via `npm run test:<tier>`.
- Shared `setup.tsx` mocks `next/navigation`, `next/link`, and `framer-motion` with a **cached forwardRef factory** (crucial — without caching, every render gave `motion.div` a fresh identity and bubbles unmounted mid-test). jsdom's missing `Element.scrollTo` / `scrollIntoView` are polyfilled too.
- Security tier is a mix of **runtime** (XSS payloads through the chatbot input; cart tamper via setQty / corrupt localStorage; form `required` attrs) and **static** (regex audit for `dangerouslySetInnerHTML`, `eval`, hard-coded secrets, insecure `http://` links, PAN/CVV strings in checkout, forms without `onSubmit`).

### Perf fixes applied in this session
- `CartDrawer` and `Chatbot` are now `next/dynamic` imports with `ssr: false` — the Chatbot used to be in the initial JS bundle even for users who never opened it.
- `AdBar` migrated from framer-motion's `animate={{x: [...]}}` loop to a **CSS-only `.marquee-track`** animation; the second copy of the row is marked `aria-hidden` to avoid duplicate reads.
- `@media (prefers-reduced-motion: reduce)` disables marquee/flicker/scan/pulse animations and zeros `transition-duration` globally.
- `HeroSlider` uses `IntersectionObserver` + `document.visibilitychange` so the 5.2s auto-rotate pauses off-screen and on hidden tabs.
- All `<img>` tags got `loading="lazy"` and `decoding="async"` except the game-detail hero (which gets `fetchpriority="high"`).
- `/page` featured + accessories sections use `content-visibility: auto` (via `.cv-auto`) to skip paint/layout of below-fold sections until they near the viewport.
- `next.config.js` now sets `compress: true`, `poweredByHeader: false`, and emits `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` headers.

### Hardening (surfaced by security tests, then fixed in code)
- `CartProvider` now validates localStorage payloads: must be an array, each row must have a string `id`, finite positive `price`, and positive integer `quantity`. Corrupt or tampered JSON is silently dropped — tested in `__tests__/security/cart-tamper.test.tsx`.

### Actions taken
1. Installed test deps (resolved a second eresolve by pinning @vitejs/plugin-react@4).
2. Wrote 68 tests across 4 tiers; iterated on mock + timeouts until all 68 pass in ~7s.
3. Perf pass as described above; restarted dev server on port 3031 (3030 still held by original run).
4. Verified: `curl` TTFB 60-85ms for all 10 routes; all security headers present; no X-Powered-By leak.

### Open items
- Full Lighthouse run against `next build && next start` (dev mode costs mask real prod perf).
- Add Playwright E2E for a cross-browser smoke test if we grow more routes.
