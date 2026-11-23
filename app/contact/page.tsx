"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 3500);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 grid md:grid-cols-2 gap-8">
      <div>
        <div className="chip">Get in touch</div>
        <h1 className="mt-4 font-display text-4xl text-neon">Contact</h1>
        <p className="mt-4 text-neon-soft/80">
          We read every message. For order issues, please include your email so we can look up the transaction.
        </p>
        <div className="mt-6 space-y-4 text-sm">
          <Info label="Office" value="Banani, Dhaka, Bangladesh" />
          <Info label="Email" value="support@gamehubspot.io" />
          <Info label="Phone" value="+880 1xxx xxx xxx" />
          <Info label="Hours" value="Sun-Thu · 10:00-20:00 BST" />
        </div>

        <div className="mt-8 card-neon p-5">
          <div className="font-display text-neon">We&apos;re at</div>
          <div className="mt-2 text-sm text-neon-soft/70">
            Road 11, Block C &mdash; Banani, Dhaka 1213, Bangladesh.
          </div>
          <div className="mt-4 aspect-video rounded overflow-hidden border border-neon-700/40 bg-black/60 bg-grid grid place-items-center">
            <div className="text-neon-soft/70 text-sm">Interactive map placeholder</div>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="card-neon p-5 space-y-3 h-fit">
        <h2 className="section-title text-sm">Send a message</h2>
        <Field label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
        <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} required />
        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-widest text-neon-soft/60">Message</span>
          <textarea
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={5}
            className="input-neon resize-none"
          />
        </label>
        <button type="submit" className="btn-neon w-full justify-center animate-pulseGlow">Send message</button>
        <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-neon text-sm"
            >
              Message queued (dummy). We&apos;ll get back within 24h.
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-neon-soft/50">{label}</div>
      <div className="text-neon-soft">{value}</div>
    </div>
  );
}
function Field({
  label, value, onChange, type = "text", required
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest text-neon-soft/60">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="input-neon"
      />
    </label>
  );
}
