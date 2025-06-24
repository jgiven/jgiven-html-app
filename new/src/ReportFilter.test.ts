import { repository } from "./repository";
import { filterByStatus } from "./ReportFilter";
import { ScenarioStatusFilter } from "./components/ScenarioOverview/ScenarioCollectionHead";
import { createSampleScenario } from "./components/Scenarios/__test__/scenarioTestData";

describe("Report filter status filter", () => {
    const fullReport = {
        tagFile: { tagTypeMap: {}, tags: {} },
        scenarios: [
            {
                className: "com.tngtech.jgiven.junit5.JUnit5ExecutorTest",
                name: "J Unit 5 Executor",
                scenarios: [
                    createSampleScenario({ executionStatus: "SUCCESS" }),
                    createSampleScenario({ executionStatus: "FAILED" })
                ]
            },
            {
                className: "com.tngtech.jgiven.tests.TestScenarios",
                name: "Test Scenarios",
                scenarios: [createSampleScenario({ executionStatus: "FAILED" })]
            }
        ]
    };
    test("should filter by status", () => {
        jest.spyOn(repository, "getReport").mockReturnValue(fullReport);

        expect(filterByStatus(ScenarioStatusFilter.SUCCESS)).toEqual([
            fullReport.scenarios[0].scenarios[0]
        ]);
    });

    test("should ignore undefined status", () => {
        jest.spyOn(repository, "getReport").mockReturnValue(fullReport);

        expect(filterByStatus(ScenarioStatusFilter.SUCCESS, undefined)).toEqual([
            fullReport.scenarios[0].scenarios[0]
        ]);
    });

    test("should return the full report if no status is provided", () => {
        jest.spyOn(repository, "getReport").mockReturnValue(fullReport);

        expect(filterByStatus()).toEqual(fullReport.scenarios.flatMap(s => s.scenarios));
    });

    test("should return the full report if null is provided", () => {
        jest.spyOn(repository, "getReport").mockReturnValue(fullReport);

        expect(filterByStatus(undefined)).toEqual(fullReport.scenarios.flatMap(s => s.scenarios));
    });
});
