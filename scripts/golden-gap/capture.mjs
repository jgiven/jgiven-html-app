import { execSync, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");
const goldenTestsDir = join(repoRoot, "tests", "golden");
const reportsDir = join(repoRoot, "reports", "golden-gap");
const snapshotsFile = join(reportsDir, "snapshots.jsonl");
const lastRunFile = join(reportsDir, "last-run.json");
const lastFailuresFile = join(reportsDir, "last-failures.json");
const loopStateFile = join(reportsDir, "loop-state.json");
const STEP_COUNT = 5;

function log(message) {
    console.log(`[golden-gap] ${message}`);
}

function logStep(step, message) {
    log(`(${step}/${STEP_COUNT}) ${message}`);
}

function formatElapsed(ms) {
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) {
        return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainder = seconds % 60;
    return `${minutes}m ${remainder}s`;
}

function logDone(message, startedAt) {
    log(`${message} (${formatElapsed(performance.now() - startedAt)})`);
}

function run(command, options = {}) {
    execSync(command, {
        cwd: options.cwd ?? repoRoot,
        stdio: "inherit",
        env: { ...process.env, ...options.env }
    });
}

function gitSha() {
    return execSync("git rev-parse HEAD", {
        cwd: repoRoot,
        encoding: "utf8"
    }).trim();
}

function buildLegacy() {
    logStep(1, "Building legacy/ …");
    const startedAt = performance.now();
    run("npm run build --prefix legacy");
    logDone("Legacy build finished", startedAt);
}

function buildNew() {
    logStep(2, "Building new/ …");
    const startedAt = performance.now();
    run("npm run build --prefix new");
    logDone("New build finished", startedAt);
}

function prepareDefaultFixture() {
    logStep(3, "Preparing golden fixtures (mixed-status) …");
    const startedAt = performance.now();
    run("node scripts/prepare-fixture.mjs", {
        cwd: goldenTestsDir,
        env: { GOLDEN_FIXTURE: "mixed-status" }
    });
    logDone("Fixtures prepared", startedAt);
}

function runGoldenTestsNew() {
    logStep(4, "Running golden tests (project=new, CI retries enabled) …");
    const startedAt = performance.now();
    const result = spawnSync(
        "npx",
        ["playwright", "test", "--project=new", "--reporter=list", "--reporter=json"],
        {
            cwd: goldenTestsDir,
            env: {
                ...process.env,
                CI: "1",
                PLAYWRIGHT_JSON_OUTPUT_FILE: lastRunFile
            },
            stdio: "inherit",
            shell: true
        }
    );
    logDone(`Playwright finished (exit ${result.status ?? "unknown"})`, startedAt);

    if (!existsSync(lastRunFile)) {
        throw new Error(`Playwright JSON report not written: ${lastRunFile}`);
    }
}

function walkSuites(suites, filePath = "", failures, passing) {
    for (const suite of suites ?? []) {
        const nextFile = suite.file ?? filePath;

        for (const spec of suite.specs ?? []) {
            for (const test of spec.tests ?? []) {
                if (test.projectName !== "new") {
                    continue;
                }

                const entry = {
                    file: nextFile,
                    title: spec.title,
                    fullTitle: [suite.title, spec.title].filter(Boolean).join(" › "),
                    status: test.status,
                    project: test.projectName
                };

                const lastResult = test.results?.[test.results.length - 1];
                if (lastResult?.error?.message) {
                    entry.error = lastResult.error.message;
                }

                if (test.status === "unexpected") {
                    failures.push(entry);
                } else if (test.status === "expected" || test.status === "flaky") {
                    passing.push(entry);
                }
            }
        }

        walkSuites(suite.suites, nextFile, failures, passing);
    }
}

function parseReport() {
    const report = JSON.parse(readFileSync(lastRunFile, "utf8"));
    const { expected = 0, unexpected = 0, flaky = 0, skipped = 0 } = report.stats ?? {};

    const total = expected + unexpected + flaky + skipped;
    const passingNew = expected + flaky;
    const gap = total - passingNew;

    const failures = [];
    const passing = [];
    walkSuites(report.suites, "", failures, passing);

    return { total, passingNew, gap, failures, passing };
}

function writeFailuresReport({ total, passingNew, gap, failures, passing }) {
    const report = {
        timestamp: new Date().toISOString(),
        git_sha: gitSha(),
        total,
        passing_new: passingNew,
        gap,
        failure_count: failures.length,
        failures,
        passing_count: passing.length
    };

    writeFileSync(lastFailuresFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    return report;
}

function appendSnapshot({ total, passingNew, gap }) {
    const snapshot = {
        timestamp: new Date().toISOString(),
        git_sha: gitSha(),
        total,
        passing_new: passingNew,
        gap
    };

    appendFileSync(snapshotsFile, `${JSON.stringify(snapshot)}\n`, "utf8");
    return snapshot;
}

function loadLoopState() {
    if (!existsSync(loopStateFile)) {
        return null;
    }

    return JSON.parse(readFileSync(loopStateFile, "utf8"));
}

function saveLoopState(state) {
    writeFileSync(loopStateFile, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function updateLoopStateAfterMeasure({ total, gap }) {
    const state = loadLoopState();
    if (!state) {
        return null;
    }

    const now = new Date().toISOString();
    state.iteration += 1;
    state.last_measure_at = now;

    if (state.last_total !== null && total > state.last_total) {
        state.status = "stopped";
        state.stop_reason = `total increased from ${state.last_total} to ${total}`;
    } else if (state.last_gap !== null && gap === state.last_gap) {
        state.gap_unchanged_streak += 1;
        if (state.gap_unchanged_streak >= 10) {
            state.status = "stopped";
            state.stop_reason = "gap unchanged for 10 consecutive measure steps";
        }
    } else {
        state.gap_unchanged_streak = 0;
    }

    if (gap === 0 && state.status === "running") {
        state.status = "completed";
        state.stop_reason = "gap is zero";
    }

    state.last_total = total;
    state.last_gap = gap;
    saveLoopState(state);
    return state;
}

function processResults() {
    logStep(5, "Processing Playwright report …");
    const startedAt = performance.now();

    const parsed = parseReport();
    log(`  parsed ${parsed.total} tests: ${parsed.passingNew} passing, gap=${parsed.gap}`);

    const snapshot = appendSnapshot(parsed);
    log(`  appended snapshot → ${snapshotsFile}`);

    const failuresReport = writeFailuresReport(parsed);
    log(`  wrote failures (${failuresReport.failure_count}) → ${lastFailuresFile}`);

    const loopState = updateLoopStateAfterMeasure(parsed);
    if (loopState) {
        log(`  updated loop state: status=${loopState.status}, iteration=${loopState.iteration}`);
    }

    logDone("Results processed", startedAt);

    console.log("");
    log("Capture complete.");
    log(`  total=${snapshot.total}  passing_new=${snapshot.passing_new}  gap=${snapshot.gap}`);
    log(`  failures=${failuresReport.failure_count}`);
    log(`  git_sha=${snapshot.git_sha}`);

    if (loopState?.stop_reason) {
        log(`  stop_reason=${loopState.stop_reason}`);
    }
}

function main() {
    const captureStartedAt = performance.now();
    mkdirSync(reportsDir, { recursive: true });

    log(`Capture started (git ${gitSha().slice(0, 7)})`);

    buildLegacy();
    buildNew();
    prepareDefaultFixture();
    runGoldenTestsNew();
    processResults();

    logDone("Total capture time", captureStartedAt);
}

try {
    main();
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
}
