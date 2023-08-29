import { ScenarioModel } from "../../reportModel";
import {Scenario} from "./Scenario";
import {useState} from "react";

export function ScenarioClass(props: {scenarios: ScenarioModel[]}){
    const accordionExpansion: Map<string,{expanded:boolean, setExpanded:(expanded:boolean)=>void}> = new Map();
    props.scenarios.forEach(scenario => {
        const [expanded, setExpanded] = useState(false);
        accordionExpansion.set(scenario.testMethodName, {expanded:expanded, setExpanded:setExpanded});
    });
    return (
        <div>
        {props.scenarios.map(scenario => ((<Scenario scenario={scenario} accordeonExpansion={accordionExpansion.get(scenario.testMethodName) as {expanded:boolean, setExpanded: (expanded:boolean) => void}}/>)))}
        </div>
    )
}