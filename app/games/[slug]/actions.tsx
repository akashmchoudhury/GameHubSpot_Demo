"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

interface Props {
  game: { id: string; title: string; price: number; cover: string; platforms: string[] };
}

export function GameDetailActions({ game }: Props) {
  const { add, open } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAdd(buyNow = false) {
    add({ id: game.id, kind: "game", title: game.title, price: game.price, image: game.cover, meta: game.platforms.join(" / ") });
    setAdded(true);
    if (buyNow) router.push("/checkout");
    else {
      open();
      setTimeout(() => setAdded(false), 1400);
    }
  }

  return (
    <div className="mt-5 flex flex-wrap gap-3">
      <button onClick={() => handleAdd(false)} className="btn-neon animate-pulseGlow">
        {added ? "Added ✓" : "Add to cart"}
      </button>
      <button onClick={() => handleAdd(true)} className="btn-neon !bg-transparent">Buy now</button>
    </div>
  );
}
