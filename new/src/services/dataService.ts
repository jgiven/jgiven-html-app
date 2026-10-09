import type { CustomNavLink, JGivenMetaData, Scenario, TestClass } from "../types/jgivenReport";
import { sortByDescription } from "../util/format";

function report() {
    return window.jgivenReport;
}

export function getTagFile() {
    return report()?.tagFile;
}

export function getTestCases(): TestClass[] {
    return report()?.scenarios ?? [];
}

export function getMetaData(): JGivenMetaData | undefined {
    return report()?.metaData;
}

export function getCustomNavigationLinks(): CustomNavLink[] {
    return report()?.customNavigationLinks ?? [];
}

export function getAllScenarios(): Scenario[] {
    const result: Scenario[] = [];
    getTestCases().forEach(testClass => {
        testClass.scenarios.forEach(scenario => {
            scenario.classTitle = testClass.name;
            result.push(scenario);
        });
    });
    return result;
}

export function getScenariosWhere(filter: (scenario: Scenario) => boolean): Scenario[] {
    return sortByDescription(getAllScenarios().filter(filter));
}

export function getPendingScenarios(): Scenario[] {
    return getScenariosWhere(
        x =>
            x.executionStatus !== "SUCCESS" &&
            x.executionStatus !== "FAILED" &&
            x.executionStatus !== "ABORTED"
    );
}

export function getFailedScenarios(): Scenario[] {
    return getScenariosWhere(x => x.executionStatus === "FAILED");
}

export function getAbortedScenarios(): Scenario[] {
    return getScenariosWhere(x => x.executionStatus === "ABORTED");
}

export function waitForReport(): Promise<void> {
    return new Promise(resolve => {
        const check = () => {
            if (report()?.metaData?.version) {
                resolve();
                return;
            }
            requestAnimationFrame(check);
        };
        check();
    });
}
