import { execSync } from "node:child_process";

export type GoldenFixture =
    | "empty"
    | "mixed-status"
    | "pagination"
    | "parameterized"
    | "failures"
    | "rich-steps"
    | "custom-nav";

/**
 * Copies a golden fixture into legacy/dist and new/build.
 * Call from describe-level beforeAll; requires workers: 1 and legacy before new
 * (see playwright.config.ts) so the on-disk fixture is not switched mid-run.
 */
export function prepareFixture(name: GoldenFixture): void {
    execSync("node scripts/prepare-fixture.mjs", {
        cwd: process.cwd(),
        env: { ...process.env, GOLDEN_FIXTURE: name },
        stdio: "inherit"
    });
}
