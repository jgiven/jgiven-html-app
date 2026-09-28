import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useState,
    type ReactNode
} from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import type { JGivenMetaData, Scenario } from "../types/jgivenReport";
import {
    getAbortedScenarios,
    getAllScenarios,
    getCustomNavigationLinks,
    getFailedScenarios,
    getMetaData,
    getPendingScenarios,
    waitForReport
} from "../services/dataService";
import {
    initTagService,
    getScenariosByTag,
    getTagByKey,
    getTagNameNode
} from "../services/tagService";
import {
    initClassService,
    getScenariosOfPackage,
    getTestCaseByClassName
} from "../services/classService";
import { findScenarios } from "../services/searchService";
import {
    applyPagePipeline,
    DEFAULT_ITEMS_PER_PAGE,
    getOptions,
    getOptionsFromSearch,
    getSelectedGroupOption,
    getSelectedOptions,
    getSelectedSortOption,
    type PageOptions,
    type ScenarioGroup
} from "../services/optionService";
import type { Statistics } from "../services/statistics";
import { gatherStatistics, getTotalStatistics } from "../services/statistics";
import {
    capitalize,
    deselectAll,
    getTagName,
    sortByDescription,
    splitClassName
} from "../util/format";
import { useTranslation } from "react-i18next";
import { hashToPath } from "../routing/hashNav";

export interface Bookmark {
    name: string;
    url: string;
    search?: string;
}

export interface CurrentPage {
    title: string;
    subtitle?: string;
    description?: string;
    breadcrumbs: string[];
    summary?: boolean;
    loading?: boolean;
    options?: PageOptions;
    groupedScenarios: ScenarioGroup[];
    statistics?: Statistics;
    filtered: number;
}

