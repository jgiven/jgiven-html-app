import { createReportStatistics } from "./scenarioTestData";
import { StatisticBreadcrumbs } from "../StatisticsBreadcrumbs";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

describe("StatisticsBreadcrumbs", () => {
    it("should display statistics", () => {
        const numSuccessfulScenarios = 1;
        const numFailedScenarios = 2;
        const numPendingScenarios = 3;
        const numScenarios = 4;
        const statistic = createReportStatistics({
            numSuccessfulScenarios,
            numFailedScenarios,
            numPendingScenarios,
            numScenarios
        });

        render(
            <MemoryRouter>
                <StatisticBreadcrumbs statistic={statistic} />
            </MemoryRouter>
        );

        expect(screen.getByText(`${numSuccessfulScenarios} Successful,`)).toBeVisible();
        expect(screen.getByText(`${numFailedScenarios} failed,`)).toBeVisible();
        expect(screen.getByText(`${numPendingScenarios} pending,`)).toBeVisible();
        expect(screen.getByText(`${numScenarios} Total`)).toBeVisible();
    });

    it.each([
        [1e7 + 1, "(0.010s)"],
        [1e9, "(1.000s)"],
        [234123455532, "(234.123s)"]
    ])(
        "should display the runtime in seconds if durationInNanos = %s",
        (durationInNanos, expectedDisplayValue) => {
            const statistic = createReportStatistics({ durationInNanos });
            render(
                <MemoryRouter>
                    <StatisticBreadcrumbs statistic={statistic} />
                </MemoryRouter>
            );

            expect(screen.getByText(expectedDisplayValue)).toBeVisible();
        }
    );

    it.each([[-1e16], [0], [100], [1e7]])(
        "should not display the duration if durationInNanos = %s",
        durationInNanos => {
            const statistic = createReportStatistics({ durationInNanos });
            render(
                <MemoryRouter>
                    <StatisticBreadcrumbs statistic={statistic} />
                </MemoryRouter>
            );

            expect(screen.queryByText("(", { exact: false })).not.toBeInTheDocument();
            expect(screen.queryByText(")", { exact: false })).not.toBeInTheDocument();
        }
    );
});
