import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

function walk(dir: string, out: string[] = []): string[] {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (/node_modules|\.next|\.git|__tests__|Logs|Instruction/.test(name)) continue;
      walk(p, out);
    } else if (/\.(tsx?|jsx?)$/.test(name)) {
      out.push(p);
    }
  }
  return out;
}

const root = path.resolve(__dirname, "..", "..");
const files = walk(root);

describe("security · static code audit (OWASP-ish quick checks)", () => {
  it("no component uses dangerouslySetInnerHTML", () => {
    const offenders = files.filter((f) => fs.readFileSync(f, "utf8").includes("dangerouslySetInnerHTML"));
    expect(offenders).toEqual([]);
  });

  it("no source file calls eval() or Function() with untrusted input", () => {
    const offenders: string[] = [];
    for (const f of files) {
      const src = fs.readFileSync(f, "utf8");
      if (/\beval\s*\(/.test(src)) offenders.push(`${f}: eval()`);
      if (/new\s+Function\s*\(/.test(src)) offenders.push(`${f}: new Function()`);
    }
    expect(offenders).toEqual([]);
  });

  it("no hard-coded secrets / API keys in the source tree", () => {
    const patterns = [
      /\bAKIA[0-9A-Z]{16}\b/,                   // AWS access key
      /\bsk_live_[A-Za-z0-9]{24,}/,              // Stripe live key
      /\bghp_[A-Za-z0-9]{36,}\b/,                // GitHub personal access token
      /\bxox[baprs]-[A-Za-z0-9-]{10,}/,          // Slack token
      /-----BEGIN (RSA|OPENSSH|EC|PRIVATE) KEY-----/
    ];
    const offenders: string[] = [];
    for (const f of files) {
      const src = fs.readFileSync(f, "utf8");
      for (const p of patterns) if (p.test(src)) offenders.push(`${f}: matches ${p}`);
    }
    expect(offenders).toEqual([]);
  });

  it("no http:// links in app source (defense-in-depth, excluding localhost)", () => {
    const offenders: string[] = [];
    for (const f of files) {
      const src = fs.readFileSync(f, "utf8");
      const matches = src.match(/http:\/\/(?!localhost|127\.)[^\s"'<>)]+/g);
      if (matches) offenders.push(`${f}: ${matches.join(", ")}`);
    }
    expect(offenders).toEqual([]);
  });

  it("checkout page never stores credit-card PANs or CVV", () => {
    const checkout = fs.readFileSync(path.join(root, "app", "checkout", "page.tsx"), "utf8");
    expect(checkout).not.toMatch(/\b(card number|pan|cvv|cvc)\b/i);
  });

  it("every <form> in app/ has an onSubmit (no silent GET exposure of state)", () => {
    const appFiles = files.filter((f) => f.includes(`${path.sep}app${path.sep}`) && f.endsWith(".tsx"));
    const offenders: string[] = [];
    for (const f of appFiles) {
      const src = fs.readFileSync(f, "utf8");
      const forms = src.match(/<form[^>]*>/g) ?? [];
      for (const tag of forms) if (!/onSubmit=/.test(tag)) offenders.push(`${f}: ${tag}`);
    }
    expect(offenders).toEqual([]);
  });
});
