import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const goldenRoot = join(__dirname, "..");

export default async function globalSetup() {
    execSync("node scripts/prepare-fixture.mjs", {
        cwd: goldenRoot,
        env: { ...process.env, GOLDEN_FIXTURE: "mixed-status" },
        stdio: "inherit"
    });
}
