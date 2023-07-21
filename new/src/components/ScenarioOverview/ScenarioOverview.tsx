import type {ReportStatistics} from "../../reportModel";
import {Breadcrumbs, Divider, Grid, Link, List, ListItem, ListItemText, Typography} from "@mui/material";
import CheckIcon from '@mui/icons-material/CheckBox';
import ErrorIcon from '@mui/icons-material/Error';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import {addRuntime} from "../utils";
import {createReportCircle} from "./DonutChart";
import { Box } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';


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
                    <Grid item>
                      <Link underline="none" color="inherit" sx={{ '&:hover': { textDecoration: 'none', color: 'inherit' } }}href="/TODO">
                            <Box
                                sx={{
                                    width: '12px',  // or some other value
                                    height: '12px', // same as width
                                    p: 0.01,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid grey',
                                    borderRadius: 1,
                                    marginRight: '5px',
                                }}
                                component="span"
                            >
                                <RemoveIcon fontSize="inherit" />
                            </Box>
                      </Link>
                    </Grid>
                    <Grid item>
                        <Link underline="none" color="inherit" sx={{ '&:hover': { textDecoration: 'none', color: 'inherit' } }}href="/TODO">
                            <Box
                                sx={{
                                    width: '12px',  // or some other value
                                    height: '12px', // same as width
                                    p: 0.01,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid grey',
                                    borderRadius: 1,
                                    marginRight: '5px'
                                }}
                                component="span"
                            >
                                <Typography>+</Typography>
                            </Box>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link underline="none" color="inherit" sx={{ '&:hover': { textDecoration: 'none', color: 'inherit' } }}href="/TODO">
                            <Box
                                sx={{
                                    width: '12px',  // or some other value
                                    height: '12px', // same as width
                                    p: 0.01,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,
                                    marginRight: '5px'
                                }}
                                component="span"
                            >
                                <PrintOutlinedIcon fontSize="inherit" />
                            </Box>
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link underline="none" color="inherit" sx={{ '&:hover': { textDecoration: 'none', color: 'inherit' } }}href="/TODO">
                            <Box
                                sx={{
                                    width: '12px',  // or some other value
                                    height: '12px', // same as width
                                    p: 0.01,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 1,
                                }}
                                component="span"
                            >
                                <BookmarkOutlinedIcon fontSize="inherit" />
                            </Box>
                        </Link>
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
