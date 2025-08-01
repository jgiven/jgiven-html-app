import type { ReportStatistics, ScenarioModel } from "../../reportModel";
import { Divider, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { DonutChart } from "./DonutChart";
import { PropsWithChildren, useMemo } from "react";
import { processWords } from "../../wordProcessor";
import { StyledContent, StyledIconButton, StyledIconContainer } from "./ScenarioHead.styles";
import { StatisticBreadcrumbs } from "../Scenarios/StatisticsBreadcrumbs";

export interface ScenarioCollectionHeadProps {
    scenarios: ScenarioModel[];
    onCollapseButtonClick: () => void;
    onExpandButtonClick: () => void;
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
                            <Grid size={12}>
                                <ScenarioTitles headers={headers} />
                            </Grid>
                            <Grid sx={{ flexGrow: 1 }} />
                            <Grid>{DonutChart({ statistic })}</Grid>
                            <Grid>
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

function ScenarioTitles(props: { headers: Headers }) {
    return (
        <Grid container>
            <Grid size={12}>
                <Typography variant="h6" color="grey">
                    {props.headers.aboveHeader}
                </Typography>
            </Grid>
            <Grid size={12}>
                <Typography variant="h4">{processWords(props.headers.header)}</Typography>
            </Grid>
            <Grid size={12}>
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
}

function ScenarioActionButtons({
    onCollapseButtonClick,
    onExpandButtonClick
}: ScenarioActionButtonsProps) {
    return (
        <Grid container>
            <Grid>
                <ScenarioHeaderIcon onClick={onCollapseButtonClick}>
                    <RemoveIcon fontSize="inherit" />
                </ScenarioHeaderIcon>
            </Grid>
            <Grid>
                <ScenarioHeaderIcon onClick={onExpandButtonClick}>
                    <AddIcon />
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
