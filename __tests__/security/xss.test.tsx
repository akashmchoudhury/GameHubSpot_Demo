import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Chatbot } from "@/components/Chatbot";

const XSS_PAYLOADS = [
  "<script>window.__pwn = 1;</script>",
  "<img src=x onerror=\"window.__pwn=1\">",
  "<svg/onload=\"window.__pwn=1\">",
  "\"><script>alert(1)</script>",
  "javascript:alert(1)"
];

describe("security · XSS: chatbot input is rendered as text, not HTML", () => {
  for (const payload of XSS_PAYLOADS) {
    it(`neutralizes payload: ${payload}`, async () => {
      (window as any).__pwn = undefined;
      const user = userEvent.setup();
      render(<Chatbot />);
      await user.click(screen.getByRole("button", { name: /open chat/i }));
      await user.type(screen.getByPlaceholderText(/Ask Spotbot/i), payload);
      await user.click(screen.getByRole("button", { name: /^send$/i }));

      // The payload must appear as text content in the DOM (not parsed HTML).
      const bubbles = await screen.findAllByText(
        (_, el) => (el?.textContent ?? "").includes(payload),
        {},
        { timeout: 3000 }
      );
      expect(bubbles.length).toBeGreaterThan(0);

      // No injected handler executed — the global was never set.
      expect((window as any).__pwn).toBeUndefined();

      // No actual <script>/<img onerror>/<svg onload> node from user input exists.
      const scripts = Array.from(document.querySelectorAll("script"));
      const dangerous = scripts.some((s) => (s.textContent ?? "").includes("__pwn"));
      expect(dangerous).toBe(false);
      expect(document.querySelector('img[onerror]')).toBeNull();
      expect(document.querySelector('svg[onload]')).toBeNull();
    });
  }
});
