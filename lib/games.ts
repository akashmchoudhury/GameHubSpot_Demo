import type { Game } from "./types";

export const GAMES: Game[] = [
  {
    id: "g-neon-drift",
    slug: "neon-drift",
    title: "Neon Drift: Horizon",
    platforms: ["PC", "iOS", "Android"],
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.7,
    genre: "Racing",
    cover: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=70&auto=format",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=70&auto=format",
    tagline: "Outrun the skyline. Outlive the night.",
    description:
      "A futuristic arcade-racer set in a rain-soaked megacity. Chain drifts, deploy neon boosts, and dominate the leaderboards across 28 track variations.",
    featured: true,
    releaseDate: "2026-03-14",
    developer: "Vector Lab",
    publisher: "Webmernix Games",
    tags: ["Multiplayer", "Arcade", "Online"]
  },
  {
    id: "g-void-runner",
    slug: "void-runner",
    title: "VoidRunner Protocol",
    platforms: ["PC"],
    price: 49.99,
    rating: 4.8,
    genre: "Sci-Fi FPS",
    cover: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=70&auto=format",
    tagline: "Hack. Shoot. Rewrite reality.",
    description:
      "A single-player cyberpunk FPS where every weapon is a program you can refactor. Branching story, 18 hours of main campaign, full mod support.",
    featured: true,
    releaseDate: "2026-01-22",
    developer: "Nullframe Studio",
    publisher: "Webmernix Games",
    tags: ["Story", "Single-player", "Mod-friendly"]
  },
  {
    id: "g-emerald-isles",
    slug: "emerald-isles",
    title: "Emerald Isles",
    platforms: ["iOS", "Android"],
    price: 9.99,
    rating: 4.6,
    genre: "Cozy Adventure",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=70&auto=format",
    tagline: "Rebuild a forgotten archipelago.",
    description:
      "A relaxing island-builder with hand-painted art, real tides, and 60+ hours of light progression. Perfect for a commute.",
    releaseDate: "2025-11-02",
    developer: "Kite & Sail",
    publisher: "Webmernix Games",
    tags: ["Cozy", "Offline", "Casual"]
  },
  {
    id: "g-hexfall",
    slug: "hexfall",
    title: "Hexfall Tactics",
    platforms: ["PC", "iOS"],
    price: 24.99,
    rating: 4.5,
    genre: "Strategy",
    cover: "https://images.unsplash.com/photo-1606503153255-59d8b8b0a6a0?w=800&q=70&auto=format",
    tagline: "Every hex is a decision.",
    description:
      "A deep tactical roguelite with 40+ unit classes, procedurally generated campaigns, and asynchronous PvP.",
    featured: true,
    releaseDate: "2025-08-30",
    developer: "Hex & Brass",
    publisher: "Webmernix Games",
    tags: ["Roguelite", "Turn-based", "PvP"]
  },
  {
    id: "g-skyforge",
    slug: "skyforge-saga",
    title: "Skyforge Saga",
    platforms: ["PC"],
    price: 59.99,
    rating: 4.9,
    genre: "Open-world RPG",
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=70&auto=format",
    tagline: "A continent that remembers you.",
    description:
      "A sprawling open-world RPG with reactive factions, hand-crafted side-quests, and seamless co-op for up to 4 players.",
    featured: true,
    releaseDate: "2026-05-10",
    developer: "Ironveil",
    publisher: "Webmernix Games",
    tags: ["Co-op", "RPG", "Open-world"]
  },
  {
    id: "g-pulsecore",
    slug: "pulsecore",
    title: "Pulsecore",
    platforms: ["iOS", "Android"],
    price: 4.99,
    rating: 4.4,
    genre: "Rhythm",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=70&auto=format",
    tagline: "Feel the beat. Become it.",
    description:
      "A one-thumb rhythm game tuned for touch. 80+ licensed tracks, daily missions, and global leaderboards.",
    releaseDate: "2026-02-18",
    developer: "Beatloop",
    publisher: "Webmernix Games",
    tags: ["Music", "Casual", "Daily"]
  },
  {
    id: "g-ironveil",
    slug: "ironveil-tactics",
    title: "Ironveil",
    platforms: ["PC", "Android"],
    price: 19.99,
    originalPrice: 29.99,
    rating: 4.6,
    genre: "Mech Action",
    cover: "https://images.unsplash.com/photo-1526178613658-3f1622045557?w=800&q=70&auto=format",
    tagline: "Suit up. Burn down.",
    description:
      "A mech-action shooter with modular loadouts and a 12-hour campaign. Cross-play between PC and Android.",
    releaseDate: "2025-10-04",
    developer: "Core Shift",
    publisher: "Webmernix Games",
    tags: ["Cross-play", "Shooter", "Action"]
  },
  {
    id: "g-lumen",
    slug: "lumen",
    title: "Lumen: A Light Puzzle",
    platforms: ["iOS", "Android", "PC"],
    price: 6.99,
    rating: 4.8,
    genre: "Puzzle",
    cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=70&auto=format",
    tagline: "Bend light. Find quiet.",
    description:
      "A meditative light-refraction puzzle with 120 hand-designed levels and a built-in level editor.",
    releaseDate: "2026-04-01",
    developer: "Quiet Signal",
    publisher: "Webmernix Games",
    tags: ["Puzzle", "Meditative", "Editor"]
  }
];

export function getGameBySlug(slug: string): Game | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function featuredGames(): Game[] {
  return GAMES.filter((g) => g.featured);
}
