// Fixture: mixed-status, pagination
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage, gotoAllScenarios } from "./helpers/navigation";
import {
    selectDropdownOption,
    scenarioCount,
    expectScenarioCount,
    toggleScenarioGroupHeader
} from "./helpers/page";

test.describe("Scenario overview list — mixed-status", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoAllScenarios(page, testInfo.project.name);
    });

    test("SL-01 scrollable scenario container", async ({ page }) => {
        await expect(page.locator("#scenario-container")).toBeVisible();
        await expect(page.locator(".scenario").first()).toBeVisible();
    });

    test("SL-05 group header shows title count and duration", async ({ page }) => {
        await selectDropdownOption(page, "Group By", "Class", true);
        const header = page.locator(".scenario-group-header").first();
        await expect(header).toContainText("com.example.alpha.AlphaTest");
        await expect(header.locator(".group-count.total")).toHaveText("2");
        await expect(header.locator(".duration")).toBeVisible();
    });

    test("SL-06 group header shows failed sub-badges when applicable", async ({ page }) => {
        await selectDropdownOption(page, "Group By", "Class", true);
        const alphaHeader = page.locator(".scenario-group-header", { hasText: "com.example.alpha.AlphaTest" });
        await expect(alphaHeader).toContainText("FAILED");
    });

    test("SL-07 groups expandable and collapsible", async ({ page }) => {
        await selectDropdownOption(page, "Group By", "Class", true);
        const groupRow = page.locator(".scenario-group-row").first();
        const header = groupRow.locator(".scenario-group-header");
        await toggleScenarioGroupHeader(header);
        await expect(groupRow.locator(".scenario").first()).toBeVisible();
        await toggleScenarioGroupHeader(header);
        await expect(groupRow.locator(".scenario")).toHaveCount(0);
    });

    test("SL-08 scenarios expandable and collapsible", async ({ page }) => {
        const title = page.locator(".scenario-title").first();
        await title.click();
        await expect(page.locator(".scenario-content").first()).toBeVisible();
        await title.click();
        await expect(page.locator(".scenario-content")).toHaveCount(0);
    });
});

test.describe("Scenario overview list — pagination", () => {
    test.beforeAll(() => {
        prepareFixture("pagination");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoAllScenarios(page, testInfo.project.name);
    });

    test("SL-02 paginated when group by None and count exceeds 40", async ({ page }) => {
        await expect(page.locator(".pagination-top")).toBeVisible();
        await expect(page.locator(".pagination-bottom")).toBeVisible();
    });

    test("SL-03 pagination changes visible page of scenarios", async ({ page }) => {
        const firstPageTitle = await page.locator(".scenario-title").first().innerText();
        await page.locator(".pagination-bottom a", { hasText: "›" }).click();
        const secondPageTitle = await page.locator(".scenario-title").first().innerText();
        expect(secondPageTitle).not.toBe(firstPageTitle);
        expect(await scenarioCount(page)).toBe(5);
    });

    test("SL-04 no pagination when grouped", async ({ page }) => {
        await selectDropdownOption(page, "Group By", "Class", true);
        await expect(page.locator(".pagination-top")).toHaveCount(0);
        await page.locator(".scenario-group-header").first().click({ force: true });
        await expectScenarioCount(page, 45);
    });
});
