import { ReportStatistics, ScenarioModel } from "../../reportModel";
import { MenuBar, ScenarioCollectionHead } from "../ScenarioOverview/ScenarioCollectionHead";
import { Scenario } from "./Scenario";
import { useState } from "react";
import { Grid } from "@mui/material";

export enum ExpansionState {
    COLLAPSED,
    INTERMEDIATE,
    EXPANDED
}
export function ScenarioOverview(props: {
    reportName: string;
    title: string;
    description: string;
    scenarios: ScenarioModel[];
}) {
    const [allExpanded, setAllExpanded] = useState<ExpansionState>(ExpansionState.COLLAPSED);
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
                                    statistic={createStatistics(props.scenarios)}
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
                            {props.scenarios.map(scenario => {
                                return (
                                    <Scenario
                                        reportName={props.reportName}
                                        scenario={scenario}
                                        globalExpansionState={allExpanded}
                                        onCollapsionCallback={() => {
                                            setAllExpanded(ExpansionState.INTERMEDIATE);
                                        }}
                                        onExpansionCallback={() => {
                                            setAllExpanded(ExpansionState.INTERMEDIATE);
                                        }}
                                    ></Scenario>
                                );
                            })}
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
