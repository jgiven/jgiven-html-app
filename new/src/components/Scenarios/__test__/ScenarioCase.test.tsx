import { render, screen } from "@testing-library/react";
import { ScenarioCase } from "../ScenarioCase";
import { createScenarioCaseModel, createStepModel, createWord } from "./scenarioTestData";

describe("ScenarioCase", () => {
    it("should display class name", () => {
        const className = "name.of.my.class";
        render(<ScenarioCase className={className} scenarioCase={createScenarioCaseModel()} />);

        expect(screen.getByText(className)).toBeInTheDocument();
    });

    it("should display all scenario steps", () => {
        const singleWordScenarioDescriptions = ["marine", "debug", "grind", "trivial", "timetable"];

        const steps = singleWordScenarioDescriptions.map(description =>
            createStepModel({ words: [createWord({ value: description })] })
        );

        render(<ScenarioCase className={""} scenarioCase={createScenarioCaseModel({ steps })} />);

        singleWordScenarioDescriptions.forEach(description => {
            expect(screen.getByText(description)).toBeVisible();
        });
    });
});
