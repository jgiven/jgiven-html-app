import type { ScenarioCaseModel, ScenarioModel, StepModel } from "../../reportModel";
import { Accordion, AccordionDetails, Box, Grid, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { addRuntime } from "../utils";
import { StatusIcon } from "../StatusIconSelector";
import { processWords } from "../../wordProcessor";
import { ExpansionState } from "./ScenarioOverview";

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

    return props.scenario.scenarioCases.length === 1 ? (
        <div
            id={`${props.scenario.className}#${props.scenario.testMethodName}`}
            aria-label={`Scenario ${props.scenario.description}`}
        >
            <SingleCaseScenario
                scenarioCase={props.scenario.scenarioCases[0]}
                reportName={props.reportName}
                summary={props.scenario.description}
                expanded={expanded}
                setExpanded={onExpansionChanged}
                className={props.scenario.className}
            />
        </div>
    ) : (
        <div></div>
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
    const AccordionSummary = styled((props: AccordionSummaryProps) => (
        <MuiAccordionSummary
            expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
            {...props}
        />
    ))(({ theme }) => ({
        backgroundColor:
            theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
        flexDirection: "row-reverse",
        "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)"
        },
        "& .MuiAccordionSummary-content": {
            marginLeft: theme.spacing(1)
        }
    }));

    return (
        <Accordion expanded={props.expanded}>
            <AccordionSummary
                aria-label="Scenario Overview"
                onClick={() => {
                    props.setExpanded(!props.expanded);
                }}
            >
                <Grid container columnSpacing={1}>
                    <Grid item>
                        <Typography color={"grey"}>{props.reportName}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography>{processWords(props.summary)}</Typography>
                    </Grid>
                    <Grid>
                        <StatusIcon model={props.scenarioCase} />
                    </Grid>
                    <Grid>
                        <Caption>{addRuntime(props.scenarioCase)}</Caption>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails aria-label="Scenario Steps">
                <Box sx={{ marginLeft: "2em" }}>
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
            </AccordionDetails>
        </Accordion>
    );
}

function ScenarioStep(props: { step: StepModel }) {
    const stepDescription = processWords(props.step.words);
    return (
        <Typography align={"left"}>
            {stepDescription} <Caption>{addRuntime(props.step)}</Caption>
        </Typography>
    );
}

function Caption(props: PropsWithChildren) {
    return (
        <Typography display="inline" variant="caption" paragraph={false}>
            {props.children}
        </Typography>
    );
}
