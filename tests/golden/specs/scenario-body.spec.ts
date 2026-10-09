// Fixture: mixed-status, parameterized, failures, rich-steps
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage, gotoAllScenarios } from "./helpers/navigation";
import { expandFirstScenario, expandScenario } from "./helpers/page";
import { clickSidebarSummary } from "./helpers/sidebar";

test.describe("Scenario body — mixed-status", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoAllScenarios(page, testInfo.project.name);
    });

    test("SV-H1 scenario header shows descriptor status duration and tags", async ({ page }) => {
        const scenario = page.locator(".scenario", { hasText: /delta multi tag/i });
        await expect(scenario.locator(".scenario-title")).toContainText(/delta multi tag/i);
        await expect(scenario.locator(".check.fa-check-square")).toBeVisible();
        await expect(scenario.locator(".duration")).toBeVisible();
        await expect(scenario.locator(".tag-column .tag").first()).toBeVisible();
    });

    test("SV-H3 extended description icon when present", async ({ page }) => {
        const scenario = page.locator(".scenario", { hasText: "extended description" });
        await expect(scenario.locator(".scenario-extended-description-icon")).toBeVisible();
    });

    test("SV-H4 tag pills clickable to apply tag filter", async ({ page }) => {
        const scenario = page.locator(".scenario", { hasText: /delta multi tag/i });
        await scenario.locator(".tag-column a", { hasText: "1" }).click();
        await expect(page.locator("#page-title")).toHaveText("1");
    });

    test("SV-H5 direct link icon opens single-scenario view", async ({ page }, testInfo) => {
        await clickSidebarSummary(page, testInfo.project.name, "failed");
        await page.locator(".scenario-link-icon").click();
        await expect(page.locator("#page-title")).toContainText(/alpha failed scenario/i);
        await expect(page.locator(".scenario")).toHaveCount(1);
    });

    test("SV-B1 body only visible when expanded", async ({ page }) => {
        await expect(page.locator(".scenario-content")).toHaveCount(0);
        await expandFirstScenario(page);
        await expect(page.locator(".scenario-content").first()).toBeVisible();
    });

    test("SV-B2 steps in Given When Then sections", async ({ page }) => {
        await expandFirstScenario(page);
        await expect(page.locator("td.steps.intro-word").first()).toBeVisible();
        await expect(page.locator("table.steps")).toBeVisible();
    });

    test("SV-B4 class name link at bottom filters by class", async ({ page }) => {
        await expandFirstScenario(page);
        await page.locator(".class-name a").first().click();
        await expect(page.locator("#page-title")).toHaveText("Alpha Test");
    });
});

test.describe("Scenario body — parameterized", () => {
    test.beforeAll(() => {
        prepareFixture("parameterized");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoAllScenarios(page, testInfo.project.name);
    });

    test("SV-H2 case count badge when multiple cases", async ({ page }) => {
        const scenario = page.locator(".scenario", { hasText: "multi case parameterized" });
        await expect(scenario.locator(".case-count")).toHaveText("3");
    });

    test("SV-B5 parameterized non-table cases expand per case", async ({ page }) => {
        const scenario = page.locator(".scenario", { hasText: "multi case parameterized" });
        await scenario.locator(".scenario-title").click();
        await expect(scenario.locator(".scenario-case-title")).toHaveCount(3);
        await scenario.locator(".scenario-case-title").first().click();
        await expect(scenario.locator(".scenario-content .steps").first()).toBeVisible();
    });
});

test.describe("Scenario body — failures", () => {
    test.beforeAll(() => {
        prepareFixture("failures");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoAllScenarios(page, testInfo.project.name);
    });

    test("SV-B6 failed case shows error message and expandable stack trace", async ({ page }) => {
        await expandScenario(page);
        await expect(page.locator(".alert-box.alert")).toContainText("Expected value but got null");
        await page.locator("pre.exception .fa-caret-right").click();
        await expect(page.locator("pre.exception")).toContainText("FailureTest.java:42");
    });

    test("SV-B13 step status icons on non-success scenarios", async ({ page }) => {
        await expandScenario(page);
        await expect(page.locator(".small-check")).toBeVisible();
        await expect(page.locator(".failed-icon")).toBeVisible();
        await expect(page.locator(".skipped")).toBeVisible();
    });
});

test.describe("Scenario body — rich-steps", () => {
    test.beforeAll(() => {
        prepareFixture("rich-steps");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoAllScenarios(page, testInfo.project.name);
    });

    test("SV-B3 when steps show duration when above 10 ms", async ({ page }) => {
        await expandScenario(page);
        await expect(page.locator(".scenario-content .duration").first()).toBeVisible();
    });

    test("SV-B7 step with formatted code data block", async ({ page }) => {
        await expandScenario(page);
        await expect(page.locator(".multiline")).toContainText("line1");
    });

    test("SV-B8 step with inline data table", async ({ page }) => {
        await expandScenario(page);
        const table = page.locator("table.table-value");
        await expect(table).toBeVisible();
        await expect(table).toContainText("Name");
        await expect(table).toContainText("foo");
    });

    test("SV-B9 thumbnail attachment opens in new tab on click", async ({ page, context }) => {
        await expandScenario(page);
        const [popup] = await Promise.all([
            context.waitForEvent("page"),
            page.locator("a[target='_blank'] .jgiven-html-thumbnail").click()
        ]);
        await expect(popup).toHaveURL(/screenshot\.png/);
    });

    test("SV-B10 direct image attachment shown inline", async ({ page }) => {
        await expandScenario(page);
        await expect(page.locator("img.direct-image")).toBeVisible();
    });

    test("SV-B11 nested steps expand and collapse", async ({ page }) => {
        await expandScenario(page);
        await page.locator("tr.steps.toggle").filter({ hasText: /slow action/i }).click();
        await expect(page.locator(".nested-step").filter({ hasText: /nested child step/i })).toBeVisible();
    });

    test("SV-B12 step tooltip on extended description and comment", async ({ page }) => {
        await expandScenario(page);
        const tipTarget = page.locator(".has-tip").first();
        await tipTarget.hover();
        await expect(page.locator(".tooltip, [class*='tooltip']").first()).toBeVisible();
    });
});
