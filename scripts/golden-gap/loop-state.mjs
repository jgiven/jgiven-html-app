import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");
const reportsDir = join(repoRoot, "reports", "golden-gap");
const loopStateFile = join(reportsDir, "loop-state.json");

function loadState() {
    if (!existsSync(loopStateFile)) {
        throw new Error(`Loop state not found: ${loopStateFile}`);
    }

    return JSON.parse(readFileSync(loopStateFile, "utf8"));
}

function saveState(state) {
    mkdirSync(reportsDir, { recursive: true });
    writeFileSync(loopStateFile, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function defaultBranchName() {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `parity/agent-${yyyy}-${mm}-${dd}`;
}

function initState({ branch }) {
    const now = new Date().toISOString();
    const state = {
        branch,
        started_at: now,
        iteration: 0,
        last_total: null,
        last_gap: null,
        gap_unchanged_streak: 0,
        review_decline_streak: 0,
        status: "running",
        stop_reason: null
    };

    saveState(state);
    return state;
}

function reviewDecline() {
    const state = loadState();
    state.review_decline_streak += 1;

    if (state.review_decline_streak >= 10) {
        state.status = "stopped";
        state.stop_reason = "10 consecutive review declines on the same uncommitted batch";
    }

    saveState(state);
    return state;
}

function reviewAccept() {
    const state = loadState();
    state.review_decline_streak = 0;
    saveState(state);
    return state;
}

function afterCommit() {
    const state = loadState();
    state.review_decline_streak = 0;
    saveState(state);
    return state;
}

function stopManual(reason) {
    const state = loadState();
    state.status = "stopped";
    state.stop_reason = reason ?? "stopped by human";
    saveState(state);
    return state;
}

function createAndCheckoutBranch(branch) {
    execSync(`git checkout -b ${branch}`, { cwd: repoRoot, stdio: "inherit" });
    console.log(`Created and checked out branch ${branch} from current HEAD`);
}

const [command, ...args] = process.argv.slice(2);

try {
    switch (command) {
        case "init": {
            const branch = args[0] ?? defaultBranchName();
            createAndCheckoutBranch(branch);
            const state = initState({ branch });
            console.log(JSON.stringify(state, null, 2));
            break;
        }
        case "review-decline": {
            const state = reviewDecline();
            console.log(JSON.stringify(state, null, 2));
            if (state.status === "stopped") {
                process.exitCode = 2;
            }
            break;
        }
        case "review-accept": {
            console.log(JSON.stringify(reviewAccept(), null, 2));
            break;
        }
        case "after-commit": {
            console.log(JSON.stringify(afterCommit(), null, 2));
            break;
        }
        case "stop": {
            console.log(JSON.stringify(stopManual(args.join(" ") || undefined), null, 2));
            break;
        }
        case "show": {
            console.log(JSON.stringify(loadState(), null, 2));
            break;
        }
        default:
            console.error(
                "Usage: node loop-state.mjs <init|review-decline|review-accept|after-commit|stop|show> [args]"
            );
            process.exit(1);
    }
} catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
}
