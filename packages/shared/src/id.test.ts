import { describe, expect, test } from "bun:test";
import { slugify } from "./id";

describe("slugify", () => {
  test("lowercases and hyphenates a display name", () => {
    const slug = slugify("My Cool Org!");
    expect(slug.startsWith("my-cool-org-")).toBe(true);
  });

  test("collapses repeated separators", () => {
    const slug = slugify("A   B___C-D");
    expect(slug.startsWith("a-b-c-d-")).toBe(true);
  });

  test("appends a random suffix so two calls rarely collide", () => {
    const a = slugify("Acme");
    const b = slugify("Acme");
    expect(a).not.toBe(b);
    expect(a.startsWith("acme-")).toBe(true);
  });
});
