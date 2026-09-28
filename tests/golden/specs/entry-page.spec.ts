// Fixture: empty
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage } from "./helpers/navigation";
import { expectStatistics } from "./helpers/page";
import { sidebarSummaryLink } from "./helpers/sidebar";

test.describe("Entry page (Welcome)", () => {
    test.beforeAll(() => {
        prepareFixture("empty");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoWelcome(page, testInfo.project.name);
    });

    test("EP-01 expanded sidebar visible on desktop", async ({ page }) => {
        await expect(page.locator("#sidebar")).toBeVisible();
        await expect(page.locator("#sidebar")).toContainText("Summary");
        await expect(page.locator("#sidebar")).toContainText("Tags");
        await expect(page.locator("#sidebar")).toContainText("Classes");
    });

    test("EP-02 sidebar sections expand and collapse on click", async ({ page }, testInfo) => {
        await page.locator("#sidebar li.heading a", { hasText: "Summary" }).click();
        await expect(sidebarSummaryLink(page, testInfo.project.name, "all")).toBeHidden();
        await page.locator("#sidebar li.heading a", { hasText: "Summary" }).click();
        await expect(sidebarSummaryLink(page, testInfo.project.name, "all")).toBeVisible();

        await page.locator("#sidebar li.heading a.toggle", { hasText: "Tags" }).click();
        await expect(page.locator("#sidebar .tree-node").first()).toBeHidden();
        await page.locator("#sidebar li.heading a.toggle", { hasText: "Tags" }).click();

        await page.locator("#sidebar li.heading a.toggle", { hasText: "Classes" }).click();
        await expect(page.locator("#sidebar li.heading a.toggle", { hasText: "Classes" })).toBeVisible();
    });

    test("EP-03 sidebar full hide and show", async ({ page }) => {
        await page.locator(".nav-hide-icon").click();
        await expect(page.locator("#sidebar")).toBeHidden();
        await page.locator(".nav-show-icon").click();
        await expect(page.locator("#sidebar")).toBeVisible();
    });

    test("EP-04 sidebar horizontal resize", async ({ page }) => {
        const sidebar = page.locator("#sidebar");
        const container = page.locator("#scenario-container");
        const initialWidth = await sidebar.evaluate((el) => getComputedStyle(el).width);

        const handle = page.locator("#nav-move-icon");
        const box = await handle.boundingBox();
        if (!box) throw new Error("Resize handle not found");

        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x - 60, box.y + box.height / 2);
        await page.mouse.up();

        const resizedWidth = await sidebar.evaluate((el) => getComputedStyle(el).width);
        expect(resizedWidth).not.toBe(initialWidth);
        const marginLeft = await container.evaluate((el) => getComputedStyle(el).marginLeft);
        expect(marginLeft).toBe(resizedWidth);
    });

    test("EP-05 search bar in top bar", async ({ page }) => {
        const search = page.locator("#nav-search");
        await expect(search).toBeVisible();
        await expect(search).toHaveAttribute("placeholder", "search in scenarios");
    });

    test("EP-06 breadcrumb shows / on Welcome", async ({ page }) => {
        await expect(page.locator("nav.breadcrumbs")).toBeVisible();
        await expect(page.locator("nav.breadcrumbs a.current").last()).toBeVisible();
    });

    test("EP-07 page title Welcome", async ({ page }) => {
        await expect(page.locator("#page-title")).toHaveText("Welcome");
    });

    test("EP-08 no scenario list on Welcome", async ({ page }) => {
        await expect(page.locator(".scenario")).toHaveCount(0);
    });

    test("EP-09 global statistics for entire report", async ({ page }) => {
        await expectStatistics(page, {
            success: 0,
            failed: 0,
            pending: 0,
            aborted: 0,
            total: 0
        });
    });

    test("EP-10 donut chart visible on large desktop", async ({ page }) => {
        await expect(page.locator("canvas.chart-doughnut")).toBeVisible();
    });

    test("EP-11 option dropdowns hidden on Welcome", async ({ page }) => {
        await expect(page.locator(".scenario-list-button-bar .button-group")).toBeHidden();
    });

    test("EP-12 report title in green top bar", async ({ page }) => {
        await expect(page.locator("#title")).toContainText("JGiven Report");
        await expect(page.locator("#title a")).toHaveAttribute("href", "#/");
    });

    test("EP-13 metadata footer", async ({ page }) => {
        const footer = page.locator(".footer-bottom");
        await expect(footer.getByRole("link", { name: "JGiven" }).first()).toHaveAttribute(
            "href",
            "http://jgiven.org"
        );
        await expect(footer).toContainText("HTML App");
        await expect(footer).toContainText("Data generated by");
        await expect(footer).toContainText("JGiven 1.0.0-golden on Jan 1, 2024, 12:00:00 PM");
    });
});
