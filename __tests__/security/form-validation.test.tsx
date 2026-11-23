import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactPage from "@/app/contact/page";

describe("security · contact form validation attributes", () => {
  it("name/email/subject/message are marked required so browser blocks empty posts", () => {
    render(<ContactPage />);
    const required = [/Your name/i, /Email/i, /Subject/i, /Message/i];
    for (const label of required) {
      const el = screen.getByLabelText(label) as HTMLInputElement | HTMLTextAreaElement;
      expect(el.required).toBe(true);
    }
  });

  it("email field has type=email so native validation fires", () => {
    render(<ContactPage />);
    const email = screen.getByLabelText(/Email/i) as HTMLInputElement;
    expect(email.type).toBe("email");
  });
});
