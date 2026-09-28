import sampleReport from "../sampleData/jgivenReport.json";
import type { JGivenReportGlobal } from "../types/jgivenReport";

export function loadSampleReport(): void {
    if (typeof window === "undefined") {
        return;
    }

    if (window.jgivenReport?.metaData?.version) {
        return;
    }

    window.jgivenReport = sampleReport as JGivenReportGlobal;
}
