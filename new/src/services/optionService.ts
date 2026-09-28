import type { JGivenTag, Scenario } from "../types/jgivenReport";
import {
    deselectAll,
    getReadableExecutionStatus,
    getTagName,
    ownProperties,
    tagToString
} from "../util/format";

export interface FilterOption {
    selected?: boolean;
    name: string;
    id?: string;
    default?: boolean;
    apply: (scenario: Scenario) => boolean;
}

export interface SortOption {
    selected?: boolean;
    name: string;
    id?: string;
    default?: boolean;
    apply: (scenarios: Scenario[]) => Scenario[];
}

export interface GroupOption {
    selected?: boolean;
    name: string;
    id?: string;
    default?: boolean;
    apply: (scenarios: Scenario[]) => ScenarioGroup[];
}

export interface ScenarioGroup {
    name: string;
    values: Scenario[];
    counts: { failed: number; pending: number; aborted?: number; durationInNanos: number };
    expanded?: boolean;
    hide?: boolean;
}

export interface PageOptions {
    sortOptions: SortOption[];
    groupOptions: GroupOption[];
    statusOptions: FilterOption[];
    tagOptions: FilterOption[];
    classOptions: FilterOption[];
}

export interface OptionSelection {
    page?: number;
    itemsPerPage?: number;
    sort?: string;
    group?: string;
    tags?: string[];
    classes?: string[];
    status?: string[];
}

export const DEFAULT_ITEMS_PER_PAGE = 40;

function groupTagsByType(tagList: JGivenTag[]) {
    const types: Record<string, JGivenTag[]> = {};
    tagList.forEach(x => {
        const name = getTagName(x);
        if (!types[name]) types[name] = [];
        types[name].push(x);
    });
    return Object.keys(types)
        .sort()
        .map(key => ({ type: key, tags: types[key] }));
}

function getUniqueSortedTags(scenarios: Scenario[]): JGivenTag[] {
    const allTags: Record<string, JGivenTag> = {};
    scenarios.forEach(scenario => {
        scenario.tags.forEach(tag => {
            allTags[tagToString(tag)] = tag;
        });
    });
    return ownProperties(allTags as Record<string, unknown>)
        .sort()
        .map(tagName => allTags[tagName]);
}

function getUniqueSortedClassNames(scenarios: Scenario[]): string[] {
    const allClasses: Record<string, boolean> = {};
    scenarios.forEach(scenario => {
        allClasses[scenario.className] = true;
    });
    return ownProperties(allClasses as Record<string, unknown>).sort() as string[];
}

function countFailedAndPending(scenarios: Scenario[]) {
    const counts = { failed: 0, pending: 0, aborted: 0, durationInNanos: 0 };
    scenarios.forEach(scenario => {
        if (scenario.executionStatus === "FAILED") counts.failed++;
        else if (scenario.executionStatus === "PENDING") counts.pending++;
        else if (scenario.executionStatus === "ABORTED") counts.aborted++;
        counts.durationInNanos += scenario.durationInNanos;
    });
    return counts;
}

