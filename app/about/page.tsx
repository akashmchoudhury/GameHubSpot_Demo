export const metadata = { title: "About — GameHubSpot" };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 prose-invert">
      <div className="chip">Our story</div>
      <h1 className="mt-4 font-display text-4xl md:text-5xl text-neon">About GameHubSpot</h1>
      <p className="mt-4 text-neon-soft/80 text-lg leading-relaxed">
        GameHubSpot is a boutique digital storefront for PC, iOS and Android games &mdash; plus the accessories that make them shine.
        We&apos;re built and operated by <span className="text-neon">Webmernix</span>, a small studio based in Dhaka, Bangladesh.
      </p>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <Card title="Curated, not endless">
          Every title in our catalog is hand-picked. If it ships here, we&apos;ve played it.
        </Card>
        <Card title="Platform-agnostic">
          PC, iOS, Android &mdash; buy once, redeem across supported platforms where available.
        </Card>
        <Card title="Gear, not hardware">
          We stock controllers, headsets, keyboards, mice and chairs. We don&apos;t sell devices.
        </Card>
      </div>

      <div className="mt-10 card-neon p-6">
        <h2 className="section-title text-sm">Who&apos;s Webmernix?</h2>
        <p className="mt-3 text-neon-soft/80 leading-relaxed">
          Webmernix is a Dhaka-based product studio that ships web apps, games, and the occasional weird neon experiment.
          GameHubSpot is our flagship storefront project &mdash; a laboratory for interface ideas, small-scale e-commerce flows, and conversational product discovery.
        </p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <Meta label="Based in" value="Dhaka, Bangladesh" />
          <Meta label="Founded" value="2025" />
          <Meta label="Team" value="Small, remote-friendly" />
          <Meta label="Focus" value="Games + Web" />
          <Meta label="Contact" value="support@gamehubspot.io" />
          <Meta label="Hours" value="10:00-20:00 BST" />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="section-title text-sm">Our neon manifesto</h2>
        <ol className="mt-4 space-y-3 list-decimal list-inside text-neon-soft/80">
          <li>Games should be easy to find, easier to buy, and fun to live with.</li>
          <li>Accessories matter &mdash; the right pad makes a mid-tier mouse feel like a top-tier one.</li>
          <li>Build for Bangladesh first, scale from there.</li>
          <li>Keep the UI dark. Keep the signals bright.</li>
        </ol>
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-neon p-5">
      <div className="font-display text-neon">{title}</div>
      <div className="mt-2 text-sm text-neon-soft/80">{children}</div>
    </div>
  );
}
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-neon-soft/50">{label}</div>
      <div className="text-neon-soft">{value}</div>
    </div>
  );
}
