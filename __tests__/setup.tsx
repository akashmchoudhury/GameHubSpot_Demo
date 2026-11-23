import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Next's router/searchParams hooks need a mock in the jsdom test env.
vi.mock("next/navigation", () => {
  const push = vi.fn();
  const replace = vi.fn();
  return {
    useRouter: () => ({ push, replace, back: vi.fn(), forward: vi.fn(), prefetch: vi.fn() }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => "/",
    notFound: () => { throw new Error("NEXT_NOT_FOUND"); }
  };
});

// Next/link renders as a plain <a> for tests so we can click through.
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: any) =>
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    (<a href={typeof href === "string" ? href : href?.pathname ?? "#"} {...rest}>{children}</a>)
}));

// framer-motion → pass-through DOM components; strip non-DOM props cleanly.
// IMPORTANT: components are cached per tag so React sees a stable type across renders.
vi.mock("framer-motion", async () => {
  const React = await import("react");
  const strip = (p: any) => {
    const { initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, viewport, layout, layoutId, drag, dragConstraints, onAnimationStart, onAnimationComplete, ...rest } = p ?? {};
    return rest;
  };
  const cache = new Map<string, any>();
  const make = (tag: string) => {
    if (cache.has(tag)) return cache.get(tag);
    const Comp = React.forwardRef(function Motion(p: any, ref: any) {
      return React.createElement(tag, { ...strip(p), ref }, p?.children);
    });
    cache.set(tag, Comp);
    return Comp;
  };
  const proxy = new Proxy({}, { get: (_t, prop: string) => make(prop) });
  return {
    motion: proxy,
    AnimatePresence: ({ children }: any) => children,
    LayoutGroup: ({ children }: any) => children,
    useAnimation: () => ({ start: () => {}, stop: () => {}, set: () => {} }),
    useMotionValue: (v: any) => ({ get: () => v, set: () => {}, onChange: () => () => {} })
  };
});

// crypto.randomUUID for chatbot messages in older jsdom
if (!globalThis.crypto) (globalThis as any).crypto = {};
if (!globalThis.crypto.randomUUID) (globalThis as any).crypto.randomUUID = () => "uuid-" + Math.random().toString(36).slice(2, 10);

// jsdom lacks Element.scrollTo / scrollIntoView used by Chatbot auto-scroll
if (!(Element.prototype as any).scrollTo) (Element.prototype as any).scrollTo = () => {};
if (!(Element.prototype as any).scrollIntoView) (Element.prototype as any).scrollIntoView = () => {};
if (!(window as any).scrollTo) (window as any).scrollTo = () => {};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
