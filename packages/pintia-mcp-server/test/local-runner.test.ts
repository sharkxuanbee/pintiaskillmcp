import { describe, expect, it } from "vitest";
import { runLocalSamples, tempDirCleanupProof } from "../src/local-runner.js";

describe("local sample runner", () => {
  it("runs python sample", async () => {
    const result = await runLocalSamples({
      language: "python",
      sourceCode: "n=input().strip()\nprint(n)",
      timeoutMs: 2000,
      samples: [{ input: "42\n", output: "42\n" }],
    });
    expect(result.passed).toBe(true);
  });

  it("cleans temp directory", async () => {
    expect(await tempDirCleanupProof()).toBe(true);
  });
});
