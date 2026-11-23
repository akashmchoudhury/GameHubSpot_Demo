"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { isOpen, close, items, subtotal, tax, total, setQty, remove, clear } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-ink-700 border-l border-neon-700/40 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-neon-700/40">
              <div className="section-title text-sm">Your Cart</div>
              <button onClick={close} className="btn-neon !py-1 !px-2 !text-[11px]">Close</button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="text-center py-20 text-neon-soft/70">
                  <div className="font-display text-neon mb-2">Empty vault</div>
                  <p className="text-sm">Add games or accessories to see them here.</p>
                  <Link href="/games" onClick={close} className="btn-neon mt-5 inline-flex">Browse games</Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((it) => (
                    <li key={it.id} className="flex gap-3 p-2 rounded-lg border border-neon-700/30 bg-black/40">
                      <div className="w-16 h-16 rounded overflow-hidden border border-neon-700/40 shrink-0">
                        <img src={it.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm truncate">{it.title}</div>
                        <div className="text-[11px] text-neon-soft/60">{it.meta} · {it.kind}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <QtyButton onClick={() => setQty(it.id, it.quantity - 1)}>-</QtyButton>
                          <span className="w-6 text-center text-sm">{it.quantity}</span>
                          <QtyButton onClick={() => setQty(it.id, it.quantity + 1)}>+</QtyButton>
                          <button onClick={() => remove(it.id)} className="ml-auto text-[11px] text-neon-soft/60 hover:text-neon">Remove</button>
                        </div>
                      </div>
                      <div className="text-neon font-display">${(it.price * it.quantity).toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-neon-700/40 p-5 space-y-2">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
              <Row label="Total" value={`$${total.toFixed(2)}`} strong />
              <div className="flex gap-2 pt-2">
                <button onClick={clear} disabled={items.length === 0} className="btn-neon flex-1 !bg-transparent">Clear</button>
                <Link
                  href="/checkout"
                  onClick={close}
                  aria-disabled={items.length === 0}
                  className={`btn-neon flex-1 justify-center ${items.length === 0 ? "pointer-events-none opacity-50" : "animate-pulseGlow"}`}
                >
                  Checkout
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={strong ? "font-display text-neon" : "text-neon-soft/70"}>{label}</span>
      <span className={strong ? "font-display text-neon text-lg" : "text-neon-soft"}>{value}</span>
    </div>
  );
}

function QtyButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-6 h-6 rounded border border-neon-700/40 text-neon hover:border-neon-500 hover:shadow-neonSoft transition"
    >
      {children}
    </button>
  );
}
