import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSlider } from "@/components/HeroSlider";
import { featuredGames } from "@/lib/games";

describe("<HeroSlider>", () => {
  it("renders the first featured game and all slide dots", () => {
    const games = featuredGames();
    render(<HeroSlider games={games} />);
    expect(screen.getByText(games[0].title)).toBeInTheDocument();
    const dots = screen.getAllByLabelText(/^Slide \d+$/);
    expect(dots.length).toBe(games.length);
  });
});
