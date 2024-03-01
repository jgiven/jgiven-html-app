import { repository } from "./repository";
import ReportModel, { ScenarioModel } from "./reportModel";
import { ScenarioStatusFilter } from "./components/ScenarioOverview/ScenarioCollectionHead";

export function filterByStatus(
    ...statusParameter: (ScenarioStatusFilter | null)[]
): ScenarioModel[] {
    const fullReport = repository.getReport();
    const status = statusParameter
        .filter(status => status !== null)
        .map(s => s as ScenarioStatusFilter);

    const filteredReports =
        status.length === 0
            ? fullReport.scenarios
            : filterReportByScenarioStatus(fullReport.scenarios, ...status);

    return filteredReports.flatMap(report => report.scenarios);
}

function filterReportByScenarioStatus(reports: ReportModel[], ...status: ScenarioStatusFilter[]) {
    const filteredReports = [];
    for (const report of reports) {
        const filteredScenarios = report.scenarios.filter(scenario =>
            (status as string[]).includes(scenario.executionStatus)
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
