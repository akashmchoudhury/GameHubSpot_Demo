"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GameCard } from "@/components/GameCard";
import { GAMES } from "@/lib/games";
import { searchGames } from "@/lib/search";
import type { Platform } from "@/lib/types";

const PLATFORMS: ("All" | Platform)[] = ["All", "PC", "iOS", "Android"];
const GENRES = ["All", ...Array.from(new Set(GAMES.map((g) => g.genre)))];
const SORTS = [
  { v: "relevance", l: "Relevance" },
  { v: "rating-desc", l: "Top rated" },
  { v: "price-asc", l: "Price: low to high" },
  { v: "price-desc", l: "Price: high to low" },
  { v: "release-desc", l: "Newest" }
] as const;

export default function GamesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-neon-soft/60">Loading catalog…</div>}>
      <GamesCatalog />
    </Suspense>
  );
}

function GamesCatalog() {
  const params = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [platform, setPlatform] = useState<("All" | Platform)>((params.get("platform") as any) ?? "All");
  const [genre, setGenre] = useState<string>(params.get("genre") ?? "All");
  const [sort, setSort] = useState<(typeof SORTS)[number]["v"]>((params.get("sort") as any) ?? "relevance");

  useEffect(() => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (platform !== "All") sp.set("platform", platform);
    if (genre !== "All") sp.set("genre", genre);
    if (sort !== "relevance") sp.set("sort", sort);
    const qs = sp.toString();
    router.replace(qs ? `/games?${qs}` : "/games", { scroll: false });
  }, [q, platform, genre, sort, router]);

  const results = useMemo(() => searchGames({ query: q, platform, genre, sort }), [q, platform, genre, sort]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="section-title text-xl">Games catalog</h1>
        <div className="text-sm text-neon-soft/60">
          Showing <span className="text-neon">{results.length}</span> of {GAMES.length} games
        </div>
      </div>

      <div className="card-neon p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, genre, tag..."
            className="input-neon w-full pl-9"
            aria-label="Search games"
          />
          <svg viewBox="0 0 24 24" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neon-500" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </div>

        <Select label="Platform" value={platform} onChange={(v) => setPlatform(v as any)} options={PLATFORMS} />
        <Select label="Genre" value={genre} onChange={setGenre} options={GENRES} />

        <div className="md:col-span-4 flex flex-wrap items-center gap-2">
          <div className="text-[10px] uppercase tracking-widest text-neon-soft/60 mr-2">Sort</div>
          {SORTS.map((s) => (
            <button
              key={s.v}
              onClick={() => setSort(s.v)}
              className={`chip transition ${sort === s.v ? "!bg-neon-500 !text-black !border-neon-500" : "hover:!bg-neon-800/40"}`}
            >
              {s.l}
            </button>
          ))}
          {(q || platform !== "All" || genre !== "All" || sort !== "relevance") && (
            <button
              onClick={() => { setQ(""); setPlatform("All"); setGenre("All"); setSort("relevance"); }}
              className="ml-auto text-xs text-neon-soft/60 hover:text-neon"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="card-neon p-12 text-center">
          <div className="font-display text-neon text-xl">No matches</div>
          <p className="mt-2 text-neon-soft/60">Try widening your filters or searching for a different genre.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
        </div>
      )}
    </section>
  );
}

function Select({
  label, value, onChange, options
}: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest text-neon-soft/60">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input-neon">
        {options.map((o) => <option key={o} value={o} className="bg-black">{o}</option>)}
      </select>
    </label>
  );
}
