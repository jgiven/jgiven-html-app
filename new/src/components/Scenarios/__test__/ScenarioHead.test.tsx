import { render } from "@testing-library/react";
import { ScenarioHead } from "../ScenarioHead";
import { createScenarioModel } from "./scenarioTestData";
import { screen } from "../../../testUtils/enhancedScreen";
import { describe, it, expect } from "vitest";

describe("Scenario Head", () => {
    it("displays class title", () => {
        const classTitle = "The class title";
        const model = createScenarioModel({ classTitle });

        render(<ScenarioHead scenario={model} />);
        expect(screen.getByText(classTitle)).toBeVisible();
    });

    it("displays capitalized title", () => {
        const description = "scenario description";
        const expectedDisplayValue = "Scenario description";

        const model = createScenarioModel({ description });
        render(<ScenarioHead scenario={model} />);

        expect(screen.getByText(expectedDisplayValue)).toBeVisible();
    });

    it("displays checkbox icon if scenario has executionStatus SUCCESS", () => {
        const model = createScenarioModel({ executionStatus: "SUCCESS" });
        render(<ScenarioHead scenario={model} />);

        expect(screen.getAllIcons()).toHaveLength(1);
        expect(screen.getCheckboxIcon()).toBeVisible();
    });

    it("displays error icon if scenario has executionStatus FAILED", () => {
        const model = createScenarioModel({ executionStatus: "FAILED" });
        render(<ScenarioHead scenario={model} />);

        expect(screen.getAllIcons()).toHaveLength(1);
        expect(screen.getErrorIcon()).toBeVisible();
    });

    it("displays pending icon if scenario has executionStatus PENDING", () => {
        const model = createScenarioModel({ executionStatus: "PENDING" });
        render(<ScenarioHead scenario={model} />);

        expect(screen.getAllIcons()).toHaveLength(1);
        expect(screen.getPendingIcon()).toBeVisible();
    });
});
