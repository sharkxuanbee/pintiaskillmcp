export type PintiaClientOptions = {
  cookie?: string;
  baseUrl?: string;
  userAgent?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
};

export type LoginStatus = {
  loggedIn: boolean;
  username?: string;
  message?: string;
};

export type ProblemSet = {
  id: string;
  title: string;
  description?: string;
  problemCount?: number;
  visibility?: "public" | "private" | "restricted";
};

export type ProblemSearchResult = {
  problemSetId: string;
  problemId: string;
  title: string;
  difficulty?: string;
  tags?: string[];
};

export type ProblemSample = {
  input: string;
  output: string;
  explanation?: string;
};

export type ProblemDetail = {
  problemSetId: string;
  problemId: string;
  title: string;
  body: string;
  inputSpec?: string;
  outputSpec?: string;
  hint?: string;
  timeLimitMs?: number;
  memoryLimitMb?: number;
  samples: ProblemSample[];
  raw?: unknown;
};

export type SubmissionResult = {
  submissionId: string;
  status:
    | "pending"
    | "running"
    | "accepted"
    | "wrong_answer"
    | "time_limit_exceeded"
    | "runtime_error"
    | "compile_error"
    | "unknown";
  score?: number;
  timeMs?: number;
  memoryKb?: number;
  message?: string;
  raw?: unknown;
};

export type SubmitSolutionParams = {
  problemSetId: string;
  problemId: string;
  language: "cpp" | "python" | "java" | string;
  sourceCode: string;
};

export type SubmitSolutionResult = {
  submissionId: string;
  accepted: boolean;
  status: SubmissionResult["status"];
  message?: string;
};
