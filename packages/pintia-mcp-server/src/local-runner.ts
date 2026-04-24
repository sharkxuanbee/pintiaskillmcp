import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

export type LocalSample = { input: string; output: string };

export type RunLocalSamplesParams = {
  language: "cpp" | "python" | "java";
  sourceCode: string;
  samples: LocalSample[];
  timeoutMs: number;
};

export type SampleRunDetail = {
  passed: boolean;
  stdout: string;
  stderr: string;
  expectedOutput: string;
  diff: string;
  timedOut: boolean;
};

export type LocalRunResult = {
  passed: boolean;
  compileError?: string;
  details: SampleRunDetail[];
};

function normalize(text: string): string {
  return text.trim().replace(/\r\n/g, "\n");
}

function buildDiff(expected: string, actual: string): string {
  if (normalize(expected) === normalize(actual)) return "";
  return `expected: ${JSON.stringify(normalize(expected))}\nactual:   ${JSON.stringify(normalize(actual))}`;
}

function execWithInput(cmd: string, args: string[], input: string, timeoutMs: number, cwd: string): Promise<{ stdout: string; stderr: string; timedOut: boolean; exitCode: number | null }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd, stdio: "pipe" });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, timedOut, exitCode: code });
    });

    child.stdin.write(input);
    child.stdin.end();
  });
}

export async function runLocalSamples(params: RunLocalSamplesParams): Promise<LocalRunResult> {
  const dir = await mkdtemp(path.join(tmpdir(), "pintia-run-"));
  try {
    let execCmd = "";
    let execArgs: string[] = [];

    if (params.language === "cpp") {
      const source = path.join(dir, "main.cpp");
      const bin = path.join(dir, "app");
      await writeFile(source, params.sourceCode, "utf8");
      const compile = await execWithInput("g++", [source, "-O2", "-std=c++17", "-o", bin], "", params.timeoutMs, dir);
      if (compile.timedOut || compile.exitCode !== 0) {
        return { passed: false, compileError: compile.stderr || "C++ compilation failed", details: [] };
      }
      execCmd = bin;
    } else if (params.language === "python") {
      const source = path.join(dir, "main.py");
      await writeFile(source, params.sourceCode, "utf8");
      execCmd = "python3";
      execArgs = [source];
    } else {
      const source = path.join(dir, "Main.java");
      await writeFile(source, params.sourceCode, "utf8");
      const compile = await execWithInput("javac", [source], "", params.timeoutMs, dir);
      if (compile.timedOut || compile.exitCode !== 0) {
        return { passed: false, compileError: compile.stderr || "Java compilation failed", details: [] };
      }
      execCmd = "java";
      execArgs = ["-cp", dir, "Main"];
    }

    const details: SampleRunDetail[] = [];
    for (const sample of params.samples) {
      const run = await execWithInput(execCmd, execArgs, sample.input, params.timeoutMs, dir);
      const diff = buildDiff(sample.output, run.stdout);
      details.push({
        passed: diff === "" && !run.timedOut,
        stdout: run.stdout,
        stderr: run.stderr,
        expectedOutput: sample.output,
        diff,
        timedOut: run.timedOut,
      });
    }

    return { passed: details.every((d) => d.passed), details };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export async function tempDirCleanupProof(): Promise<boolean> {
  const dir = await mkdtemp(path.join(tmpdir(), "pintia-cleanup-"));
  const f = path.join(dir, "x.txt");
  await writeFile(f, "ok", "utf8");
  await rm(dir, { recursive: true, force: true });
  try {
    await readFile(f, "utf8");
    return false;
  } catch {
    return true;
  }
}
