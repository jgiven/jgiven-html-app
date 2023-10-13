import type { ReportStatistics } from "../../reportModel";
import {
    Box,
    Breadcrumbs,
    Button,
    Divider,
    Grid,
    Link,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import CheckIcon from "@mui/icons-material/CheckBox";
import ErrorIcon from "@mui/icons-material/Error";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { addRuntime } from "../utils";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import { createReportCircle } from "./DonutChart";
import React, { MouseEventHandler } from "react";
import { processWords } from "../../wordProcessor";

export interface ScenarioOverviewProps {
    statistic: ReportStatistics;
    targets: ActionButtonTargets;
    headers: Headers;
}

interface ActionButtonTargets {
    minusButtonTarget: MouseEventHandler;
    plusButtonTarget: MouseEventHandler;
    printButtonTarget: MouseEventHandler;
    bookmarkButtonTarget: MouseEventHandler;
}

interface Headers {
    aboveHeader?: string;
    header: string;
    belowHeader?: string;
}

export function ScenarioOverview(props: ScenarioOverviewProps) {
    return (
        <List>
            <ListItem>
                <Grid container direction={"row"} justifyContent="flex-end" alignItems="flex-start">
                    <Grid item xs={12} sm={8}>
                        <ScenarioTitles headers={props.headers} />
                    </Grid>
                    <Grid item sx={{ flexGrow: 1 }} />
                    <Grid item>{createReportCircle(props)}</Grid>
                    <Grid item>
                        <ScenarioActionButtons targets={props.targets} />
                    </Grid>
                </Grid>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemText primary={StatisticBreadcrumbs(props)} />
            </ListItem>
            <ListItem>
                <canvas id={"symbol-canvas"} width={"50"} height={"2"} />
            </ListItem>
        </List>
    );
}

function ScenarioTitles(props: { headers: Headers }) {
    return (
        <Grid container>
            <Grid item xs={12}>
                {/*TODO: may there be cases, where we should capitalize?*/}
                <Typography variant="h6" color="grey">
                    {props.headers.aboveHeader}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h4">{processWords(props.headers.header)}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" color="grey">
                    {processWords(props.headers.belowHeader)}
                </Typography>
            </Grid>
        </Grid>
    );
}

function ScenarioActionButtons(props: { targets: ActionButtonTargets }) {
    return (
        <Grid container>
            <Grid item>
                <ScenarioOverviewItem action={props.targets.minusButtonTarget}>
                    <RemoveIcon fontSize="inherit" />
                </ScenarioOverviewItem>
            </Grid>
            <Grid item>
                <ScenarioOverviewItem action={props.targets.plusButtonTarget}>
                    <AddIcon></AddIcon>
                </ScenarioOverviewItem>
            </Grid>
            <Grid item>
                <ScenarioOverviewItem action={props.targets.printButtonTarget}>
                    <PrintOutlinedIcon fontSize="inherit" />
                </ScenarioOverviewItem>
            </Grid>
            <Grid item>
                <ScenarioOverviewItem action={props.targets.bookmarkButtonTarget}>
                    <BookmarkOutlinedIcon fontSize="inherit" />
                </ScenarioOverviewItem>
            </Grid>
        </Grid>
    );
}

function ScenarioOverviewItem(props: { children: React.ReactNode; action: MouseEventHandler }) {
    const sx = {
        width: "12px", // or some other value
        height: "12px", // same as width
        p: 0.01,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid grey",
        borderRadius: 1,
        marginRight: "5px"
    };
    return (
        <Box sx={sx} component="span">
            <Button
                className="actionPanelButton"
                color="inherit"
                sx={{
                    "&:hover": { textDecoration: "none", color: "inherit" },
                    "min-width": "1px",
                    "min-height": "1px",
                    height: sx.height
                }}
                onClick={props.action}
            >
                {props.children}
            </Button>
        </Box>
    );
}

function StatisticBreadcrumbs(props: { statistic: ReportStatistics }) {
    return (
        <Breadcrumbs separator=" " aria-label="breadcrumb">
            <Link underline="hover" color={"black"} href={"/TODO"}>
                <CheckIcon sx={{ mr: 0.5 }} fontSize={"small"} />
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
            <Typography color="text.primary">{props.statistic.numScenarios} Total</Typography>
            <Typography color={"text.primary"}>{addRuntime(props.statistic)}</Typography>
        </Breadcrumbs>
    );
}
