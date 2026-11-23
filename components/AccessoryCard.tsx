"use client";

import { motion } from "framer-motion";
import { useCart } from "./CartProvider";
import type { Accessory } from "@/lib/types";

export function AccessoryCard({ item, index = 0 }: { item: Accessory; index?: number }) {
  const { add } = useCart();
  return (
    <motion.div
      id={item.slug}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35 }}
      className="card-neon group relative overflow-hidden flex flex-col"
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-2 left-2 chip">{item.category}</div>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <div className="font-display text-sm text-neon">{item.title}</div>
        <p className="mt-1 text-xs text-neon-soft/70 flex-1">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-neon text-lg">${item.price.toFixed(2)}</span>
          <button
            type="button"
            onClick={() =>
              add({ id: item.id, kind: "accessory", title: item.title, price: item.price, image: item.image, meta: item.category })
            }
            className="btn-neon !py-1.5 !px-3 !text-[11px]"
          >
            + Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
