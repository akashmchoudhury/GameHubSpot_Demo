import { GAMES } from "./games";
import { ACCESSORIES } from "./accessories";
import type { Game, Accessory, Platform } from "./types";

export interface SearchFilters {
  query?: string;
  platform?: Platform | "All";
  genre?: string | "All";
  minRating?: number;
  sort?: "relevance" | "price-asc" | "price-desc" | "rating-desc" | "release-desc";
}

export interface SearchResults {
  games: Game[];
  accessories: Accessory[];
}

function score(text: string, query: string): number {
  if (!query) return 1;
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t === q) return 10;
  if (t.startsWith(q)) return 6;
  if (t.includes(q)) return 3;
  return 0;
}

export function searchGames(filters: SearchFilters): Game[] {
  const q = (filters.query ?? "").trim();
  let list = GAMES.filter((g) => {
    if (filters.platform && filters.platform !== "All" && !g.platforms.includes(filters.platform)) return false;
    if (filters.genre && filters.genre !== "All" && g.genre !== filters.genre) return false;
    if (filters.minRating && g.rating < filters.minRating) return false;
    return true;
  });
  if (q) {
    list = list
      .map((g) => ({
        g,
        s:
          score(g.title, q) * 3 +
          score(g.genre, q) * 1.5 +
          score(g.tagline, q) +
          g.tags.reduce((acc, t) => acc + score(t, q), 0)
      }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.g);
  }
  switch (filters.sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    case "release-desc":
      list = [...list].sort((a, b) => +new Date(b.releaseDate) - +new Date(a.releaseDate));
      break;
  }
  return list;
}

export function quickSearch(query: string, limit = 6): SearchResults {
  const q = query.trim().toLowerCase();
  if (!q) return { games: [], accessories: [] };
  const games = GAMES.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.genre.toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q))
  ).slice(0, limit);
  const accessories = ACCESSORIES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  ).slice(0, limit);
  return { games, accessories };
}
