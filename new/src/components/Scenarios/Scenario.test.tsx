import { render, screen } from "@testing-library/react";
import { ScenarioModel } from "../../reportModel";
import { Scenario } from "./Scenario";
import { processWords } from "../../wordProcessor";
import { ExpansionState } from "./ScenarioOverview";
import userEvent from "@testing-library/user-event";

afterEach(() => {
    jest.resetAllMocks();
});

const onExpansionCallback = jest.fn();
const onCollapsionCallback = jest.fn();

describe("Scenario accordion behavior", () => {
    test("accordion details are not visible when globalExpansionState is COLLAPSED", async () => {
        render(
            <Scenario
                scenario={model}
                globalExpansionState={ExpansionState.COLLAPSED}
                onExpansionCallback={onExpansionCallback}
                onCollapsionCallback={onCollapsionCallback}
            />
        );
        const accordion = await screen.findByLabelText("Scenario Overview");
        expect(accordion.attributes.getNamedItem("aria-expanded")?.value).toBe("false");
    });

    test("accordion details are visible when globalExpansionState is EXPANDED", async () => {
        render(
            <Scenario
                scenario={model}
                globalExpansionState={ExpansionState.EXPANDED}
                onExpansionCallback={onExpansionCallback}
                onCollapsionCallback={onCollapsionCallback}
            />
        );
        const accordion = await screen.findByLabelText("Scenario Overview");
        expect(accordion.attributes.getNamedItem("aria-expanded")?.value).toBe("true");
    });

    test("onExpansionCallback is invoked when clicking on the header of a collapsed scenario", async () => {
        render(
            <Scenario
                scenario={model}
                globalExpansionState={ExpansionState.COLLAPSED}
                onExpansionCallback={onExpansionCallback}
                onCollapsionCallback={onCollapsionCallback}
            />
        );
        const scenarioOverview = await screen.findByLabelText("Scenario Overview");
        userEvent.click(scenarioOverview);
        expect(onExpansionCallback).toHaveBeenCalled();
    });

    test("onCollapsionCallback is invoked when clicking on the header of an expanded scenario", async () => {
        render(
            <Scenario
                scenario={model}
                globalExpansionState={ExpansionState.EXPANDED}
                onExpansionCallback={onExpansionCallback}
                onCollapsionCallback={onCollapsionCallback}
            />
        );
        const scenarioOverview = await screen.findByLabelText("Scenario Overview");
        userEvent.click(scenarioOverview);
        expect(onCollapsionCallback).toHaveBeenCalled();
    });
});

test("Scenario displays steps", async () => {
    render(
        <Scenario
            scenario={model}
            globalExpansionState={ExpansionState.EXPANDED}
            onExpansionCallback={onExpansionCallback}
            onCollapsionCallback={onCollapsionCallback}
        />
    );
    const textElement = await screen.findByText(
        model.scenarioCases[0].steps[0].words.flatMap(word => word.value).join(" ")
    );
    expect(textElement).toBeInTheDocument();
});

test("Scenario capitalizes title", async () => {
    render(
        <Scenario
            scenario={model}
            globalExpansionState={ExpansionState.EXPANDED}
            onExpansionCallback={onExpansionCallback}
            onCollapsionCallback={onCollapsionCallback}
        />
    );
    const textElement = await screen.findByText(processWords(model.description));
    expect(textElement).toBeInTheDocument();
});

const model: ScenarioModel = {
    classTitle: "classTitle",
    executionStatus: "SUCCESS",
    tags: [],
    className: "testClass",
    testMethodName: "testMethod",
    description: "this is a description",
    extendedDescription: "this is an extended description",
    tagIds: ["tag1", "tag2"],
    explicitParameters: [],
    derivedParameters: [],
    scenarioCases: [
        {
            caseNr: 1,
            description: "case1",
            derivedArguments: [],
            explicitArguments: [],
            durationInNanos: 2001000,
            status: "SUCCESS",
            steps: [
                {
                    status: "PASSED",
                    durationInNanos: 2000000,
                    name: "Step1",
                    words: [{ value: "Step1", isIntroWord: true }],
                    depth: 0,
                    parentFailed: false
                }
            ]
        }
    ],
    casesAsTable: false,
    durationInNanos: 0
};
