import { defineConfig, devices } from "@playwright/test";

const legacyPort = 8765;
const newPort = 8766;

export default defineConfig({
    testDir: "./specs",
    globalSetup: "./scripts/global-setup.mjs",
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: "list",
    use: {
        trace: "on-first-retry"
    },
    webServer: [
        {
            command: `node scripts/serve.mjs legacy ${legacyPort}`,
            url: `http://127.0.0.1:${legacyPort}`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000
        },
        {
            command: `node scripts/serve.mjs new ${newPort}`,
            url: `http://127.0.0.1:${newPort}`,
            reuseExistingServer: !process.env.CI,
            timeout: 120_000
        }
    ],
    projects: [
        {
            name: "legacy",
            use: {
                ...devices["Desktop Chrome"],
                baseURL: `http://127.0.0.1:${legacyPort}`
            }
        },
        {
            name: "new",
            dependencies: ["legacy"],
            use: {
                ...devices["Desktop Chrome"],
                baseURL: `http://127.0.0.1:${newPort}`
            }
        }
    ]
});
