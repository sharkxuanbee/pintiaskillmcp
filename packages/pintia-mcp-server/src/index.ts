import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createToolRegistry } from "./tools.js";
import { getConfigFromEnv } from "./config.js";

export function createServer() {
  const server = new McpServer({ name: "pintia-mcp-server", version: "0.1.0" });
  const registry = createToolRegistry(getConfigFromEnv());

  for (const [name, def] of Object.entries(registry)) {
    server.tool(name, def.description, def.schema, def.handler);
  }

  return server;
}

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const safe = error instanceof Error ? error.message : "Unknown error";
    process.stderr.write(`[pintia-mcp-server] startup failed: ${safe}\n`);
    process.exitCode = 1;
  });
}
