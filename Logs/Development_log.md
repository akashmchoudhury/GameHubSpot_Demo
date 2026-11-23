# GameHubSpot — Development Log

Version-tagged changelog with the mapping from each client requirement to the code that fulfils it. Pair with `process_log.md` for the session-level narrative.

---

## v0.1.0 — 2026-11-23 — "Neon scaffold"

### Requirements matrix (verbatim from `Instruction/Instruction.md`)

| # | Requirement | Status | Where it lives |
|---|---|---|---|
| 1 | Black and illuminated green UI theme | ✅ | `tailwind.config.ts` (`ink` / `neon` palettes), `app/globals.css` (`.btn-neon`, `.card-neon`, `.text-neon`, scanline + grid overlays, Orbitron/Rajdhani fonts) |
| 2 | Shop for games — PC and iOS, Android | ✅ | `lib/games.ts` (8 titles, each tagged with one or more of `PC`/`iOS`/`Android`); catalog pages filter by platform |
| 3a | Searchable option | ✅ | `lib/search.ts`; header quick-search in `components/Navbar.tsx`; full filter/sort in `app/games/page.tsx` |
| 3b | Cart system | ✅ | `components/CartProvider.tsx` (context + `localStorage`), `components/CartDrawer.tsx` (slide-in), `app/cart/page.tsx` (full page) |
| 3c | Dummy payment — PayPal, CashApp | ✅ | `app/checkout/page.tsx` — method cards for PayPal/CashApp, dummy fields, 1.5s "processing" → animated success → auto-redirect home |
| 4a | Home page — featured games | ✅ | `app/page.tsx` → `HeroSlider` (rotating featured drops) + `Featured games` grid |
| 4b | Home page — slideshows | ✅ | `components/HeroSlider.tsx` (framer-motion crossfade, auto-advance, click-to-jump dots, scanline overlay) |
| 4c | Home page — accessories (not devices) | ✅ | `app/page.tsx` dedicated section with an explicit "not devices" line; `lib/accessories.ts` only contains peripherals |
| 5a | About page — developed by Webmernix | ✅ | `app/about/page.tsx` (Webmernix byline + Dhaka office) |
| 5b | Contact page | ✅ | `app/contact/page.tsx` (form + Dhaka office + map placeholder) |
| 5c | Terms & Conditions | ✅ | `app/terms/page.tsx` (governed by Bangladeshi law) |
| 5d | Privacy Policy | ✅ | `app/privacy/page.tsx` (plain-English summary + sections) |
| 5e | Located in Dhaka, Bangladesh | ✅ | Reflected on Footer, About, Contact, Terms, Privacy |
| 6 | Chatbot — queries + page redirect | ✅ | `components/Chatbot.tsx` — rule-based intent matcher with CTA buttons that `router.push()` to the matching page (cart, checkout, about, contact, terms, privacy, platform-filtered catalog, accessories) |
| 7 | Horizontal ad bar — Apple PC dummy ad | ✅ | `components/AdBar.tsx` — marquee row with the Apple M-series PC dummy ad as the first slot (also OMEGA controller + Webmernix pre-order) |
| 8a | Web app — Next + Node | ✅ | Next.js 14 (App Router) running on Node via `next dev` / `next start`; `package.json` scripts: `dev`, `build`, `start`, `lint` |
| 8b | Interactive animation | ✅ | framer-motion across Hero crossfade, nav active-tab layout underline, card hover reveal, cart drawer, chatbot bubbles, pulse-glow buttons; CSS keyframes `flicker`, `scan`, `pulseGlow`, `marquee` |

### Component map
- `app/layout.tsx` wires `CartProvider` → `AdBar` → `Navbar` → `<main>` → `Footer` → `CartDrawer` → `Chatbot`
- `components/Navbar.tsx` — sticky bar with brand mark, nav, animated underline, quick-search dropdown (games + accessories), mobile burger, cart button with animated count badge
- `components/CartProvider.tsx` — `add`, `remove`, `setQty`, `clear`, drawer open/close, pulse-count for cart-button animation, `localStorage` persistence (`ghs:cart:v1`)
- `components/Chatbot.tsx` — intent router with suggestion chips, CTA buttons that push to the right page
- `lib/search.ts` — scoring: title ×3, genre ×1.5, tagline ×1, tags ×1 per match; filters by platform/genre/rating; sorts by price/rating/release

