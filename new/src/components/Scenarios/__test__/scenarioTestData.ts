import {StepModel, Word} from "../../../reportModel";

export function createWord(props?: Partial<Word>): Word {
    return {
        value: props?.value ?? "word value",
        isIntroWord: props?.isIntroWord,
        argumentInfo: props?.argumentInfo,
    }
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
        comment: props?.comment,
    }
}