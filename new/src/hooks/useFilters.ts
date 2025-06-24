import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import { ScenarioStatusFilter } from "../components/ScenarioOverview/ScenarioCollectionHead";

export interface Filter {
    status: ScenarioStatusFilter | undefined;
}

export function useFilters(): { filter: Filter; setUrlSearchParams: SetURLSearchParams } {
    const [searchParams, setSearchParams] = useSearchParams();
    const status = searchParams.get("status");

    return { filter: { status: parseScenarioStatus(status) }, setUrlSearchParams: setSearchParams };
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
