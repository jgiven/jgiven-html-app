import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppProvider";
import { nanosToReadableUnit } from "../../util/format";

export function StatisticsRow() {
    const { t } = useTranslation();
    const { currentPage, showSuccessful, showFailed, showPending, showAborted, clearFilter } =
        useApp();
    const stats = currentPage.statistics;
    if (!stats) return null;

    return (
        <div id="statistics" className="small-12 large-6 columns no-pad-left">
            <span
                className={`${stats.success === 0 ? "gray" : ""} toggle`}
                onClick={showSuccessful}
            >
                <i
                    className={`fa fa-check-square ${stats.aborted + stats.failed + stats.pending === 0 && stats.success > 0 ? "check" : "gray"}`}
                />{" "}
                {stats.success} {t("successful")}
            </span>
            ,{" "}
            <span className={`${stats.failed > 0 ? "red" : "gray"} toggle`} onClick={showFailed}>
                <i className="fa fa-exclamation-circle" /> {stats.failed} {t("failed")}
            </span>
            ,{" "}
            <span
                className={`${stats.pending > 0 ? "bold" : "silver"} toggle`}
                onClick={showPending}
            >
                <i className="fa fa-ban" /> {stats.pending} {t("pending")}
            </span>
            ,{" "}
            <span className={`${stats.aborted > 0 ? "bold" : "gray"} toggle`} onClick={showAborted}>
                <i className="fa fa-ban" /> {stats.aborted} {t("aborted")}
            </span>
            ,{" "}
            <span className={stats.count === 0 ? "gray" : ""}>
                {stats.count} {t("total")} ({nanosToReadableUnit(stats.totalNanos)})
            </span>
            {currentPage.filtered > 0 && (
                <span className="bold toggle" onClick={clearFilter}>
                    ({currentPage.filtered} {t("filtered")})
                </span>
            )}
        </div>
    );
}
