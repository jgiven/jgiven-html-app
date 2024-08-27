import type { ReportStatistics, ScenarioModel } from "../../reportModel";
import { Divider, Grid, Link, List, ListItem, ListItemText, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import { createReportCircle } from "./DonutChart";
import { PropsWithChildren, useMemo } from "react";
import { processWords } from "../../wordProcessor";
import {
    StyledContent,
    StyledDrawer,
    StyledIconButton,
    StyledIconContainer
} from "./ScenarioHead.styles";
import { StatisticBreadcrumbs } from "../Scenarios/StatisticsBreadcrumbs";

export interface ScenarioCollectionHeadProps {
    scenarios: ScenarioModel[];
    onCollapseButtonClick: () => void;
    onExpandButtonClick: () => void;
    onPrintButtonClick: () => void;
    onBookmarkButtonClick: () => void;
    headers: Headers;
}

interface Headers {
    aboveHeader?: string;
    header: string;
    belowHeader?: string;
}

export function ScenarioCollectionHead(props: ScenarioCollectionHeadProps) {
    const { scenarios, headers, ...iconClickHandlers } = props;

    const statistic = useMemo(() => createStatistics(scenarios), [scenarios]);

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
                                <ScenarioTitles headers={headers} />
                            </Grid>
                            <Grid item sx={{ flexGrow: 1 }} />
                            <Grid item>{createReportCircle({ statistic })}</Grid>
                            <Grid item>
                                <ScenarioActionButtons {...iconClickHandlers} />
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary={StatisticBreadcrumbs({ statistic })} />
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

interface ScenarioActionButtonsProps {
    onCollapseButtonClick: () => void;
    onExpandButtonClick: () => void;
    onPrintButtonClick: () => void;
    onBookmarkButtonClick: () => void;
}

function ScenarioActionButtons({
    onCollapseButtonClick,
    onExpandButtonClick,
    onPrintButtonClick,
    onBookmarkButtonClick
}: ScenarioActionButtonsProps) {
    return (
        <Grid container>
            <Grid item>
                <ScenarioHeaderIcon onClick={onCollapseButtonClick}>
                    <RemoveIcon fontSize="inherit" />
                </ScenarioHeaderIcon>
            </Grid>
            <Grid item>
                <ScenarioHeaderIcon onClick={onExpandButtonClick}>
                    <AddIcon />
                </ScenarioHeaderIcon>
            </Grid>
            <Grid item>
                <ScenarioHeaderIcon onClick={onPrintButtonClick}>
                    <PrintOutlinedIcon fontSize="inherit" />
                </ScenarioHeaderIcon>
            </Grid>
            <Grid item>
                <ScenarioHeaderIcon onClick={onBookmarkButtonClick}>
                    <BookmarkOutlinedIcon fontSize="inherit" />
                </ScenarioHeaderIcon>
            </Grid>
        </Grid>
    );
}

type ScenarioHeaderIconProps = PropsWithChildren<{ onClick: () => void }>;

function ScenarioHeaderIcon({ children, onClick }: ScenarioHeaderIconProps) {
    return (
        <StyledIconContainer>
            <StyledIconButton className="actionPanelButton" onClick={onClick}>
                {children}
            </StyledIconButton>
        </StyledIconContainer>
    );
}

export enum ScenarioStatusFilter {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    PENDING = "PENDING"
}

function createStatistics(scenarios: ScenarioModel[]): ReportStatistics {
    const allCases = scenarios.flatMap(scenario => scenario.scenarioCases);
    const failedScenarios = scenarios.filter(scenario => scenario.executionStatus === "FAILED");
    const pendingScenarios = scenarios.filter(scenario => scenario.executionStatus === "PENDING");
    const successfulScenarios = scenarios.filter(
        scenario => scenario.executionStatus === "SUCCESS"
    );
    return {
        numScenarios: scenarios.length,
        numFailedScenarios: failedScenarios.length,
        durationInNanos: allCases
            .map(scenarioCase => scenarioCase.durationInNanos)
            .reduce((totalDuration, current) => totalDuration + current),
        numPendingScenarios: pendingScenarios.length,
        numSuccessfulScenarios: successfulScenarios.length
    };
}
