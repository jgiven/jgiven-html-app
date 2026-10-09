// Fixture: mixed-status
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage, gotoAllScenarios, expectPageTitle } from "./helpers/navigation";
import {
    ensureSidebarSectionExpanded,
    expectStatistics,
    openDropdown,
    selectDropdownOption,
    expectScenarioCount
} from "./helpers/page";
import { clickSidebarSummary } from "./helpers/sidebar";

test.describe("Scenario overview statistics row", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoWelcome(page, testInfo.project.name);
    });

    test("SI-01 shows all status counts and execution time", async ({ page }) => {
        await expect(page.locator("#statistics")).toContainText("Successful");
        await expect(page.locator("#statistics")).toContainText("Failed");
        await expect(page.locator("#statistics")).toContainText("Pending");
        await expect(page.locator("#statistics")).toContainText("Aborted");
        await expect(page.locator("#statistics")).toContainText("Total");
        await expectStatistics(page, {
            success: 5,
            failed: 1,
            pending: 1,
            aborted: 1,
            total: 8
        });
    });

    test("SI-02 click Successful on Welcome navigates to filtered all-success view", async ({ page }) => {
        await page.locator("#statistics").getByText(/Successful/).click();
        await expectPageTitle(page, "All Scenarios");
        await expectStatistics(page, {
            success: 5,
            failed: 0,
            pending: 0,
            aborted: 0,
            total: 5
        });
    });

    test("SI-03 click Failed on Welcome navigates to Failed Scenarios", async ({ page }) => {
        await page.locator("#statistics").getByText(/Failed/).click();
        await expectPageTitle(page, "Failed Scenarios");
    });

    test("SI-04 click status count on tag page adds in-context filter", async ({ page }) => {
        await ensureSidebarSectionExpanded(page, "Tags");
        const featureNode = page.locator("#sidebar .tree-node", { hasText: "Feature" }).first();
        await featureNode.locator("a").first().click();
        await page.locator("#sidebar a", { hasText: "UI" }).click();
        await page.locator("#statistics").getByText(/Failed/).click();
        await expectPageTitle(page, "UI");
        await expectScenarioCount(page, 0);
    });

    test("SI-05 dropdown filters show filtered count", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await selectDropdownOption(page, "Status", "Failed", true);
        await expect(page.locator("#statistics")).toContainText("(7 Filtered)");
    });

    test("SI-06 click filtered count clears dropdown filters", async ({ page }, testInfo) => {
        await gotoAllScenarios(page, testInfo.project.name);
        await selectDropdownOption(page, "Status", "Failed", true);
        await page.locator("#statistics").getByText("(7 Filtered)").click();
        await expectScenarioCount(page, 8);
        await expect(page.locator("#statistics")).not.toContainText("Filtered");
    });

    test("SI-07 option dropdowns visible only when more than one scenario", async ({ page }, testInfo) => {
        await expect(page.locator(".scenario-list-button-bar .button-group")).toBeHidden();
        await clickSidebarSummary(page, testInfo.project.name, "failed");
        await expect(page.locator(".scenario-list-button-bar .button-group")).toBeHidden();
        await clickSidebarSummary(page, testInfo.project.name, "all");
        await expect(page.locator(".scenario-list-button-bar .button-group")).toBeVisible();
    });
});
