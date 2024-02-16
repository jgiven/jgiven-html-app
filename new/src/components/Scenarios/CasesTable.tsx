import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { ScenarioCaseModel } from "../../reportModel";
import { Box } from "@mui/material";
import { TFunction } from "i18next";

interface CasesTableProps {
    cases: ScenarioCaseModel[];
}

export interface Group {
    hide: boolean;
    name: string;
    cases: ScenarioCaseModel[];
    expanded: boolean;
}

export interface Column {
    name: string;
    sorting: "desc" | "asc";
    canGroup: boolean;
    getValue?: (aCase: string) => number;
}

//For the report data, don't use redux but build a simple global context
//Use Playwright for E2E testing
//Important notice! Don't copy the angular code
//Also use MUI elements https://mui.com/
//Consider making t typesafe: https://react.i18next.com/latest/typescript
export function CasesTable(props: CasesTableProps) {
    const { t } = useTranslation();
    const columns: GridColDef[] = createColumnsFromArguments(props.cases[0], t);
    return (
        <div>
            <h6>{t("report.scenario.cases.casesTitle")}</h6>
            <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                    columns={columns}
                    rows={props.cases.map(sc => ({ id: sc.caseNr, ...sc }))}
                ></DataGrid>
            </Box>
        </div>
    );
}

function createColumnsFromArguments(
    cases: ScenarioCaseModel,
    t: TFunction<"translation", undefined>
): GridColDef[] {
    return [
        {
            field: "index",
            headerName: "#"
        },
        {
            field: "status",
            headerName: t("report.scenario.cases.status") ?? "report.scenario.cases.status"
        },
        ...[...cases.explicitArguments, ...cases.derivedArguments].map(argument => ({
            field: argument,
            headerName: argument
        }))
    ];
}
