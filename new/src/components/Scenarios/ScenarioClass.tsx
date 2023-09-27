import { ScenarioModel } from "../../reportModel";
import { Scenario } from "./Scenario";
import { useState } from "react";

export function ScenarioClass(props: { scenarios: ScenarioModel[] }) {
    const accordionExpansion: Map<
        string,
        { expanded: boolean; setExpanded: (expanded: boolean) => void }
    > = new Map();
    const [expanded, setExpanded] = useState(props.scenarios.map(__ => false));
    for (let i = 0; i < props.scenarios.length; i++) {
        accordionExpansion.set(props.scenarios[i].testMethodName, {
            expanded: expanded[i],
            setExpanded: value => {
                const newExpanded = expanded;
                newExpanded[i] = value;
                setExpanded(newExpanded);
            }
        });
    }
    return (
        <div>
            {props.scenarios.map(scenario => (
                <Scenario
                    scenario={scenario}
                    accordionExpansion={
                        accordionExpansion.get(scenario.testMethodName) as {
                            expanded: boolean;
                            setExpanded: (expanded: boolean) => void;
                        }
                    }
                />
            ))}
        </div>
    );
}
