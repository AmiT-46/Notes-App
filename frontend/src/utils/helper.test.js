import { describe, expect, it } from "vitest";
import { validateEmail } from "./helper";

describe("validateEmail", () => {
  it("accepts valid email addresses and rejects invalid ones", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("not-an-email")).toBe(false);
  });
});
