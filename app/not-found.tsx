import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="font-display text-7xl text-neon animate-flicker">404</div>
      <h1 className="mt-4 font-display text-2xl text-neon-soft">Signal lost</h1>
      <p className="mt-3 text-neon-soft/70">That page isn&apos;t in our grid. Try one of these instead.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="btn-neon">Home</Link>
        <Link href="/games" className="btn-neon !bg-transparent">Games</Link>
      </div>
    </section>
  );
}
