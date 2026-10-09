export interface JGivenMetaData {
    title: string;
    version: string;
    created: string;
    data: string[];
    showThumbnails?: boolean;
}

export interface JGivenTag {
    type: string;
    fullType?: string;
    name?: string;
    value?: string;
    description?: string;
    href?: string;
    color?: string;
    cssClass?: string;
    style?: string;
    prependType?: boolean;
    hideInNav?: boolean;
    tags?: string[];
}

export interface StepWord {
    value: string;
    isIntroWord?: boolean;
    isDifferent?: boolean;
    argumentInfo?: {
        parameterName?: string;
        formattedValue?: string;
        dataTable?: {
            data: string[][];
            headerType?: string;
        };
    };
}

export interface StepAttachment {
    value: string;
    title?: string;
    showDirectly?: boolean;
    mimeType?: string;
    mediaType?: string;
}

export interface ScenarioStep {
    name: string;
    words: StepWord[];
    status: string;
    depth?: number;
    nestedSteps?: ScenarioStep[];
    attachments?: StepAttachment[];
    durationInNanos?: number;
    isSectionTitle?: boolean;
    extendedDescription?: string;
    comment?: string;
    expanded?: boolean;
}

export interface ScenarioCase {
    caseNr: number;
    status: string;
    explicitArguments?: unknown[];
    derivedArguments?: unknown[];
    steps: ScenarioStep[];
    errorMessage?: string;
    stackTrace?: string[];
    durationInNanos?: number;
    description?: string;
    expanded?: boolean;
    stackTraceExpanded?: boolean;
}

export interface Scenario {
    className: string;
    classTitle?: string;
    testMethodName: string;
    description: string;
    extendedDescription?: string;
    executionStatus: string;
    tagIds: string[];
    tags: JGivenTag[];
    explicitParameters?: string[];
    derivedParameters?: string[];
    scenarioCases: ScenarioCase[];
    casesAsTable?: boolean;
    durationInNanos: number;
    expanded?: boolean;
}

export interface TestClass {
    className: string;
    name?: string;
    description?: string;
    scenarios: Scenario[];
}

export interface CustomNavLink {
    text: string;
    href: string;
    target?: string;
}

export interface JGivenReportGlobal {
    scenarios: TestClass[];
    tagFile?: {
        tags: Record<
            string,
            { tagType: string; value?: string; description?: string; href?: string }
        >;
        tagTypeMap: Record<string, JGivenTag>;
    };
    metaData: JGivenMetaData;
    customNavigationLinks: CustomNavLink[];
}

declare global {
    interface Window {
        jgivenReport: JGivenReportGlobal;
    }
}

export {};
