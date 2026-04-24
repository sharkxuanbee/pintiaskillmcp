import { describe, expect, it } from "vitest";
import { runLocalSamplesInput, searchProblemsInput, submitSolutionInput } from "../src/schemas.js";

describe("schema validation", () => {
  it("accepts search schema", () => {
    const data = searchProblemsInput.parse({ keyword: "dp", page: 1, pageSize: 20 });
    expect(data.keyword).toBe("dp");
  });

  it("rejects empty source code", () => {
    expect(() => submitSolutionInput.parse({ problemSetId: "a", problemId: "b", language: "cpp", sourceCode: "" })).toThrow();
  });

  it("validates local sample input", () => {
    const data = runLocalSamplesInput.parse({
      language: "python",
      sourceCode: "print(input())",
      samples: [{ input: "1\n", output: "1\n" }],
      timeoutMs: 2000,
    });
    expect(data.language).toBe("python");
  });
});
