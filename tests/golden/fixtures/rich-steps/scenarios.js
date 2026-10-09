jgivenReport.setAllScenarios([
    {
        className: "com.example.rich.RichStepsTest",
        name: "Rich Steps Test",
        scenarios: [
            {
                executionStatus: "FAILED",
                className: "com.example.rich.RichStepsTest",
                testMethodName: "rich_step_content",
                description: "rich step content scenario",
                tagIds: [],
                explicitParameters: [],
                derivedParameters: [],
                scenarioCases: [
                    {
                        caseNr: 1,
                        steps: [
                            {
                                name: "formatted code block",
                                words: [
                                    { value: "Given", isIntroWord: true },
                                    { value: "code is" },
                                    {
                                        value: "line1\nline2",
                                        argumentInfo: {
                                            argumentName: "code",
                                            formattedValue: "line1\nline2"
                                        }
                                    }
                                ],
                                status: "PASSED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: false
                            },
                            {
                                name: "inline data table",
                                words: [
                                    { value: "And", isIntroWord: true },
                                    { value: "table is" },
                                    {
                                        value: "table",
                                        argumentInfo: {
                                            argumentName: "table",
                                            formattedValue: "table",
                                            dataTable: {
                                                headerType: "ROW",
                                                data: [
                                                    ["Name", "Value"],
                                                    ["foo", "bar"]
                                                ]
                                            }
                                        }
                                    }
                                ],
                                status: "PASSED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: false,
                                extendedDescription: "Step extended description text",
                                comment: "Step comment text"
                            },
                            {
                                name: "slow when step",
                                words: [
                                    { value: "When", isIntroWord: true },
                                    { value: "slow action runs" }
                                ],
                                status: "FAILED",
                                durationInNanos: 25000000,
                                depth: 0,
                                parentFailed: false,
                                attachments: [
                                    {
                                        value: "attachments/screenshot.png",
                                        title: "Screenshot attachment",
                                        mediaType: "image/png",
                                        showDirectly: false
                                    },
                                    {
                                        value: "attachments/inline.png",
                                        title: "Inline image",
                                        mediaType: "image/png",
                                        showDirectly: true
                                    }
                                ],
                                nestedSteps: [
                                    {
                                        name: "nested child step",
                                        words: [
                                            { value: "And", isIntroWord: true },
                                            { value: "nested child step" }
                                        ],
                                        status: "FAILED",
                                        durationInNanos: 1000,
                                        depth: 1,
                                        parentFailed: false
                                    }
                                ],
                                expanded: false
                            },
                            {
                                name: "then assertion",
                                words: [
                                    { value: "Then", isIntroWord: true },
                                    { value: "assertion fails" }
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
                        errorMessage: "Rich step failure",
                        stackTrace: ["at RichStepsTest.rich_step_content(RichStepsTest.java:15)"],
                        durationInNanos: 30000000
                    }
                ],
                casesAsTable: false,
                durationInNanos: 30000000
            }
        ]
    }
]);
