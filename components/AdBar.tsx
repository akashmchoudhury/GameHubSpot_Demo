export function AdBar() {
  return (
    <div className="relative overflow-hidden border-b border-neon-700/30 bg-black">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 py-2 flex items-center gap-3">
        <span className="chip !bg-black !border-neon-500 !text-neon">AD</span>
        <div className="relative flex-1 overflow-hidden whitespace-nowrap">
          <div className="marquee-track flex gap-16 whitespace-nowrap will-change-transform">
            {[0, 1].map((k) => (
              <div key={k} className="flex items-center gap-16" aria-hidden={k === 1 ? true : undefined}>
                <AdSlot brand="APPLE" mark="" headline="New M-Series Gaming PCs" sub="Up to 40% faster in next-gen titles. Learn more →" />
                <AdSlot brand="OMEGA" mark="✦" headline="Omega Elite Controller · 15% OFF" sub="Use code NEON15 at checkout" />
                <AdSlot brand="WEBMERNIX" mark="" headline="Skyforge Saga pre-orders live" sub="Reserve now, play May 2026" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdSlot({ brand, mark, headline, sub }: { brand: string; mark: string; headline: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="font-display tracking-widest text-neon">{mark} {brand}</span>
      <span className="text-neon-soft">{headline}</span>
      <span className="text-neon-soft/60">{sub}</span>
    </div>
  );
}
