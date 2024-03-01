import {repository} from "./repository";
import ReportModel from "./reportModel";
import {ScenarioStatusFilter} from "./components/ScenarioOverview/ScenarioHead";

export function filterByStatus(status: ScenarioStatusFilter) {
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