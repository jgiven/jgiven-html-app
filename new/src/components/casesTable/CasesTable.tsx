interface CasesTableProps {
    columns: Column[],
    groupColumns: Column[],
    cases: Case[],
    groups: Group[],
    sortColumn: Column,
    groupColumn: Column|undefined,
}

interface Group {
    hide: boolean,
    name: string,
    cases: Case[],
    expanded: boolean,
}

interface Case {
 [x:string]: unknown //that is almost as good as any, but I don't know the case yet.
}

interface Column {
    name: string,
    sorting: "desc" | "asc",
    canGroup: boolean,
    getValue: (aCase: string) => number
}

export function casesTable(props: CasesTableProps) {

    return (<div></div>);
}