"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { items, subtotal, tax, total, setQty, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="section-title justify-center text-xl">Your cart is empty</h1>
        <p className="mt-4 text-neon-soft/70">Add some games or accessories to get started.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/games" className="btn-neon">Browse games</Link>
          <Link href="/accessories" className="btn-neon !bg-transparent">Browse accessories</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="section-title text-xl mb-5">Cart ({items.length})</h1>
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className="card-neon p-4 flex gap-4 items-center">
              <div className="w-20 h-20 rounded overflow-hidden border border-neon-700/40 shrink-0">
                <img src={it.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-neon-soft">{it.title}</div>
                <div className="text-xs text-neon-soft/60">{it.meta} · {it.kind}</div>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => setQty(it.id, it.quantity - 1)} className="w-7 h-7 rounded border border-neon-700/40 text-neon">-</button>
                  <span className="w-8 text-center">{it.quantity}</span>
                  <button onClick={() => setQty(it.id, it.quantity + 1)} className="w-7 h-7 rounded border border-neon-700/40 text-neon">+</button>
                  <button onClick={() => remove(it.id)} className="ml-auto text-xs text-neon-soft/60 hover:text-neon">Remove</button>
                </div>
              </div>
              <div className="font-display text-neon text-lg">${(it.price * it.quantity).toFixed(2)}</div>
            </li>
          ))}
        </ul>
        <button onClick={clear} className="mt-5 text-xs text-neon-soft/60 hover:text-neon">Clear cart</button>
      </div>

      <aside className="card-neon p-5 h-fit sticky top-24">
        <h2 className="section-title text-sm">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <Row label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
          <div className="border-t border-neon-700/40 my-2" />
          <Row label="Total" value={`$${total.toFixed(2)}`} strong />
        </div>
        <Link href="/checkout" className="btn-neon mt-5 w-full justify-center animate-pulseGlow">Proceed to checkout</Link>
      </aside>
    </section>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={strong ? "font-display text-neon" : "text-neon-soft/70"}>{label}</span>
      <span className={strong ? "font-display text-neon text-lg" : "text-neon-soft"}>{value}</span>
    </div>
  );
}
