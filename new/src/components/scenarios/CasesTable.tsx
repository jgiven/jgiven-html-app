import { Fragment, useMemo, useState } from "react";
import type { Scenario, ScenarioCase } from "../../types/jgivenReport";
import { nanosToReadableUnit } from "../../util/format";
import { useApp } from "../../context/AppProvider";

interface Column {
    name: string;
    sorting?: "asc" | "desc";
    canGroup: boolean;
    isStatus?: boolean;
    grouping?: boolean;
    getValue: (aCase: ScenarioCase) => unknown;
}

interface CaseGroup {
    name: unknown;
    cases: ScenarioCase[];
    expanded?: boolean;
    hide?: boolean;
}

function initializeColumns(scenario: Scenario): Column[] {
    const columns: Column[] = [
        {
            name: "#",
            sorting: "desc",
            canGroup: false,
            getValue: aCase => aCase.caseNr
        }
    ];

    if (scenario.scenarioCases[0]?.description) {
        columns.push({
            name: "Description",
            canGroup: true,
            getValue: aCase => aCase.description
        });
    }

    scenario.derivedParameters?.forEach((param, index) => {
        columns.push({
            name: param,
            canGroup: true,
            getValue: aCase => aCase.derivedArguments?.[index]
        });
    });

    columns.push({
        name: "Status",
        canGroup: true,
        isStatus: true,
        getValue: aCase => aCase.status !== "FAILED"
    });

    return columns;
}

function sort(col: Column, cases: ScenarioCase[]): ScenarioCase[] {
    const sorted = [...cases].sort((a, b) => {
        const av = col.getValue(a);
        const bv = col.getValue(b);
        if (av === bv) return 0;
        if (av === undefined || av === null) return 1;
        if (bv === undefined || bv === null) return -1;
        return String(av).localeCompare(String(bv));
    });
    return col.sorting === "asc" ? sorted.reverse() : sorted;
}

function groupCases(col: Column, cases: ScenarioCase[]): CaseGroup[] {
    const sortedByGroupValue = sort(col, cases);
    const groups: CaseGroup[] = [];
    let group: CaseGroup = { name: undefined, cases: [] };

    sortedByGroupValue.forEach(aCase => {
        const value = col.getValue(aCase);
        if (group.name !== value) {
            group = { name: value, cases: [] };
            groups.push(group);
        }
        group.cases.push(aCase);
    });

    return groups;
}

