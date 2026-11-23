import { describe, it, expect } from "vitest";
import { searchGames, quickSearch } from "@/lib/search";
import { GAMES } from "@/lib/games";

describe("lib/search · searchGames", () => {
  it("returns every game when no filters supplied", () => {
    expect(searchGames({}).length).toBe(GAMES.length);
  });

  it("filters by platform", () => {
    const pcOnly = searchGames({ platform: "PC" });
    expect(pcOnly.length).toBeGreaterThan(0);
    expect(pcOnly.every((g) => g.platforms.includes("PC"))).toBe(true);
  });

  it("filters by iOS platform", () => {
    const ios = searchGames({ platform: "iOS" });
    expect(ios.length).toBeGreaterThan(0);
    expect(ios.every((g) => g.platforms.includes("iOS"))).toBe(true);
  });

  it("filters by Android platform", () => {
    const android = searchGames({ platform: "Android" });
    expect(android.length).toBeGreaterThan(0);
    expect(android.every((g) => g.platforms.includes("Android"))).toBe(true);
  });

  it("filters by genre", () => {
    const racing = searchGames({ genre: "Racing" });
    expect(racing.every((g) => g.genre === "Racing")).toBe(true);
  });

  it("sorts by price ascending", () => {
    const list = searchGames({ sort: "price-asc" });
    for (let i = 1; i < list.length; i++) {
      expect(list[i].price).toBeGreaterThanOrEqual(list[i - 1].price);
    }
  });

  it("sorts by price descending", () => {
    const list = searchGames({ sort: "price-desc" });
    for (let i = 1; i < list.length; i++) {
      expect(list[i].price).toBeLessThanOrEqual(list[i - 1].price);
    }
  });

  it("sorts by rating descending", () => {
    const list = searchGames({ sort: "rating-desc" });
    for (let i = 1; i < list.length; i++) {
      expect(list[i].rating).toBeLessThanOrEqual(list[i - 1].rating);
    }
  });

  it("sorts by release date (newest first)", () => {
    const list = searchGames({ sort: "release-desc" });
    for (let i = 1; i < list.length; i++) {
      expect(+new Date(list[i].releaseDate)).toBeLessThanOrEqual(+new Date(list[i - 1].releaseDate));
    }
  });

  it("ranks exact title matches above partial matches", () => {
    const list = searchGames({ query: "Pulsecore" });
    expect(list[0].title).toBe("Pulsecore");
  });

  it("returns empty array for a nonsense query", () => {
    expect(searchGames({ query: "zzz-nope-nothing-xyz" }).length).toBe(0);
  });

  it("is case-insensitive", () => {
    const lower = searchGames({ query: "neon drift" });
    const upper = searchGames({ query: "NEON DRIFT" });
    expect(lower[0]?.id).toBe(upper[0]?.id);
  });

  it("stacks filters: Android + Puzzle", () => {
    const list = searchGames({ platform: "Android", genre: "Puzzle" });
    expect(list.every((g) => g.platforms.includes("Android") && g.genre === "Puzzle")).toBe(true);
  });
});

describe("lib/search · quickSearch", () => {
  it("returns no results for empty query", () => {
    const r = quickSearch("");
    expect(r.games.length).toBe(0);
    expect(r.accessories.length).toBe(0);
  });

  it("finds accessories by category", () => {
    const r = quickSearch("headset");
    expect(r.accessories.length).toBeGreaterThan(0);
  });

  it("honors the limit", () => {
    const r = quickSearch("e", 2);
    expect(r.games.length).toBeLessThanOrEqual(2);
    expect(r.accessories.length).toBeLessThanOrEqual(2);
  });
});
