// Fixture: mixed-status
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage, gotoAllScenarios, expectPageTitle } from "./helpers/navigation";
import { expandBookmarksSection, expectStatistics } from "./helpers/page";
import { clickSidebarSummary } from "./helpers/sidebar";

test.describe("Sidebar bookmarks", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoWelcome(page, testInfo.project.name);
    });

    test("SB-01 bookmarks section hidden when no bookmarks", async ({ page }) => {
        await expect(page.locator("#sidebar li.heading a", { hasText: "Bookmarks" })).toHaveCount(0);
    });

    test("SB-02 bookmark icon reveals bookmarks section", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await page.locator(".add-bookmark-icon").click();
        await expect(page.locator("#sidebar li.heading a", { hasText: "Bookmarks" })).toBeVisible();
        await expandBookmarksSection(page);
        await expect(page.locator("#sidebar .remove-bookmark-icon")).toHaveCount(1);
    });

    test("SB-03 bookmark entry applies saved filter", async ({ page }, testInfo) => {
        await clickSidebarSummary(page, testInfo.project.name, "failed");
        await expectPageTitle(page, "Failed Scenarios");
        await page.locator(".add-bookmark-icon").click();
        await page.locator("#sidebar a", { hasText: "Failed Scenarios" }).last().click();
        await expectPageTitle(page, "Failed Scenarios");
        await expectStatistics(page, {
            success: 0,
            failed: 1,
            pending: 0,
            aborted: 0,
            total: 1
        });
    });

    test("SB-04 delete bookmark via x icon removes entry", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await page.locator(".add-bookmark-icon").click();
        await expandBookmarksSection(page);
        await expect(page.locator("#sidebar .remove-bookmark-icon")).toHaveCount(1);
        await page.locator("#sidebar .remove-bookmark-icon").click();
        await expect(page.locator("#sidebar li.heading a", { hasText: "Bookmarks" })).toHaveCount(0);
    });

    test("SB-05 toggle bookmark icon again removes current bookmark", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await page.locator(".add-bookmark-icon").click();
        await expandBookmarksSection(page);
        await expect(page.locator("#sidebar .remove-bookmark-icon")).toHaveCount(1);
        await page.locator("#sidebar .remove-bookmark-icon").click();
        await expect(page.locator("#sidebar li.heading a", { hasText: "Bookmarks" })).toHaveCount(0);
    });
});
