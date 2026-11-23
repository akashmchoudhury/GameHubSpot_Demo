import { describe, it, expect } from "vitest";
import { GAMES, getGameBySlug, featuredGames } from "@/lib/games";
import { ACCESSORIES, getAccessoryBySlug } from "@/lib/accessories";

describe("lib/games catalog invariants", () => {
  it("every game has required fields", () => {
    for (const g of GAMES) {
      expect(g.id).toBeTruthy();
      expect(g.slug).toBeTruthy();
      expect(g.title).toBeTruthy();
      expect(g.platforms.length).toBeGreaterThan(0);
      expect(g.price).toBeGreaterThan(0);
      expect(g.rating).toBeGreaterThanOrEqual(0);
      expect(g.rating).toBeLessThanOrEqual(5);
      expect(g.cover).toMatch(/^https?:\/\//);
      expect(() => new Date(g.releaseDate)).not.toThrow();
    }
  });

  it("every slug is unique", () => {
    const slugs = GAMES.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every id is unique", () => {
    const ids = GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("discounts (if present) are positive and less than full price", () => {
    for (const g of GAMES) {
      if (g.originalPrice != null) {
        expect(g.originalPrice).toBeGreaterThan(g.price);
      }
    }
  });

  it("covers all three required platforms", () => {
    const platforms = new Set(GAMES.flatMap((g) => g.platforms));
    expect(platforms.has("PC")).toBe(true);
    expect(platforms.has("iOS")).toBe(true);
    expect(platforms.has("Android")).toBe(true);
  });

  it("getGameBySlug returns matching game and undefined for miss", () => {
    const first = GAMES[0];
    expect(getGameBySlug(first.slug)?.id).toBe(first.id);
    expect(getGameBySlug("does-not-exist")).toBeUndefined();
  });

  it("featuredGames only contains featured titles", () => {
    const list = featuredGames();
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((g) => g.featured === true)).toBe(true);
  });
});

describe("lib/accessories catalog invariants", () => {
  it("only sells accessories, not devices", () => {
    const forbidden = /\b(phone|iphone|ipad|laptop|pc|console|playstation|xbox|monitor|tv|tablet)\b/i;
    for (const a of ACCESSORIES) {
      expect(a.title).not.toMatch(forbidden);
      expect(a.description).not.toMatch(/\b(sell phones|sell laptops|sell consoles)\b/i);
    }
  });

  it("category is from the approved set", () => {
    const allowed = new Set(["Controller", "Headset", "Keyboard", "Mouse", "Mousepad", "Chair", "Streaming"]);
    for (const a of ACCESSORIES) {
      expect(allowed.has(a.category)).toBe(true);
    }
  });

  it("slugs and ids are unique", () => {
    const slugs = ACCESSORIES.map((a) => a.slug);
    const ids = ACCESSORIES.map((a) => a.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getAccessoryBySlug resolves known and unknown slugs", () => {
    expect(getAccessoryBySlug(ACCESSORIES[0].slug)?.id).toBe(ACCESSORIES[0].id);
    expect(getAccessoryBySlug("nothing")).toBeUndefined();
  });
});
