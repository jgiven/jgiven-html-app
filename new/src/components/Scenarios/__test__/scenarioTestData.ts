import {
    ReportStatistics,
    ScenarioCaseModel,
    ScenarioModel,
    StepModel,
    Word
} from "../../../reportModel";

export function createReportStatistics(props?: Partial<ReportStatistics>): ReportStatistics {
    return {
        numScenarios: props?.numScenarios ?? 1,
        numFailedScenarios: props?.numFailedScenarios ?? 2,
        durationInNanos: props?.durationInNanos ?? 1000,
        numPendingScenarios: props?.numPendingScenarios ?? 3,
        numSuccessfulScenarios: props?.numSuccessfulScenarios ?? 4
    };
}

export function createWord(props?: Partial<Word>): Word {
    return {
        value: props?.value ?? "word value",
        isIntroWord: props?.isIntroWord,
        argumentInfo: props?.argumentInfo
    };
}

export function createStepModel(props?: Partial<StepModel>): StepModel {
    return {
        name: props?.name ?? "step name",
        words: props?.words ?? [],
        status: props?.status ?? "PASSED",
        durationInNanos: props?.durationInNanos ?? 0,
        depth: props?.depth ?? 0,
        parentFailed: props?.parentFailed ?? false,
        nestedSteps: props?.nestedSteps,
        extendedDescription: props?.extendedDescription,
        attachments: props?.attachments,
        isSectionTitle: props?.isSectionTitle,
        comment: props?.comment
    };
}

export function createScenarioCaseModel(props?: Partial<ScenarioCaseModel>): ScenarioCaseModel {
    return {
        caseNr: props?.caseNr ?? 0,
        steps: props?.steps ?? [],
        explicitArguments: props?.explicitArguments ?? [],
        derivedArguments: props?.derivedArguments ?? [],
        status: props?.status ?? "SUCCESS",
        errorMessage: props?.errorMessage,
        stackTrace: props?.stackTrace,
        durationInNanos: props?.durationInNanos ?? 0,
        description: props?.description
    };
}

export function createScenarioModel(props?: Partial<ScenarioModel>): ScenarioModel {
    return {
        className: props?.className ?? "class name",
        classTitle: props?.classTitle ?? "class title",
        testMethodName: props?.testMethodName ?? "test method name",
        description: props?.description ?? "scenario description",
        extendedDescription: props?.extendedDescription,
        tagIds: props?.tagIds ?? [],
        explicitParameters: props?.explicitParameters ?? [],
        derivedParameters: props?.derivedParameters ?? [],
        scenarioCases: props?.scenarioCases ?? [],
        casesAsTable: props?.casesAsTable ?? false,
        durationInNanos: props?.durationInNanos ?? 0,
        executionStatus: props?.executionStatus ?? "SUCCESS",
        tags: props?.tags ?? []
    };
}

export function createSampleScenario(scenario: Partial<ScenarioModel>): ScenarioModel {
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
