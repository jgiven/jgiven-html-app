import type { Page } from "@playwright/test";

export function welcomePath(projectName: string): string {
    return projectName === "legacy" ? "/#/" : "/";
}

export function allScenariosPath(projectName: string): string {
    return projectName === "legacy" ? "/#/all" : "/all";
}

export async function gotoWelcome(page: Page, projectName: string): Promise<void> {
    await page.goto(welcomePath(projectName));
    await page.locator("#page-title").waitFor({ state: "visible" });
}

export async function gotoAllScenarios(page: Page, projectName: string): Promise<void> {
    await page.goto(allScenariosPath(projectName));
    await expectPageTitle(page, "All Scenarios");
}

export async function expectPageTitle(page: Page, title: string): Promise<void> {
    await page.locator("#page-title").waitFor({ state: "visible" });
    await page.locator("#page-title").filter({ hasText: title }).waitFor({ state: "visible" });
}

export async function clearStorage(page: Page): Promise<void> {
    await page.evaluate(() => localStorage.clear());
}
