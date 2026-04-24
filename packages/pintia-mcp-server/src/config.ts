export type ServerConfig = {
  cookie?: string;
  baseUrl?: string;
  userAgent?: string;
  timeoutMs: number;
};

export function getConfigFromEnv(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  const timeoutRaw = env.PINTIA_TIMEOUT_MS;
  const timeoutMs = timeoutRaw ? Number.parseInt(timeoutRaw, 10) : 10_000;
  return {
    cookie: env.PINTIA_COOKIE,
    baseUrl: env.PINTIA_BASE_URL,
    userAgent: env.PINTIA_USER_AGENT,
    timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 10_000,
  };
}

export function redactForLog(input: string): string {
  return input
    .replace(/(PINTIA_COOKIE=)[^\s]+/g, "$1[REDACTED]")
    .replace(/(cookie|token|password)\s*[:=]\s*[^;\s]+/gi, "$1=[REDACTED]");
}