interface AppContextValue {
    ready: boolean;
    metaData: JGivenMetaData | null;
    currentPage: CurrentPage;
    showOptions: boolean;
    pagination: boolean;
    totalItems: number;
    currentPageNr: number;
    itemsPerPage: number;
    navHidden: boolean;
    navWidth: number;
    bookmarks: Bookmark[];
    bookmarksExpanded: boolean;
    customNavigationLinks: ReturnType<typeof getCustomNavigationLinks>;
    totalStatistics: Statistics;
    baseScenarios: Scenario[];
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    submitSearch: () => void;
    hideNav: () => void;
    showNav: () => void;
    startResizeNav: (pageX: number) => void;
    summaryExpanded: boolean;
    tagsExpanded: boolean;
    classesExpanded: boolean;
    setSummaryExpanded: (v: boolean) => void;
    setTagsExpanded: (v: boolean) => void;
    setClassesExpanded: (v: boolean) => void;
    setBookmarksExpanded: (v: boolean) => void;
    toggleScenario: (scenario: Scenario) => void;
    expandAll: () => void;
    collapseAll: () => void;
    sortOptionSelected: (id: string) => void;
    groupOptionSelected: (id: string) => void;
    filterOptionSelected: (type: "status" | "tag" | "class", name: string) => void;
    setPage: (page: number) => void;
    showSuccessful: () => void;
    showFailed: () => void;
    showPending: () => void;
    showAborted: () => void;
    clearFilter: () => void;
    toggleBookmark: () => void;
    removeBookmark: (index: number) => void;
    isBookmarked: () => boolean;
    printCurrentPage: () => void;
    refreshPage: () => void;
    bumpRender: () => void;
    navigateToPage: (to: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp outside provider");
    return ctx;
}

function getStatusDescription(
    count: number,
    status: string,
    t: (k: string, o?: object) => string
): string {
    if (count === 0) return t(`no${capitalize(status)}Scenarios`);
    if (count === 1) return t(`one${capitalize(status)}Scenario`);
    return t(`many${capitalize(status)}Scenarios`, { count });
}

export function AppProvider({ children }: { children: ReactNode }) {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [ready, setReady] = useState(false);
    const [metaData, setMetaData] = useState<JGivenMetaData | null>(null);
    const [baseScenarios, setBaseScenarios] = useState<Scenario[]>([]);
    const [currentPage, setCurrentPage] = useState<CurrentPage>({
        title: t("welcome"),
        breadcrumbs: [""],
        groupedScenarios: [],
        filtered: 0,
        summary: true,
        statistics: gatherStatistics([])
    });
    const [showOptions, setShowOptions] = useState(false);
    const [pagination, setPagination] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPageNr, setCurrentPageNr] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [navHidden, setNavHidden] = useState(false);
    const [navWidth, setNavWidth] = useState(400);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [bookmarksExpanded, setBookmarksExpanded] = useState(false);
    const [summaryExpanded, setSummaryExpanded] = useState(true);
    const [tagsExpanded, setTagsExpanded] = useState(true);
    const [classesExpanded, setClassesExpanded] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalStatistics, setTotalStatistics] = useState<Statistics>(gatherStatistics([]));
    const [, setRenderNonce] = useState(0);
    const bumpRender = useCallback(() => setRenderNonce(n => n + 1), []);

    const applyPipeline = useCallback(
        (scenarios: Scenario[], page: CurrentPage, pageNr: number, perPage: number) => {
            if (!page.options) return page;
            const result = applyPagePipeline(
                scenarios,
                page as { options: PageOptions },
                pageNr,
                perPage
            );
            setShowOptions(result.showOptions);
            setPagination(result.pagination);
            setTotalItems(result.totalItems);
            return {
                ...page,
                groupedScenarios: result.groupedScenarios,
                statistics: result.statistics,
                filtered: result.filtered
            };
        },
        []
    );

    const loadRoute = useCallback(
        (routeOverride?: { pathname?: string; search?: URLSearchParams }) => {
            const path = routeOverride?.pathname ?? location.pathname;
            const params = routeOverride?.search ?? searchParams;
            const opts = getOptionsFromSearch(params);
            setCurrentPageNr(opts.page ?? 1);
            setItemsPerPage(opts.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE);

            if (path === "/" || path === "") {
                setBaseScenarios([]);
                setCurrentPage({
                    title: t("welcome"),
                    breadcrumbs: [""],
                    groupedScenarios: [],
                    filtered: 0,
                    summary: true,
                    statistics: getTotalStatistics()
                });
                setShowOptions(false);
                setPagination(false);
                return;
            }

            let scenarios: Scenario[] = [];
            let page: CurrentPage = {
                title: "",
                breadcrumbs: [],
                groupedScenarios: [],
                filtered: 0
            };

            if (path === "/all") {
                scenarios = sortByDescription(getAllScenarios());
                page = {
                    title: t("allScenarios"),
                    breadcrumbs: ["ALL SCENARIOS"],
                    groupedScenarios: [],
                    filtered: 0,
                    loading: false
                };
            } else if (path === "/failed") {
                scenarios = getFailedScenarios();
                page = {
                    title: t("failedScenarios"),
                    description: getStatusDescription(scenarios.length, "failed", t),
                    breadcrumbs: ["FAILED SCENARIOS"],
                    groupedScenarios: [],
                    filtered: 0
                };
            } else if (path === "/pending") {
                scenarios = getPendingScenarios();
                page = {
                    title: t("pendingScenarios"),
                    description: getStatusDescription(scenarios.length, "pending", t),
                    breadcrumbs: ["PENDING SCENARIOS"],
                    groupedScenarios: [],
                    filtered: 0
                };
            } else if (path === "/aborted") {
                scenarios = getAbortedScenarios();
                page = {
                    title: t("abortedScenarios"),
                    description: getStatusDescription(scenarios.length, "aborted", t),
                    breadcrumbs: ["ABORTED SCENARIOS"],
                    groupedScenarios: [],
                    filtered: 0
                };
            } else if (path.startsWith("/class/")) {
                const className = decodeURIComponent(path.slice("/class/".length));
                const testCase = getTestCaseByClassName(className);
                if (testCase) {
                    scenarios = sortByDescription([...testCase.scenarios]);
                    const cn = splitClassName(testCase.className);
                    page = {
                        subtitle: cn.packageName + (testCase.name ? "." + cn.className : ""),
                        title: testCase.name ?? cn.className,
                        description: testCase.description,
                        breadcrumbs: cn.packageName.split("."),
                        groupedScenarios: [],
                        filtered: 0
                    };
                }
            } else if (path.startsWith("/package/")) {
                const packageName = decodeURIComponent(path.slice("/package/".length));
                scenarios = sortByDescription(getScenariosOfPackage(packageName));
                page = {
                    subtitle: t("package"),
                    title: packageName,
                    breadcrumbs: packageName.split("."),
                    groupedScenarios: [],
                    filtered: 0
                };
            } else if (path.startsWith("/tagid/")) {
                const rest = decodeURIComponent(path.slice("/tagid/".length));
                const slash = rest.indexOf("/");
                const type = slash >= 0 ? rest.slice(0, slash) : rest;
                const value = slash >= 0 ? rest.slice(slash + 1) : undefined;
                const tagKey = type + (value ? "-" + value : "");
                const tag = getTagByKey(tagKey);
                if (tag) {
                    scenarios = sortByDescription(getScenariosByTag(tag));
                    page = {
                        title: tag.value
                            ? (tag.prependType ? getTagName(tag) + "-" : "") + tag.value
                            : getTagName(tag),
                        subtitle: tag.value && !tag.prependType ? getTagName(tag) : undefined,
                        description: tag.description,
                        breadcrumbs: ["TAGS", getTagName(tag), tag.value ?? ""].filter(
                            Boolean
                        ) as string[],
                        groupedScenarios: [],
                        filtered: 0
                    };
                }
            } else if (path.startsWith("/tag/")) {
                const rest = decodeURIComponent(path.slice("/tag/".length));
                const parts = rest.split("/");
                const name = parts[0];
                if (parts.length > 1) {
                    const tagKey = parts[0] + "-" + parts[1];
                    const tag = getTagByKey(tagKey);
                    if (tag) {
                        scenarios = sortByDescription(getScenariosByTag(tag));
                        page = {
                            title: tag.value
                                ? (tag.prependType ? getTagName(tag) + "-" : "") + tag.value
                                : getTagName(tag),
                            subtitle: tag.value && !tag.prependType ? getTagName(tag) : undefined,
                            description: tag.description,
                            breadcrumbs: ["TAGS", getTagName(tag), tag.value ?? ""].filter(
                                Boolean
                            ) as string[],
                            groupedScenarios: [],
                            filtered: 0
                        };
                    }
                } else {
                    const nameNode = getTagNameNode(name);
                    if (nameNode) {
                        scenarios = sortByDescription(nameNode.scenarios());
                        page = {
                            title: nameNode.nodeName(),
                            description: "",
                            breadcrumbs: ["TAGS", nameNode.nodeName()],
                            groupedScenarios: [],
                            filtered: 0
                        };
                    }
                }
            } else if (path.startsWith("/scenario/")) {
                const rest = path.slice("/scenario/".length);
                const slash = rest.indexOf("/");
                const className = decodeURIComponent(rest.slice(0, slash));
                const method = decodeURIComponent(rest.slice(slash + 1));
                const testCase = getTestCaseByClassName(className);
                if (testCase) {
                    scenarios = sortByDescription(
                        testCase.scenarios.filter(s => s.testMethodName === method)
                    );
                    if (scenarios[0]) {
                        page = {
                            title: capitalize(scenarios[0].description),
                            subtitle: className,
                            description: scenarios[0].extendedDescription,
                            breadcrumbs: ["SCENARIO", ...className.split("."), method],
                            groupedScenarios: [],
                            filtered: 0
                        };
                    }
                }
            } else if (path.startsWith("/search/")) {
                const query = decodeURIComponent(path.slice("/search/".length));
                scenarios = findScenarios(query);
                page = {
                    title: t("searchResults"),
                    description: t("searchedFor", { query }),
                    breadcrumbs: ["Search", query],
                    groupedScenarios: [],
                    filtered: 0,
                    loading: false
                };
            }

            setBaseScenarios(scenarios);
            page.options = getOptions(scenarios, opts);
            page.summary = false;
            const updated = applyPipeline(
                scenarios,
                page,
                opts.page ?? 1,
                opts.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE
            );
            setCurrentPage(updated);
        },
        [location.pathname, searchParams, t, applyPipeline]
    );

    const navigateToPage = useCallback(
        (to: string) => {
            const qIndex = to.indexOf("?");
            const pathname = qIndex >= 0 ? to.slice(0, qIndex) : to;
            const search =
                qIndex >= 0 ? new URLSearchParams(to.slice(qIndex + 1)) : new URLSearchParams();
            flushSync(() => {
                navigate({ pathname, search: search.toString() });
                loadRoute({ pathname, search });
            });
        },
        [loadRoute, navigate]
    );

    useEffect(() => {
        void waitForReport().then(() => {
            initTagService();
            initClassService();
            setMetaData(getMetaData() ?? null);
            setTotalStatistics(getTotalStatistics());
            const stored = localStorage.getItem("bookmarks");
            if (stored) setBookmarks(JSON.parse(stored) as Bookmark[]);
            setReady(true);
        });
    }, []);

    useLayoutEffect(() => {
        if (ready) {
            flushSync(() => {
                loadRoute();
            });
        }
    }, [ready, loadRoute]);

    useEffect(() => {
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }, [bookmarks]);

    const updateSearchParams = useCallback(
        (updates: Record<string, string | null>) => {
            const next = new URLSearchParams(searchParams);
            Object.entries(updates).forEach(([k, v]) => {
                if (v === null || v === undefined) next.delete(k);
                else next.set(k, v);
            });
            setSearchParams(next, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const syncOptionParams = useCallback(
        (page: CurrentPage) => {
            if (!page.options) return;
            const sort = getSelectedSortOption(page as { options: PageOptions });
            const group = getSelectedGroupOption(page as { options: PageOptions });
            const tags = getSelectedOptions(page.options.tagOptions);
            const status = getSelectedOptions(page.options.statusOptions);
            const classes = getSelectedOptions(page.options.classOptions);
            updateSearchParams({
                sort: sort.default ? null : sort.id ?? null,
                group: group.default ? null : group.id ?? null,
                tags: tags.length ? tags.map(x => x.name).join(";") : null,
                status: status.length ? status.map(x => x.id!).join(";") : null,
                classes: classes.length ? classes.map(x => x.name).join(";") : null,
                page: pagination ? String(currentPageNr) : null,
                itemsPerPage: pagination ? String(itemsPerPage) : null
            });
        },
        [currentPageNr, itemsPerPage, pagination, updateSearchParams]
    );

    const reapply = useCallback(
        (scenarios: Scenario[], page: CurrentPage) => {
            const updated = applyPipeline(scenarios, page, currentPageNr, itemsPerPage);
            setCurrentPage(updated);
            syncOptionParams(updated);
        },
        [applyPipeline, currentPageNr, itemsPerPage, syncOptionParams]
    );

    const isRootPath =
        location.pathname === "/" || location.pathname === "" || location.pathname === "/all";

    const value: AppContextValue = {
        ready,
        metaData,
        currentPage,
        showOptions,
        pagination,
        totalItems,
        currentPageNr,
        itemsPerPage,
        navHidden,
        navWidth,
        bookmarks,
        bookmarksExpanded,
        customNavigationLinks: getCustomNavigationLinks(),
        totalStatistics,
        baseScenarios,
        searchQuery,
        setSearchQuery,
        summaryExpanded,
        tagsExpanded,
        classesExpanded,
        setSummaryExpanded,
        setTagsExpanded,
        setClassesExpanded,
        setBookmarksExpanded,
        submitSearch: () => {
            if (searchQuery.trim())
                navigateToPage("/search/" + encodeURIComponent(searchQuery.trim()));
        },
        hideNav: () => setNavHidden(true),
        showNav: () => setNavHidden(false),
        startResizeNav: (pageX: number) => {
            const startX = pageX;
            const startWidth = navWidth;
            const onMove = (e: MouseEvent) => {
                const newWidth = Math.max(20, startWidth + (startX - e.pageX));
                setNavWidth(newWidth);
            };
            const onUp = () => {
                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("mouseup", onUp);
            };
            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", onUp);
        },
        toggleScenario: scenario => {
            scenario.expanded = !scenario.expanded;
            bumpRender();
        },
        expandAll: () => {
            baseScenarios.forEach(s => {
                s.expanded = true;
            });
            currentPage.groupedScenarios.forEach(g => {
                g.values.forEach(s => {
                    s.expanded = true;
                });
            });
            bumpRender();
        },
        collapseAll: () => {
            baseScenarios.forEach(s => {
                s.expanded = false;
            });
            currentPage.groupedScenarios.forEach(g => {
                g.values.forEach(s => {
                    s.expanded = false;
                });
            });
            bumpRender();
        },
        sortOptionSelected: id => {
            if (!currentPage.options) return;
            deselectAll(currentPage.options.sortOptions);
            currentPage.options.sortOptions.find(o => o.id === id)!.selected = true;
            reapply(baseScenarios, { ...currentPage });
        },
        groupOptionSelected: id => {
            if (!currentPage.options) return;
            deselectAll(currentPage.options.groupOptions);
            currentPage.options.groupOptions.find(o => o.id === id)!.selected = true;
            reapply(baseScenarios, { ...currentPage });
        },
        filterOptionSelected: (type, name) => {
            if (!currentPage.options) return;
            const list =
                type === "status"
                    ? currentPage.options.statusOptions
                    : type === "tag"
                      ? currentPage.options.tagOptions
                      : currentPage.options.classOptions;
            const opt = list.find(o => o.name === name || o.id === name);
            if (opt) opt.selected = !opt.selected;
            reapply(baseScenarios, { ...currentPage });
        },
        setPage: page => {
            setCurrentPageNr(page);
            updateSearchParams({ page: String(page) });
            if (currentPage.options) {
                const updated = applyPipeline(baseScenarios, currentPage, page, itemsPerPage);
                setCurrentPage(updated);
            }
        },
        showSuccessful: () => {
            flushSync(() => {
                if (location.pathname === "/" || location.pathname === "") {
                    navigateToPage("/all?status=success");
                } else {
                    const next = new URLSearchParams(searchParams);
                    next.set("status", "success");
                    setSearchParams(next, { replace: true });
                    loadRoute({ search: next });
                }
            });
        },
        showFailed: () => {
            flushSync(() => {
                if (isRootPath) {
                    navigateToPage("/failed");
                } else {
                    const next = new URLSearchParams(searchParams);
                    next.set("status", "fail");
                    setSearchParams(next, { replace: true });
                    loadRoute({ search: next });
                }
            });
        },
        showPending: () => {
            flushSync(() => {
                if (isRootPath) {
                    navigateToPage("/pending");
                } else {
                    const next = new URLSearchParams(searchParams);
                    next.set("status", "pending");
                    setSearchParams(next, { replace: true });
                    loadRoute({ search: next });
                }
            });
        },
        showAborted: () => {
            flushSync(() => {
                if (isRootPath) {
                    navigateToPage("/aborted");
                } else {
                    const next = new URLSearchParams(searchParams);
                    next.set("status", "aborted");
                    setSearchParams(next, { replace: true });
                    loadRoute({ search: next });
                }
            });
        },
        clearFilter: () => {
            if (location.pathname === "/") navigate("/all");
            else updateSearchParams({ status: null, tags: null, classes: null });
        },
        toggleBookmark: () => {
            const idx = bookmarks.findIndex(
                b => hashToPath(b.url) === location.pathname && (b.search ?? "") === location.search
            );
            if (idx >= 0) {
                setBookmarks(bookmarks.filter((_, i) => i !== idx));
            } else {
                setBookmarks([
                    ...bookmarks,
                    {
                        name:
                            currentPage.title === t("searchResults")
                                ? currentPage.description!
                                : currentPage.title,
                        url: "#" + location.pathname,
                        search: location.search || undefined
                    }
                ]);
            }
        },
        removeBookmark: index => setBookmarks(bookmarks.filter((_, i) => i !== index)),
        isBookmarked: () =>
            bookmarks.some(
                b => hashToPath(b.url) === location.pathname && (b.search ?? "") === location.search
            ),
        printCurrentPage: () => {
            baseScenarios.forEach(s => {
                s.expanded = true;
            });
            bumpRender();
            setTimeout(() => window.print(), 50);
        },
        refreshPage: () => loadRoute(),
        bumpRender,
        navigateToPage
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
