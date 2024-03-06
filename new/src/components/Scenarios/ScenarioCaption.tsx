import {PropsWithChildren} from "react";
import {Typography} from "@mui/material";

export function ScenarioCaption(props: PropsWithChildren) {
    return (
        <Typography display="inline" variant="caption" paragraph={false}>
            {props.children}
        </Typography>
    );
}