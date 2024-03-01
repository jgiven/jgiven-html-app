import JGivenReport from '../resources/jgivenReport.json';
import ReportModel, {Tag} from "./reportModel";

export const repository = {
    getReport(): JsonReport {
        return JGivenReport as unknown as JsonReport;
    }
}

interface JsonReport {
    scenarios: ReportModel[],
    tagFile: TagFile
};
type TagFile = { tagTypeMap: Record<string, Tag>, tags: Record<string, {}>[] }
