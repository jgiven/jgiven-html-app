import { ScenarioCaseModel, StepModel, Word } from "../../../reportModel";

export function createWord(props?: Partial<Word>): Word {
    return {
        value: props?.value ?? "word value",
        isIntroWord: props?.isIntroWord,
        argumentInfo: props?.argumentInfo
    };
}

export function createStepModel(props?: Partial<StepModel>): StepModel {
    return {
        name: props?.name ?? "step name",
        words: props?.words ?? [],
        status: props?.status ?? "PASSED",
        durationInNanos: props?.durationInNanos ?? 0,
        depth: props?.depth ?? 0,
        parentFailed: props?.parentFailed ?? false,
        nestedSteps: props?.nestedSteps,
        extendedDescription: props?.extendedDescription,
        attachments: props?.attachments,
        isSectionTitle: props?.isSectionTitle,
        comment: props?.comment
    };
}

export function createScenarioCaseModel(props?: Partial<ScenarioCaseModel>): ScenarioCaseModel {
    return {
        caseNr: props?.caseNr ?? 0,
        steps: props?.steps ?? [],
        explicitArguments: props?.explicitArguments ?? [],
        derivedArguments: props?.derivedArguments ?? [],
        status: props?.status ?? "SUCCESS",
        errorMessage: props?.errorMessage,
        stackTrace: props?.stackTrace,
        durationInNanos: props?.durationInNanos ?? 0,
        description: props?.description
    };
}
