import { render, screen } from "@testing-library/react";
import { ScenarioOverview } from "../Scenarios/ScenarioOverview";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { vitest, describe, it, expect } from "vitest";

vitest.mock("./DonutChart", () => ({
    createReportCircle: () => null
}));

describe("<ScenarioOverview/>", () => {
    const reportName = "My report";
    const description = "My description";
    const title = "My title";

    it.skip("should only show failed scenarios after clicking the link to filter for failed scenarios", () => {
        render(
            <MemoryRouter>
                <ScenarioOverview reportName={reportName} title={title} description={description} />
            </MemoryRouter>
        );

        const failingTest = screen.getByText("A failing JUnit 5 test");
        expect(failingTest).toBeInTheDocument();

        const link = screen.getByLabelText("filter-for-successful-tests");
        userEvent.click(link);

        // Test seems to be a green mistakenly, because clicking on
        // screen.getByLabelText("filter-for-failed-tests") also leaves it green :(
        expect(failingTest).not.toBeInTheDocument();
    });
});
