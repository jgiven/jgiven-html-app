import {processWords} from "../../wordProcessor";
import {Typography} from "@mui/material";
import {ScenarioCaption} from "./ScenarioCaption";
import {addRuntimeInSeconds} from "../utils";
import {StepModel} from "../../reportModel";

export interface ScenarioStepProps {
    step: StepModel;
}

export function ScenarioStep({step}: ScenarioStepProps) {
    const stepDescription = processWords(step.words);
    return (
        <Typography align={"left"}>
            {stepDescription} <ScenarioCaption>{addRuntimeInSeconds(step.durationInNanos)}</ScenarioCaption>
        </Typography>
    );
}