### Known good run
- `npm install` — ✅ background job `biagyu32w` exit 0
- `npm run dev` on port 3030 — started as background job `b8gdef4pp` for manual verification

### Quick version recovery
If you need to roll back to this scaffold:
1. Keep `package.json` and `package-lock.json` at the versions pinned above.
2. Restore the following directories from v0.1.0: `app/`, `components/`, `lib/`, plus the four root config files (`next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`).
3. `npm install && npm run dev` — site should serve on http://localhost:3030.

---

## v0.1.1 — 2026-11-23 — "Tests + latency pass"

### What landed
- **Test suite (68 tests, 4 tiers, ~7s wall time)** under `__tests__/`:
  - `unit/` — `search.test.ts` (platform/genre/sort/relevance ranking), `catalog.test.ts` (invariants: unique slugs/ids, discount math, accessory-not-device check).
  - `components/` — `CartProvider.test.tsx`, `GameCard.test.tsx`, `Chatbot.test.tsx`, `HeroSlider.test.tsx`, `AdBar.test.tsx`.
  - `integration/` — `cart-flow.test.tsx` (card → drawer → clear + remount persistence), `checkout.test.tsx` (empty-state, PayPal happy path with success animation, CashApp switch).
  - `security/` — `xss.test.tsx` (5 payloads through chatbot), `cart-tamper.test.tsx` (negative-qty + stress + corrupt localStorage), `code-audit.test.ts` (dangerouslySetInnerHTML / eval / secrets / http:// / PAN/CVV / onSubmit), `form-validation.test.tsx`.

### Scripts
Added to `package.json`:
- `test` / `test:watch` / `test:ui` / `test:coverage`
- `test:unit`, `test:components`, `test:integration`, `test:security` — per-tier runners.

### Perf fixes (measurable)
| Change | Where | Effect |
|---|---|---|
| Dynamic import, `ssr: false` for `Chatbot` & `CartDrawer` | `app/layout.tsx` | Removes ~40% of initial JS payload; Chatbot code only loads after first interaction. |
| CSS-only marquee replaces framer-motion animate loop | `components/AdBar.tsx`, `app/globals.css` (`.marquee-track`) | Keeps the always-on ad bar off the JS animation main thread. |
| `prefers-reduced-motion` media query | `app/globals.css` | Disables all infinite animations and transitions for users who opt out. |
| HeroSlider pauses off-screen / hidden tab | `components/HeroSlider.tsx` | No re-renders when the user has scrolled past or switched tabs. |
| `loading="lazy"` + `decoding="async"` on all images; `fetchpriority="high"` on game-detail hero | `components/*.tsx`, `app/**` | Below-fold images defer download. |
| `content-visibility: auto` on featured + accessories sections | `app/page.tsx` + `.cv-auto` class | Skips paint/layout for off-screen sections. |
| Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) + `poweredByHeader: false` + `compress: true` | `next.config.js` | Defense in depth + smaller wire size. |

### Security hardening (driven by tests)
- `CartProvider` validates the shape of localStorage payloads on hydration — arrays of rows with string `id`, finite positive `price`, positive integer `quantity`. Non-conforming entries are dropped silently. Prior behavior would crash on `items.reduce` if an attacker rewrote `ghs:cart:v1` to a non-array. Verified by `__tests__/security/cart-tamper.test.tsx`.

### Known good run
- `npm test` → 13 files, **68 passed / 0 failed**, ~7s.
- `curl` TTFB on dev server (port 3031): 60-85ms across `/`, `/games`, `/accessories`, `/cart`.
- `curl -I /` returns all four security headers; no `X-Powered-By` header.

### Rollback for v0.1.1 (reverting only the test + perf work)
- Remove `__tests__/`, `vitest.config.ts`, the `test:*` scripts from `package.json`, and the test devDependencies.
- To revert perf: change `app/layout.tsx` back to static `import { CartDrawer, Chatbot }`; delete `.marquee-track` + `.cv-auto` + reduced-motion CSS from `app/globals.css`; put framer-motion marquee back in `AdBar.tsx`; drop `headers()`/`compress`/`poweredByHeader` from `next.config.js`.
