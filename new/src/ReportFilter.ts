import {repository} from "./repository";
import ReportModel from "./reportModel";

interface JsonReport {
    scenarios: ReportModel[],
    tagFile: TagFile
};

type TagFile = { tagTypeMap: unknown, tags: unknown[] }


export function filterByStatus(status: string) {
    const fullReport = repository.getReport();
    return {
        ...fullReport,
        scenarios: filterScenarios(fullReport, status)
    }

}

function filterScenarios(report: JsonReport, status: string) {
    return report.scenarios.filter(scenario => scenario.scenarios.filter(sc => sc.executionStatus === status))
}