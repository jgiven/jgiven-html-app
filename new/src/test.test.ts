import JGivenReport from '../resources/jgivenReport.json';
import {StepStatus} from "./reportModel";

test('Test', () => {

    const allStepsStatus: StepStatus[] = [];
    for (const scenario of JGivenReport.scenarios) {
        for (const scenarioCase of scenario.scenarios) {
            for (const step of scenarioCase.scenarioCases) {
                if (isStepStatus(step.status)) {
                    allStepsStatus.push(step.status);
                } else {
                    console.log('Invalid step status: ', step.status, ' in scenario: ', scenarioCase.testMethodName, ' in class: ', scenario.className);
                }
            }

        }
    }
});

function isStepStatus(status: string): status is StepStatus {
    return ['FAILED', 'PENDING', 'PASSED', 'SKIPPED', 'SUCCESS'].includes(status);
}