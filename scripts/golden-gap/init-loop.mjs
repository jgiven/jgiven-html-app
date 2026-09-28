import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

execSync(`node "${join(__dirname, "loop-state.mjs")}" init`, {
    cwd: join(__dirname, "..", ".."),
    stdio: "inherit"
});

console.log("");
console.log("Parity loop initialized.");
console.log("Next: start the parity-loop skill (you are already on the new parity branch).");
