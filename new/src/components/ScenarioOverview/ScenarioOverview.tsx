import type {ReportStatistics} from "../../reportModel";
import {Breadcrumbs, Link, Typography} from "@mui/material";
import CheckIcon from '@mui/icons-material/CheckBox';
import ErrorIcon from '@mui/icons-material/Error';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import {addRuntime} from "../utils";

export function ScenarioOverview(props: { statistic: ReportStatistics }) {
    return (
        <Breadcrumbs separator=" " aria-label="breadcrumb">
            <Link underline="hover" color={"inherit"} href={"/TODO"}>
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
