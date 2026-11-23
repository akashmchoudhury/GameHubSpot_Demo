"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartProvider";

type Method = "paypal" | "cashapp";

export default function CheckoutPage() {
  const { items, subtotal, tax, total, clear } = useCart();
  const router = useRouter();
  const [method, setMethod] = useState<Method>("paypal");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (items.length === 0 && !success) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="section-title justify-center text-xl">Nothing to checkout</h1>
        <p className="mt-3 text-neon-soft/70">Your cart is empty. Add a game or accessory first.</p>
        <Link href="/games" className="btn-neon mt-5 inline-flex">Browse games</Link>
      </section>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setSuccess(true);
      setProcessing(false);
      clear();
      setTimeout(() => router.push("/"), 4500);
    }, 1500);
  }

  if (success) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-block">
          <div className="w-24 h-24 rounded-full border-2 border-neon-500 shadow-neon grid place-items-center mx-auto animate-pulseGlow">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-neon-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 12 5 5 9-11"/>
            </svg>
          </div>
        </motion.div>
        <h1 className="mt-6 font-display text-3xl text-neon">Payment accepted</h1>
        <p className="mt-3 text-neon-soft/80">This was a dummy {method === "paypal" ? "PayPal" : "CashApp"} transaction &mdash; no real money moved.</p>
        <p className="mt-1 text-neon-soft/60 text-sm">Redirecting you home in a moment...</p>
        <Link href="/" className="btn-neon mt-6 inline-flex">Return home</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 grid md:grid-cols-3 gap-6">
      <form onSubmit={submit} className="md:col-span-2 space-y-5">
        <h1 className="section-title text-xl">Checkout</h1>

        <div className="card-neon p-5 space-y-3">
          <h2 className="section-title text-sm">Buyer</h2>
          <Field label="Full name" value={name} onChange={setName} required />
          <Field label="Email" value={email} onChange={setEmail} type="email" required />
        </div>

        <div className="card-neon p-5">
          <h2 className="section-title text-sm">Payment method</h2>
          <p className="text-xs text-neon-soft/60 mt-1">Dummy methods only &mdash; no real card details are collected.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MethodCard active={method === "paypal"} onClick={() => setMethod("paypal")} name="PayPal" tagline="Pay with PayPal (sandbox)" />
            <MethodCard active={method === "cashapp"} onClick={() => setMethod("cashapp")} name="CashApp" tagline="Send $ via CashApp handle" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={method}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              {method === "paypal" ? (
                <Field label="PayPal email" value={handle} onChange={setHandle} type="email" required placeholder="you@paypal.com" />
              ) : (
                <Field label="CashApp $Cashtag" value={handle} onChange={setHandle} required placeholder="$yourhandle" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button type="submit" disabled={processing} className="btn-neon !py-3 !px-6 animate-pulseGlow w-full justify-center">
          {processing ? "Processing..." : `Pay $${total.toFixed(2)}`}
        </button>
      </form>

      <aside className="card-neon p-5 h-fit">
        <h2 className="section-title text-sm">Order</h2>
        <ul className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
          {items.map((it) => (
            <li key={it.id} className="flex gap-3 items-center text-sm">
              <div className="w-10 h-10 rounded overflow-hidden border border-neon-700/40 shrink-0">
                <img src={it.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="truncate">{it.title}</div>
                <div className="text-[11px] text-neon-soft/60">x{it.quantity}</div>
              </div>
              <div className="text-neon">${(it.price * it.quantity).toFixed(2)}</div>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 text-sm">
          <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <Row label="Tax (8%)" value={`$${tax.toFixed(2)}`} />
          <div className="border-t border-neon-700/40 my-2" />
          <Row label="Total" value={`$${total.toFixed(2)}`} strong />
        </div>
      </aside>
    </section>
  );
}

function Field({
  label, value, onChange, type = "text", required, placeholder
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest text-neon-soft/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="input-neon"
      />
    </label>
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

function MethodCard({ active, onClick, name, tagline }: { active: boolean; onClick: () => void; name: string; tagline: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-lg border transition ${
        active
          ? "border-neon-500 bg-neon-800/20 shadow-neonSoft"
          : "border-neon-700/40 hover:border-neon-500/60"
      }`}
    >
      <div className="font-display text-neon">{name}</div>
      <div className="text-xs text-neon-soft/60 mt-1">{tagline}</div>
      <div className="mt-2 text-[10px] text-neon-soft/40 uppercase tracking-widest">Dummy · sandbox</div>
    </button>
  );
}
