import type {ReportStatistics} from "../../reportModel";
import {Breadcrumbs, Divider, Link, List, ListItem, ListItemText, Typography} from "@mui/material";
import CheckIcon from '@mui/icons-material/CheckBox';
import ErrorIcon from '@mui/icons-material/Error';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import {addRuntime} from "../utils";
import DonutChart from "react-donut-chart";

export function ScenarioOverview(props: { statistic: ReportStatistics }) {
    return (
        <List sx={undefined} component="nav" aria-label="jgiven-overview">
            <ListItem button>
                <ListItemText primary={createReportCircle(props)} />
            </ListItem>
            <Divider />
            <ListItem button>
                <ListItemText primary={getBreadcrumbs(props)} />
            </ListItem>
        </List>
    )
}

// function getTopLevel() {
//     return (
//         <Typography variant="h4">All Scenarios</Typography>
//     )
// }

function createReportCircle(props: {statistic: ReportStatistics}) {
    const reactDonutChartdata = [
        {
            label: "Success: ",
            value: props.statistic.numSuccessfulScenarios,
            color: "#00E396"
        },
        {
            label: "Failed: ",
            value: props.statistic.numFailedScenarios,
            color: "#FEB019"
        }
    ];
    return (
        <DonutChart
            width={120}
            height={120}
            data={reactDonutChartdata}
            colors={["green", "red"]}
            innerRadius={0.55}
            selectedOffset={0}
            legend={false}
            clickToggle={false}
            interactive={false}
        />
    );
}

function getBreadcrumbs(props: { statistic: ReportStatistics}) {
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
