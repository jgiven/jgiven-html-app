import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Scenario } from "../Scenario";
import { ExpansionState } from "../ScenarioOverview";
import {
    createScenarioCaseModel,
    createScenarioModel,
    createStepModel,
    createWord
} from "./scenarioTestData";
import { afterEach, vitest, describe, it, expect } from "vitest";

afterEach(() => {
    vitest.resetAllMocks();
});

const onExpansionCallback = vitest.fn();
const onCollapsionCallback = vitest.fn();

describe("Scenario", () => {
    it("displays single scenario case", () => {
        const className = "my custom class name";
        const scenarioCases = [createScenarioCaseModel()];
        const model = createScenarioModel({ className, scenarioCases });

        render(
            <Scenario
                scenario={model}
                globalExpansionState={ExpansionState.EXPANDED}
                onExpansionCallback={onExpansionCallback}
                onCollapsionCallback={onCollapsionCallback}
            />
        );

        expect(screen.getByText(className)).toBeVisible();
    });

    describe("Scenario accordion behavior", () => {
        it("accordion details are not visible when globalExpansionState is COLLAPSED", async () => {
            const details = "some details";
            const model = createScenarioModel({
                scenarioCases: [
                    createScenarioCaseModel({
                        steps: [createStepModel({ words: [createWord({ value: details })] })]
                    })
                ]
            });
            render(
                <Scenario
                    scenario={model}
                    globalExpansionState={ExpansionState.COLLAPSED}
                    onExpansionCallback={onExpansionCallback}
                    onCollapsionCallback={onCollapsionCallback}
                />
            );
            const accordion = screen.getByLabelText("Scenario Overview");
            expect(accordion.attributes.getNamedItem("aria-expanded")?.value).toBe("false");
            expect(screen.queryByText(details)).not.toBeVisible();
        });

        it("accordion details are visible when globalExpansionState is EXPANDED", async () => {
            const details = "some details";
            const model = createScenarioModel({
                scenarioCases: [
                    createScenarioCaseModel({
                        steps: [createStepModel({ words: [createWord({ value: details })] })]
                    })
                ]
            });
            render(
                <Scenario
                    scenario={model}
                    globalExpansionState={ExpansionState.EXPANDED}
                    onExpansionCallback={onExpansionCallback}
                    onCollapsionCallback={onCollapsionCallback}
                />
            );
            const accordion = screen.getByLabelText("Scenario Overview");
            expect(accordion.attributes.getNamedItem("aria-expanded")?.value).toBe("true");
            expect(screen.queryByText(details)).toBeVisible();
        });

        it("onExpansionCallback is invoked when clicking on the header of a collapsed scenario", async () => {
            render(
                <Scenario
                    scenario={createScenarioModel()}
                    globalExpansionState={ExpansionState.COLLAPSED}
                    onExpansionCallback={onExpansionCallback}
                    onCollapsionCallback={onCollapsionCallback}
                />
            );
            const scenarioOverview = await screen.findByLabelText("Scenario Overview");
            await userEvent.click(scenarioOverview);
            expect(onExpansionCallback).toHaveBeenCalled();
        });

        it("onCollapsionCallback is invoked when clicking on the header of an expanded scenario", async () => {
            render(
                <Scenario
                    scenario={createScenarioModel()}
                    globalExpansionState={ExpansionState.EXPANDED}
                    onExpansionCallback={onExpansionCallback}
                    onCollapsionCallback={onCollapsionCallback}
                />
            );
            const scenarioOverview = await screen.findByLabelText("Scenario Overview");
            await userEvent.click(scenarioOverview);
            expect(onCollapsionCallback).toHaveBeenCalled();
        });
    });
});
