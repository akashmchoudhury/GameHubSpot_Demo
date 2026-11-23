export const metadata = { title: "Privacy Policy — GameHubSpot" };

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="chip">Legal</div>
      <h1 className="mt-4 font-display text-4xl text-neon">Privacy Policy</h1>
      <p className="mt-2 text-sm text-neon-soft/50">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="mt-6 card-neon p-5">
        <div className="font-display text-neon text-sm">Plain-English summary</div>
        <p className="mt-2 text-sm text-neon-soft/80">
          We only collect what we need to deliver your orders and run the site. We don&apos;t sell your data.
          Cart contents are stored on your device. The chatbot works locally &mdash; messages are not sent to a server.
        </p>
      </div>

      <div className="mt-8 space-y-6 text-neon-soft/85 leading-relaxed">
        <Section n="1" title="Who we are">
          GameHubSpot is operated by <span className="text-neon">Webmernix</span> from Dhaka, Bangladesh. We&apos;re the
          data controller for this website.
        </Section>

        <Section n="2" title="What we collect">
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Order details: name, email, products purchased, payment handle (for dummy checkout).</li>
            <li>Support messages you send via the contact form.</li>
            <li>Technical: anonymous usage analytics (page views, device type).</li>
          </ul>
        </Section>

        <Section n="3" title="What we don&apos;t collect">
          We don&apos;t collect your card numbers. We don&apos;t sell or share your data with ad networks.
          The chatbot runs in your browser; your messages are not persisted or sent to any third party.
        </Section>

        <Section n="4" title="Cookies &amp; local storage">
          We use <code className="text-neon">localStorage</code> to remember your cart between visits. No third-party
          tracking cookies are set.
        </Section>

        <Section n="5" title="Your rights">
          You can request export or deletion of any personal data we hold about you by emailing
          <span className="text-neon"> support@gamehubspot.io</span>. We&apos;ll respond within 30 days.
        </Section>

        <Section n="6" title="Data retention">
          Order records are kept for 7 years for tax purposes. Contact-form messages are kept for 2 years.
        </Section>

        <Section n="7" title="Contact">
          For privacy questions, email <span className="text-neon">privacy@gamehubspot.io</span>.
        </Section>
      </div>
    </section>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-neon text-lg">{n}. {title}</h2>
      <div className="mt-2">{children}</div>
    </div>
  );
}
