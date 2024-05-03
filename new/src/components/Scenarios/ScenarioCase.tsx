import { Box, Link, Typography } from "@mui/material";
import { ScenarioCaseModel, StepModel } from "../../reportModel";
import { ScenarioStep } from "./ScenarioStep";

export interface ScenarioCaseProps {
    className: string;
    scenarioCase: ScenarioCaseModel;
}

export function ScenarioCase({ scenarioCase, className }: ScenarioCaseProps) {
    return (
        <Box sx={{ marginLeft: "2em" }}>
            {scenarioCase.steps.map((step: StepModel, index) => (
                <ScenarioStep key={index} step={step}></ScenarioStep>
            ))}
            <Typography align="right" variant="body2">
                <Link
                    href={`#class/${className}`}
                    variant="inherit"
                    color="inherit"
                    underline="none"
                >
                    {className}
                </Link>
            </Typography>
        </Box>
    );
}
