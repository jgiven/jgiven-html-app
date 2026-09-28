import type { Scenario, ScenarioStep, StepWord } from "../types/jgivenReport";
import { getAllScenarios } from "./dataService";
import { getTagName, sortByDescription } from "../util/format";

export function findScenarios(searchString: string): Scenario[] {
    const searchStrings = searchString.split(" ");
    const regexps = searchStrings.map(x => new RegExp(x, "i"));

    return sortByDescription(
        getAllScenarios().filter(scenario => scenarioMatchesAll(scenario, regexps))
    );
}

function scenarioMatchesAll(scenario: Scenario, regexpList: RegExp[]): boolean {
    return regexpList.every(regexp => scenarioMatches(scenario, regexp));
}

function scenarioMatches(scenario: Scenario, regexp: RegExp): boolean {
    if (scenario.className.match(regexp)) return true;
    if (scenario.description.match(regexp)) return true;

    for (const tag of scenario.tags) {
        if ((getTagName(tag) && getTagName(tag).match(regexp)) || tag.value?.match(regexp)) {
            return true;
        }
    }

    for (const scenarioCase of scenario.scenarioCases) {
        if (caseMatches(scenarioCase.steps, regexp)) return true;
    }

    return false;
}

function caseMatches(steps: ScenarioStep[], regexp: RegExp): boolean {
    for (const step of steps) {
        if (stepMatches(step, regexp)) return true;
    }
    return false;
}

function stepMatches(step: ScenarioStep, regexp: RegExp): boolean {
    for (const word of step.words) {
        if (word.value.match(regexp)) return true;
    }
    if (step.nestedSteps) {
        for (const nested of step.nestedSteps) {
            if (stepMatches(nested, regexp)) return true;
        }
    }
    return false;
}

export function getNonIntroWords(words: StepWord[]): StepWord[] {
    if (words[0]?.isIntroWord) {
        return words.slice(1);
    }
    return words;
}
