import {render, screen} from '@testing-library/react';
import {ScenarioModel} from '../../reportModel';
import {Scenario} from './Scenario';
import {processWords} from "../../wordProcessor";

describe('Scenario accordion behavior', () => {
    test('accordeon details are not visible when expanded is set to false', async () => {
        let expanded = false;
        const setExpanded = (value: boolean) => {
            expanded = value
        };
        render(<Scenario scenario={model} accordionExpansion={{expanded, setExpanded}}/>);
        const accordion = await screen.findByLabelText("Scenario Overview");
        expect(accordion.attributes.getNamedItem("aria-expanded")?.value).toBe("false");
    });

    test('accordion details are visible when expanded is set to true', async () => {
        let expanded = true;
        const setExpanded = (value: boolean) => {
            expanded = value
        };
        render(<Scenario scenario={model} accordionExpansion={{expanded, setExpanded}}/>);
        const accordion = await screen.findByLabelText("Scenario Overview");
        expect(accordion.attributes.getNamedItem("aria-expanded")?.value).toBe("true");
    });

    test('accordion details get visible when clicking on the header', async () => {
        let expanded = false;
        const setExpanded = (value: boolean) => {
            expanded = value
        };
        render(<Scenario scenario={model} accordionExpansion={{expanded, setExpanded}}/>);
        await screen.findByLabelText("Scenario Overview").then(element => element.click());
        expect(expanded).toBeTruthy();
    });
});

test('Scenario displays steps',async()=>{
    let expanded = true;
    const setExpanded = (value: boolean) => {
        expanded = value
    };
    render(<Scenario scenario={model} accordionExpansion={{expanded, setExpanded}}/>);
    const textElement = await screen.findByText(
        model.scenarioCases[0].steps[0].words.flatMap(word => word.value).join(" ")
    );
    expect(textElement).toBeTruthy();
});

test('Scenario capitalizes title ',async()=>{
    let expanded = true;
    const setExpanded = (value: boolean) => {
        expanded = value
    };
    render(<Scenario scenario={model} accordionExpansion={{expanded, setExpanded}}/>);
    const textElement = await screen.findByText(tekst => processWords( model.description) === tekst);
    expect(textElement).toBeTruthy();
});


const model: ScenarioModel = {
    className: 'testClass',
    testMethodName: 'testMethod',
    description: 'this is a description',
    extendedDescription: 'this is an extended description',
    tagIds: ["tag1", "tag2"],
    explicitParameters: [],
    derivedParameters: [],
    scenarioCases: [
        {
            caseNr: 1,
            description: "case1",
            derivedArguments: [],
            explicitArguments: [],
            durationInNanos: 2001000,
            status: "SUCCESS",
            steps: [
                {
                    status: "PASSED",
                    durationInNanos: 2000000,
                    name: "Step1",
                    words: [{value: "Step1", isIntroWord: true}],
                    depth: 0,
                    parentFailed: false
                }
            ]
        }
    ],
    casesAsTable: false,
    durationInNanos: 0
}
