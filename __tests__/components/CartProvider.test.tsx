import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { CartProvider, useCart } from "@/components/CartProvider";

function wrap({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("<CartProvider>", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("adds an item and computes subtotal/tax/total", () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    act(() => {
      result.current.add({ id: "g1", kind: "game", title: "Test", price: 10, image: "x.jpg" });
    });
    expect(result.current.count).toBe(1);
    expect(result.current.subtotal).toBe(10);
    expect(result.current.tax).toBeCloseTo(0.8, 2);
    expect(result.current.total).toBeCloseTo(10.8, 2);
  });

  it("merges quantities when adding the same id", () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    act(() => {
      result.current.add({ id: "g1", kind: "game", title: "A", price: 5, image: "x.jpg" });
      result.current.add({ id: "g1", kind: "game", title: "A", price: 5, image: "x.jpg", quantity: 2 });
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it("removes an item", () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    act(() => {
      result.current.add({ id: "g1", kind: "game", title: "A", price: 5, image: "x.jpg" });
      result.current.remove("g1");
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("setQty to 0 removes the item (never goes negative)", () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    act(() => {
      result.current.add({ id: "g1", kind: "game", title: "A", price: 5, image: "x.jpg", quantity: 1 });
      result.current.setQty("g1", -5);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("clear empties the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    act(() => {
      result.current.add({ id: "a", kind: "game", title: "A", price: 5, image: "x" });
      result.current.add({ id: "b", kind: "accessory", title: "B", price: 7, image: "x" });
      result.current.clear();
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.subtotal).toBe(0);
  });

  it("persists to localStorage under ghs:cart:v1", () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    act(() => {
      result.current.add({ id: "g1", kind: "game", title: "A", price: 5, image: "x" });
    });
    const raw = localStorage.getItem("ghs:cart:v1");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed[0].id).toBe("g1");
  });

  it("opens and closes the drawer", () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
  });

  it("increments pulse counter when an item is added", () => {
    const { result } = renderHook(() => useCart(), { wrapper: wrap });
    const before = result.current.pulse;
    act(() => result.current.add({ id: "g1", kind: "game", title: "A", price: 1, image: "x" }));
    expect(result.current.pulse).toBe(before + 1);
  });
});
