import type { Scenario } from "../types/jgivenReport";
import { getReadableExecutionStatus } from "../util/format";

export interface Statistics {
    count: number;
    failed: number;
    pending: number;
    success: number;
    aborted: number;
    totalNanos: number;
    chartData?: number[];
}

export function gatherStatistics(scenarios: Scenario[]): Statistics {
    const statistics: Statistics = {
        count: scenarios.length,
        failed: 0,
        pending: 0,
        success: 0,
        aborted: 0,
        totalNanos: 0
    };

    scenarios.forEach(x => {
        statistics.totalNanos += x.durationInNanos;
        if (x.executionStatus === "SUCCESS") {
            statistics.success++;
        } else if (x.executionStatus === "FAILED") {
            statistics.failed++;
        } else if (x.executionStatus === "ABORTED") {
            statistics.aborted++;
        } else {
            statistics.pending++;
        }
    });

    statistics.chartData = [
        statistics.success,
        statistics.failed,
        statistics.pending,
        statistics.aborted
    ];

    return statistics;
}

import { getAllScenarios } from "./dataService";

export function getTotalStatistics(): Statistics {
    return gatherStatistics(getAllScenarios());
}

export function getScenarioTitleStatusClass(scenario: Scenario): string {
    switch (scenario.executionStatus) {
        case "SUCCESS":
            return "";
        case "FAILED":
            return "failed";
        case "ABORTED":
            return "aborted";
        default:
            return "pending";
    }
}

export function getNumberOfFailedCases(scenario: Scenario): string {
    const nCases = scenario.scenarioCases.length;
    if (nCases === 1) return "";

    let failedCases = 0;
    scenario.scenarioCases.forEach(aCase => {
        if (aCase.status === "FAILED") failedCases++;
    });

    if (failedCases < nCases) {
        return " " + failedCases + " OF " + nCases + " CASES ";
    }
    return " ALL CASES";
}

export function getNumberOfAbortedCases(scenario: Scenario): string {
    const nCases = scenario.scenarioCases.length;
    if (nCases === 1) return "";

    let abortedCases = 0;
    scenario.scenarioCases.forEach(aCase => {
        if (aCase.status === "ABORTED") abortedCases++;
    });

    if (abortedCases < nCases) {
        return " " + abortedCases + " OF " + nCases + " CASES ";
    }
    return " ALL CASES";
}

export function getScenarioCaseTitleStatusClass(status: string): string {
    return status === "FAILED" ? "failed" : "";
}

export { getReadableExecutionStatus };
