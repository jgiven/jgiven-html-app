// Fixture: mixed-status
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage, gotoAllScenarios, expectPageTitle } from "./helpers/navigation";
import {
    clickDonutSegment,
    clickSidebarClass,
    ensureSidebarSectionExpanded,
    expectStatistics,
    expandFirstScenario,
    scenarioCount
} from "./helpers/page";
import { stubPrint } from "./helpers/print";

test.describe("Scenario overview heading", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoWelcome(page, testInfo.project.name);
    });

    test("SH-01 heading with title and subtitle when applicable", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await expect(page.locator("#page-title")).toHaveText("All Scenarios");
        await clickSidebarClass(page, "BetaTest");
        await expect(page.locator("h2.subtitle")).toContainText("com.example.beta");
        await expect(page.locator("#page-title")).toHaveText("Beta Test");
    });

    test("SH-02 donut chart reflects current view statistics", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await expectStatistics(page, {
            success: 5,
            failed: 1,
            pending: 1,
            aborted: 1,
            total: 8
        });
        await expect(page.locator("canvas.chart-doughnut")).toBeVisible();
    });

    test("SH-03 donut hover shows tooltip with segment details", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        const canvas = page.locator("canvas.chart-doughnut");
        await canvas.hover({ position: { x: 40, y: 20 } });
        await expect(canvas).toBeVisible();
    });

    test("SH-04 donut click Failed on all view navigates to Failed Scenarios", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await clickDonutSegment(page, "Failed", testInfo.project.name);
        await expectPageTitle(page, "Failed Scenarios");
    });

    test("SH-05 donut click Failed on tag view adds in-context status filter", async ({ page }, testInfo) => {
        await ensureSidebarSectionExpanded(page, "Tags");
        const featureNode = page.locator("#sidebar .tree-node", { hasText: "Feature" }).first();
        await featureNode.locator("a").first().click();
        await page.locator("#sidebar a", { hasText: "UI" }).click();
        await expectPageTitle(page, "UI");
        await clickDonutSegment(page, "Failed", testInfo.project.name);
        await expectPageTitle(page, "UI");
        await expectStatistics(page, {
            success: 0,
            failed: 0,
            pending: 0,
            aborted: 0,
            total: 0
        });
    });

    test("SH-06 donut click Successful on all view filters to successful", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await clickDonutSegment(page, "Successful", testInfo.project.name);
        await expectPageTitle(page, "All Scenarios");
        await expectStatistics(page, {
            success: 5,
            failed: 0,
            pending: 0,
            aborted: 0,
            total: 5
        });
    });

    test("SH-07 collapse all scenarios", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await expandFirstScenario(page);
        await page.locator(".collapse-icon").click();
        await expect(page.locator(".scenario-content")).toHaveCount(0);
    });

    test("SH-08 expand all scenarios", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await page.locator(".expand-icon").click();
        expect(await page.locator(".scenario-content").count()).toBe(await scenarioCount(page));
    });

    test("SH-09 print button triggers print flow with expanded scenarios", async ({ page }, testInfo) => {
        await stubPrint(page);
        await gotoAllScenarios(page, testInfo.project.name);
        const totalScenarios = await scenarioCount(page);
        await Promise.all([
            page.waitForFunction(
                (expected) => document.querySelectorAll(".scenario-content").length === expected,
                totalScenarios
            ),
            page.locator(".print-icon").click()
        ]);
        await page.waitForFunction(() => !!(window as Window & { __printCalled?: boolean }).__printCalled);
    });

    test("SH-10 bookmark button adds bookmark", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await page.locator(".add-bookmark-icon").click();
        await expect(page.locator("#sidebar li.heading a", { hasText: "Bookmarks" })).toBeVisible();
        await expect(page.locator("#sidebar a", { hasText: "All Scenarios" })).toBeVisible();
    });
});
