import { ReportStatistics, ScenarioModel } from "../../reportModel";
import { MenuBar, ScenarioCollectionHead } from "../ScenarioOverview/ScenarioCollectionHead";
import { Scenario } from "./Scenario";
import { useState } from "react";
import { Grid } from "@mui/material";
import { filterByStatus } from "../../ReportFilter";
import { useFilters } from "../../hooks/useFilters";
import { repository } from "../../repository";

export enum ExpansionState {
    COLLAPSED,
    INTERMEDIATE,
    EXPANDED
}

export function ScenarioOverview(props: {
    reportName: string;
    title: string;
    description: string;
}) {
    const [allExpanded, setAllExpanded] = useState<ExpansionState>(ExpansionState.COLLAPSED);
    const [filters] = useFilters();
    const scenarios = repository.getAllScenarios();

    return (
        <>
            <Grid container>
                <Grid item xs={12} md={1}>
                    <div style={{ height: "100vh" }}>
                        <MenuBar />
                    </div>
                </Grid>
                <Grid item xs={12} md={11}>
                    {" "}
                    {/* Workshop: Extract to new component.  */}
                    <Grid container direction="column">
                        <Grid item xs={12}>
                            <div style={{ height: "20em" }}>
                                <ScenarioCollectionHead
                                    headers={{
                                        aboveHeader: props.description,
                                        header: props.title
                                    }}
                                    statistic={createStatistics(scenarios)}
                                    onCollapseButtonClick={() => {
                                        setAllExpanded(ExpansionState.COLLAPSED);
                                    }}
                                    onExpandButtonClick={() => {
                                        setAllExpanded(ExpansionState.EXPANDED);
                                    }}
                                    onBookmarkButtonClick={() => {
                                        /* not implemented yet */
                                    }}
                                    onPrintButtonClick={() => {
                                        /* not implemented yet */
                                    }}
                                />
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ height: "40em" }}>
                            {filterByStatus(filters.status)
                                .sort(compareByClassTitleAndDescriptionFn)
                                .map(scenario => (
                                    <Scenario
                                        scenario={scenario}
                                        globalExpansionState={allExpanded}
                                        onCollapsionCallback={() => {
                                            setAllExpanded(ExpansionState.INTERMEDIATE);
                                        }}
                                        onExpansionCallback={() => {
                                            setAllExpanded(ExpansionState.INTERMEDIATE);
                                        }}
                                    />
                                ))}
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

function createStatistics(scenarios: ScenarioModel[]): ReportStatistics {
    const allCases = scenarios.flatMap(scenario => scenario.scenarioCases);
    const failedScenarios = scenarios.filter(scenario => scenario.executionStatus === "FAILED");
    const pendingScenarios = scenarios.filter(scenario => scenario.executionStatus === "PENDING");
    const successfulScenarios = scenarios.filter(
        scenario => scenario.executionStatus === "SUCCESS"
    );
    return {
        numScenarios: scenarios.length,
        numFailedScenarios: failedScenarios.length,
        durationInNanos: allCases
            .map(scenarioCase => scenarioCase.durationInNanos)
            .reduce((totalDuration, current) => totalDuration + current),
        numPendingScenarios: pendingScenarios.length,
        numSuccessfulScenarios: successfulScenarios.length
    };
}

const compareByClassTitleAndDescriptionFn = (a: ScenarioModel, b: ScenarioModel) => {
    const sortValueByClassTitle = a.classTitle.localeCompare(b.classTitle);
    if (sortValueByClassTitle === 0) {
        return a.description.localeCompare(b.description);
    }
    return sortValueByClassTitle;
};
