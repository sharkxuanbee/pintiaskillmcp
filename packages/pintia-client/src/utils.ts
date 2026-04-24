import { z } from "zod";
import { ApiResponseError, NetworkError, SchemaMismatchError, TimeoutError, UnauthorizedError } from "./errors.js";

export const DEFAULT_BASE_URL = "https://pintia.cn";

export type HttpClientOptions = {
  baseUrl: string;
  cookie?: string;
  userAgent?: string;
  timeoutMs: number;
  fetchImpl: typeof fetch;
};

export class HttpClient {
  constructor(private readonly options: HttpClientOptions) {}

  async get<T>(path: string, schema: z.Schema<T>, query?: Record<string, string | number | undefined>): Promise<T> {
    return this.request("GET", path, schema, undefined, query);
  }

  async post<T>(path: string, body: unknown, schema: z.Schema<T>): Promise<T> {
    return this.request("POST", path, schema, body);
  }

  private async request<T>(
    method: "GET" | "POST",
    path: string,
    schema: z.Schema<T>,
    body?: unknown,
    query?: Record<string, string | number | undefined>,
  ): Promise<T> {
    const url = new URL(path, this.options.baseUrl);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": this.options.userAgent ?? "pintia-mcp-skill/0.1",
    };

    if (this.options.cookie) {
      headers.Cookie = this.options.cookie;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.options.timeoutMs);

    let response: Response;
    try {
      response = await this.options.fetchImpl(url.toString(), {
        method,
        headers,
        signal: controller.signal,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error: unknown) {
      clearTimeout(timeout);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new TimeoutError("Pintia request timed out");
      }
      throw new NetworkError("Failed to reach Pintia endpoint", { path, method });
    }

    clearTimeout(timeout);

    if (response.status === 401 || response.status === 403) {
      throw new UnauthorizedError();
    }

    const payload: unknown = await response.json().catch(() => {
      throw new ApiResponseError("Response is not valid JSON", { status: response.status, path });
    });

    if (!response.ok) {
      throw new ApiResponseError("Pintia API returned non-success status", { status: response.status, path, payload });
    }

    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      throw new SchemaMismatchError("Pintia response does not match expected schema", parsed.error.flatten());
    }
    return parsed.data;
  }
}

export function redactSensitiveText(value: string): string {
  return value.replace(/(cookie|token|password)\s*[:=]\s*[^;\s]+/gi, "$1=[REDACTED]");
}
