// Fixture: mixed-status
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage, expectPageTitle } from "./helpers/navigation";
import {
    clickSidebarClass,
    clickSidebarPackage,
    ensureSidebarSectionExpanded,
    expandSidebarClassTree,
    expectStatistics,
    expectScenarioCount
} from "./helpers/page";

test.describe("Sidebar classes", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoWelcome(page, testInfo.project.name);
    });

    test("SC-01 classes section expand and collapse", async ({ page }) => {
        await page.locator("#sidebar li.heading a.toggle", { hasText: "Classes" }).click();
        await expect(page.locator("#sidebar .tree-node", { hasText: "example" })).toBeHidden();
        await page.locator("#sidebar li.heading a.toggle", { hasText: "Classes" }).click();
        await expect(page.locator("#sidebar .tree-node").first()).toBeVisible();
    });

    test("SC-02 package and class tree structure", async ({ page }) => {
        await expandSidebarClassTree(page);
        await expect(page.locator("#sidebar .tree-node", { hasText: "alpha" })).toBeVisible();
        await expect(page.locator("#sidebar a", { hasText: "AlphaTest" })).toBeVisible();
    });

    test("SC-03 click package node filters scenarios in package", async ({ page }) => {
        await clickSidebarPackage(page, "com.example.alpha");
        await expect(page.locator("h2.subtitle")).toHaveText("Package");
        await expectStatistics(page, {
            success: 1,
            failed: 1,
            pending: 0,
            aborted: 0,
            total: 2
        });
        await expectScenarioCount(page, 2);
    });

    test("SC-04 click class leaf filters scenarios for that class", async ({ page }) => {
        await clickSidebarClass(page, "BetaTest");
        await expectPageTitle(page, "Beta Test");
        await expectStatistics(page, {
            success: 0,
            failed: 0,
            pending: 1,
            aborted: 1,
            total: 2
        });
        await expectScenarioCount(page, 2);
    });
});
