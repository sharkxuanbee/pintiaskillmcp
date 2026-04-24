import { describe, expect, it } from "vitest";
import { redactForLog } from "../src/config.js";

describe("sensitive data redaction", () => {
  it("removes sensitive key-value data", () => {
    const msg = redactForLog("PINTIA_COOKIE=abc123 token=xyz password=foo");
    expect(msg).not.toContain("abc123");
    expect(msg).not.toContain("xyz");
    expect(msg).not.toContain("foo");
  });
});
