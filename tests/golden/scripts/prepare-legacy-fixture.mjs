import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const result = spawnSync("node", [join(__dirname, "prepare-fixture.mjs")], {
    cwd: join(__dirname, ".."),
    env: process.env,
    stdio: "inherit"
});

process.exit(result.status ?? 1);
