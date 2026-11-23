import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdBar } from "@/components/AdBar";

describe("<AdBar>", () => {
  it("marks the bar as an AD slot and contains the Apple PC dummy ad", () => {
    render(<AdBar />);
    expect(screen.getAllByText("AD").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/APPLE/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/M-Series Gaming PCs/i).length).toBeGreaterThan(0);
  });
});
