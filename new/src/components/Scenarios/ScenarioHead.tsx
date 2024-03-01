import { Grid, Typography} from "@mui/material";
import { ScenarioModel} from "../../reportModel";
import {processWords} from "../../wordProcessor";
import {StatusIcon} from "../StatusIconSelector";
import {addRuntime} from "../utils";
import {styled} from "@mui/material/styles";
import MuiAccordionSummary, {AccordionSummaryProps} from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import {ScenarioCaption} from "./ScenarioCaption";

export function ScenarioHead(props: {
    scenario: ScenarioModel;
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
    reportName?: string;
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

    return <AccordionSummary
        aria-label="Scenario Overview"
        onClick={() => {
            props.setExpanded(!props.expanded);
        }}
    >
        <Grid container columnSpacing={1}>
            <Grid item>
                <Typography color={"grey"}>{props.scenario.classTitle}</Typography>
            </Grid>
            <Grid item>
                <Typography>{processWords(props.scenario.description)}</Typography>
            </Grid>
            <Grid>
                <StatusIcon executionStatus={props.scenario.executionStatus} />
            </Grid>
            <Grid>
                <ScenarioCaption>{addRuntime(props.scenario.scenarioCases[0])}</ScenarioCaption>
            </Grid>
        </Grid>
    </AccordionSummary>
}