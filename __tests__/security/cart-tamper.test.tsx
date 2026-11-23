import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { CartProvider, useCart } from "@/components/CartProvider";

function wrap({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("security · cart cannot be tampered via setQty", () => {
  it("negative quantity never ends up in state", () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    act(() => {
      result.current.add({ id: "x", kind: "game", title: "X", price: 10, image: "x" });
      result.current.setQty("x", -999);
    });
    for (const i of result.current.items) expect(i.quantity).toBeGreaterThan(0);
    expect(result.current.subtotal).toBeGreaterThanOrEqual(0);
    expect(result.current.total).toBeGreaterThanOrEqual(0);
  });

  it("subtotal is always >= 0 even after random stress", () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    act(() => {
      for (let i = 0; i < 30; i++) {
        result.current.add({ id: `x${i % 3}`, kind: "game", title: "X", price: 1, image: "x" });
      }
      ["x0", "x1", "x2"].forEach((id) => result.current.setQty(id, Math.floor(Math.random() * -50)));
    });
    expect(result.current.subtotal).toBe(0);
    expect(result.current.items).toHaveLength(0);
  });
});

describe("security · corrupt localStorage does not crash the provider", () => {
  it("loads cleanly when ghs:cart:v1 contains garbage", () => {
    localStorage.setItem("ghs:cart:v1", "this is not json {{{");
    expect(() => renderHook(() => useCart(), { wrapper: wrap })).not.toThrow();
  });

  it("loads cleanly when the stored value is wrong-shape JSON", () => {
    localStorage.setItem("ghs:cart:v1", JSON.stringify({ not: "an array" }));
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    // The provider doesn't type-check, but any following add() must still work.
    act(() => result.current.add({ id: "a", kind: "game", title: "A", price: 5, image: "x" }));
    expect(result.current.count).toBeGreaterThan(0);
  });
});
