"use client";

import { useMemo, useState } from "react";
import { AccessoryCard } from "@/components/AccessoryCard";
import { ACCESSORIES } from "@/lib/accessories";

const CATEGORIES = ["All", ...Array.from(new Set(ACCESSORIES.map((a) => a.category)))];

export default function AccessoriesPage() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    return ACCESSORIES.filter((a) => {
      if (cat !== "All" && a.category !== cat) return false;
      if (!term) return true;
      return (
        a.title.toLowerCase().includes(term) ||
        a.category.toLowerCase().includes(term) ||
        a.tags.some((t) => t.toLowerCase().includes(term)) ||
        a.description.toLowerCase().includes(term)
      );
    });
  }, [cat, q]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title text-xl">Accessories</h1>
          <p className="mt-2 text-sm text-neon-soft/70 max-w-xl">
            Controllers, headsets, keyboards, mice, chairs. We stock the gear &mdash; devices are up to you.
          </p>
        </div>
        <div className="text-sm text-neon-soft/60">
          <span className="text-neon">{items.length}</span> items
        </div>
      </div>

      <div className="card-neon p-4 mb-6 flex flex-col md:flex-row gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search accessories..."
          className="input-neon flex-1"
        />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`chip transition ${cat === c ? "!bg-neon-500 !text-black !border-neon-500" : "hover:!bg-neon-800/40"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card-neon p-10 text-center text-neon-soft/60">No accessories match that filter.</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((a, i) => <AccessoryCard key={a.id} item={a} index={i} />)}
        </div>
      )}
    </section>
  );
}
