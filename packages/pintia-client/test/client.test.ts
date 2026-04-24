import { describe, expect, it } from "vitest";
import { PintiaClient, SchemaMismatchError, UnauthorizedError, redactSensitiveText } from "../src/index.js";

function createFetch(response: { status: number; body: unknown }) {
  return async () =>
    new Response(JSON.stringify(response.body), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
}

describe("PintiaClient", () => {
  it("returns login status for a valid payload", async () => {
    const client = new PintiaClient({ fetchImpl: createFetch({ status: 200, body: { loggedIn: true, username: "alice" } }) as typeof fetch });
    const status = await client.getLoginStatus();
    expect(status.loggedIn).toBe(true);
    expect(status.username).toBe("alice");
  });

  it("throws UnauthorizedError on 401", async () => {
    const client = new PintiaClient({ fetchImpl: createFetch({ status: 401, body: { message: "expired" } }) as typeof fetch });
    await expect(client.getLoginStatus()).rejects.toBeInstanceOf(UnauthorizedError);
  });

  it("throws schema mismatch when shape changed", async () => {
    const client = new PintiaClient({ fetchImpl: createFetch({ status: 200, body: { ok: true } }) as typeof fetch });
    await expect(client.getLoginStatus()).rejects.toBeInstanceOf(SchemaMismatchError);
  });

  it("redacts cookie/token/password in logs", () => {
    const redacted = redactSensitiveText("cookie=abc token:xyz password=123");
    expect(redacted).toContain("cookie=[REDACTED]");
    expect(redacted).toContain("token=[REDACTED]");
    expect(redacted).toContain("password=[REDACTED]");
  });
});
