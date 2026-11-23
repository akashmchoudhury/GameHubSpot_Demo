"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { quickSearch } from "@/lib/search";

interface Msg {
  id: string;
  role: "bot" | "user";
  text: string;
  cta?: { label: string; href: string }[];
}

const INTRO: Msg = {
  id: "intro",
  role: "bot",
  text:
    "Hey, I'm Spotbot. I can help you find games, check out, read our policies, or just answer questions. Try: \"show me RPGs\", \"where is my cart?\", or \"what are your hours?\""
};

const SUGGESTIONS = [
  "Show me RPG games",
  "I need a headset",
  "How do I pay?",
  "Where are you located?",
  "Open the cart",
  "Privacy policy"
];

export function Chatbot() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([INTRO]);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  function send(text?: string) {
    const content = (text ?? draft).trim();
    if (!content) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: content };
    const reply = respond(content);
    setMsgs((m) => [...m, userMsg]);
    setDraft("");
    setTimeout(() => setMsgs((m) => [...m, reply]), 320);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 btn-neon !py-3 !px-4 animate-pulseGlow"
        aria-label="Open chat"
      >
        <ChatIcon /> {open ? "Close" : "Spotbot"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-20 right-5 z-40 w-[92vw] max-w-sm h-[520px] bg-ink-700 border border-neon-700/50 rounded-xl shadow-neon flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neon-700/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-400 shadow-neon animate-pulseGlow" />
                <span className="font-display text-neon tracking-widest text-sm">SPOTBOT</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-neon-soft/70 hover:text-neon text-sm">&times;</button>
            </div>

            <div ref={scroller} className="flex-1 overflow-y-auto p-3 space-y-2 bg-black/30">
              {msgs.map((m) => (
                <Bubble key={m.id} m={m} onCta={(href) => { setOpen(false); router.push(href); }} />
              ))}
            </div>

            <div className="px-3 py-2 border-t border-neon-700/40 bg-black/50">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="chip hover:!bg-neon-800/40 hover:!text-neon transition">
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Ask Spotbot..."
                  className="input-neon flex-1 text-sm"
                />
                <button type="submit" className="btn-neon !py-1.5 !px-3">Send</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ m, onCta }: { m: Msg; onCta: (href: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
        m.role === "user"
          ? "ml-auto bg-neon-800/40 border border-neon-700/40 text-neon-soft"
          : "bg-black/60 border border-neon-700/50 text-neon-soft"
      }`}
    >
      <div className="whitespace-pre-wrap">{m.text}</div>
      {m.cta && m.cta.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {m.cta.map((c) => (
            <button key={c.href} onClick={() => onCta(c.href)} className="chip hover:!bg-neon-800/40 hover:!text-neon">
              {c.label} &rarr;
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a8 8 0 0 1-11.6 7.1L3 20l1-5.5A8 8 0 1 1 21 12Z"/>
    </svg>
  );
}

function respond(input: string): Msg {
  const t = input.toLowerCase();
  const id = crypto.randomUUID();

  if (/\b(cart|checkout|buy|purchase|pay(ment)?)\b/.test(t)) {
    if (/pay|payment|paypal|cashapp|cash app|method/.test(t)) {
      return {
        id, role: "bot",
        text: "We take dummy PayPal and CashApp payments on the checkout page — great for testing the flow. No real card details are collected.",
        cta: [{ label: "Go to checkout", href: "/checkout" }, { label: "Open cart page", href: "/cart" }]
      };
    }
    return {
      id, role: "bot",
      text: "Your cart lives at /cart, or you can pop the side drawer from the top-right. Checkout accepts dummy PayPal / CashApp.",
      cta: [{ label: "Open cart", href: "/cart" }, { label: "Checkout", href: "/checkout" }]
    };
  }

  if (/\b(contact|support|email|phone|reach)\b/.test(t)) {
    return {
      id, role: "bot",
      text: "You can reach us via the contact form. We're based in Dhaka, Bangladesh and reply within 24h.",
      cta: [{ label: "Contact page", href: "/contact" }]
    };
  }

  if (/\b(about|who|team|webmernix|developer)\b/.test(t)) {
    return {
      id, role: "bot",
      text: "GameHubSpot is built and maintained by Webmernix out of Dhaka, Bangladesh.",
      cta: [{ label: "About page", href: "/about" }]
    };
  }

  if (/\b(privacy|data|gdpr)\b/.test(t)) {
    return { id, role: "bot", text: "Here's our privacy policy — plain-English summary at the top.", cta: [{ label: "Privacy Policy", href: "/privacy" }] };
  }
  if (/\b(terms|t&c|tos|refund)\b/.test(t)) {
    return { id, role: "bot", text: "Our Terms & Conditions cover usage, purchases and refunds.", cta: [{ label: "Terms & Conditions", href: "/terms" }] };
  }

  if (/\b(location|where|address|dhaka|bangladesh|hours)\b/.test(t)) {
    return {
      id, role: "bot",
      text: "GameHubSpot HQ is in Dhaka, Bangladesh. Store is online 24/7; support hours are 10:00-20:00 BST.",
      cta: [{ label: "Contact", href: "/contact" }]
    };
  }

  if (/\b(accessor|headset|keyboard|mouse|controller|chair)\b/.test(t)) {
    const r = quickSearch(input, 4);
    if (r.accessories.length > 0) {
      return {
        id, role: "bot",
        text: `I found ${r.accessories.length} accessor${r.accessories.length === 1 ? "y" : "ies"} matching that. We carry accessories only — no devices.`,
        cta: [{ label: "Browse accessories", href: "/accessories" }, ...r.accessories.slice(0, 2).map((a) => ({ label: a.title, href: `/accessories#${a.slug}` }))]
      };
    }
    return { id, role: "bot", text: "We stock controllers, headsets, keyboards, mice, chairs and streaming gear.", cta: [{ label: "All accessories", href: "/accessories" }] };
  }

  if (/\b(pc|windows|mac)\b/.test(t)) {
    return { id, role: "bot", text: "PC catalog incoming.", cta: [{ label: "PC games", href: "/games?platform=PC" }] };
  }
  if (/\b(ios|iphone|ipad|apple)\b/.test(t)) {
    return { id, role: "bot", text: "iOS catalog incoming.", cta: [{ label: "iOS games", href: "/games?platform=iOS" }] };
  }
  if (/\b(android|google play|pixel|samsung)\b/.test(t)) {
    return { id, role: "bot", text: "Android catalog incoming.", cta: [{ label: "Android games", href: "/games?platform=Android" }] };
  }

  if (/\b(rpg|puzzle|racing|strategy|shooter|fps|rhythm|cozy|roguelite|mech|action)\b/.test(t)) {
    const r = quickSearch(input, 5);
    if (r.games.length > 0) {
      return {
        id, role: "bot",
        text: `Here are ${r.games.length} match${r.games.length === 1 ? "" : "es"} for "${input}":`,
        cta: [{ label: "All games", href: "/games" }, ...r.games.slice(0, 3).map((g) => ({ label: g.title, href: `/games/${g.slug}` }))]
      };
    }
  }

  if (/\b(hi|hello|hey|yo|hola)\b/.test(t)) {
    return { id, role: "bot", text: "Hi! I'm here to help you navigate GameHubSpot. What are you looking for today?" };
  }

  const r = quickSearch(input, 4);
  if (r.games.length + r.accessories.length > 0) {
    return {
      id, role: "bot",
      text: `I found a few things matching "${input}".`,
      cta: [
        ...r.games.slice(0, 2).map((g) => ({ label: g.title, href: `/games/${g.slug}` })),
        ...r.accessories.slice(0, 2).map((a) => ({ label: a.title, href: `/accessories#${a.slug}` }))
      ]
    };
  }

  return {
    id, role: "bot",
    text: "Not sure I caught that. Try asking about games, accessories, payment, or legal pages — or pick a suggestion below.",
    cta: [
      { label: "Browse games", href: "/games" },
      { label: "Accessories", href: "/accessories" },
      { label: "Contact us", href: "/contact" }
    ]
  };
}
