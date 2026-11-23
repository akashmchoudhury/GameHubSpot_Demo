"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Game } from "@/lib/types";

export function HeroSlider({ games }: { games: Game[] }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; });
    io.observe(node);
    const onVis = () => { visibleRef.current = document.visibilityState === "visible" && visibleRef.current; };
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (!visibleRef.current || document.visibilityState !== "visible") return;
      setI((n) => (n + 1) % games.length);
    }, 5200);
    return () => clearInterval(t);
  }, [games.length]);

  const g = games[i];
  return (
    <section ref={ref} className="relative overflow-hidden border-b border-neon-700/40">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="chip">Featured drop</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45 }}
                className="mt-4"
              >
                <h1 className="font-display text-4xl md:text-6xl leading-tight tracking-wide text-neon drop-shadow">
                  {g.title}
                </h1>
                <p className="mt-3 text-lg text-neon-soft/90 max-w-lg">{g.tagline}</p>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {g.platforms.map((p) => (
                    <span key={p} className="chip">{p}</span>
                  ))}
                  <span className="chip">{g.genre}</span>
                  <span className="chip">&#9733; {g.rating.toFixed(1)}</span>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <Link href={`/games/${g.slug}`} className="btn-neon animate-pulseGlow">View Details</Link>
                  <Link href="/games" className="btn-neon !bg-transparent">Browse all</Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative aspect-[4/3] md:aspect-[5/4] rounded-xl overflow-hidden border border-neon-700/50 shadow-neonSoft">
            <AnimatePresence mode="wait">
              <motion.img
                key={g.id}
                src={g.banner || g.cover}
                alt={g.title}
                decoding="async"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.06 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-transparent to-black/30" />
            <div className="absolute inset-x-0 bottom-0 flex gap-2 p-3">
              {games.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-1 flex-1 rounded-full transition ${idx === i ? "bg-neon-400 shadow-neon" : "bg-neon-800/60"}`}
                />
              ))}
            </div>
            <div className="absolute inset-0 pointer-events-none mix-blend-screen scan-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
