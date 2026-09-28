(function () {
    function simpleStep(introWord, text, extra) {
        var step = {
            name: text,
            words: [
                { value: introWord, isIntroWord: true },
                { value: text }
            ],
            status: "PASSED",
            durationInNanos: 1000,
            depth: 0,
            parentFailed: false
        };
        if (extra) {
            for (var key in extra) {
                if (extra.hasOwnProperty(key)) {
                    step[key] = extra[key];
                }
            }
        }
        return step;
    }

    function singleCase(steps, status) {
        return {
            caseNr: 1,
            steps: steps,
            explicitArguments: [],
            derivedArguments: [],
            status: status || "SUCCESS",
            durationInNanos: 1000000
        };
    }

    jgivenReport.setAllScenarios([
        {
            className: "com.example.alpha.AlphaTest",
            name: "Alpha Test",
            scenarios: [
                {
                    executionStatus: "SUCCESS",
                    className: "com.example.alpha.AlphaTest",
                    testMethodName: "alpha_success",
                    description: "alpha success scenario",
                    tagIds: ["tag-feature-ui"],
                    explicitParameters: [],
                    derivedParameters: [],
                    scenarioCases: [singleCase([simpleStep("Given", "alpha is ready"), simpleStep("Then", "alpha succeeds")])],
                    casesAsTable: false,
                    durationInNanos: 2000000
                },
                {
                    executionStatus: "FAILED",
                    className: "com.example.alpha.AlphaTest",
                    testMethodName: "alpha_failed",
                    description: "alpha failed scenario",
                    tagIds: ["tag-feature-api"],
                    explicitParameters: [],
                    derivedParameters: [],
                    scenarioCases: [
                        {
                            caseNr: 1,
                            steps: [simpleStep("Given", "alpha fails")],
                            explicitArguments: [],
                            derivedArguments: [],
                            status: "FAILED",
                            errorMessage: "Alpha assertion failed",
                            stackTrace: ["at AlphaTest.alpha_failed(AlphaTest.java:10)"],
                            durationInNanos: 3000000
                        }
                    ],
                    casesAsTable: false,
                    durationInNanos: 3000000
                }
            ]
        },
        {
            className: "com.example.beta.BetaTest",
            name: "Beta Test",
            scenarios: [
                {
                    executionStatus: "SCENARIO_PENDING",
                    className: "com.example.beta.BetaTest",
                    testMethodName: "beta_pending",
                    description: "beta pending scenario",
                    tagIds: ["tag-issue-1"],
                    explicitParameters: [],
                    derivedParameters: [],
                    scenarioCases: [singleCase([simpleStep("Given", "beta is pending")], "PENDING")],
                    casesAsTable: false,
                    durationInNanos: 4000000
                },
                {
                    executionStatus: "ABORTED",
                    className: "com.example.beta.BetaTest",
                    testMethodName: "beta_aborted",
                    description: "beta aborted scenario",
                    tagIds: ["tag-issue-2"],
                    explicitParameters: [],
                    derivedParameters: [],
                    scenarioCases: [singleCase([simpleStep("Given", "beta is aborted")], "ABORTED")],
                    casesAsTable: false,
                    durationInNanos: 5000000
                }
            ]
        },
        {
            className: "com.example.gamma.GammaTest",
            name: "Gamma Test",
            scenarios: [
                {
                    executionStatus: "SUCCESS",
                    className: "com.example.gamma.GammaTest",
                    testMethodName: "gamma_untagged",
                    description: "gamma untagged scenario",
                    tagIds: [],
                    explicitParameters: [],
                    derivedParameters: [],
                    scenarioCases: [singleCase([simpleStep("Given", "gamma has no tags")])],
                    casesAsTable: false,
                    durationInNanos: 6000000
                }
            ]
        },
        {
            className: "com.example.delta.DeltaTest",
            name: "Delta Test",
            scenarios: [
                {
                    executionStatus: "SUCCESS",
                    className: "com.example.delta.DeltaTest",
                    testMethodName: "delta_multi_tag",
                    description: "delta multi tag scenario",
                    tagIds: ["tag-feature-ui", "tag-issue-1"],
                    explicitParameters: [],
                    derivedParameters: [],
                    scenarioCases: [singleCase([simpleStep("Given", "delta has multiple tags")])],
                    casesAsTable: false,
                    durationInNanos: 7000000
                }
            ]
        },
        {
            className: "com.example.search.SearchTest",
            name: "Search Test",
            scenarios: [
                {
                    executionStatus: "SUCCESS",
                    className: "com.example.search.SearchTest",
                    testMethodName: "search_keyword",
                    description: "golden search keyword here",
                    tagIds: [],
                    explicitParameters: [],
                    derivedParameters: [],
                    scenarioCases: [singleCase([simpleStep("Given", "searchable content")])],
                    casesAsTable: false,
                    durationInNanos: 8000000
                }
            ]
        },
        {
            className: "com.example.meta.MetaTest",
            name: "Meta Test",
            scenarios: [
                {
                    executionStatus: "SUCCESS",
                    className: "com.example.meta.MetaTest",
                    testMethodName: "extended_description",
                    description: "scenario with extended description",
                    extendedDescription: "This scenario has extra context.",
                    tagIds: ["tag-sub-only"],
                    explicitParameters: [],
                    derivedParameters: [],
                    scenarioCases: [singleCase([simpleStep("Given", "meta scenario runs")])],
                    casesAsTable: false,
                    durationInNanos: 9000000
                }
            ]
        }
    ]);
})();
