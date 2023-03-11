import { ScenarioCaseModel, StepModel } from "../reportModel";


export function ScenarioCase(props: {scenarioCase: ScenarioCaseModel}) {
    return (
        <div>
            {props.scenarioCase.steps.map(step => (<ScenarioStep step={step}></ScenarioStep>))}
        </div>
    );
}

function ScenarioStep(props: {step: StepModel}) {
    return (
        <div>
            {props.step.words.}
        </div>
    )
}