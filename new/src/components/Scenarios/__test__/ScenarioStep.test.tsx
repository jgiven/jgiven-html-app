import { render, screen } from "@testing-library/react";
import { createStepModel, createWord } from "./scenarioTestData";
import { ScenarioStep } from "../ScenarioStep";
import { describe, it, expect } from "vitest";

describe("ScenarioStep", () => {
    it("should display words in scenario step description separated by space", () => {
        const words = [
            createWord({ value: "cower" }),
            createWord({ value: "comfortable" }),
            createWord({ value: "front" }),
            createWord({ value: "pony" })
        ];
        const expectedDisplayValue = "cower comfortable front pony";

        render(<ScenarioStep step={createStepModel({ words })} />);

        expect(screen.getByText(expectedDisplayValue)).toBeVisible();
    });
});
