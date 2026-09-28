import { expect, type Locator, type Page } from "@playwright/test";

export interface StatisticsCounts {
    success: number;
    failed: number;
    pending: number;
    aborted: number;
    total: number;
}

export function statisticsLocator(page: Page): Locator {
    return page.locator("#statistics");
}

export async function parseStatistics(page: Page): Promise<StatisticsCounts> {
    const text = await statisticsLocator(page).innerText();
    const match = text.match(
        /(\d+)\s+Successful.*?(\d+)\s+Failed.*?(\d+)\s+Pending.*?(\d+)\s+Aborted.*?(\d+)\s+Total/s
    );
    if (!match) {
        throw new Error(`Could not parse statistics from: ${text}`);
    }
    return {
        success: Number(match[1]),
        failed: Number(match[2]),
        pending: Number(match[3]),
        aborted: Number(match[4]),
        total: Number(match[5])
    };
}

export async function expectStatistics(page: Page, expected: StatisticsCounts): Promise<void> {
    await expect(statisticsLocator(page)).toBeVisible();
    const actual = await parseStatistics(page);
    expect(actual).toEqual(expected);
}

export function scenarioTitles(page: Page): Locator {
    return page.locator(".scenario-title");
}

export async function scenarioCount(page: Page): Promise<number> {
    return page.locator(".scenario").count();
}

export async function expandFirstScenario(page: Page): Promise<void> {
    const title = scenarioTitles(page).first();
    await title.click();
    await page.locator(".scenario-content").first().waitFor({ state: "visible" });
}

export async function expandScenario(page: Page, scenarioText?: RegExp | string): Promise<void> {
    if (scenarioText) {
        const scenario = page.locator(".scenario", { hasText: scenarioText });
        await scenario.locator(".scenario-title").click();
        await scenario.locator(".scenario-content").waitFor({ state: "visible" });
        return;
    }

    await page.locator(".expand-icon").click();
    await page.locator("#scenario-container .scenario-content").first().waitFor({ state: "visible" });
}

export async function ensureSidebarSectionExpanded(page: Page, section: "Tags" | "Classes"): Promise<void> {
    const sectionRoot = page.locator("#sidebar li.heading").filter({
        has: page.locator("a", { hasText: section })
    });
    const treeMarker =
        section === "Tags"
            ? sectionRoot.locator(".tree-node, .show-tree-node-link")
            : sectionRoot.locator(".tree-node, a[href*='#package'], a[href*='#class']");
    if (!(await treeMarker.first().isVisible())) {
        await sectionRoot.locator("a").first().click();
    }
}

const DROPDOWN_IDS: Record<string, string> = {
    "Group By": "group-drop-down",
    "Sort By": "sort-drop-down",
    Status: "status-drop-down",
    Tags: "tag-drop-down",
    Classes: "class-drop-down"
};

export async function openDropdown(page: Page, toggleText: string): Promise<void> {
    await page
        .locator(".scenario-list-button-bar a.button")
        .filter({ hasText: toggleText })
        .first()
        .click();
}

export async function selectDropdownOption(
    page: Page,
    dropdown: string,
    optionName: string,
    exact = false
): Promise<void> {
    const dropdownId = DROPDOWN_IDS[dropdown];
    if (!dropdownId) {
        throw new Error(`Unknown dropdown: ${dropdown}`);
    }
    const menu = page.locator(`#${dropdownId}`);
    if (!(await menu.isVisible())) {
        await openDropdown(page, dropdown);
    }
    await menu.locator("a").getByText(optionName, { exact }).click();
}

export async function expandSidebarClassTree(page: Page): Promise<void> {
    await ensureSidebarSectionExpanded(page, "Classes");
    const classesSection = page.locator("#sidebar li.heading").filter({
        has: page.locator("a", { hasText: "Classes" })
    });
    for (let attempt = 0; attempt < 8; attempt++) {
        const collapsed = classesSection.locator(".tree-node a .fa-caret-right:not(.fa-rotate-90)");
        if ((await collapsed.count()) === 0) {
            break;
        }
        await collapsed.first().click();
    }
}

export async function clickSidebarClass(page: Page, shortClassName: string): Promise<void> {
    await expandSidebarClassTree(page);
    await page.locator("#sidebar a[href*='#class/']").filter({ hasText: shortClassName }).click();
}

export async function clickSidebarPackage(page: Page, packageName: string): Promise<void> {
    await expandSidebarClassTree(page);
    await page.locator(`#sidebar a[href="#package/${packageName}"]`).click();
}

export async function expandBookmarksSection(page: Page): Promise<void> {
    const heading = page.locator("#sidebar li.heading a", { hasText: "Bookmarks" });
    if (await heading.isVisible()) {
        await heading.click();
    }
}

export async function expandAllScenarioGroups(page: Page): Promise<void> {
    const headers = page.locator(".scenario-group-header");
    const count = await headers.count();
    for (let i = 0; i < count; i++) {
        await headers.nth(i).click({ force: true });
    }
}

export async function expectScenarioCount(page: Page, expected: number): Promise<void> {
    await expect(page.locator(".scenario")).toHaveCount(expected);
}

export async function toggleScenarioGroupHeader(header: Locator): Promise<void> {
    await header.evaluate((element) => (element as HTMLElement).click());
}

export function visibleBreadcrumb(page: Page): Locator {
    return page.locator("nav.breadcrumbs a.current:not(.ng-hide)").last();
}

export async function currentBreadcrumbText(page: Page): Promise<string> {
    return visibleBreadcrumb(page).innerText();
}

export async function clickDonutSegment(
    page: Page,
    segment: "Successful" | "Failed" | "Pending" | "Aborted",
    projectName = "legacy"
): Promise<void> {
    const canvas = page.locator("canvas.chart-doughnut");
    await expect(canvas).toBeVisible();

    if (projectName === "legacy") {
        const triggered = await page.evaluate((label) => {
            const element = document.querySelector("canvas.chart-doughnut");
            const angularApi = (window as Window & { angular?: { element: (el: Element) => { scope: () => { click?: (event: unknown[]) => void; $apply: (fn: () => void) => void } } } }).angular;
            if (!element || !angularApi) {
                return false;
            }
            const scope = angularApi.element(element).scope();
            if (!scope?.click) {
                return false;
            }
            scope.$apply(() => scope.click!([{ _model: { label } }]));
            return true;
        }, segment);
        if (triggered) {
            return;
        }
    }

    const box = await canvas.boundingBox();
    if (!box) {
        throw new Error("Donut chart canvas has no bounding box");
    }

    const positions = {
        Successful: { x: box.width * 0.5, y: box.height * 0.12 },
        Failed: { x: box.width * 0.88, y: box.height * 0.5 },
        Pending: { x: box.width * 0.5, y: box.height * 0.88 },
        Aborted: { x: box.width * 0.12, y: box.height * 0.5 }
    };

    await canvas.click({ position: positions[segment] });
}
