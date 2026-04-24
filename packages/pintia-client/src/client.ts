import { z } from "zod";
import { UnsupportedOperationError } from "./errors.js";
import type {
  LoginStatus,
  PintiaClientOptions,
  ProblemDetail,
  ProblemSample,
  ProblemSearchResult,
  ProblemSet,
  SubmissionResult,
  SubmitSolutionParams,
  SubmitSolutionResult,
} from "./types.js";
import { DEFAULT_BASE_URL, HttpClient } from "./utils.js";

const loginStatusSchema = z.object({
  loggedIn: z.boolean(),
  username: z.string().optional(),
  message: z.string().optional(),
});

const problemSetSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    problemCount: z.number().optional(),
    visibility: z.enum(["public", "private", "restricted"]).optional(),
  }),
);

const problemSearchSchema = z.array(
  z.object({
    problemSetId: z.string(),
    problemId: z.string(),
    title: z.string(),
    difficulty: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
);

const sampleSchema = z.array(
  z.object({
    input: z.string(),
    output: z.string(),
    explanation: z.string().optional(),
  }),
);

const problemDetailSchema = z.object({
  problemSetId: z.string(),
  problemId: z.string(),
  title: z.string(),
  body: z.string(),
  inputSpec: z.string().optional(),
  outputSpec: z.string().optional(),
  hint: z.string().optional(),
  timeLimitMs: z.number().optional(),
  memoryLimitMb: z.number().optional(),
  samples: sampleSchema,
  raw: z.unknown().optional(),
});

const submissionResultSchema = z.object({
  submissionId: z.string(),
  status: z.enum([
    "pending",
    "running",
    "accepted",
    "wrong_answer",
    "time_limit_exceeded",
    "runtime_error",
    "compile_error",
    "unknown",
  ]),
  score: z.number().optional(),
  timeMs: z.number().optional(),
  memoryKb: z.number().optional(),
  message: z.string().optional(),
  raw: z.unknown().optional(),
});

const submitSolutionSchema = z.object({
  submissionId: z.string(),
  accepted: z.boolean(),
  status: submissionResultSchema.shape.status,
  message: z.string().optional(),
});

export class PintiaClient {
  private readonly http: HttpClient;

  constructor(options: PintiaClientOptions = {}) {
    this.http = new HttpClient({
      baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
      cookie: options.cookie,
      userAgent: options.userAgent,
      timeoutMs: options.timeoutMs ?? 10_000,
      fetchImpl: options.fetchImpl ?? fetch,
    });
  }

  async getLoginStatus(): Promise<LoginStatus> {
    return this.http.get("/api/mcp/login-status", loginStatusSchema);
  }

  async listProblemSets(params?: { keyword?: string; page?: number; pageSize?: number }): Promise<ProblemSet[]> {
    return this.http.get("/api/mcp/problem-sets", problemSetSchema, params);
  }

  async searchProblems(params: { keyword: string; page?: number; pageSize?: number }): Promise<ProblemSearchResult[]> {
    return this.http.get("/api/mcp/problems/search", problemSearchSchema, params);
  }

  async getProblem(params: { problemSetId: string; problemId: string }): Promise<ProblemDetail> {
    return this.http.get(
      `/api/mcp/problem-sets/${encodeURIComponent(params.problemSetId)}/problems/${encodeURIComponent(params.problemId)}`,
      problemDetailSchema,
    );
  }

  async getProblemSamples(params: { problemSetId: string; problemId: string }): Promise<ProblemSample[]> {
    return this.http.get(
      `/api/mcp/problem-sets/${encodeURIComponent(params.problemSetId)}/problems/${encodeURIComponent(params.problemId)}/samples`,
      sampleSchema,
    );
  }

  async getSubmissionResult(params: { submissionId: string }): Promise<SubmissionResult> {
    return this.http.get(`/api/mcp/submissions/${encodeURIComponent(params.submissionId)}`, submissionResultSchema);
  }

  async submitSolution(params: SubmitSolutionParams): Promise<SubmitSolutionResult> {
    return this.http.post("/api/mcp/submissions", params, submitSolutionSchema);
  }

  async solveAllProblems(): Promise<never> {
    throw new UnsupportedOperationError("Unattended solving is intentionally not supported.");
  }

  async bypassCaptcha(): Promise<never> {
    throw new UnsupportedOperationError("Bypassing captcha or platform controls is prohibited.");
  }
}
