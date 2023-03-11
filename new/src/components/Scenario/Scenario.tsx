import type {ScenarioCaseModel, ScenarioModel, StepModel, StepStatus, ExecutionStatus} from "../../reportModel";
import {Accordion, AccordionDetails, Box, SxProps, Theme, Typography} from "@mui/material";
import {styled} from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import {PropsWithChildren} from "react";
import {addRuntime} from "../utils"
import {FontSizes, GreenCheckbox} from "../Icons/CheckMarks";
import ErrorIcon from "@mui/icons-material/Error";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";


export function Scenario(props: { scenario: ScenarioModel, expanded?: boolean }) {
    return props.scenario.scenarioCases.length === 1 ?
        (<SingleCaseScenario
                scenarioCase={props.scenario.scenarioCases[0]}
                summary={props.scenario.description}
                expanded={props.expanded ?? false}
            />
        )
        : (<div></div>);
}

function SingleCaseScenario(props: { scenarioCase: ScenarioCaseModel, expanded: boolean, summary: string }) {
    const AccordionSummary = styled((props: AccordionSummaryProps) => (
        <MuiAccordionSummary
            expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}
            {...props}
        />
    ))(({theme}) => ({
        backgroundColor:
            theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, .05)'
                : 'rgba(0, 0, 0, .03)',
        flexDirection: 'row-reverse',
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
            marginLeft: theme.spacing(1),
        },
    }));
    return (
        <Accordion>
            <AccordionSummary>
                <Typography>{props.summary}</Typography>
                <StatusIcon model={props.scenarioCase} />
                <Caption>{addRuntime(props.scenarioCase)}</Caption>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{"margin-left": '2em'}}>
                    {props.scenarioCase.steps.map((step: StepModel) => (<ScenarioStep step={step}></ScenarioStep>))}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
}

function StatusIcon(props: { model: {status: StepStatus | ExecutionStatus} ,sx?:SxProps<Theme>, fontSize?:FontSizes},) {
    switch (props.model.status) {
        case "SUCCESS":
        case "PASSED":
            return (<GreenCheckbox sx={{mr: 0.5, ...props.sx}} fontSize={props.fontSize ??  "small"}/>)
        case "FAILED":
            return (<ErrorIcon sx={{ mr: 0.5 }} fontSize={"small"} />);
        case "SCENARIO_PENDING":
        case "SOME_STEPS_PENDING":
        case "PENDING":
            return <DoNotDisturbAltIcon sx={{ mr: 0.5 }} fontSize={"small"} />;
        case "SKIPPED":
            return null;
    }
}

function ScenarioStep(props: { step: StepModel }) {
    return (
        <Typography align={'left'}>
            {props.step.words.map(word => word.value).join(" ")} <Caption>{addRuntime(props.step)}</Caption>
        </Typography>
    );
}

function Caption(props: PropsWithChildren) {
    return (
        <Typography display='inline' variant='caption' paragraph={false}>
            {props.children}
        </Typography>
    );
}
