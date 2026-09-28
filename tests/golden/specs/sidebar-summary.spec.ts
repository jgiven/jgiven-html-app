// Fixture: mixed-status
import { test, expect } from "@playwright/test";
import { prepareFixture } from "./helpers/fixtures";
import { gotoWelcome, clearStorage, expectPageTitle } from "./helpers/navigation";
import { expectStatistics, scenarioCount, visibleBreadcrumb } from "./helpers/page";
import {
    clickSidebarSummary,
    expectSidebarSummaryBadge,
    sidebarSummaryLink
} from "./helpers/sidebar";

test.describe("Sidebar summary", () => {
    test.beforeAll(() => {
        prepareFixture("mixed-status");
    });

    test.beforeEach(async ({ page }, testInfo) => {
        await gotoWelcome(page, testInfo.project.name);
        await clearStorage(page);
        await gotoWelcome(page, testInfo.project.name);
    });

    test("SS-01 summary section expanded by default", async ({ page }, testInfo) => {
        await expect(sidebarSummaryLink(page, testInfo.project.name, "all")).toBeVisible();
        await expect(sidebarSummaryLink(page, testInfo.project.name, "failed")).toBeVisible();
    });

    test("SS-02 summary links show badge counts", async ({ page }, testInfo) => {
        await expectSidebarSummaryBadge(page, testInfo.project.name, "all", "8");
        await expectSidebarSummaryBadge(page, testInfo.project.name, "failed", "1");
        await expectSidebarSummaryBadge(page, testInfo.project.name, "pending", "1");
        await expectSidebarSummaryBadge(page, testInfo.project.name, "aborted", "1");
    });

    test("SS-03 click All Scenarios updates page", async ({ page }, testInfo) => {
        await clickSidebarSummary(page, testInfo.project.name, "all");
        await expectPageTitle(page, "All Scenarios");
        await expect(visibleBreadcrumb(page)).toHaveText("ALL SCENARIOS");
        await expectStatistics(page, {
            success: 5,
            failed: 1,
            pending: 1,
            aborted: 1,
            total: 8
        });
        expect(await scenarioCount(page)).toBe(8);
    });

    test("SS-04 click Failed Scenarios updates page", async ({ page }, testInfo) => {
        await clickSidebarSummary(page, testInfo.project.name, "failed");
        await expectPageTitle(page, "Failed Scenarios");
        await expectStatistics(page, {
            success: 0,
            failed: 1,
            pending: 0,
            aborted: 0,
            total: 1
        });
        expect(await scenarioCount(page)).toBe(1);
        await expect(page.locator(".scenario-title")).toContainText(/alpha failed scenario/i);
    });

    test("SS-05 click Pending Scenarios updates page", async ({ page }, testInfo) => {
        await clickSidebarSummary(page, testInfo.project.name, "pending");
        await expectPageTitle(page, "Pending Scenarios");
        await expectStatistics(page, {
            success: 0,
            failed: 0,
            pending: 1,
            aborted: 0,
            total: 1
        });
        await expect(page.locator(".scenario-title")).toContainText(/beta pending scenario/i);
    });

    test("SS-06 click Aborted Scenarios updates page", async ({ page }, testInfo) => {
        await clickSidebarSummary(page, testInfo.project.name, "aborted");
        await expectPageTitle(page, "Aborted Scenarios");
        await expectStatistics(page, {
            success: 0,
            failed: 0,
            pending: 0,
            aborted: 1,
            total: 1
        });
        await expect(page.locator(".scenario-title")).toContainText(/beta aborted scenario/i);
    });
});
