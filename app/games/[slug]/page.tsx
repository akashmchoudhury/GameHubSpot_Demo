import { notFound } from "next/navigation";
import Link from "next/link";
import { GAMES, getGameBySlug } from "@/lib/games";
import { GameDetailActions } from "./actions";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export default function GameDetail({ params }: { params: { slug: string } }) {
  const game = getGameBySlug(params.slug);
  if (!game) return notFound();
  const related = GAMES.filter((g) => g.id !== game.id && g.platforms.some((p) => game.platforms.includes(p))).slice(0, 4);
  const discount = game.originalPrice ? Math.round(((game.originalPrice - game.price) / game.originalPrice) * 100) : 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <div className="card-neon relative overflow-hidden aspect-[4/5]">
            <img src={game.banner || game.cover} alt={game.title} decoding="async" fetchPriority="high" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
              {game.platforms.map((p) => <span key={p} className="chip">{p}</span>)}
            </div>
            {discount > 0 && (
              <div className="absolute top-3 right-3 chip !bg-neon-500 !text-black !border-neon-500">-{discount}%</div>
            )}
          </div>
        </div>

        <div className="md:col-span-3">
          <h1 className="font-display text-3xl md:text-5xl text-neon">{game.title}</h1>
          <p className="mt-2 text-neon-soft/90">{game.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip">{game.genre}</span>
            <span className="chip">&#9733; {game.rating.toFixed(1)}</span>
            <span className="chip">Released {new Date(game.releaseDate).toLocaleDateString()}</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-neon text-4xl">${game.price.toFixed(2)}</span>
            {game.originalPrice && <span className="text-neon-soft/50 line-through">${game.originalPrice.toFixed(2)}</span>}
          </div>

          <GameDetailActions
            game={{ id: game.id, title: game.title, price: game.price, cover: game.cover, platforms: game.platforms }}
          />

          <div className="mt-8 card-neon p-5">
            <h3 className="section-title text-sm">About</h3>
            <p className="mt-3 text-neon-soft/80 leading-relaxed">{game.description}</p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <Meta label="Developer" value={game.developer} />
              <Meta label="Publisher" value={game.publisher} />
              <Meta label="Release" value={new Date(game.releaseDate).toLocaleDateString()} />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {game.tags.map((t) => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="section-title text-lg mb-5">You might also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((g) => (
              <Link key={g.id} href={`/games/${g.slug}`} className="card-neon overflow-hidden block">
                <div className="aspect-[4/5] relative">
                  <img src={g.cover} alt={g.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-sm font-display text-neon truncate">{g.title}</div>
                    <div className="text-[11px] text-neon-soft/70">{g.genre} · ${g.price.toFixed(2)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
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