function toArrayOfGroups(obj: Record<string, Scenario[]>): ScenarioGroup[] {
    return ownProperties(obj as Record<string, unknown>)
        .map(p => ({
            name: p,
            values: obj[p],
            counts: countFailedAndPending(obj[p])
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

function groupByTag(scenarios: Scenario[]): Record<string, Scenario[]> {
    const result: Record<string, Scenario[]> = {};
    scenarios.forEach(scenario => {
        scenario.tags.forEach(tag => {
            const tagName = tagToString(tag);
            if (!result[tagName]) result[tagName] = [];
            result[tagName].push(scenario);
        });
        if (scenario.tags.length === 0) {
            if (!result[" No Tag"]) result[" No Tag"] = [];
            result[" No Tag"].push(scenario);
        }
    });
    return result;
}

function getTagOfType(tags: JGivenTag[], type: string): JGivenTag[] {
    return tags.filter(tag => getTagName(tag) === type);
}

function getDefaultStatusOptions(): FilterOption[] {
    return [
        {
            selected: false,
            name: "Successful",
            id: "success",
            apply: scenario => scenario.executionStatus === "SUCCESS"
        },
        {
            selected: false,
            name: "Failed",
            id: "fail",
            apply: scenario => scenario.executionStatus === "FAILED"
        },
        {
            selected: false,
            name: "Pending",
            id: "pending",
            apply: scenario =>
                scenario.executionStatus !== "SUCCESS" && scenario.executionStatus !== "FAILED"
        }
    ];
}

function getDefaultTagOptions(uniqueSortedTags: JGivenTag[]): FilterOption[] {
    return uniqueSortedTags.map(tag => {
        const tagName = tagToString(tag);
        return {
            selected: false,
            name: tagName,
            apply: scenario => scenario.tags.some(t => tagToString(t) === tagName)
        };
    });
}

function getDefaultClassOptions(scenarios: Scenario[]): FilterOption[] {
    return getUniqueSortedClassNames(scenarios).map(className => ({
        selected: false,
        name: className,
        apply: scenario => scenario.className === className
    }));
}

function getDefaultGroupOptions(): GroupOption[] {
    return [
        {
            selected: true,
            default: true,
            id: "none",
            name: "None",
            apply: scenarios => {
                const result = toArrayOfGroups({ all: scenarios });
                result[0].expanded = true;
                return result;
            }
        },
        {
            selected: false,
            id: "class",
            name: "Class",
            apply: scenarios => {
                const grouped: Record<string, Scenario[]> = {};
                scenarios.forEach(s => {
                    if (!grouped[s.className]) grouped[s.className] = [];
                    grouped[s.className].push(s);
                });
                return toArrayOfGroups(grouped);
            }
        },
        {
            selected: false,
            id: "classtitle",
            name: "Class Title",
            apply: scenarios => {
                const grouped: Record<string, Scenario[]> = {};
                scenarios.forEach(s => {
                    const key = s.classTitle ?? "<No Title>";
                    if (!grouped[key]) grouped[key] = [];
                    grouped[key].push(s);
                });
                return toArrayOfGroups(grouped);
            }
        },
        {
            selected: false,
            id: "status",
            name: "Status",
            apply: scenarios => {
                const grouped: Record<string, Scenario[]> = {};
                scenarios.forEach(s => {
                    const key = getReadableExecutionStatus(s.executionStatus);
                    if (!grouped[key]) grouped[key] = [];
                    grouped[key].push(s);
                });
                return toArrayOfGroups(grouped);
            }
        },
        {
            selected: false,
            id: "tag",
            name: "Tag",
            apply: scenarios => toArrayOfGroups(groupByTag(scenarios))
        }
    ];
}

function getTagSortOptions(uniqueSortedTags: JGivenTag[]): SortOption[] {
    const result: SortOption[] = [];
    groupTagsByType(uniqueSortedTags).forEach(tagType => {
        if (tagType.tags.length > 1) {
            result.push({
                selected: false,
                name: tagType.type,
                apply: scenarios =>
                    [...scenarios].sort((a, b) => {
                        const x = getTagOfType(a.tags, tagType.type)[0];
                        const y = getTagOfType(b.tags, tagType.type)[0];
                        const xv = x?.value ?? "";
                        const yv = y?.value ?? "";
                        return String(xv).localeCompare(String(yv));
                    })
            });
        }
    });
    return result;
}

function getDefaultSortOptions(uniqueSortedTags: JGivenTag[]): SortOption[] {
    return [
        {
            selected: true,
            default: true,
            id: "name-asc",
            name: "A-Z",
            apply: scenarios =>
                [...scenarios].sort((a, b) => {
                    const av =
                        (a.classTitle ? a.classTitle + " " : "Z") + a.description.toLowerCase();
                    const bv =
                        (b.classTitle ? b.classTitle + " " : "Z") + b.description.toLowerCase();
                    return av.localeCompare(bv);
                })
        },
        {
            selected: false,
            id: "name-desc",
            name: "Z-A",
            apply: scenarios =>
                [...scenarios]
                    .sort((a, b) => {
                        const av =
                            (a.classTitle ? a.classTitle + " " : "Z") + a.description.toLowerCase();
                        const bv =
                            (b.classTitle ? b.classTitle + " " : "Z") + b.description.toLowerCase();
                        return av.localeCompare(bv);
                    })
                    .reverse()
        },
        {
            selected: false,
            id: "status-asc",
            name: "Failed",
            apply: scenarios =>
                [...scenarios].sort((a, b) => a.executionStatus.localeCompare(b.executionStatus))
        },
        {
            selected: false,
            id: "status-desc",
            name: "Successful",
            apply: scenarios =>
                [...scenarios]
                    .sort((a, b) => a.executionStatus.localeCompare(b.executionStatus))
                    .reverse()
        },
        {
            selected: false,
            id: "duration-asc",
            name: "Fastest",
            apply: scenarios => [...scenarios].sort((a, b) => a.durationInNanos - b.durationInNanos)
        },
        {
            selected: false,
            id: "duration-desc",
            name: "Slowest",
            apply: scenarios => [...scenarios].sort((a, b) => b.durationInNanos - a.durationInNanos)
        },
        ...getTagSortOptions(uniqueSortedTags)
    ];
}

export function getDefaultOptions(scenarios: Scenario[]): PageOptions {
    const uniqueSortedTags = getUniqueSortedTags(scenarios);
    return {
        sortOptions: getDefaultSortOptions(uniqueSortedTags),
        groupOptions: getDefaultGroupOptions(),
        statusOptions: getDefaultStatusOptions(),
        tagOptions: getDefaultTagOptions(uniqueSortedTags),
        classOptions: getDefaultClassOptions(scenarios)
    };
}

function selectOption(
    property: "id" | "name",
    value: string,
    options: { selected?: boolean; id?: string; name?: string }[]
) {
    const match = options.find(option => option[property] === value);
    if (match) match.selected = true;
}

export function getOptions(scenarios: Scenario[], optionSelection: OptionSelection): PageOptions {
    const result = getDefaultOptions(scenarios);

    if (optionSelection.sort) {
        deselectAll(result.sortOptions);
        selectOption("id", optionSelection.sort, result.sortOptions);
    }
    if (optionSelection.group) {
        deselectAll(result.groupOptions);
        selectOption("id", optionSelection.group, result.groupOptions);
    }
    optionSelection.tags?.forEach(tagName => {
        selectOption("name", tagName, result.tagOptions);
    });
    optionSelection.status?.forEach(status => {
        selectOption("id", status, result.statusOptions);
    });
    optionSelection.classes?.forEach(className => {
        selectOption("name", className, result.classOptions);
    });

    return result;
}

export function getOptionsFromSearch(search: URLSearchParams): OptionSelection {
    return {
        page: parseInt(search.get("page") ?? "1") || 1,
        itemsPerPage:
            parseInt(search.get("itemsPerPage") ?? String(DEFAULT_ITEMS_PER_PAGE)) ||
            DEFAULT_ITEMS_PER_PAGE,
        sort: search.get("sort") ?? undefined,
        group: search.get("group") ?? undefined,
        tags: search.get("tags")?.split(";").filter(Boolean) ?? [],
        classes: search.get("classes")?.split(";").filter(Boolean) ?? [],
        status: search.get("status")?.split(";").filter(Boolean) ?? []
    };
}

export function getSelectedOptions<T extends { selected?: boolean }>(options: T[]): T[] {
    return options.filter(o => o.selected);
}

export function getSelectedSortOption(page: { options: PageOptions }): SortOption {
    return getSelectedOptions(page.options.sortOptions)[0];
}

export function getSelectedGroupOption(page: { options: PageOptions }): GroupOption {
    return getSelectedOptions(page.options.groupOptions)[0];
}

function anyOptionMatches(filterOptions: FilterOption[]) {
    if (filterOptions.length === 0) {
        return () => true;
    }
    return (scenario: Scenario) => filterOptions.some(opt => opt.apply(scenario));
}

function allOptionMatches(filterOptions: FilterOption[]) {
    if (filterOptions.length === 0) {
        return () => true;
    }
    return (scenario: Scenario) => filterOptions.every(opt => opt.apply(scenario));
}

export function getFilterFunction(page: { options: PageOptions }) {
    const statusMatches = anyOptionMatches(getSelectedOptions(page.options.statusOptions));
    const tagMatches = allOptionMatches(getSelectedOptions(page.options.tagOptions));
    const classMatches = anyOptionMatches(getSelectedOptions(page.options.classOptions));
    return (scenario: Scenario) =>
        statusMatches(scenario) && tagMatches(scenario) && classMatches(scenario);
}

import { gatherStatistics } from "./statistics";

export function applyPagePipeline(
    baseScenarios: Scenario[],
    page: { options: PageOptions },
    pageNr: number,
    itemsPerPage: number
): {
    groupedScenarios: ScenarioGroup[];
    filteredScenarios: Scenario[];
    statistics: ReturnType<typeof gatherStatistics>;
    filtered: number;
    showOptions: boolean;
    pagination: boolean;
    totalItems: number;
} {
    const selectedSortOption = getSelectedSortOption(page);
    const filterFn = getFilterFunction(page);

    const filteredScenarios = selectedSortOption.apply(baseScenarios.filter(filterFn));
    const showOptions = baseScenarios.length > 1;
    const totalItems = filteredScenarios.length;
    const groupOption = getSelectedGroupOption(page);

    let scenariosOfCurrentPage = filteredScenarios;
    let pagination = false;

    if (groupOption.name === "None" && totalItems > itemsPerPage) {
        pagination = true;
        const start = (pageNr - 1) * itemsPerPage;
        scenariosOfCurrentPage = filteredScenarios.slice(start, start + itemsPerPage);
    }

    const groupedScenarios = groupOption.apply(scenariosOfCurrentPage);

    return {
        groupedScenarios,
        filteredScenarios,
        statistics: gatherStatistics(filteredScenarios),
        filtered: baseScenarios.length - filteredScenarios.length,
        showOptions,
        pagination,
        totalItems
    };
}
