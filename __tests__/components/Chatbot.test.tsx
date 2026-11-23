import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chatbot } from "@/components/Chatbot";

async function openBot() {
  const user = userEvent.setup();
  render(<Chatbot />);
  await user.click(screen.getByRole("button", { name: /open chat/i }));
  return user;
}

async function ask(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(screen.getByPlaceholderText(/Ask Spotbot/i), text);
  await user.click(screen.getByRole("button", { name: /^send$/i }));
}

describe("<Chatbot>", () => {
  it("renders the intro bubble on open", async () => {
    await openBot();
    expect(screen.getByText(/i'm Spotbot/i)).toBeInTheDocument();
  });

  it("routes a payment question to the checkout CTA", async () => {
    const user = await openBot();
    await ask(user, "How do I pay?");
    expect(await screen.findByText(/dummy PayPal and CashApp/i, {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it("routes a privacy question to the privacy page CTA", async () => {
    const user = await openBot();
    await ask(user, "privacy policy");
    // The bot reply plus the CTA button should both mention "privacy"
    const hits = await screen.findAllByText(/privacy policy/i, {}, { timeout: 3000 });
    expect(hits.length).toBeGreaterThanOrEqual(2); // user bubble + bot reply/CTA
  });

  it("routes a location question to Dhaka", async () => {
    const user = await openBot();
    await ask(user, "where are you located?");
    // Bot reply is uniquely identifiable by the support-hours phrase.
    expect(await screen.findByText(/10:00-20:00 BST/i, {}, { timeout: 3000 })).toBeInTheDocument();
  });

  it("falls back gracefully when it can't understand the query", async () => {
    const user = await openBot();
    await ask(user, "qqqqxxxxyyy");
    expect(await screen.findByText(/Not sure I caught that/i, {}, { timeout: 3000 })).toBeInTheDocument();
  });
});
