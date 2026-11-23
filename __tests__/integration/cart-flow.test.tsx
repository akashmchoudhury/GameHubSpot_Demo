import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { GameCard } from "@/components/GameCard";
import { AccessoryCard } from "@/components/AccessoryCard";
import { GAMES } from "@/lib/games";
import { ACCESSORIES } from "@/lib/accessories";

function OpenButton() {
  const { open } = useCart();
  return <button onClick={open}>Open cart</button>;
}

function Harness() {
  return (
    <CartProvider>
      <GameCard game={GAMES[0]} />
      <AccessoryCard item={ACCESSORIES[0]} />
      <OpenButton />
      <CartDrawer />
    </CartProvider>
  );
}

describe("integration: browse → add → open drawer → update qty → clear", () => {
  it("full happy path", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const addButtons = screen.getAllByRole("button", { name: /^\+ cart$/i });
    await user.click(addButtons[0]);
    await user.click(addButtons[1]);

    await user.click(screen.getByRole("button", { name: /^open cart$/i }));

    expect((await screen.findAllByText(GAMES[0].title)).length).toBeGreaterThan(0);
    expect(screen.getAllByText(ACCESSORIES[0].title).length).toBeGreaterThan(0);

    const expectedSubtotal = GAMES[0].price + ACCESSORIES[0].price;
    const subtotalText = `$${expectedSubtotal.toFixed(2)}`;
    expect(
      await screen.findByText(
        (_, el) => el?.tagName === "SPAN" && (el?.textContent ?? "") === subtotalText,
        {},
        { timeout: 3000 }
      )
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^clear$/i }));
    expect(await screen.findByText(/Empty vault/i)).toBeInTheDocument();
  });

  it("persists cart across remounts via localStorage", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Harness />);
    const addButtons = screen.getAllByRole("button", { name: /^\+ cart$/i });
    await user.click(addButtons[0]);

    unmount();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: /^open cart$/i }));
    expect((await screen.findAllByText(GAMES[0].title)).length).toBeGreaterThan(0);
  });
});
