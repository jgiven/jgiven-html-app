import type { Page } from "@playwright/test";

export async function stubPrint(page: Page): Promise<void> {
    await page.addInitScript(() => {
        (window as Window & { __printCalled?: boolean }).__printCalled = false;
        window.print = () => {
            (window as Window & { __printCalled?: boolean }).__printCalled = true;
        };
    });
    await page.evaluate(() => {
        (window as Window & { __printCalled?: boolean }).__printCalled = false;
        window.print = () => {
            (window as Window & { __printCalled?: boolean }).__printCalled = true;
        };
    });
}

export async function wasPrintCalled(page: Page): Promise<boolean> {
    return page.evaluate(() => !!(window as Window & { __printCalled?: boolean }).__printCalled);
}
