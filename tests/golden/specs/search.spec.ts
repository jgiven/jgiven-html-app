// Fixture: mixed-status
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage } from "./helpers/navigation";
import { expectStatistics, expectScenarioCount, visibleBreadcrumb } from "./helpers/page";

test.describe("Search", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoWelcome(page, testInfo.project.name);
    });

    test("SR-01 submit search navigates to search results", async ({ page }) => {
        await page.locator("#nav-search").fill("golden search");
        await page.locator("#nav-search").press("Enter");
        await expect(page.locator("#page-title")).toHaveText("Search Results");
    });

    test("SR-02 title and description contain query", async ({ page }) => {
        await page.locator("#nav-search").fill("golden search");
        await page.locator("#nav-search").press("Enter");
        await expect(page.locator("h3.description")).toContainText("golden search");
    });

    test("SR-03 breadcrumb includes Search and query", async ({ page }) => {
        await page.locator("#nav-search").fill("golden search");
        await page.locator("#nav-search").press("Enter");
        await expect(visibleBreadcrumb(page)).toBeVisible();
        await expect(page.locator("nav.breadcrumbs")).toContainText(/search/i);
    });

    test("SR-04 only matching scenarios shown", async ({ page }) => {
        await page.locator("#nav-search").fill("golden search");
        await page.locator("#nav-search").press("Enter");
        await expectScenarioCount(page, 1);
        await expect(page.locator(".scenario-title")).toContainText(/golden search keyword here/i);
    });

    test("SR-05 statistics and donut reflect search result set", async ({ page }) => {
        await page.locator("#nav-search").fill("golden search");
        await page.locator("#nav-search").press("Enter");
        await expectStatistics(page, {
            success: 1,
            failed: 0,
            pending: 0,
            aborted: 0,
            total: 1
        });
        await expect(page.locator("canvas.chart-doughnut")).toBeVisible();
    });

    test("SR-06 loading indicator briefly visible on slow search", async ({ page }) => {
        await page.locator("#nav-search").fill("golden search");
        await page.locator("#nav-search").press("Enter");
        await expect(page.locator("#page-title")).toHaveText("Search Results");
        await expect(page.locator(".scenario").first()).toBeVisible();
        await expect(page.locator("h4").filter({ hasText: "Loading" })).toBeHidden();
    });
});
