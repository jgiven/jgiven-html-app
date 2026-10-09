// Verifies prepare-fixture.mjs copies data and injects scripts for legacy and new.
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";

/** mixed-status setAllScenarios passes six report-class models. */
const MIXED_STATUS_REPORT_MODEL_COUNT = 6;

type JgivenReportSnapshot = {
    scenarioCount: number;
    version: string | null;
    hasTagFile: boolean;
};

async function readJgivenReport(page: import("@playwright/test").Page): Promise<JgivenReportSnapshot> {
    return page.evaluate(() => {
        const report = (window as Window & {
            jgivenReport?: {
                scenarios?: unknown[];
                metaData?: { version?: string; title?: string };
                tagFile?: unknown;
            };
        }).jgivenReport;

        return {
            scenarioCount: report?.scenarios?.length ?? -1,
            version: report?.metaData?.version ?? null,
            hasTagFile: report?.tagFile != null
        };
    });
}

async function expectFixtureLoaded(
    page: import("@playwright/test").Page,
    expectedReportModelCount: number
) {
    await page.goto("/");
    await page.waitForFunction(() => {
        const report = (window as Window & { jgivenReport?: { metaData?: { version?: string } } })
            .jgivenReport;
        return report?.metaData?.version === "1.0.0-golden";
    });

    const snapshot = await readJgivenReport(page);

    expect(snapshot.version).toBe("1.0.0-golden");
    expect(snapshot.hasTagFile).toBe(true);
    expect(snapshot.scenarioCount).toBe(expectedReportModelCount);
}

test.describe("Fixture loading — empty", () => {
    test.beforeAll(() => {
        prepareFixture("empty");
    });

    test("FL-01 empty fixture exposes jgivenReport on legacy", async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "legacy", "legacy project only");
        await expectFixtureLoaded(page, 0);
    });

    test("FL-02 empty fixture exposes jgivenReport on new", async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "new", "new project only");
        await expectFixtureLoaded(page, 0);
    });
});

test.describe("Fixture loading — mixed-status", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test("FL-03 mixed-status fixture exposes scenarios on legacy", async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "legacy", "legacy project only");
        await expectFixtureLoaded(page, MIXED_STATUS_REPORT_MODEL_COUNT);
    });

    test("FL-04 mixed-status fixture exposes scenarios on new", async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "new", "new project only");
        await expectFixtureLoaded(page, MIXED_STATUS_REPORT_MODEL_COUNT);
    });
});
