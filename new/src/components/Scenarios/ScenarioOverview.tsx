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
    const allCases = scenarios.flatMap((scenario) => scenario.scenarioCases);
    const allSteps = allCases.flatMap((scenarioCase) => {scenarioCase.steps});
    const failedCases = allCases.filter((scenarioCase) => scenarioCase.status === "FAILED" );

    const failedScenarios = scenarios.filter((scenario) => scenario.scenarioCases.some((scenarioCase) => scenarioCase.status === "FAILED"));
    const pendingScenarios = scenarios.filter((scenario) => scenario.scenarioCases.some((scenarioCase) => scenarioCase.status === "SOME_STEPS_PENDING" || scenarioCase.status === "SCENARIO_PENDING"));
    return {
        numClasses: 1,
        numScenarios: scenarios.length,
                numFailedScenarios: failedScenarios.length,
        numCases: allCases.length,
        numFailedCases: failedCases.length,
        numSteps: allSteps.length,
        durationInNanos: 1, //scenario.durationInNanos,
        numPendingScenarios: pendingScenarios.length,
        //Math.sign(
        //    findNumberOfCasesWithStatus(scenario.scenarioCases, "SCENARIO_PENDING")
        //),
        numSuccessfulScenarios: 1
        //Math.sign(
        //    findNumberOfCasesWithStatus(scenario.scenarioCases, "SUCCESS")
        //)
    };
}
