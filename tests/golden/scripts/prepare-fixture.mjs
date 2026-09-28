import { cp, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..", "..");
const legacyDist = join(repoRoot, "legacy", "dist");
const newBuild = join(repoRoot, "new", "build");
const stubSource = join(__dirname, "jgivenReport-stub.js");
const fixtureName = process.env.GOLDEN_FIXTURE || "mixed-status";
const fixtureRoot = join(__dirname, "..", "fixtures", fixtureName);

const FIXTURE_MARKER = "<!-- golden-fixture-scripts -->";

const fixtureScriptTags = [
    '<script type="text/javascript" src="js/jgivenReport-stub.js" charset="utf-8"></script>',
    '<script type="text/javascript" src="js/custom.js" charset="utf-8"></script>',
    '<script type="text/javascript" src="data/metaData.js" charset="utf-8"></script>',
    '<script type="text/javascript" src="data/tags.js" charset="utf-8"></script>'
];

const fixtureScriptBlock = `${FIXTURE_MARKER}
    ${fixtureScriptTags.join("\n    ")}
    `;

async function copyFixtureTree(targetRoot) {
    await mkdir(join(targetRoot, "data"), { recursive: true });
    await mkdir(join(targetRoot, "js"), { recursive: true });

    await cp(join(fixtureRoot, "metaData.js"), join(targetRoot, "data", "metaData.js"));
    await cp(join(fixtureRoot, "tags.js"), join(targetRoot, "data", "tags.js"));
    await cp(join(fixtureRoot, "scenarios.js"), join(targetRoot, "data", "scenarios.js"));
    await cp(join(fixtureRoot, "js", "custom.js"), join(targetRoot, "js", "custom.js"));

    const dataDir = join(fixtureRoot, "data");
    try {
        await stat(dataDir);
        const entries = await readdir(dataDir, { withFileTypes: true });
        for (const entry of entries) {
            const source = join(dataDir, entry.name);
            const target = join(targetRoot, "data", entry.name);
            await cp(source, target, { recursive: entry.isDirectory() });
        }
    } catch {
        // fixture has no attachment data directory
    }
}

function stripExistingFixtureBlock(html) {
    if (!html.includes(FIXTURE_MARKER)) {
        return html;
    }

    let result = html.replace(new RegExp(`\\s*${FIXTURE_MARKER}`, "g"), "");

    for (const tag of fixtureScriptTags) {
        const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        result = result.replace(new RegExp(`\\s*${escaped}`, "g"), "");
    }

    return result;
}

async function patchNewBuildIndex() {
    const indexPath = join(newBuild, "index.html");
    let html;

    try {
        html = await readFile(indexPath, "utf8");
    } catch {
        console.warn(`Skipping new/build index patch — not found: ${indexPath}`);
        return;
    }

    html = stripExistingFixtureBlock(html);

    const rootDiv = /<div id="root"\s*\/?>/i;
    if (rootDiv.test(html)) {
        html = html.replace(rootDiv, `${fixtureScriptBlock}$&`);
    } else {
        const bodyOpen = /<body[^>]*>/i;
        if (bodyOpen.test(html)) {
            html = html.replace(bodyOpen, `$&\n    ${fixtureScriptBlock}`);
        } else {
            html += `\n${fixtureScriptBlock}`;
        }
    }

    await writeFile(indexPath, html, "utf8");
}

await copyFixtureTree(legacyDist);

try {
    await stat(newBuild);
    await copyFixtureTree(newBuild);
    await cp(stubSource, join(newBuild, "js", "jgivenReport-stub.js"));
    await patchNewBuildIndex();
    console.log(`Prepared new/build fixture: ${fixtureName}`);
} catch {
    console.warn(`Skipping new/build fixture — build output not found: ${newBuild}`);
}

console.log(`Prepared legacy fixture: ${fixtureName}`);
