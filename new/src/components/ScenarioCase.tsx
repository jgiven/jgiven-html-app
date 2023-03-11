import { ScenarioCaseModel, StepModel } from "../reportModel";


export function ScenarioCase(props: {scenarioCase: ScenarioCaseModel | any}) {
    return (
        <div>
            {props.scenarioCase.steps.map((step:StepModel) => (<ScenarioStep step={step}></ScenarioStep>))}
        </div>
    );
}

function ScenarioStep(props: {step: StepModel}) {
    return (
        <div>
            {props.step.words.map(word => word.value).join(" ")}
        </div>
    )
}