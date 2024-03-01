import { ReportStatistics, ScenarioModel } from "../../reportModel";
import { MenuBar, ScenarioHead } from "../ScenarioOverview/ScenarioHead";
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
                                <ScenarioHead
                                    headers={{
                                        aboveHeader: props.description,
                                        header: props.title
                                    }}
                                    statistic={createStatistics(props.scenarios)}
                                    targets={{
                                        minusButtonTarget: () => {
                                            console.log("Collapsing stuff");
                                            setAllExpanded(ExpansionState.COLLAPSED);
                                        },
                                        plusButtonTarget: () => {
                                            console.log("Expanding stuff");
                                            setAllExpanded(ExpansionState.EXPANDED);
                                        },
                                        printButtonTarget: () => {
                                            console.error("print not implemented");
                                        },
                                        bookmarkButtonTarget: () => {
                                            console.error("bookmark not implemented");
                                        }
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
    return {
        numClasses: 1,
        numScenarios: 1,
        //        numFailedScenarios: Math.sign(
        //            findNumberOfCasesWithStatus(scenario.scenarioCases, "FAILED")
        //        ),
        numFailedScenarios: 1,
        numCases: 1, //scenario.scenarioCases.length,
        numFailedCases: 1, //findNumberOfCasesWithStatus(scenario.scenarioCases, "FAILED"),
        numSteps: 1, //scenario.scenarioCases.map(value => value.steps.length).reduce(sum),
        durationInNanos: 1, //scenario.durationInNanos,
        numPendingScenarios: 1,
        //Math.sign(
        //    findNumberOfCasesWithStatus(scenario.scenarioCases, "SCENARIO_PENDING")
        //),
        numSuccessfulScenarios: 1
        //Math.sign(
        //    findNumberOfCasesWithStatus(scenario.scenarioCases, "SUCCESS")
        //)
    };
}
