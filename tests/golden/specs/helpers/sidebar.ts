import { expect, type Locator, type Page } from "@playwright/test";

export type SummaryView = "all" | "failed" | "pending" | "aborted";

const LEGACY_SUMMARY_HREFS: Record<SummaryView, string> = {
    all: "#all",
    failed: "#failed",
    pending: "#pending",
    aborted: "#aborted"
};

const NEW_SUMMARY_LABELS: Record<SummaryView, string> = {
    all: "All Scenarios",
    failed: "Failed Scenarios",
    pending: "Pending Scenarios",
    aborted: "Aborted Scenarios"
};

export function sidebarSummaryLink(page: Page, projectName: string, view: SummaryView): Locator {
    if (projectName === "legacy") {
        return page.locator(`#sidebar a[href="${LEGACY_SUMMARY_HREFS[view]}"]`);
    }
    return page.locator("#sidebar a", { hasText: NEW_SUMMARY_LABELS[view] });
}

export async function clickSidebarSummary(
    page: Page,
    projectName: string,
    view: SummaryView
): Promise<void> {
    await sidebarSummaryLink(page, projectName, view).click();
}

export async function expectSidebarSummaryBadge(
    page: Page,
    projectName: string,
    view: SummaryView,
    count: string
): Promise<void> {
    await expect(sidebarSummaryLink(page, projectName, view).locator(".nav-count")).toHaveText(count);
}
