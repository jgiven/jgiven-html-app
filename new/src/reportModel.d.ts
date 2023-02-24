export default interface ReportModel {

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
    description: string,

}
interface StepModel {
    name: string,
    words: Word[],
    nestedSteps: StepModel[],
    status: StepStatus
    durationInNanos: number,
    extendedDescription?: string,
    attachments?: AttachmentModel[],
    isSeciontTitle?: boolean,
    comment?: string,
    depth: number,
    parentFailed: boolean,
}

interface AttachmentModel {
    title:string,
    value:string,
    fileName:string,
    mediaType: string,
    binary: boolean
}

interface Word {
    value: string,
    isIntroWord: boolean,
    argumentInfo?: ArgumentInfo,

}

interface ArgumentInfo {
    parameterName: string,
    argumentName: string,
    formattedValue?: string,
    dataTable?: DataTable,
    isDifferent?:boolean


}

interface DataTable {
   headerType: HeaderType
    data: string[][]
}

type HeaderType = "NONE"| "HORIZONTAL"|"VERTICAL" | "BOTH";
type StepStatus = "PASSED" | "FAILED" | "SKIPPED" | "PENDING";
type ExecutionStatus = "SCENARIO_PENDING" | "SUCCESS" | "FAILED" | "SOME_STEPS_PENDING";