import { z } from "zod";

export const listProblemSetsInput = z.object({
  keyword: z.string().min(1).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(200).optional(),
});

export const searchProblemsInput = z.object({
  keyword: z.string().min(1),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(200).optional(),
});

export const getProblemInput = z.object({
  problemSetId: z.string().min(1),
  problemId: z.string().min(1),
});

export const getSubmissionResultInput = z.object({
  submissionId: z.string().min(1),
});

export const submitSolutionInput = z.object({
  problemSetId: z.string().min(1),
  problemId: z.string().min(1),
  language: z.string().min(1),
  sourceCode: z.string().min(1),
});

export const runLocalSamplesInput = z.object({
  language: z.enum(["cpp", "python", "java"]),
  sourceCode: z.string().min(1),
  timeoutMs: z.number().int().positive().max(30_000).default(3_000),
  samples: z.array(z.object({ input: z.string(), output: z.string() })).min(1),
});
