// Fixture: parameterized
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage, gotoAllScenarios } from "./helpers/navigation";

test.describe("Cases table", () => {
    test.beforeAll(() => {
        prepareFixture("parameterized");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoAllScenarios(page, testInfo.project.name);
    });

    async function openTableScenario(page: import("@playwright/test").Page) {
        const scenario = page.locator(".scenario", { hasText: "parameterized table scenario" });
        await scenario.locator(".scenario-title").click();
        return scenario;
    }

    test("CT-01 table under steps when casesAsTable", async ({ page }) => {
        await openTableScenario(page);
        await expect(page.locator("h6.cases-table-header", { hasText: "Cases" })).toBeVisible();
        await expect(page.locator("table.data-table")).toBeVisible();
    });

    test("CT-02 columns include number parameters and status", async ({ page }) => {
        await openTableScenario(page);
        const headers = page.locator("table.data-table th");
        await expect(page.getByRole("columnheader", { name: /#/ })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: /name/i })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: /age/i })).toBeVisible();
        await expect(page.getByRole("columnheader", { name: /status/i })).toBeVisible();
    });

    test("CT-03 column sort ascending and descending via header", async ({ page }) => {
        await openTableScenario(page);
        const nameHeader = page.locator("table.data-table th", { hasText: "name" });
        await nameHeader.click();
        const firstAsc = await page.locator("table.data-table tbody tr td").nth(1).innerText();
        await nameHeader.click();
        const firstDesc = await page.locator("table.data-table tbody tr td").nth(1).innerText();
        expect(firstAsc).not.toBe(firstDesc);
    });

    test("CT-04 primitive array parameters displayed", async ({ page }) => {
        const scenario = page.locator(".scenario", { hasText: "primitive array parameters" });
        await scenario.locator(".scenario-title").click();
        await expect(scenario.locator(".scenario-case-title, .scenario-content")).toContainText("items");
    });

    test("CT-05 action panel when more than two cases", async ({ page }) => {
        await openTableScenario(page);
        await expect(page.locator("a.group-by", { hasText: "Group by" })).toBeVisible();
        await expect(page.locator("a[title='Expand Groups']")).toBeVisible();
        await expect(page.locator("a[title='Collapse Groups']")).toBeVisible();
    });

    test("CT-06 group by selected creates expandable row groups", async ({ page }) => {
        await openTableScenario(page);
        await page.locator("a.group-by").click();
        await page.locator(".f-dropdown:visible a", { hasText: "age" }).click();
        await expect(page.locator(".cases-group-header")).toHaveCount(3);
        await page.locator(".cases-group-header").first().click();
        await expect(page.locator("table.data-table tbody tr", { hasText: "Alice" })).toBeHidden();
    });
});
