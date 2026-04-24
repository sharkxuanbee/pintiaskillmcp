import { PintiaClient } from "@pintia-mcp/pintia-client";
import type { ServerConfig } from "./config.js";
import {
  getProblemInput,
  getSubmissionResultInput,
  listProblemSetsInput,
  runLocalSamplesInput,
  searchProblemsInput,
  submitSolutionInput,
} from "./schemas.js";
import { runLocalSamples } from "./local-runner.js";

function toJsonText(value: unknown): { content: Array<{ type: "text"; text: string }> } {
  return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }] };
}

export function createToolRegistry(config: ServerConfig) {
  const client = new PintiaClient({
    cookie: config.cookie,
    baseUrl: config.baseUrl,
    userAgent: config.userAgent,
    timeoutMs: config.timeoutMs,
  });

  return {
    pintia_get_login_status: {
      description: "Check whether current Pintia cookie is valid for learning workflow.",
      schema: {},
      handler: async () => toJsonText(await client.getLoginStatus()),
    },
    pintia_list_problem_sets: {
      description: "List visible Pintia problem sets for learning and guided practice.",
      schema: listProblemSetsInput.shape,
      handler: async (input: unknown) => toJsonText(await client.listProblemSets(listProblemSetsInput.parse(input))),
    },
    pintia_search_problems: {
      description: "Search Pintia problems by keyword for learning-oriented solving.",
      schema: searchProblemsInput.shape,
      handler: async (input: unknown) => toJsonText(await client.searchProblems(searchProblemsInput.parse(input))),
    },
    pintia_get_problem: {
      description: "Fetch full Pintia problem statement for analysis, drafting, and debugging.",
      schema: getProblemInput.shape,
      handler: async (input: unknown) => toJsonText(await client.getProblem(getProblemInput.parse(input))),
    },
    pintia_get_problem_samples: {
      description: "Fetch parsed Pintia sample I/O pairs for local validation.",
      schema: getProblemInput.shape,
      handler: async (input: unknown) => toJsonText(await client.getProblemSamples(getProblemInput.parse(input))),
    },
    pintia_get_submission_result: {
      description: "Query Pintia submission status and judge details by submission ID.",
      schema: getSubmissionResultInput.shape,
      handler: async (input: unknown) => toJsonText(await client.getSubmissionResult(getSubmissionResultInput.parse(input))),
    },
    pintia_submit_solution: {
      description: "Submit a user-provided solution to Pintia intentionally (manual trigger only).",
      schema: submitSolutionInput.shape,
      handler: async (input: unknown) => toJsonText(await client.submitSolution(submitSolutionInput.parse(input))),
    },
    pintia_run_local_samples: {
      description: "Compile/run local code against samples in isolated temp directory with timeout.",
      schema: runLocalSamplesInput.shape,
      handler: async (input: unknown) => toJsonText(await runLocalSamples(runLocalSamplesInput.parse(input))),
    },
    solve_all_problems: {
      description: "Refuse unattended bulk solving requests for safety and academic integrity.",
      schema: {},
      handler: async () => toJsonText({ blocked: true, reason: "Unattended auto-solving is not supported." }),
    },
    auto_submit_all: {
      description: "Refuse unattended batch submission requests for safety and academic integrity.",
      schema: {},
      handler: async () => toJsonText({ blocked: true, reason: "Auto submit all is not supported." }),
    },
    batch_submit: {
      description: "Refuse batch submit automation by default; use manual per-problem submission only.",
      schema: {},
      handler: async () => toJsonText({ blocked: true, reason: "Batch submit is disabled." }),
    },
    scrape_exam_answers: {
      description: "Refuse exam-answer scraping and cheating-related automation.",
      schema: {},
      handler: async () => toJsonText({ blocked: true, reason: "Cheating-related capability is prohibited." }),
    },
    bypass_captcha: {
      description: "Refuse captcha bypass requests; user must complete official verification.",
      schema: {},
      handler: async () => toJsonText({ blocked: true, reason: "Bypass operations are prohibited." }),
    },
    bypass_login: {
      description: "Refuse login bypass requests; valid user session is required.",
      schema: {},
      handler: async () => toJsonText({ blocked: true, reason: "Bypass operations are prohibited." }),
    },
    bypass_rate_limit: {
      description: "Refuse rate-limit bypass requests; follow platform usage policies.",
      schema: {},
      handler: async () => toJsonText({ blocked: true, reason: "Bypass operations are prohibited." }),
    },
  };
}

export type ToolRegistry = ReturnType<typeof createToolRegistry>;
