import type { ReportStatistics } from "../../reportModel";
import {
    Breadcrumbs,
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
import { useSearchParams } from "react-router-dom";
import {
    StyledContent,
    StyledDrawer,
    StyledIconButton,
    StyledIconContainer,
    StyledLink
} from "./ScenarioHead.styles";

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

export function ScenarioHead(props: ScenarioOverviewProps) {
    return (
        <div style={{ display: "flex" }}>
            <StyledContent>
                <List>
                    <ListItem>
                        <Grid
                            container
                            direction={"row"}
                            justifyContent="flex-end"
                            alignItems="flex-start"
                        >
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
            </StyledContent>
        </div>
    );
}

export function MenuBar() {
    return (
        <StyledDrawer variant="permanent">
            <List>
                <List>
                    <ListItem sx={{ paddingTop: 0.1, paddingBottom: 0.1 }}>
                        <ListItemText primary={<Typography variant="h6">SUMMARY</Typography>} />
                    </ListItem>
                    <List>
                        {["All Scenarios", "Failed Scenarios", "Pending Scenarios"].map(
                            (scenario, index) => (
                                <ListItem key={index} sx={{ paddingTop: 0.1, paddingBottom: 0.1 }}>
                                    <ListItemText
                                        primary={
                                            <Link
                                                href="http://localhost:3000"
                                                underline="none"
                                                sx={{ color: "inherit" }}
                                            >
                                                {scenario}
                                            </Link>
                                        }
                                    />
                                </ListItem>
                            )
                        )}
                    </List>
                </List>
                {/* Workshop: Use forEach to implement missing subitems. */}
                <ListItem>
                    <ListItemText primary={<Typography variant="h6">TAGS</Typography>} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={<Typography variant="h6">CLASSES</Typography>} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={<Typography variant="h6">BOOKMARKS</Typography>} />
                </ListItem>
            </List>
        </StyledDrawer>
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
                <ScenarioHeaderIcon action={props.targets.minusButtonTarget}>
                    <RemoveIcon fontSize="inherit" />
                </ScenarioHeaderIcon>
            </Grid>
            <Grid item>
                <ScenarioHeaderIcon action={props.targets.plusButtonTarget}>
                    <AddIcon />
                </ScenarioHeaderIcon>
            </Grid>
            <Grid item>
                <ScenarioHeaderIcon action={props.targets.printButtonTarget}>
                    <PrintOutlinedIcon fontSize="inherit" />
                </ScenarioHeaderIcon>
            </Grid>
            <Grid item>
                <ScenarioHeaderIcon action={props.targets.bookmarkButtonTarget}>
                    <BookmarkOutlinedIcon fontSize="inherit" />
                </ScenarioHeaderIcon>
            </Grid>
        </Grid>
    );
}

function ScenarioHeaderIcon(props: { children: React.ReactNode; action: MouseEventHandler }) {
    return (
        <StyledIconContainer>
            <StyledIconButton className="actionPanelButton" onClick={props.action}>
                {props.children}
            </StyledIconButton>
        </StyledIconContainer>
    );
}

export enum ScenarioStatusFilter {
    SUCCESS = "success",
    FAILURE = "failure",
    PENDING = "pending"
}

function StatisticBreadcrumbs(props: { statistic: ReportStatistics }) {
    const [_urlSearchParams, setUrlSearchParams] = useSearchParams();

    return (
        <Breadcrumbs separator=" " aria-label="breadcrumb">
            <StyledLink
                underline="hover"
                className="pseudo-link"
                color={"black"}
                onClick={() => setUrlSearchParams({ result: ScenarioStatusFilter.SUCCESS })}
            >
                <CheckIcon sx={{ mr: 0.5 }} fontSize={"small"} />
                {props.statistic.numSuccessfulScenarios} Successful,
            </StyledLink>
            <StyledLink
                underline="hover"
                className="pseudo-link"
                color={"red"}
                onClick={() => setUrlSearchParams({ result: ScenarioStatusFilter.FAILURE })}
            >
                <ErrorIcon sx={{ mr: 0.5 }} fontSize={"small"} />
                {props.statistic.numFailedScenarios} failed,
            </StyledLink>
            <StyledLink
                underline="hover"
                className="pseudo-link"
                color={"grey"}
                onClick={() => setUrlSearchParams({ result: ScenarioStatusFilter.PENDING })}
            >
                <DoNotDisturbAltIcon sx={{ mr: 0.5 }} fontSize={"small"} />
                {props.statistic.numPendingScenarios} pending,
            </StyledLink>
            <Typography color="text.primary">{props.statistic.numScenarios} Total</Typography>
            <Typography color={"text.primary"}>{addRuntime(props.statistic)}</Typography>
        </Breadcrumbs>
    );
}
