import type {ScenarioCaseModel, ScenarioModel, StepModel} from "../reportModel";
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";


export function Scenario(props: { scenario: ScenarioModel, expanded?: boolean }) {
    return props.scenario.scenarioCases.length == 1 ?
        (<SingleCaseScenario
                scenarioCase={props.scenario.scenarioCases[0]}
                summary={props.scenario.description}
                expanded={props.expanded ?? false}
            />
        )
        : (<div></div>);
}

function SingleCaseScenario(props: { scenarioCase: ScenarioCaseModel, expanded: boolean, summary: string }) {
    return (
        <div>
            <Accordion>
                <AccordionSummary>
                    <Typography>{props.summary}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {props.scenarioCase.steps.map((step: StepModel) => (<ScenarioStep step={step}></ScenarioStep>))}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

function ScenarioStep(props: { step: StepModel }) {
    return (
        <div>
            {props.step.words.map(word => word.value).join(" ")}
        </div>
    )
}
