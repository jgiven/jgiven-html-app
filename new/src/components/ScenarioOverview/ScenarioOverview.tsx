import type {ReportStatistics} from "../../reportModel";
import {Breadcrumbs, Divider, Grid, Link, List, ListItem, ListItemText, Typography} from "@mui/material";
import CheckIcon from '@mui/icons-material/CheckBox';
import ErrorIcon from '@mui/icons-material/Error';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import {addRuntime} from "../utils";
import {createReportCircle} from "./DonutChart";
import {renderSymbols} from "./OverviewSymbols";
import {useEffect} from "react";

export function ScenarioOverview(props: { statistic: ReportStatistics }) {
    useEffect(() => {
        componentDidMount();
    }, []);
    return (
        <List component="nav" aria-label="jgiven-overview">
            <ListItem button>
                <Grid container>
                    <Grid item>
                        {getTopLevel()}
                    </Grid>
                    <Grid item sx={{ flexGrow: 1 }} />
                    <Grid item>
                        {createReportCircle(props)}
                    </Grid>
                </Grid>
            </ListItem>
            <Divider />
            <ListItem button>
                <ListItemText primary={getBreadcrumbs(props)} />
            </ListItem>
            <Grid container justifyContent={"flex-end"} alignItems={"center"}>
                <canvas id={"symbol-canvas"} width={"50"} height={"2"}/>
            </Grid>
        </List>
    )
}

function getTopLevel() {
    return (
        <Typography variant="h4">All Scenarios</Typography>
    )
}


function getBreadcrumbs(props: { statistic: ReportStatistics}) {
    return (
        <Breadcrumbs separator=" " aria-label="breadcrumb">
            <Link underline="hover" color={"black"} href={"/TODO"}>
                <CheckIcon sx={{ mr: 0.5}} fontSize={"small"} />
                {props.statistic.numSuccessfulScenarios} Successful,
            </Link>
            <Link underline="hover" color={"red"} href={"/TODO"}>
                <ErrorIcon sx={{ mr: 0.5 }} fontSize={"small"} />
                {props.statistic.numFailedScenarios} failed,
            </Link>
            <Link underline="hover" color={"grey"} href={"/"}>
                <DoNotDisturbAltIcon sx={{ mr: 0.5 }} fontSize={"small"} />
                {props.statistic.numPendingScenarios} pending,
            </Link>
            <Typography color="text.primary">
                {props.statistic.numScenarios} Total
            </Typography>
            <Typography color={"text.primary"}>
                {addRuntime(props.statistic)}
            </Typography>
        </Breadcrumbs>
    )
}

function componentDidMount() {
    const canvas = document.getElementById("symbol-canvas") as HTMLCanvasElement
    const ctx = canvas.getContext("2d")
    if (ctx) {
        renderSymbols(ctx, canvas);
    }
}
