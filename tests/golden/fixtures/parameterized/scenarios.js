jgivenReport.setAllScenarios([
    {
        className: "com.example.param.TableTest",
        name: "Table Test",
        scenarios: [
            {
                executionStatus: "SUCCESS",
                className: "com.example.param.TableTest",
                testMethodName: "cases_as_table",
                description: "parameterized table scenario",
                tagIds: [],
                explicitParameters: [],
                derivedParameters: ["name", "age"],
                scenarioCases: [
                    {
                        caseNr: 1,
                        steps: [
                            {
                                name: "user $ is $ years old",
                                words: [
                                    { value: "Given", isIntroWord: true },
                                    { value: "user" },
                                    {
                                        value: "Alice",
                                        argumentInfo: { parameterName: "name", formattedValue: "Alice" }
                                    },
                                    { value: "is" },
                                    {
                                        value: "30",
                                        argumentInfo: { parameterName: "age", formattedValue: "30" }
                                    },
                                    { value: "years old" }
                                ],
                                status: "PASSED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: false
                            }
                        ],
                        explicitArguments: [],
                        derivedArguments: ["Alice", "30"],
                        status: "SUCCESS",
                        durationInNanos: 1000
                    },
                    {
                        caseNr: 2,
                        steps: [
                            {
                                name: "user $ is $ years old",
                                words: [
                                    { value: "Given", isIntroWord: true },
                                    { value: "user" },
                                    {
                                        value: "Bob",
                                        argumentInfo: { parameterName: "name", formattedValue: "Bob" }
                                    },
                                    { value: "is" },
                                    {
                                        value: "25",
                                        argumentInfo: { parameterName: "age", formattedValue: "25" }
                                    },
                                    { value: "years old" }
                                ],
                                status: "PASSED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: false
                            }
                        ],
                        explicitArguments: [],
                        derivedArguments: ["Bob", "25"],
                        status: "SUCCESS",
                        durationInNanos: 1000
                    },
                    {
                        caseNr: 3,
                        steps: [
                            {
                                name: "user $ is $ years old",
                                words: [
                                    { value: "Given", isIntroWord: true },
                                    { value: "user" },
                                    {
                                        value: "Carol",
                                        argumentInfo: { parameterName: "name", formattedValue: "Carol" }
                                    },
                                    { value: "is" },
                                    {
                                        value: "30",
                                        argumentInfo: { parameterName: "age", formattedValue: "30" }
                                    },
                                    { value: "years old" }
                                ],
                                status: "PASSED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: false
                            }
                        ],
                        explicitArguments: [],
                        derivedArguments: ["Carol", "30"],
                        status: "SUCCESS",
                        durationInNanos: 1000
                    },
                    {
                        caseNr: 4,
                        steps: [
                            {
                                name: "user $ is $ years old",
                                words: [
                                    { value: "Given", isIntroWord: true },
                                    { value: "user" },
                                    {
                                        value: "Dave",
                                        argumentInfo: { parameterName: "name", formattedValue: "Dave" }
                                    },
                                    { value: "is" },
                                    {
                                        value: "40",
                                        argumentInfo: { parameterName: "age", formattedValue: "40" }
                                    },
                                    { value: "years old" }
                                ],
                                status: "PASSED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: false
                            }
                        ],
                        explicitArguments: [],
                        derivedArguments: ["Dave", "40"],
                        status: "FAILED",
                        durationInNanos: 1000
                    }
                ],
                casesAsTable: true,
                durationInNanos: 4000
            }
        ]
    },
    {
        className: "com.example.param.CaseTest",
        name: "Case Test",
        scenarios: [
            {
                executionStatus: "SUCCESS",
                className: "com.example.param.CaseTest",
                testMethodName: "multi_case_params",
                description: "multi case parameterized scenario",
                tagIds: [],
                explicitParameters: ["color"],
                derivedParameters: [],
                scenarioCases: [
                    {
                        caseNr: 1,
                        steps: [
                            {
                                name: "color is set",
                                words: [
                                    { value: "Given", isIntroWord: true },
                                    { value: "color is set" }
                                ],
                                status: "PASSED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: false
                            }
                        ],
                        explicitArguments: ["red"],
                        derivedArguments: [],
                        status: "SUCCESS",
                        durationInNanos: 1000
                    },
                    {
                        caseNr: 2,
                        steps: [
                            {
                                name: "color is set",
                                words: [
                                    { value: "Given", isIntroWord: true },
                                    { value: "color is set" }
                                ],
                                status: "PASSED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: false
                            }
                        ],
                        explicitArguments: ["green"],
                        derivedArguments: [],
                        status: "SUCCESS",
                        durationInNanos: 1000
                    },
                    {
                        caseNr: 3,
                        steps: [
                            {
                                name: "color is set",
                                words: [
                                    { value: "Given", isIntroWord: true },
                                    { value: "color is set" }
                                ],
                                status: "PASSED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: false
                            }
                        ],
                        explicitArguments: ["blue"],
                        derivedArguments: [],
                        status: "SUCCESS",
                        durationInNanos: 1000
                    }
                ],
                casesAsTable: false,
                durationInNanos: 3000
            },
            {
                executionStatus: "SUCCESS",
                className: "com.example.param.CaseTest",
                testMethodName: "primitive_array_params",
                description: "primitive array parameters scenario",
                tagIds: [],
                explicitParameters: ["items"],
                derivedParameters: [],
                scenarioCases: [
                    {
                        caseNr: 1,
                        steps: [
                            {
                                name: "items are processed",
                                words: [
                                    { value: "Given", isIntroWord: true },
                                    { value: "items are processed" }
                                ],
                                status: "PASSED",
                                durationInNanos: 1000,
                                depth: 0,
                                parentFailed: false
                            }
                        ],
                        explicitArguments: [["a", "b", "c"]],
                        derivedArguments: [],
                        status: "SUCCESS",
                        durationInNanos: 1000
                    }
                ],
                casesAsTable: false,
                durationInNanos: 1000
            }
        ]
    }
]);
