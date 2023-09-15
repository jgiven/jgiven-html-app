import {ReportStatistics, ScenarioCaseModel, ScenarioModel} from "../../reportModel";
import {ScenarioOverview} from "../ScenarioOverview/ScenarioOverview";
import {Scenario} from "./Scenario";
import {useState} from "react";

export function SingleScenarioView(props: { reportName: string, scenario: ScenarioModel }) {
    const [expanded,setExpanded] = useState(false)
    return (
        <>
            <ScenarioOverview
                headers={{
                    aboveHeader: props.scenario.className,
                    header: props.scenario.description
                }}
                statistic={createStatistics(props.scenario)}
                targets={{
                    minusButtonTarget: () => {
                        console.log("Collapsing stuff");
                        setExpanded(false)
                    },
                    plusButtonTarget: () => {
                        console.log("Expanding stuff");
                        setExpanded(true)
                    },
                    printButtonTarget: () => {
                        console.error("print not implemented");
                    },
                    bookmarkButtonTarget: () => {
                        console.error("bookmark not implemented");
                    },
                }}/>
            <Scenario reportName={props.reportName} scenario={props.scenario} accordionExpansion={{expanded:expanded, setExpanded:setExpanded}}></Scenario>
        </>
    )
}

function createStatistics(scenario: ScenarioModel): ReportStatistics {
    return {
        numClasses: 1,
        numScenarios: 1,
        numFailedScenarios: Math.sign(findNumberOfCasesWithStatus(scenario.scenarioCases, "FAILED")),
        numCases: scenario.scenarioCases.length,
        numFailedCases: findNumberOfCasesWithStatus(scenario.scenarioCases, "FAILED"),
        numSteps: scenario.scenarioCases.map(value => value.steps.length).reduce(sum),
        durationInNanos: scenario.durationInNanos,
        numPendingScenarios: Math.sign(findNumberOfCasesWithStatus(scenario.scenarioCases, "SCENARIO_PENDING")),
        numSuccessfulScenarios: Math.sign(findNumberOfCasesWithStatus(scenario.scenarioCases, "SUCCESS"))
    }
}

function findNumberOfCasesWithStatus(scenarioCases: ScenarioCaseModel[], status: ScenarioCaseModel["status"]): number {
    return scenarioCases.filter(value => value.status === status).length;
}

function sum(left: number, right: number): number {
    return left + right;
}
