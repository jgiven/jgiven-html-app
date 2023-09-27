import { SxProps, Theme } from "@mui/material";
import { FontSizes, GreenCheckbox } from "./Icons/CheckMarks";
import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { ExecutionStatus, StepStatus } from "../reportModel";

export function StatusIcon(props: {
    model: { status: StepStatus | ExecutionStatus };
    sx?: SxProps<Theme>;
    fontSize?: FontSizes;
}) {
    switch (props.model.status) {
        case "SUCCESS":
        case "PASSED":
            return (
                <React.Fragment>
                    <GreenCheckbox
                        sx={{ mr: 0.5, ...props.sx }}
                        fontSize={props.fontSize ?? "small"}
                    />
                </React.Fragment>
            );
        case "FAILED":
            return (
                <React.Fragment>
                    <ErrorIcon sx={{ mr: 0.5 }} fontSize={"small"} />
                </React.Fragment>
            );
        case "SCENARIO_PENDING":
        case "SOME_STEPS_PENDING":
        case "PENDING":
            return (
                <React.Fragment>
                    <DoNotDisturbAltIcon sx={{ mr: 0.5 }} fontSize={"small"} />
                </React.Fragment>
            );
        case "SKIPPED":
            return null;
    }
}
