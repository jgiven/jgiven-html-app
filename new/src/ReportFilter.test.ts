import { repository } from "./repository";
import { ScenarioModel } from "./reportModel";
import { filterByStatus } from "./ReportFilter";
import { ScenarioStatusFilter } from "./components/ScenarioOverview/ScenarioCollectionHead";
import { describe, it, vitest, expect } from "vitest";

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
    it("should filter by status", () => {
        vitest.spyOn(repository, "getReport").mockReturnValue(fullReport);

        expect(filterByStatus(ScenarioStatusFilter.SUCCESS)).toEqual([
            fullReport.scenarios[0].scenarios[0]
        ]);
    });

    it("should ignore undefined status", () => {
        vitest.spyOn(repository, "getReport").mockReturnValue(fullReport);

        expect(filterByStatus(ScenarioStatusFilter.SUCCESS, undefined)).toEqual([
            fullReport.scenarios[0].scenarios[0]
        ]);
    });

    it("should return the full report if no status is provided", () => {
        vitest.spyOn(repository, "getReport").mockReturnValue(fullReport);

        expect(filterByStatus()).toEqual(fullReport.scenarios.flatMap(s => s.scenarios));
    });

    it("should return the full report if null is provided", () => {
        vitest.spyOn(repository, "getReport").mockReturnValue(fullReport);

        expect(filterByStatus(undefined)).toEqual(fullReport.scenarios.flatMap(s => s.scenarios));
    });
});

function createSampleScenario(scenario: Partial<ScenarioModel>): ScenarioModel {
    return {
        className: "com.tngtech.jgiven.junit5.JUnit5ExecutorTest",
        testMethodName: "after_stage_methods_of_stages_following_failing_stages_are_ignored",
        description: "after stage methods of stages following failing stages are ignored",
        tagIds: ["com.tngtech.jgiven.tags.FeatureJUnit5"],
        explicitParameters: [],
        derivedParameters: [],
        scenarioCases: [
            {
                caseNr: 1,
                steps: [
                    {
                        name: "a failing test with $ steps",
                        words: [
                            {
                                value: "Given",
                                isIntroWord: true
                            },
                            {
                                value: "a failing test with"
                            },
                            {
                                value: "2",
                                argumentInfo: {
                                    argumentName: "n",
                                    formattedValue: "2"
                                }
                            },
                            {
                                value: "steps"
                            }
                        ],
                        status: "PASSED",
                        durationInNanos: 429103,
                        depth: 0,
                        parentFailed: false
                    },
                    {
                        name: "the test has $ failing stages",
                        words: [
                            {
                                value: "and",
                                isIntroWord: true
                            },
                            {
                                value: "the test has"
                            },
                            {
                                value: "2",
                                argumentInfo: {
                                    argumentName: "n",
                                    formattedValue: "2"
                                }
                            },
                            {
                                value: "failing stages"
                            }
                        ],
                        status: "PASSED",
                        durationInNanos: 413003,
                        depth: 0,
                        parentFailed: false
                    },
                    {
                        name: "stage $ has a failing after stage method",
                        words: [
                            {
                                value: "and",
                                isIntroWord: true
                            },
                            {
                                value: "stage"
                            },
                            {
                                value: "2",
                                argumentInfo: {
                                    argumentName: "i",
                                    formattedValue: "2"
                                }
                            },
                            {
                                value: "has a failing after stage method"
                            }
                        ],
                        status: "PASSED",
                        durationInNanos: 297902,
                        depth: 0,
                        parentFailed: false
                    },
                    {
                        name: "step $ fails",
                        words: [
                            {
                                value: "and",
                                isIntroWord: true
                            },
                            {
                                value: "step"
                            },
                            {
                                value: "1",
                                argumentInfo: {
                                    argumentName: "i",
                                    formattedValue: "1"
                                }
                            },
                            {
                                value: "fails"
                            }
                        ],
                        status: "PASSED",
                        durationInNanos: 1022008,
                        depth: 0,
                        parentFailed: false
                    },
                    {
                        name: "the test is executed with JUnit5",
                        words: [
                            {
                                value: "When",
                                isIntroWord: true
                            },
                            {
                                value: "the test is executed with JUnit5"
                            }
                        ],
                        status: "PASSED",
                        durationInNanos: 518574231,
                        depth: 0,
                        parentFailed: false
                    },
                    {
                        name: "the test fails",
                        words: [
                            {
                                value: "Then",
                                isIntroWord: true
                            },
                            {
                                value: "the test fails"
                            }
                        ],
                        status: "PASSED",
                        durationInNanos: 1932714,
                        depth: 0,
                        parentFailed: false
                    },
                    {
                        name: "step $ is reported as failed",
                        words: [
                            {
                                value: "and",
                                isIntroWord: true
                            },
                            {
                                value: "step"
                            },
                            {
                                value: "1",
                                argumentInfo: {
                                    argumentName: "i",
                                    formattedValue: "1"
                                }
                            },
                            {
                                value: "is reported as failed"
                            }
                        ],
                        status: "PASSED",
                        durationInNanos: 1136408,
                        depth: 0,
                        parentFailed: false
                    },
                    {
                        name: "step $ is reported as skipped",
                        words: [
                            {
                                value: "and",
                                isIntroWord: true
                            },
                            {
                                value: "step"
                            },
                            {
                                value: "2",
                                argumentInfo: {
                                    argumentName: "i",
                                    formattedValue: "2"
                                }
                            },
                            {
                                value: "is reported as skipped"
                            }
                        ],
                        status: "PASSED",
                        durationInNanos: 287102,
                        depth: 0,
                        parentFailed: false
                    }
                ],
                explicitArguments: [],
                derivedArguments: [],
                status: "SUCCESS",
                durationInNanos: 525725382
            }
        ],
        casesAsTable: false,
        durationInNanos: 525725382,
        executionStatus: "SUCCESS",
        tags: [{}],
        classTitle: "J Unit 5 Executor",
        ...scenario
    };
}
