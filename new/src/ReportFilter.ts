import {repository} from "./repository";
import ReportModel from "./reportModel";
import {ScenarioStatusFilter} from "./components/ScenarioOverview/ScenarioHead";

interface JsonReport {
    scenarios: ReportModel[],
    tagFile: TagFile
};

type TagFile = { tagTypeMap: unknown, tags: unknown[] }


export function filterByStatus(status: string) {
    const fullReport = repository.getReport();
    return filterScenarios(fullReport.scenarios, status)

}

function filterScenarios(reports: ReportModel[], status: ScenarioStatusFilter) {
    const filteredReports = [];
    for (const report of reports) {
        const filteredScenarios = report.scenarios.filter(scenario => scenario.executionStatus === status)
        if (filteredScenarios.length > 0) {
            filteredReports.push({
                ...report,
                scenarios: filteredScenarios
            })
        }
    }
    return filteredReports;
}