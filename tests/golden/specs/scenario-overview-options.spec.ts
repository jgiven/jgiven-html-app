// Fixture: mixed-status (default), pagination, parameterized
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage, gotoAllScenarios } from "./helpers/navigation";
import {
    openDropdown,
    selectDropdownOption,
    expectScenarioCount,
    toggleScenarioGroupHeader
} from "./helpers/page";

test.describe("Scenario overview options — mixed-status", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoAllScenarios(page, testInfo.project.name);
    });

    test("OG-01 group by options available", async ({ page }) => {
        await openDropdown(page, "Group By");
        for (const option of ["None", "Class", "Class Title", "Status", "Tag"]) {
            await expect(
                page.locator("#group-drop-down a").getByText(option, { exact: true })
            ).toBeVisible();
        }
    });

    test("OG-02 group by None shows flat scenario list", async ({ page }) => {
        await expect(page.locator(".scenario-group-header")).toHaveCount(0);
        await expectScenarioCount(page, 8);
    });

    test("OG-03 group by Class shows grouped list", async ({ page }) => {
        await selectDropdownOption(page, "Group By", "Class", true);
        await expect(page.locator(".scenario-group-header")).toHaveCount(6);
        await expect(page.locator(".scenario-group-header-name").first()).toBeVisible();
    });

    test("OG-04 group by Tag puts untagged scenarios in No Tag group", async ({ page }) => {
        await selectDropdownOption(page, "Group By", "Tag", true);
        await expect(page.locator(".scenario-group-header-name", { hasText: " No Tag" })).toBeVisible();
    });

    test("OS-01 sort by options available", async ({ page }) => {
        await openDropdown(page, "Sort By");
        for (const option of ["A-Z", "Z-A", "Failed", "Successful", "Fastest", "Slowest"]) {
            await expect(page.locator("#sort-drop-down a", { hasText: option })).toBeVisible();
        }
    });

    test("OS-02 dynamic tag type sorts when type has multiple values", async ({ page }) => {
        await openDropdown(page, "Sort By");
        await expect(page.locator("#sort-drop-down a", { hasText: "Issue" })).toBeVisible();
    });

    test("OS-03 sort applies to flat list", async ({ page }) => {
        await selectDropdownOption(page, "Sort By", "Z-A", true);
        const firstTitle = await page.locator(".scenario-title").first().innerText();
        expect(firstTitle.toLowerCase()).toMatch(/golden search|search test/);
    });

    test("OS-04 sort applies within groups when grouped", async ({ page }) => {
        await selectDropdownOption(page, "Group By", "Class", true);
        await selectDropdownOption(page, "Sort By", "Z-A", true);
        const alphaHeader = page.locator(".scenario-group-header", { hasText: "com.example.alpha.AlphaTest" });
        await toggleScenarioGroupHeader(alphaHeader);
        const alphaGroup = page.locator(".scenario-group-row", { hasText: "com.example.alpha.AlphaTest" });
        const firstInGroup = alphaGroup.locator(".scenario-title").first();
        await expect(firstInGroup).toContainText(/alpha success/i);
    });

    test("OF-S1 status dropdown excludes Aborted", async ({ page }) => {
        await openDropdown(page, "Status");
        await expect(page.locator("#status-drop-down a", { hasText: "Successful" })).toBeVisible();
        await expect(page.locator("#status-drop-down a", { hasText: "Failed" })).toBeVisible();
        await expect(page.locator("#status-drop-down a", { hasText: "Pending" })).toBeVisible();
        await expect(page.locator("#status-drop-down a", { hasText: "Aborted" })).toHaveCount(0);
    });

    test("OF-S2 status dropdown multi-select with checkmarks", async ({ page }) => {
        await selectDropdownOption(page, "Status", "Failed", true);
        await openDropdown(page, "Status");
        await expect(page.locator("#status-drop-down .fa-check.selected")).toHaveCount(1);
        await selectDropdownOption(page, "Status", "Successful", true);
        await openDropdown(page, "Status");
        await expect(page.locator("#status-drop-down .fa-check.selected")).toHaveCount(2);
    });

    test("OF-S3 no status selected means no status filter", async ({ page }) => {
        await expectScenarioCount(page, 8);
    });

    test("OF-S4 some status selected applies OR filter", async ({ page }) => {
        await selectDropdownOption(page, "Status", "Failed", true);
        await selectDropdownOption(page, "Status", "Successful", true);
        await expectScenarioCount(page, 6);
    });

    test("OF-T1 tags dropdown lists relevant tags", async ({ page }) => {
        await openDropdown(page, "Tags");
        await expect(page.locator("#tag-drop-down a", { hasText: "UI", exact: true })).toBeVisible();
        await expect(page.locator("#tag-drop-down a", { hasText: "1", exact: true })).toBeVisible();
    });

    test("OF-T2 tags dropdown multi-select with checkmarks", async ({ page }) => {
        await selectDropdownOption(page, "Tags", "UI", true);
        await openDropdown(page, "Tags");
        await expect(page.locator("#tag-drop-down .fa-check.selected")).toHaveCount(1);
    });

    test("OF-T3 tags dropdown applies AND filter", async ({ page }) => {
        await selectDropdownOption(page, "Tags", "UI", true);
        await selectDropdownOption(page, "Tags", "1", true);
        await expectScenarioCount(page, 1);
        await expect(page.locator(".scenario-title")).toContainText(/delta multi tag/i);
    });

    test("OF-C1 classes dropdown lists relevant classes", async ({ page }) => {
        await openDropdown(page, "Classes");
        await expect(page.locator("#class-drop-down a", { hasText: "com.example.alpha.AlphaTest" })).toBeVisible();
        await expect(page.locator("#class-drop-down a", { hasText: "com.example.beta.BetaTest" })).toBeVisible();
    });

    test("OF-C2 classes dropdown applies OR filter", async ({ page }) => {
        await selectDropdownOption(page, "Classes", "com.example.alpha.AlphaTest", true);
        await selectDropdownOption(page, "Classes", "com.example.beta.BetaTest", true);
        await expectScenarioCount(page, 4);
    });
});

test.describe("Scenario overview options — pagination fixture", () => {
    test.beforeAll(() => {
        prepareFixture("pagination");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoAllScenarios(page, testInfo.project.name);
    });

    test("pagination fixture supports group and sort options", async ({ page }) => {
        await expect(page.locator(".scenario-list-button-bar .button-group")).toBeVisible();
        await selectDropdownOption(page, "Group By", "Class", true);
        await expect(page.locator(".scenario-group-header")).toHaveCount(1);
    });
});

test.describe("Scenario overview options — parameterized fixture", () => {
    test.beforeAll(() => {
        prepareFixture("parameterized");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoAllScenarios(page, testInfo.project.name);
    });

    test("parameterized fixture exposes options on multi-scenario view", async ({ page }) => {
        await expectScenarioCount(page, 3);
        await expect(page.locator(".scenario-list-button-bar .button-group")).toBeVisible();
    });
});
