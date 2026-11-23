import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-neon-700/30 bg-black/80">
      <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="font-display text-lg tracking-widest">
            <span className="text-neon">GAME</span>
            <span className="text-neon-soft">HUB</span>
            <span className="text-neon">SPOT</span>
          </div>
          <p className="mt-3 text-sm text-neon-soft/70">
            A curated hub for PC, iOS and Android games, built by <span className="text-neon">Webmernix</span>.
          </p>
          <p className="mt-2 text-xs text-neon-soft/60">
            Dhaka, Bangladesh · support@gamehubspot.io
          </p>
        </div>

        <div>
          <div className="section-title text-xs">Shop</div>
          <ul className="mt-3 space-y-1 text-sm">
            <li><Link href="/games" className="hover:text-neon">All Games</Link></li>
            <li><Link href="/games?platform=PC" className="hover:text-neon">PC</Link></li>
            <li><Link href="/games?platform=iOS" className="hover:text-neon">iOS</Link></li>
            <li><Link href="/games?platform=Android" className="hover:text-neon">Android</Link></li>
            <li><Link href="/accessories" className="hover:text-neon">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <div className="section-title text-xs">Company</div>
          <ul className="mt-3 space-y-1 text-sm">
            <li><Link href="/about" className="hover:text-neon">About</Link></li>
            <li><Link href="/contact" className="hover:text-neon">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="section-title text-xs">Legal</div>
          <ul className="mt-3 space-y-1 text-sm">
            <li><Link href="/terms" className="hover:text-neon">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy" className="hover:text-neon">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neon-700/20">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-neon-soft/60">
          <div>&copy; {new Date().getFullYear()} GameHubSpot. All rights reserved.</div>
          <div>Developed by <span className="text-neon">Webmernix</span></div>
        </div>
      </div>
    </footer>
  );
}
