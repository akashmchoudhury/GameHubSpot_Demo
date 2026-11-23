"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartProvider";
import { quickSearch } from "@/lib/search";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/accessories", label: "Accessories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, pulse, open } = useCart();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  const results = useMemo(() => quickSearch(q, 5), [q]);
  const hasResults = results.games.length + results.accessories.length > 0;

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!wrap.current) return;
      if (!wrap.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/games?q=${encodeURIComponent(q.trim())}`);
    setFocused(false);
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-black/70 border-b border-neon-700/40">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <LogoMark />
          <span className="font-display text-lg md:text-xl tracking-widest">
            <span className="text-neon">GAME</span>
            <span className="text-neon-soft">HUB</span>
            <span className="text-neon">SPOT</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-2">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative px-3 py-1.5 font-display text-xs tracking-widest uppercase transition ${
                  active ? "text-neon" : "text-neon-soft/70 hover:text-neon"
                }`}
              >
                {n.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-[2px] bg-neon-400 shadow-neon"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div ref={wrap} className="relative flex-1 max-w-md ml-auto">
          <form onSubmit={submit} className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Search games, genres, accessories..."
              className="input-neon w-full pl-9 pr-3 text-sm"
              aria-label="Search"
            />
            <SearchIcon />
          </form>
          <AnimatePresence>
            {focused && q.trim() && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute left-0 right-0 mt-2 bg-ink-700/95 border border-neon-700/40 rounded-lg shadow-neonSoft overflow-hidden"
              >
                {!hasResults && (
                  <div className="p-4 text-sm text-neon-soft/70">
                    No results for <span className="text-neon">{q}</span>. Try &quot;rpg&quot;, &quot;puzzle&quot;, or &quot;headset&quot;.
                  </div>
                )}
                {results.games.length > 0 && (
                  <div className="p-2">
                    <div className="px-2 py-1 text-[10px] font-display tracking-widest text-neon-soft/60">GAMES</div>
                    {results.games.map((g) => (
                      <Link key={g.id} href={`/games/${g.slug}`} onClick={() => setFocused(false)} className="flex items-center gap-3 px-2 py-2 rounded hover:bg-neon-800/20">
                        <div className="w-10 h-10 rounded overflow-hidden border border-neon-700/40">
                          <img src={g.cover} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{g.title}</div>
                          <div className="text-[11px] text-neon-soft/60">{g.genre} · {g.platforms.join(" / ")}</div>
                        </div>
                        <div className="text-neon text-sm font-semibold">${g.price.toFixed(2)}</div>
                      </Link>
                    ))}
                  </div>
                )}
                {results.accessories.length > 0 && (
                  <div className="p-2 border-t border-neon-700/30">
                    <div className="px-2 py-1 text-[10px] font-display tracking-widest text-neon-soft/60">ACCESSORIES</div>
                    {results.accessories.map((a) => (
                      <Link key={a.id} href={`/accessories#${a.slug}`} onClick={() => setFocused(false)} className="flex items-center gap-3 px-2 py-2 rounded hover:bg-neon-800/20">
                        <div className="w-10 h-10 rounded overflow-hidden border border-neon-700/40">
                          <img src={a.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{a.title}</div>
                          <div className="text-[11px] text-neon-soft/60">{a.category}</div>
                        </div>
                        <div className="text-neon text-sm font-semibold">${a.price.toFixed(2)}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={open}
          className="relative btn-neon !py-2"
          aria-label="Open cart"
        >
          <CartIcon />
          <span className="hidden sm:inline">Cart</span>
          <AnimatePresence>
            {count > 0 && (
              <motion.span
                key={pulse}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full bg-neon-500 text-black text-[11px] font-bold font-display flex items-center justify-center shadow-neon"
              >
                {count}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden btn-neon !py-2 !px-2"
          aria-label="Menu"
        >
          <BurgerIcon open={mobileOpen} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-neon-700/30 overflow-hidden"
          >
            <div className="px-4 py-2 flex flex-col">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)} className="py-2 font-display tracking-widest uppercase text-sm text-neon-soft hover:text-neon">
                  {n.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function LogoMark() {
  return (
    <div className="relative w-9 h-9 rounded-md border border-neon-500/60 shadow-neonSoft grid place-items-center group-hover:shadow-neon transition">
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-neon-400 animate-flicker">
        <path fill="currentColor" d="M3 7h12l-2 4H5a2 2 0 0 0-2 2v4h5l1-2h6l1 2h5v-4a2 2 0 0 0-2-2h-5l4-6H3z"/>
      </svg>
    </div>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3h2l2 12h11l2-8H6"/>
      <circle cx="9" cy="20" r="1.5" fill="currentColor"/>
      <circle cx="17" cy="20" r="1.5" fill="currentColor"/>
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neon-500" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
    </svg>
  );
}
function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2">
      {open ? <path d="M6 6l12 12M6 18 18 6"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}
    </svg>
  );
}