export function CasesTable({ scenario }: { scenario: Scenario }) {
    const { bumpRender } = useApp();
    const [columns, setColumns] = useState(() => initializeColumns(scenario));
    const [groupColumn, setGroupColumn] = useState<Column | undefined>();
    const [groups, setGroups] = useState<CaseGroup[]>([
        { hide: true, name: "All", cases: scenario.scenarioCases, expanded: true }
    ]);
    const [sortColumn, setSortColumn] = useState(columns[0]);
    const [groupMenuOpen, setGroupMenuOpen] = useState(false);

    const groupColumns = useMemo(() => columns.filter(c => c.canGroup), [columns]);

    const applySorting = (col: Column, nextGroups: CaseGroup[]) => {
        return nextGroups.map(g => ({ ...g, cases: sort(col, g.cases) }));
    };

    const changeSorting = (col: Column) => {
        const oldSorting = col.sorting;
        const next = columns.map(c => ({ ...c, sorting: undefined as "asc" | "desc" | undefined }));
        const target = next.find(c => c.name === col.name)!;
        target.sorting = oldSorting === "desc" ? "asc" : "desc";
        setColumns(next);
        setSortColumn(target);
        setGroups(gs => applySorting(target, gs));
    };

    const changeGrouping = (col: Column) => {
        const wasGrouping = col.grouping;
        const next = columns.map(c => ({ ...c, grouping: false }));
        const target = next.find(c => c.name === col.name)!;
        target.grouping = !wasGrouping;
        setColumns(next);
        setGroupMenuOpen(false);

        if (!target.grouping) {
            setGroupColumn(undefined);
            setGroups([{ hide: true, name: "All", cases: scenario.scenarioCases, expanded: true }]);
        } else {
            setGroupColumn(target);
            setGroups(applySorting(sortColumn, groupCases(target, scenario.scenarioCases)));
        }
    };

    const setExpanded = (value: boolean) => {
        setGroups(gs => gs.map(g => ({ ...g, expanded: value })));
    };

    return (
        <div>
            <h6 className="cases-table-header">
                Cases
                {scenario.scenarioCases.length > 2 && (
                    <ul className="button-group radius right">
                        <li>
                            <a
                                className="button dropdown small secondary group-by"
                                onClick={() => setGroupMenuOpen(!groupMenuOpen)}
                            >
                                Group by <b>{groupColumn?.name ?? ""}</b>
                            </a>
                            <ul
                                className="f-dropdown"
                                style={{ display: groupMenuOpen ? "block" : "none" }}
                            >
                                {groupColumns.map(col => (
                                    <li key={col.name}>
                                        <a onClick={() => changeGrouping(col)}>
                                            <i
                                                className={`fa fa-check ${col.grouping ? "selected" : "unselected"}`}
                                            />{" "}
                                            {col.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                        <li>
                            <a
                                title="Expand Groups"
                                className="button small secondary icon-button"
                                onClick={() => setExpanded(true)}
                            >
                                <i className="fa fa-expand" />
                            </a>
                        </li>
                        <li>
                            <a
                                title="Collapse Groups"
                                className="button small secondary icon-button"
                                onClick={() => setExpanded(false)}
                            >
                                <i className="fa fa-compress" />
                            </a>
                        </li>
                    </ul>
                )}
            </h6>
            <table className="data-table" style={{ width: "100%" }}>
                <thead>
                    <tr>
                        {columns.map(col =>
                            !(col.grouping && !col.isStatus) ? (
                                <th
                                    key={col.name}
                                    nowrap
                                    className="toggle"
                                    onClick={() => changeSorting(col)}
                                >
                                    {col.name}
                                    <span className="fa-stack fa-lg sort-icon">
                                        {col.sorting !== "asc" && (
                                            <i className="fa fa-caret-up sort-icon fa-stack-1x" />
                                        )}
                                        {col.sorting !== "desc" && (
                                            <i className="fa fa-caret-down sort-icon fa-stack-1x" />
                                        )}
                                    </span>
                                </th>
                            ) : null
                        )}
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group, gi) => (
                        <Fragment key={`group-${gi}`}>
                            {!group.hide && (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="cases-group-header toggle"
                                        onClick={() => {
                                            group.expanded = !group.expanded;
                                            bumpRender();
                                            setGroups([...groups]);
                                        }}
                                    >
                                        <b>
                                            <i
                                                className={`fa fa-fw ${group.expanded ? "fa-angle-down" : "fa-angle-right"}`}
                                            />
                                        </b>{" "}
                                        {!groupColumn?.isStatus && <b>{String(group.name)}</b>}
                                        {groupColumn?.isStatus && (
                                            <b>{group.name === true ? "Success" : "Failed"}</b>
                                        )}
                                    </td>
                                </tr>
                            )}
                            {group.expanded &&
                                group.cases.map((aCase, ci) => (
                                    <tr key={`${gi}-${ci}`}>
                                        {columns.map(col =>
                                            !(col.grouping && !col.isStatus) ? (
                                                <td key={col.name}>
                                                    {!col.isStatus && (
                                                        <div>
                                                            {String(col.getValue(aCase) ?? "")}
                                                        </div>
                                                    )}
                                                    {col.isStatus && aCase.status !== "FAILED" && (
                                                        <div>
                                                            <i className="check fa fa-check-square" />
                                                            {(aCase.durationInNanos ?? 0) >
                                                                10000000 && (
                                                                <span className="duration">
                                                                    {" "}
                                                                    (
                                                                    {nanosToReadableUnit(
                                                                        aCase.durationInNanos!
                                                                    )}
                                                                    )
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {col.isStatus && aCase.status === "FAILED" && (
                                                        <div data-alert className="alert-box alert">
                                                            <pre
                                                                className="toggle"
                                                                onClick={() => {
                                                                    aCase.stackTraceExpanded =
                                                                        !aCase.stackTraceExpanded;
                                                                    bumpRender();
                                                                }}
                                                            >
                                                                <i
                                                                    className={`fa fa-caret-right toggle ${aCase.stackTraceExpanded ? "fa-rotate-90" : ""}`}
                                                                />{" "}
                                                                FAILED: {aCase.errorMessage}
                                                                {aCase.stackTraceExpanded &&
                                                                    aCase.stackTrace &&
                                                                    "\n" +
                                                                        aCase.stackTrace.join("\n")}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </td>
                                            ) : null
                                        )}
                                    </tr>
                                ))}
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
