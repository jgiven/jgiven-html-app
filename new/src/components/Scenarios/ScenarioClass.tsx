import { ScenarioModel } from "../../reportModel";
import {Scenario} from "./Scenario";

export function ScenarioClass(props: {scenarios: ScenarioModel[]}){
    return (
        <div>
        {props.scenarios.map(scenario => ((<Scenario scenario={scenario}/>)))}
        </div>
    )
}