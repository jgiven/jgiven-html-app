import { useFilters } from "../../hooks/useFilters";
import { Breadcrumbs, Typography } from "@mui/material";
import { StyledLink } from "../ScenarioOverview/ScenarioHead.styles";
import CheckIcon from "@mui/icons-material/CheckBox";
import ErrorIcon from "@mui/icons-material/Error";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { addRuntimeInSeconds } from "../utils";
import { ScenarioStatusFilter } from "../ScenarioOverview/ScenarioCollectionHead";
import { ReportStatistics } from "../../reportModel";

export interface statisticsBreadcrumbProps {
    statistic: ReportStatistics;
}

export function StatisticBreadcrumbs({ statistic }: statisticsBreadcrumbProps) {
    const { setUrlSearchParams } = useFilters();

    return (
        <Breadcrumbs separator=" " aria-label="breadcrumb">
            <StyledLink
                aria-label="filter-for-successful-tests"
                underline="hover"
                color={"black"}
                onClick={() => setUrlSearchParams({ status: ScenarioStatusFilter.SUCCESS })}
            >
                <CheckIcon sx={{ mr: 0.5 }} fontSize={"small"} />
                {statistic.numSuccessfulScenarios} Successful,
            </StyledLink>
            <StyledLink
                aria-label="filter-for-failed-tests"
                underline="hover"
                color={"red"}
                onClick={() => setUrlSearchParams({ status: ScenarioStatusFilter.FAILED })}
            >
                <ErrorIcon sx={{ mr: 0.5 }} fontSize={"small"} />
                {statistic.numFailedScenarios} failed,
            </StyledLink>
            <StyledLink
                aria-label="filter-for-pending-tests"
                underline="hover"
                color={"grey"}
                onClick={() => setUrlSearchParams({ status: ScenarioStatusFilter.PENDING })}
            >
                <DoNotDisturbAltIcon sx={{ mr: 0.5 }} fontSize={"small"} />
                {statistic.numPendingScenarios} pending,
            </StyledLink>
            <Typography color="text.primary">{statistic.numScenarios} Total</Typography>
            <Typography color={"text.primary"}>
                {addRuntimeInSeconds(statistic.durationInNanos)}
            </Typography>
        </Breadcrumbs>
    );
}
