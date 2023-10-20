import { ReportStatistics, ScenarioCaseModel, ScenarioModel } from "../../reportModel";
import {MenuBar, ScenarioOverview} from "../ScenarioOverview/ScenarioOverview";
import { Scenario } from "./Scenario";
import { useState } from "react";
import {Grid} from "@mui/material";

export function SingleScenarioView(props: { reportName: string; scenario: ScenarioModel }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <>
            <Grid container>
                <Grid item xs={12} md={1}>
                    <div style={{ height: '100vh'}}>
                        <MenuBar/>
                    </div>
                </Grid>
                <Grid item xs={12} md={11}>
                    <Grid container direction="column">
                        <Grid item xs={12}>
                            <div style={{ height: '20vh'}}>
                                <ScenarioOverview
                                    headers={{
                                        aboveHeader: props.scenario.className,
                                        header: props.scenario.description
                                    }}
                                    statistic={createStatistics(props.scenario)}
                                    targets={{
                                        minusButtonTarget: () => {
                                            console.log("Collapsing stuff");
                                            setExpanded(false);
                                        },
                                        plusButtonTarget: () => {
                                            console.log("Expanding stuff");
                                            setExpanded(true);
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
                        <div style={{ height: '50vh'}}>
                            <Scenario
                                reportName={props.reportName}
                                scenario={props.scenario}
                                accordionExpansion={{ expanded: expanded, setExpanded: setExpanded }}
                            ></Scenario>
                        </div>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

function createStatistics(scenario: ScenarioModel): ReportStatistics {
    return {
        numClasses: 1,
        numScenarios: 1,
        numFailedScenarios: Math.sign(
            findNumberOfCasesWithStatus(scenario.scenarioCases, "FAILED")
        ),
        numCases: scenario.scenarioCases.length,
        numFailedCases: findNumberOfCasesWithStatus(scenario.scenarioCases, "FAILED"),
        numSteps: scenario.scenarioCases.map(value => value.steps.length).reduce(sum),
        durationInNanos: scenario.durationInNanos,
        numPendingScenarios: Math.sign(
            findNumberOfCasesWithStatus(scenario.scenarioCases, "SCENARIO_PENDING")
        ),
        numSuccessfulScenarios: Math.sign(
            findNumberOfCasesWithStatus(scenario.scenarioCases, "SUCCESS")
        )
    };
}

function findNumberOfCasesWithStatus(
    scenarioCases: ScenarioCaseModel[],
    status: ScenarioCaseModel["status"]
): number {
    return scenarioCases.filter(value => value.status === status).length;
}

function sum(left: number, right: number): number {
    return left + right;
}
