import Link from "next/link";
import { HeroSlider } from "@/components/HeroSlider";
import { GameCard } from "@/components/GameCard";
import { AccessoryCard } from "@/components/AccessoryCard";
import { featuredGames, GAMES } from "@/lib/games";
import { ACCESSORIES } from "@/lib/accessories";

export default function HomePage() {
  const featured = featuredGames();
  const trending = GAMES.slice(0, 8);
  const accessories = ACCESSORIES.slice(0, 4);

  return (
    <>
      <HeroSlider games={featured} />

      <Section title="Featured games" cta={{ href: "/games", label: "See all" }} offscreen>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((g, i) => <GameCard key={g.id} game={g} index={i} />)}
        </div>
      </Section>

      <section className="relative overflow-hidden my-10">
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 border-y border-neon-700/30 bg-gradient-to-r from-black via-ink-700/80 to-black">
          <div className="grid md:grid-cols-3 gap-6">
            <Stat kpi="1,200+" label="Games curated" />
            <Stat kpi="3" label="Platforms: PC / iOS / Android" />
            <Stat kpi="24/7" label="Chat support (BST business hours)" />
          </div>
        </div>
      </section>

      <Section title="Accessories, not devices" cta={{ href: "/accessories", label: "Shop accessories" }} offscreen>
        <p className="-mt-4 mb-6 text-sm text-neon-soft/70 max-w-xl">
          We don&apos;t sell phones, consoles or PCs &mdash; just the gear that makes them better. Controllers, headsets, keyboards, mice and more.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {accessories.map((a, i) => <AccessoryCard key={a.id} item={a} index={i} />)}
        </div>
      </Section>

      <section className="my-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="card-neon p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display text-3xl text-neon">Need help picking something?</h3>
                <p className="mt-2 text-neon-soft/80 max-w-md">
                  Our chatbot <span className="text-neon">Spotbot</span> can recommend games by genre, platform or mood &mdash; and take you straight to checkout.
                </p>
              </div>
              <div className="flex md:justify-end gap-3">
                <Link href="/games" className="btn-neon">Browse games</Link>
                <Link href="/contact" className="btn-neon !bg-transparent">Contact support</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  title, cta, children, offscreen
}: { title: string; cta?: { href: string; label: string }; children: React.ReactNode; offscreen?: boolean }) {
  return (
    <section className={`mx-auto max-w-7xl px-4 py-10 ${offscreen ? "cv-auto" : ""}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title text-lg md:text-xl">{title}</h2>
        {cta && <Link href={cta.href} className="text-xs uppercase tracking-widest text-neon-soft/70 hover:text-neon">{cta.label} &rarr;</Link>}
      </div>
      {children}
    </section>
  );
}

function Stat({ kpi, label }: { kpi: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-4xl text-neon drop-shadow">{kpi}</div>
      <div className="mt-1 text-xs tracking-widest uppercase text-neon-soft/60">{label}</div>
    </div>
  );
}
