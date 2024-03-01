import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import { ScenarioStatusFilter } from "../components/ScenarioOverview/ScenarioCollectionHead";

export interface Filters {
    status: ScenarioStatusFilter | undefined;
}

export function useFilters(): [Filters, SetURLSearchParams] {
    const [searchParams, setSearchParams] = useSearchParams();
    const status = searchParams.get("status");

    return [{ status: parseScenarioStatus(status) }, setSearchParams];
}

function parseScenarioStatus(status: string | null): ScenarioStatusFilter | undefined {
    switch (status) {
        case ScenarioStatusFilter.FAILED:
            return ScenarioStatusFilter.FAILED;
        case ScenarioStatusFilter.PENDING:
            return ScenarioStatusFilter.PENDING;
        case ScenarioStatusFilter.SUCCESS:
            return ScenarioStatusFilter.SUCCESS;
        default:
            return undefined;
    }
}
