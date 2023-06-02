import type {ReportStatistics} from "../../reportModel";
import {Breadcrumbs, Divider, Grid, Link, List, ListItem, ListItemText, Typography} from "@mui/material";
import CheckIcon from '@mui/icons-material/CheckBox';
import ErrorIcon from '@mui/icons-material/Error';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import {addRuntime} from "../utils";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

export function ScenarioOverview(props: { statistic: ReportStatistics }) {
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
        </List>
    )
}

function getTopLevel() {
    return (
        <Typography variant="h4">All Scenarios</Typography>
    )
}


function createReportCircle(props: {statistic: ReportStatistics}) {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const width = 240; // set default width to 100 if none is provided via props
    const height = 120; // set default height to 100 if none is provided via props

    const data = {
        labels: ['Successful', 'Failed'],
        datasets: [
            {
                data: [props.statistic.numSuccessfulScenarios, props.statistic.numFailedScenarios],
                backgroundColor: [
                    'rgba(60, 179, 113)',
                    'rgba(255, 0, 0)',
                ],
                borderWidth: 1,
                hoverBackgroundColor: [
                    'rgba(60,179,113,0.62)',
                    'rgba(255,20,20,0.63)',
                ],
            },
        ],
    };

    const options = {
        aspectRatio: 2,
        cutoutPercentage: 70    ,
        plugins: {
            legend: {
                display: false,
            },
        },
        tooltips: {
            enabled: true,
            intersect: true,
            mode: "nearest",
            callbacks: {
                label: (tooltipItem: any, data: any) => {
                    const label = data.labels[tooltipItem.index];
                    const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return `${label}: ${value}`;
                },
            },
        },

    }

    return (
        <Doughnut data={data} width={width} height={height} options={options}  />
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
