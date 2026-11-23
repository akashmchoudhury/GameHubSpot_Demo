import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "@/components/CartProvider";
import { GameCard } from "@/components/GameCard";
import type { Game } from "@/lib/types";

const GAME: Game = {
  id: "g-test",
  slug: "test-game",
  title: "Testopia",
  platforms: ["PC", "iOS"],
  price: 19.99,
  originalPrice: 29.99,
  rating: 4.5,
  genre: "Puzzle",
  cover: "https://example.com/cover.jpg",
  tagline: "Tag",
  description: "Desc",
  releaseDate: "2025-01-01",
  developer: "Dev",
  publisher: "Pub",
  tags: ["x"]
};

function Peek({ onReady }: { onReady: (api: ReturnType<typeof useCart>) => void }) {
  const api = useCart();
  onReady(api);
  return null;
}

describe("<GameCard>", () => {
  it("renders title, price, platforms, and discount badge", () => {
    render(<CartProvider><GameCard game={GAME} /></CartProvider>);
    expect(screen.getByText("Testopia")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("PC")).toBeInTheDocument();
    expect(screen.getByText("iOS")).toBeInTheDocument();
    expect(screen.getByText("-33%")).toBeInTheDocument();
  });

  it("clicking '+ Cart' adds the game to the cart", async () => {
    let api: ReturnType<typeof useCart> | null = null;
    render(
      <CartProvider>
        <Peek onReady={(a) => (api = a)} />
        <GameCard game={GAME} />
      </CartProvider>
    );
    await userEvent.click(screen.getByRole("button", { name: /cart/i }));
    expect(api!.items[0]?.id).toBe("g-test");
    expect(api!.items[0]?.title).toBe("Testopia");
    expect(api!.items[0]?.kind).toBe("game");
    expect(api!.items[0]?.price).toBe(19.99);
  });

  it("omits the discount badge when there is no originalPrice", () => {
    const { container } = render(
      <CartProvider><GameCard game={{ ...GAME, originalPrice: undefined }} /></CartProvider>
    );
    expect(container.textContent).not.toMatch(/-\d+%/);
  });
});
