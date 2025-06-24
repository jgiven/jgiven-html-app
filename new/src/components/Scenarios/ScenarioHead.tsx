import { Grid, Typography } from "@mui/material";
import { ScenarioModel } from "../../reportModel";
import { processWords } from "../../wordProcessor";
import { StatusIcon } from "../StatusIconSelector";
import { ScenarioCaption } from "./ScenarioCaption";
import { addRuntimeInMilliseconds } from "../utils";

export interface ScenarioHeadProps {
    scenario: ScenarioModel;
}

export function ScenarioHead({ scenario }: ScenarioHeadProps) {
    return (
        <Grid container columnSpacing={1}>
            <Grid item>
                <Typography color={"grey"}>{scenario.classTitle}</Typography>
            </Grid>
            <Grid item>
                <Typography>{processWords(scenario.description)}</Typography>
            </Grid>
            <Grid>
                <StatusIcon executionStatus={scenario.executionStatus} />
            </Grid>
            <Grid>
                <ScenarioCaption>
                    {scenario.scenarioCases.length > 0
                        ? addRuntimeInMilliseconds(scenario.scenarioCases[0].durationInNanos)
                        : ""}
                </ScenarioCaption>
            </Grid>
        </Grid>
    );
}
