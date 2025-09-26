import type { ScenarioModel } from "../../reportModel";
import { Accordion, AccordionDetails } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { ExpansionState } from "./ScenarioOverview";
import { ScenarioHead } from "./ScenarioHead";
import { ScenarioCase } from "./ScenarioCase";
import { styled } from "@mui/material/styles";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

export interface ScenarioProps {
    scenario: ScenarioModel;
    globalExpansionState: ExpansionState;
    onExpansionCallback: () => void;
    onCollapsionCallback: () => void;
}

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === "dark" ? "rgba(255, 255, 255, .05)" : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(90deg)"
    },
    "& .MuiAccordionSummary-content": {
        marginLeft: theme.spacing(1)
    }
}));

export function Scenario({
    scenario,
    onExpansionCallback,
    onCollapsionCallback,
    globalExpansionState
}: ScenarioProps) {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (globalExpansionState === ExpansionState.COLLAPSED) {
            setExpanded(false);
        }
        if (globalExpansionState === ExpansionState.EXPANDED) {
            setExpanded(true);
        }
    }, [globalExpansionState]);

    const onExpansionChanged = useCallback(
        (isExpansion: boolean) => {
            setExpanded(isExpansion);
            if (isExpansion) {
                onExpansionCallback();
            } else {
                onCollapsionCallback();
            }
        },
        [onExpansionCallback, onCollapsionCallback]
    );

    return (
        <div
            id={`${scenario.className}#${scenario.testMethodName}`}
            aria-label={`Scenario ${scenario.description}`}
        >
            <Accordion expanded={expanded}>
                <AccordionSummary
                    aria-label="Scenario Overview"
                    onClick={() => {
                        onExpansionChanged(!expanded);
                    }}
                >
                    <ScenarioHead scenario={scenario} />
                </AccordionSummary>

                <AccordionDetails aria-label="Scenario Steps">
                    {scenario.scenarioCases.map(scenarioCase => {
                        return (
                            <ScenarioCase
                                key={scenarioCase.caseNr}
                                scenarioCase={scenarioCase}
                                className={scenario.className}
                            />
                        );
                    })}
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
