import { render, screen, within } from "@testing-library/react";
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

    it.each([
        [1e7 + 1, "(0.010s)"],
        [1e9, "(1.000s)"],
        [234123455532, "(234.123s)"]
    ])(
        "should display the runtime in seconds if durationInNanos = %s",
        (durationInNanos, expectedDisplayValue) => {
            const word = "some word";
            render(
                <ScenarioStep
                    step={createStepModel({
                        words: [createWord({ value: word })],
                        durationInNanos
                    })}
                />
            );

            expect(screen.getByText(expectedDisplayValue)).toBeVisible();
        }
    );

    it.each([[-1e16], [0], [100], [1e7]])(
        "should not display the duration if durationInNanos = %s",
        durationInNanos => {
            const word = "some word";
            render(
                <ScenarioStep
                    step={createStepModel({
                        words: [createWord({ value: word })],
                        durationInNanos
                    })}
                />
            );

            expect(within(screen.getByText(word)).getByText("")).toBeInTheDocument();
        }
    );
});
