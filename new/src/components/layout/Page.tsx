import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppProvider";
import { AppHeader, MetadataFooter } from "./AppHeader";
import { Sidebar } from "../sidebar/Sidebar";
import { StatisticsRow } from "../scenarios/StatisticsRow";
import { OptionDropdowns } from "../scenarios/OptionDropdowns";
import { PaginationBar } from "../scenarios/PaginationBar";
import { ScenarioList } from "../scenarios/ScenarioList";
import { DonutChart } from "../scenarios/DonutChart";

export function Page() {
    const { t } = useTranslation();
    const {
        ready,
        currentPage,
        navHidden,
        navWidth,
        collapseAll,
        expandAll,
        printCurrentPage,
        toggleBookmark,
        isBookmarked
    } = useApp();

    if (!ready) {
        return (
            <div id="loading-modal">
                <h1>
                    {t("loading")} <i className="fa fa-circle-o-notch fa-spin" />
                </h1>
            </div>
        );
    }

    return (
        <div className="off-canvas-wrap off-canvas-wrap-fix-resize">
            <div className="inner-wrap">
                <AppHeader />
                <div className="row content">
                    <Sidebar />
                    <div
                        id="scenario-container"
                        style={{
                            marginLeft: navHidden ? 0 : navWidth,
                            marginTop: 76
                        }}
                    >
                        <div className="row title">
                            <div className="small-12 large-8 column title-column">
                                {currentPage.subtitle && (
                                    <h2 className="subtitle">{currentPage.subtitle}</h2>
                                )}
                                <h2 id="page-title">{currentPage.title}</h2>
                                {currentPage.description && (
                                    <h3
                                        className="description"
                                        dangerouslySetInnerHTML={{
                                            __html: currentPage.description
                                        }}
                                    />
                                )}
                            </div>
                            <div className="small-12 large-4 column statistics-chart-column clearfix show-for-large-up">
                                <DonutChart />
                            </div>
                            {!currentPage.summary && (
                                <div className="page-icon-bar">
                                    <a title={t("collapseAll")} onClick={collapseAll}>
                                        <i className="fa fa-minus-square-o collapse-icon toggle" />
                                    </a>
                                    <a title={t("expandAll")} onClick={expandAll}>
                                        <i className="fa fa-plus-square-o expand-icon toggle" />
                                    </a>
                                    <a title={t("printPage")} onClick={printCurrentPage}>
                                        <i className="fa fa-print print-icon toggle" />
                                    </a>
                                    <a title={t("addBookmark")} onClick={toggleBookmark}>
                                        <i
                                            className={`fa fa-bookmark add-bookmark-icon toggle ${isBookmarked() ? "bookmarked" : ""}`}
                                        />
                                    </a>
                                </div>
                            )}
                        </div>

                        {currentPage.loading && (
                            <h4>
                                {t("loading")} <i className="fa fa-circle-o-notch fa-spin" />
                            </h4>
                        )}

                        <div className="scenario-list-button-bar row">
                            {currentPage.statistics && <StatisticsRow />}
                            <OptionDropdowns />
                        </div>

                        <PaginationBar position="top" />
                        <ScenarioList />
                        <PaginationBar position="bottom" />
                        <MetadataFooter />
                    </div>
                </div>
            </div>
        </div>
    );
}
