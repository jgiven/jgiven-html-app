import {repository} from "./repository";

type Report = ReturnType<typeof repository["getReport"]>;

export function filterByStatus(status: string) {
    const fullReport = repository.getReport();
    return {
        ...fullReport,
        scenarios: filterScenarios(fullReport, status)
    }

}

function filterScenarios(report: Report, status: string) {
    //return report.scenarios.filter(scenario => scenario.scenarios.filter(sc => sc.executionStatus === status))
}