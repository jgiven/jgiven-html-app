import type {ScenarioCaseModel, ScenarioModel, StepModel} from "../../reportModel";
import {Accordion, AccordionDetails, Box, Grid, Link, Typography} from "@mui/material";
import {styled} from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import {PropsWithChildren, useState} from "react";
import {addRuntime} from "../utils"
import {StatusIcon} from "../StatusIconSelector";



export function Scenario(props: { scenario: ScenarioModel, reportName?:string, expanded?: boolean }) {
    return props.scenario.scenarioCases.length === 1 ?
        (<SingleCaseScenario
                scenarioCase={props.scenario.scenarioCases[0]}
                reportName={props.reportName}
                summary={props.scenario.description}
                expanded={props.expanded ?? false}
                className={props.scenario.className}
            />
        )
        : (<div></div>);
}
export function SingleCaseScenario(props: { scenarioCase: ScenarioCaseModel, expanded: boolean, reportName?:string, summary: string, className: string }) {
    const [expanded, setExpanded] = useState(props.expanded);
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
        <Accordion expanded={expanded} >
            <AccordionSummary onClick={()=>{setExpanded(!expanded)}}>
                <Grid container columnSpacing={1}>
                    <Grid item><Typography color={"grey"}>{props.reportName}</Typography></Grid>
                    <Grid item><Typography>{props.summary}</Typography></Grid>
                    <Grid><StatusIcon model={props.scenarioCase}/></Grid>
                    <Grid><Caption>{addRuntime(props.scenarioCase)}</Caption></Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{"margin-left": '2em'}}>
                    {props.scenarioCase.steps.map((step: StepModel) => (<ScenarioStep step={step}></ScenarioStep>))}
                    <Typography align='right' variant='body2'>
                        <Link href={`#class/${props.className}`}  variant="inherit" color='inherit' underline='none'>
                            {props.className}
                        </Link>
                    </Typography>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
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
