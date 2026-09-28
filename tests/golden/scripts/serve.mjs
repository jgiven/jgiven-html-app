import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..", "..");

const target = process.argv[2];
const port = Number(process.argv[3] ?? 8765);

const roots = {
    legacy: join(repoRoot, "legacy", "dist"),
    new: join(repoRoot, "new", "build")
};

const root = roots[target];
if (!root) {
    console.error(`Unknown target "${target}". Use "legacy" or "new".`);
    process.exit(1);
}

const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".map": "application/json; charset=utf-8",
    ".svg": "image/svg+xml"
};

async function resolveFile(pathname) {
    const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    const candidates = [
        join(root, safePath),
        join(root, safePath, "index.html"),
        join(root, "index.html")
    ];

    for (const candidate of candidates) {
        try {
            const fileStat = await stat(candidate);
            if (fileStat.isFile()) {
                return candidate;
            }
        } catch {
            // try next candidate
        }
    }

    return null;
}

createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
    const filePath = await resolveFile(decodeURIComponent(url.pathname));

    if (!filePath) {
        response.writeHead(404);
        response.end("Not found");
        return;
    }

    const extension = extname(filePath);
    response.writeHead(200, {
        "Content-Type": mimeTypes[extension] ?? "application/octet-stream"
    });
    createReadStream(filePath).pipe(response);
}).listen(port, "127.0.0.1", () => {
    console.log(`Serving ${target} from ${root} on http://127.0.0.1:${port}`);
});
