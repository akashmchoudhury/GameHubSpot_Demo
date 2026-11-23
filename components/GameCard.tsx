"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "./CartProvider";
import type { Game } from "@/lib/types";

export function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  const { add } = useCart();
  const discount = game.originalPrice ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35 }}
      className="card-neon group relative flex flex-col overflow-hidden"
    >
      <Link href={`/games/${game.slug}`} className="relative block aspect-[4/5] overflow-hidden">
        <img src={game.cover} alt={game.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-2 left-2 flex gap-1">
          {game.platforms.map((p) => (
            <span key={p} className="chip">{p}</span>
          ))}
        </div>
        {discount > 0 && (
          <div className="absolute top-2 right-2 chip !bg-neon-500 !text-black !border-neon-500">-{discount}%</div>
        )}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="font-display text-base text-neon drop-shadow">{game.title}</div>
          <div className="text-xs text-neon-soft/80">{game.genre}</div>
        </div>
      </Link>
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-neon text-lg">${game.price.toFixed(2)}</span>
          {game.originalPrice && (
            <span className="text-xs text-neon-soft/40 line-through">${game.originalPrice.toFixed(2)}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() =>
            add({ id: game.id, kind: "game", title: game.title, price: game.price, image: game.cover, meta: game.platforms.join(" / ") })
          }
          className="btn-neon !py-1.5 !px-3 !text-[11px]"
        >
          + Cart
        </button>
      </div>
      <div className="px-3 pb-3 flex items-center justify-between text-[11px] text-neon-soft/60">
        <span>&#9733; {game.rating.toFixed(1)}</span>
        <span>{new Date(game.releaseDate).toLocaleDateString(undefined, { year: "numeric", month: "short" })}</span>
      </div>
    </motion.div>
  );
}
