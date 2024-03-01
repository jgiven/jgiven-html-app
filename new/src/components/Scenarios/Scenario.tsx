import type {ScenarioCaseModel, ScenarioModel, StepModel} from "../../reportModel";
import {Accordion, AccordionDetails, Box, Link, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {processWords} from "../../wordProcessor";
import {ExpansionState} from "./ScenarioOverview";
import {ScenarioHead} from "./ScenarioHead";
import {ScenarioCaption} from "./ScenarioCaption";
import {addRuntimeInSeconds} from "../utils";

export interface ScenarioProps {
    scenario: ScenarioModel;
    globalExpansionState: ExpansionState;
    onExpansionCallback: () => void;
    onCollapsionCallback: () => void;
    reportName?: string;
}

export function Scenario(props: ScenarioProps) {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (props.globalExpansionState === ExpansionState.COLLAPSED) {
            setExpanded(false);
        }
        if (props.globalExpansionState === ExpansionState.EXPANDED) {
            setExpanded(true);
        }
    }, [props.globalExpansionState]);

    const onExpansionChanged = useCallback(
        (isExpansion: boolean) => {
            setExpanded(isExpansion);
            isExpansion ? props.onExpansionCallback() : props.onCollapsionCallback();
        },
        [expanded]
    );

    return (
        <div
            id={`${props.scenario.className}#${props.scenario.testMethodName}`}
            aria-label={`Scenario ${props.scenario.description}`}
        >
            <Accordion expanded={expanded}>
                <ScenarioHead
                    scenario={props.scenario}
                    expanded={expanded}
                    setExpanded={onExpansionChanged}
                />

                <AccordionDetails aria-label="Scenario Steps">
                    {
                        props.scenario.scenarioCases.map((scenarioCase) => {
                                return <SingleCaseScenario
                                    scenarioCase={scenarioCase}
                                    reportName={props.reportName}
                                    summary={props.scenario.description}
                                    expanded={expanded}
                                    setExpanded={onExpansionChanged}
                                    className={props.scenario.className}
                                />
                            }
                        )
                    }
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

function SingleCaseScenario(props: {
    scenarioCase: ScenarioCaseModel;
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
    reportName?: string;
    summary: string;
    className: string;
}) {
    return (
            <Box sx={{marginLeft: "2em"}}>
                {props.scenarioCase.steps.map((step: StepModel, index) => (
                    <ScenarioStep key={index} step={step}></ScenarioStep>
                ))}
                <Typography align="right" variant="body2">
                    <Link
                        href={`#class/${props.className}`}
                        variant="inherit"
                        color="inherit"
                        underline="none"
                    >
                        {props.className}
                    </Link>
                </Typography>
            </Box>
    );
}

function ScenarioStep(props: { step: StepModel }) {
    const stepDescription = processWords(props.step.words);
    return (
        <Typography align={"left"}>
            {stepDescription} <ScenarioCaption>{addRuntimeInSeconds(props.step.durationInNanos)}</ScenarioCaption>
        </Typography>
    );
}


