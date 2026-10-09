jgivenReport.setAllScenarios([
    {
        className: "com.example.fail.FailureTest",
        name: "Failure Test",
        scenarios: [
            {
                executionStatus: "FAILED",
                className: "com.example.fail.FailureTest",
                testMethodName: "failed_with_stack",
                description: "failed scenario with stack trace",
                tagIds: [],
                explicitParameters: [],
                derivedParameters: [],
                scenarioCases: [
                    {
                        caseNr: 1,
                        steps: [
                            {
                                name: "a passing step",
                                words: [
                                    { value: "Given", isIntroWord: true },
                                    { value: "setup works" }
                                ],
                                status: "PASSED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: false
                            },
                            {
                                name: "a failing step",
                                words: [
                                    { value: "When", isIntroWord: true },
                                    { value: "action fails" }
                                ],
                                status: "FAILED",
                                durationInNanos: 15000000,
                                depth: 0,
                                parentFailed: false
                            },
                            {
                                name: "a skipped step",
                                words: [
                                    { value: "Then", isIntroWord: true },
                                    { value: "assertion skipped" }
                                ],
                                status: "SKIPPED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: true
                            }
                        ],
                        explicitArguments: [],
                        derivedArguments: [],
                        status: "FAILED",
                        errorMessage: "Expected value but got null",
                        stackTrace: [
                            "at FailureTest.failed_with_stack(FailureTest.java:42)",
                            "at org.junit.runners.ParentRunner.run(ParentRunner.java:50)"
                        ],
                        durationInNanos: 20000000
                    }
                ],
                casesAsTable: false,
                durationInNanos: 20000000
            }
        ]
    }
]);
