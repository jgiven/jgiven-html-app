export default interface ReportModel {
    className: string,
    name: string,
    description: string,
    scenarios: ScenarioModel[],
    tagMap: Map<string, Tag>,
}
interface ArgumentInfo {
    parameterName?: string,
    argumentName?: string,
    formattedValue?: string,
    dataTable?: DataTable,
}
interface AttachmentModel {
    title:string,
    value:string,
    fileName:string,
    mediaType: string,
    binary: boolean,
    showDirectly?: boolean
}
interface CompleteReportModel {
    models: ReportModelFile[],
    tagMap: Map<Tag, ScenarioModel[]>,
    statisticsMap: Map<ReportModelFile, ReportStatistics>,
    totalStatistics: ReportStatistics,
    failedScenarios: ScenarioModel[],
    pendingScenarios: ScenarioModel[],
    allScenarios: ScenarioModel[],
    tagIdMap: Map<string, Tag>,
}
interface DataTable {
    headerType: HeaderType
    data: string[][]
}
interface ExecutionStatusCalculator {
    failedCount: number,
    pendingCount: number,
    totalCount: number,
    status: ExecutionStatus
}
interface NamedArgument {
    name: string,
    value: object,
}
interface ReportModelFile {
    model: ReportModel,
    file: File
}
interface ReportStatistics {
    numClasses: number,
    numScenarios: number,
    numFailedScenarios: number,
    numCases: number,
    numFailedCases: number,
    numSteps: number,
    durationInNanos: number,
    numPendingScenarios: number,
    numSuccessfulScenarios: number
}
interface ScenarioCaseModel {
    caseNr: number,
    steps: StepModel[],
    explicitArguments: string[],
    derivedArguments: string[],
    status: ExecutionStatus,
    errorMessage?: string,
    stackTrace?: string[],
    durationInNanos: number,
    description?: string,

}
interface ScenarioModel {
    className: string,
    testMethodName: string,
    description: string,
    extendedDescription: string,
    tagIds: string[],
    explicitParameters: string[],
    derivedParameters: string[],
    scenarioCases: ScenarioCaseModel[],
    casesAsTable: boolean,
    durationInNanos: number,
    executionStatus: ExecutionStatus,

}
interface StepFormatter {
    stepDescription: string,
    arguments: NamedArgument[],
    formatters,

}
interface StepModel {
    name: string,
    words: Word[],
    nestedSteps?: StepModel[],
    status: StepStatus,
    durationInNanos: number,
    extendedDescription?: string,
    attachments?: AttachmentModel[],
    isSectionTitle?: boolean,
    comment?: string,
    depth: number,
    parentFailed: boolean,
}
interface Tag {
    fullType: string,
    type: string,
    name: string,
    value: object,
    description: string,
    prependType?: boolean,
    color: string,
    cssClass?: string,
    style?: string,
    tags?: string[],
    href?: string,
    hideInNav?: boolean,
}
interface Word {
    value: string,
    isIntroWord?: boolean,
    argumentInfo?: ArgumentInfo,

}
type ExecutionStatus = "SCENARIO_PENDING" | "SUCCESS" | "FAILED" | "SOME_STEPS_PENDING";
type HeaderType = "NONE"| "HORIZONTAL"|"VERTICAL" | "BOTH";
type InvocationMode = "NORMAL" |"NESTED" | "FAILED"| "SKIPPED" | "PENDING";
type StepStatus = "SUCCESS" | "PASSED" | "FAILED" | "SKIPPED" | "PENDING";