import { SxProps, Theme } from "@mui/material";
import { FontSizes, GreenCheckbox } from "./Icons/CheckMarks";
import React from "react";
import ErrorIcon from "@mui/icons-material/Error";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { ExecutionStatus } from "../reportModel";

export function StatusIcon(props: {
    executionStatus: ExecutionStatus;
    sx?: SxProps<Theme>;
    fontSize?: FontSizes;
}) {
    switch (props.executionStatus) {
        case "SUCCESS":
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
        case "PENDING":
            return (
                <React.Fragment>
                    <DoNotDisturbAltIcon sx={{ mr: 0.5 }} fontSize={"small"} />
                </React.Fragment>
            );
        default:
            return null;
    }
}
