import { describe, it, expect, vi } from "vitest";
import { useEffect } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider, useCart } from "@/components/CartProvider";
import CheckoutPage from "@/app/checkout/page";

function Seed() {
  const { add, items } = useCart();
  useEffect(() => {
    if (items.length === 0) {
      add({ id: "g-x", kind: "game", title: "Ghost Pilot", price: 25.0, image: "x.jpg" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

describe("integration: checkout page", () => {
  it("shows the empty-cart state when the cart is empty", () => {
    render(
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    );
    expect(screen.getByText(/Nothing to checkout/i)).toBeInTheDocument();
  });

  it("completes a dummy PayPal payment and clears the cart", { timeout: 15000 }, async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <Seed />
        <CheckoutPage />
      </CartProvider>
    );

    await waitFor(() => expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument());

    await user.type(screen.getByLabelText(/Full name/i), "Nova Rider");
    const emails = screen.getAllByLabelText(/email/i);
    await user.type(emails[0], "nova@example.com");
    await user.type(screen.getByLabelText(/PayPal email/i), "nova@paypal.com");

    await user.click(screen.getByRole("button", { name: /Pay \$/i }));

    expect(await screen.findByText(/Payment accepted/i, {}, { timeout: 7000 })).toBeInTheDocument();
    expect(screen.getByText(/dummy PayPal transaction/i)).toBeInTheDocument();
  });

  it("can switch to CashApp and shows the $Cashtag field", async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <Seed />
        <CheckoutPage />
      </CartProvider>
    );
    await waitFor(() => expect(screen.getByRole("button", { name: /CashApp/i })).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /CashApp/i }));
    expect(await screen.findByLabelText(/CashApp \$Cashtag/i)).toBeInTheDocument();
  });
});
