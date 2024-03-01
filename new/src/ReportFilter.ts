import {repository} from "./repository";
import ReportModel from "./reportModel";
import {ScenarioStatusFilter} from "./components/ScenarioOverview/ScenarioCollectionHead";

export function filterByStatus(...statusParameter: (ScenarioStatusFilter | null)[]): ReportModel[] {
    const fullReport = repository.getReport();
    const status = statusParameter
        .filter(status => status !== null)
        .map(s => s as ScenarioStatusFilter);

    if (status.length === 0) {
        return fullReport.scenarios;
    }

    return filterScenarios(fullReport.scenarios, ...status);
}

function filterScenarios(reports: ReportModel[], ...status: ScenarioStatusFilter[]) {
    const filteredReports = [];
    for (const report of reports) {
        const filteredScenarios = report.scenarios.filter(
            scenario => (status as string[]).includes(scenario.executionStatus)
        );
        if (filteredScenarios.length > 0) {
            filteredReports.push({
                ...report,
                scenarios: filteredScenarios
            });
        }
    }
    return filteredReports;
}
