import jGivenReport from "./sampleData/jgivenReport.json";
import tagFile from "./sampleData/tagFile.json";
import ReportModel, { ScenarioModel } from "./reportModel";

export const repository = {
    getReport(): JsonReport {
        return jGivenReport as unknown as JsonReport;
    },

    getAllScenarios(): ScenarioModel[] {
        return jGivenReport.scenarios
            .map(r => r as ReportModel)
            .flatMap((report: ReportModel) => report.scenarios);
    },

    getTags(): TagFile {
        return tagFile;
    }
};

interface JsonReport {
    scenarios: ReportModel[];
    tagFile: TagFile;
}

type TagFile = { tagTypeMap: Record<string, JsonTagType>; tags: Record<string, JsonTag> };

interface JsonTagType {
    fullType: string;
    type: string;
    description: string;
    prependType?: boolean;
    color?: string;
    href: string;
}

interface JsonTag {
    tagType: string;
    value?: string;
}
