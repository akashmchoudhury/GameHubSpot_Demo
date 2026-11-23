export const metadata = { title: "Terms & Conditions — GameHubSpot" };

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="chip">Legal</div>
      <h1 className="mt-4 font-display text-4xl text-neon">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-neon-soft/50">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="mt-8 space-y-6 text-neon-soft/85 leading-relaxed">
        <Section n="1" title="Who we are">
          GameHubSpot is operated by <span className="text-neon">Webmernix</span>, headquartered in Dhaka, Bangladesh.
          By using this website you agree to the terms set out below.
        </Section>

        <Section n="2" title="Accounts">
          Browsing is open to all. Purchases may require a guest email so we can deliver receipts and download keys.
        </Section>

        <Section n="3" title="Purchases &amp; payments">
          Payments on this site are processed via dummy PayPal and CashApp integrations for demonstration purposes.
          Real payment processors will be integrated before production launch. In the demo environment, no funds are
          collected and no products are delivered.
        </Section>

        <Section n="4" title="Refunds">
          Digital goods are refundable within 14 days of purchase if they are unlaunched or technically faulty.
          Accessories can be returned within 30 days provided packaging is intact. Shipping costs are non-refundable.
        </Section>

        <Section n="5" title="Acceptable use">
          You agree not to reverse engineer our software, scrape the catalog, or use the chatbot to generate abusive
          content. We may suspend accounts that violate these rules.
        </Section>

        <Section n="6" title="Content & intellectual property">
          All marks, artwork and copy belong to their respective publishers. GameHubSpot and the logo are trademarks
          of Webmernix.
        </Section>

        <Section n="7" title="Limitation of liability">
          GameHubSpot is provided "as is". We&apos;re not liable for indirect or consequential losses arising from use of
          the site, to the extent permitted by Bangladeshi law.
        </Section>

        <Section n="8" title="Governing law">
          These terms are governed by the laws of Bangladesh. Disputes shall be resolved in the courts of Dhaka.
        </Section>

        <Section n="9" title="Contact">
          Questions? Reach us at <span className="text-neon">support@gamehubspot.io</span> or via the contact page.
        </Section>
      </div>
    </section>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-neon text-lg">{n}. {title}</h2>
      <p className="mt-2">{children}</p>
    </div>
  );
}
