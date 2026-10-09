// Fixture: mixed-status (sidebar chrome also covered in entry-page with empty)
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage } from "./helpers/navigation";

test.describe("Sidebar chrome", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoWelcome(page, testInfo.project.name);
    });

    test("sidebar is visible with all main sections", async ({ page }) => {
        await expect(page.locator("#sidebar")).toBeVisible();
        await expect(page.locator("#sidebar")).toContainText("Summary");
        await expect(page.locator("#sidebar")).toContainText("Tags");
        await expect(page.locator("#sidebar")).toContainText("Classes");
    });
});

// Fixture: custom-nav
test.describe("Sidebar custom navigation links", () => {
    test.beforeAll(() => {
        prepareFixture("custom-nav");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoWelcome(page, testInfo.project.name);
    });

    test("SN-01 custom link appears in sidebar with configured text", async ({ page }) => {
        await expect(page.locator("#sidebar a", { hasText: "Example Documentation" })).toBeVisible();
    });

    test("SN-02 custom link has configured href and target", async ({ page }) => {
        const link = page.locator('#sidebar a[href="https://example.com/docs"]');
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("target", "_blank");
    });
});
