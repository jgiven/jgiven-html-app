// Fixture: mixed-status
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage, expectPageTitle } from "./helpers/navigation";
import { ensureSidebarSectionExpanded, expectStatistics, scenarioCount } from "./helpers/page";

test.describe("Sidebar tags", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoWelcome(page, testInfo.project.name);
    });

    test("ST-01 tags section expand and collapse", async ({ page }) => {
        const tagsSection = page.locator("#sidebar li.heading").filter({
            has: page.locator("a", { hasText: "Tags" })
        });
        await tagsSection.locator("a").first().click();
        await expect(tagsSection.locator(".tree-node").first()).toBeHidden();
        await tagsSection.locator("a").first().click();
        await expect(tagsSection.locator(".tree-node").first()).toBeVisible();
    });

    test("ST-02 tree structure with expandable parent nodes", async ({ page }) => {
        await expect(page.locator("#sidebar .tree-node", { hasText: "Feature" })).toBeVisible();
        await expect(page.locator("#sidebar .tree-node", { hasText: "Category" })).toBeVisible();
    });

    test("ST-03 caret click expands node without navigation", async ({ page }) => {
        const featureNode = page.locator("#sidebar .tree-node", { hasText: "Feature" }).first();
        await featureNode.locator("a").first().click();
        await expect(page.locator("#page-title")).toHaveText("Welcome");
        await expect(page.locator("#sidebar a", { hasText: "UI" })).toBeVisible();
    });

    test("ST-04 chevron link on parent filters by tag name", async ({ page }) => {
        await ensureSidebarSectionExpanded(page, "Tags");
        const featureNode = page.locator("#sidebar .tree-node", { hasText: "Feature" }).first();
        await featureNode.locator(".show-tree-node-link").click();
        await expectPageTitle(page, "Feature");
        await expectStatistics(page, {
            success: 2,
            failed: 1,
            pending: 0,
            aborted: 0,
            total: 3
        });
        expect(await scenarioCount(page)).toBe(3);
    });

    test("ST-05 leaf click filters by specific tag value", async ({ page }) => {
        await ensureSidebarSectionExpanded(page, "Tags");
        const featureNode = page.locator("#sidebar .tree-node", { hasText: "Feature" }).first();
        await featureNode.locator("a").first().click();
        await page.locator("#sidebar a", { hasText: "UI" }).click();
        await expectPageTitle(page, "UI");
        await expectStatistics(page, {
            success: 2,
            failed: 0,
            pending: 0,
            aborted: 0,
            total: 2
        });
        expect(await scenarioCount(page)).toBe(2);
    });

    test("ST-06 auto-expand single-child chains when opening a node", async ({ page }) => {
        const categoryNode = page.locator("#sidebar .tree-node", { hasText: "Category" }).first();
        await categoryNode.locator("a").first().click();
        await expect(page.locator("#sidebar a", { hasText: "Only" })).toBeVisible();
    });
});
