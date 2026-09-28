(function () {
    var scenarios = [];
    for (var i = 1; i <= 45; i++) {
        scenarios.push({
            executionStatus: "SUCCESS",
            className: "com.example.page.PageTest",
            testMethodName: "page_scenario_" + i,
            description: "pagination scenario " + String(i).padStart(2, "0"),
            tagIds: [],
            explicitParameters: [],
            derivedParameters: [],
            scenarioCases: [
                {
                    caseNr: 1,
                    steps: [
                        {
                            name: "step",
                            words: [
                                { value: "Given", isIntroWord: true },
                                { value: "page " + i }
                            ],
                            status: "PASSED",
                            durationInNanos: 1000,
                            depth: 0,
                            parentFailed: false
                        }
                    ],
                    explicitArguments: [],
                    derivedArguments: [],
                    status: "SUCCESS",
                    durationInNanos: 1000
                }
            ],
            casesAsTable: false,
            durationInNanos: 1000000 + i
        });
    }

    jgivenReport.setAllScenarios([
        {
            className: "com.example.page.PageTest",
            name: "Page Test",
            scenarios: scenarios
        }
    ]);
})();
