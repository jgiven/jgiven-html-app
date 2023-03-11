import type {ScenarioCaseModel, ScenarioModel, StepModel} from "../../reportModel";
import {Accordion, AccordionDetails, Box, Typography} from "@mui/material";
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';


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
    const AccordionSummary = styled((props: AccordionSummaryProps) => (
        <MuiAccordionSummary
            expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
            {...props}
        />
    ))(({ theme }) => ({
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
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ "margin-left":'2em', "text-align":'left'}}>
                        {props.scenarioCase.steps.map((step: StepModel) => (<ScenarioStep step={step}></ScenarioStep>))}
                    </Box>
                </AccordionDetails>
            </Accordion>
    );
}

function ScenarioStep(props: { step: StepModel }) {
    return (
        <Typography>
            {props.step.words.map(word => word.value).join(" ")} <Typography>{addRuntime(props.step)}</Typography>
        </Typography>
    )
}

function addRuntime(input: {durationInNanos:number}):string{
   return input.durationInNanos > 1e7 ? `(${Math.round(input.durationInNanos/1e6)}ms)` : "";
}
