import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppProvider";
import { getRootTags } from "../../services/tagService";
import { getRootPackage } from "../../services/classService";
import { HashNavLink, hashToPath } from "../../routing/hashNav";
import { TreeNodeView, PackageTreeView } from "./TreeNodeView";
import { orderNodes } from "../../services/classService";

export function Sidebar() {
    const { t } = useTranslation();
    const {
        navHidden,
        navWidth,
        hideNav,
        showNav,
        startResizeNav,
        totalStatistics,
        summaryExpanded,
        tagsExpanded,
        classesExpanded,
        bookmarksExpanded,
        setSummaryExpanded,
        setTagsExpanded,
        setClassesExpanded,
        setBookmarksExpanded,
        bookmarks,
        removeBookmark,
        customNavigationLinks
    } = useApp();

    const rootTags = getRootTags();
    const rootPackage = getRootPackage();

    if (navHidden) {
        return (
            <div className="hide-for-small">
                <i className="fa fa-angle-double-right nav-show-icon" onClick={showNav} />
            </div>
        );
    }

    return (
        <div className="hide-for-small">
            <div id="sidebar" style={{ width: navWidth }}>
                <nav>
                    <i className="fa fa-angle-double-left nav-hide-icon" onClick={hideNav} />
                    <div id="nav-move-icon-container">
                        <i
                            id="nav-move-icon"
                            className="fa fa-bars fa-rotate-90"
                            onMouseDown={e => startResizeNav(e.pageX)}
                        />
                    </div>
                    <ul className="side-nav">
                        <li className="heading">
                            <a
                                className="toggle"
                                onClick={() => setSummaryExpanded(!summaryExpanded)}
                            >
                                {t("summary")}
                            </a>
                            {summaryExpanded && (
                                <ul>
                                    <li>
                                        <HashNavLink hashHref="#all" to="/all">
                                            {t("allScenarios")}
                                            <span className="label secondary round nav-count">
                                                {totalStatistics.count}
                                            </span>
                                        </HashNavLink>
                                    </li>
                                    <li>
                                        <HashNavLink hashHref="#failed" to="/failed">
                                            {t("failedScenarios")}
                                            <span
                                                className={`label secondary round nav-count ${totalStatistics.failed > 0 ? "failed" : ""}`}
                                            >
                                                {totalStatistics.failed}
                                            </span>
                                        </HashNavLink>
                                    </li>
                                    <li>
                                        <HashNavLink hashHref="#pending" to="/pending">
                                            {t("pendingScenarios")}
                                            <span
                                                className={`label secondary round nav-count ${totalStatistics.pending > 0 ? "pending" : ""}`}
                                            >
                                                {totalStatistics.pending}
                                            </span>
                                        </HashNavLink>
                                    </li>
                                    <li>
                                        <HashNavLink hashHref="#aborted" to="/aborted">
                                            {t("abortedScenarios")}
                                            <span
                                                className={`label secondary round nav-count ${totalStatistics.aborted > 0 ? "aborted" : ""}`}
                                            >
                                                {totalStatistics.aborted}
                                            </span>
                                        </HashNavLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="heading">
                            <a className="toggle" onClick={() => setTagsExpanded(!tagsExpanded)}>
                                {t("tags")}
                            </a>
                            {tagsExpanded && (
                                <ul>
                                    {rootTags.map(node => (
                                        <li key={node.nodeName()}>
                                            <TreeNodeView node={node} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                        <li className="heading">
                            <a
                                className="toggle"
                                onClick={() => setClassesExpanded(!classesExpanded)}
                            >
                                {t("classes")}
                            </a>
                            {classesExpanded && (
                                <ul>
                                    {[...rootPackage.leafs()]
                                        .sort((a, b) => orderNodes(a).localeCompare(orderNodes(b)))
                                        .map(leaf => (
                                            <li key={leaf.fullQualifiedName()}>
                                                <HashNavLink
                                                    hashHref={leaf.url()}
                                                    to={hashToPath(leaf.url())}
                                                >
                                                    {leaf.nodeName()}
                                                </HashNavLink>
                                            </li>
                                        ))}
                                    {[...rootPackage.childNodes()]
                                        .sort((a, b) => orderNodes(a).localeCompare(orderNodes(b)))
                                        .map(node => (
                                            <li key={node.nodeName()}>
                                                <PackageTreeView node={node} />
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </li>
                        {bookmarks.length > 0 && (
                            <li className="heading">
                                <a
                                    className="toggle"
                                    onClick={() => setBookmarksExpanded(!bookmarksExpanded)}
                                >
                                    {t("bookmarks")}
                                    <span className="label secondary round nav-count">
                                        {bookmarks.length}
                                    </span>
                                </a>
                                {bookmarksExpanded && (
                                    <ul>
                                        {bookmarks.map((bookmark, index) => (
                                            <li key={index}>
                                                <HashNavLink
                                                    hashHref={bookmark.url}
                                                    to={
                                                        hashToPath(bookmark.url) +
                                                        (bookmark.search ?? "")
                                                    }
                                                >
                                                    {bookmark.name}
                                                    <i
                                                        title="Delete Bookmark"
                                                        className="fa fa-times remove-bookmark-icon toggle"
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            removeBookmark(index);
                                                        }}
                                                    />
                                                </HashNavLink>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        )}
                        {customNavigationLinks.map(link => (
                            <li key={link.text} className="heading">
                                <a href={link.href} target={link.target}>
                                    {link.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
