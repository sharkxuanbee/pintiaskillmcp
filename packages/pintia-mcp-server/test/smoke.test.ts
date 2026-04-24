import { describe, expect, it } from "vitest";
import { createServer } from "../src/index.js";
import { createToolRegistry } from "../src/tools.js";

describe("mcp server smoke", () => {
  it("creates server instance", () => {
    const server = createServer();
    expect(server).toBeTruthy();
  });

  it("registers expected tool names", () => {
    const tools = Object.keys(createToolRegistry({ timeoutMs: 1000 }));
    expect(tools).toContain("pintia_get_problem");
    expect(tools).toContain("pintia_run_local_samples");
    expect(tools).toContain("pintia_submit_solution");
  });
});
