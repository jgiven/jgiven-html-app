import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppProvider";
import { HashNavLink } from "../../routing/hashNav";

export function AppHeader() {
    const { t } = useTranslation();
    const { metaData, searchQuery, setSearchQuery, submitSearch } = useApp();

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        submitSearch();
    };

    return (
        <div className="fixed header-fixed">
            <nav className="top-bar" data-topbar role="navigation">
                <ul className="title-area">
                    <li className="name">
                        <h1 id="title">
                            <HashNavLink hashHref="#/" to="/">
                                {metaData?.title ?? "JGiven Report"}
                            </HashNavLink>
                        </h1>
                    </li>
                </ul>
                <section className="top-bar-section">
                    <ul className="right">
                        <li>
                            <div className="small-12 columns">
                                <form onSubmit={onSubmit}>
                                    <input
                                        id="nav-search"
                                        className="search"
                                        type="text"
                                        placeholder={t("searchPlaceholder")}
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                    <i className="fa fa-search search-icon" />
                                </form>
                            </div>
                        </li>
                    </ul>
                </section>
            </nav>
            <BreadcrumbBar />
        </div>
    );
}

function BreadcrumbBar() {
    const { currentPage } = useApp();
    const crumbs = currentPage.breadcrumbs ?? [];
    const showWelcomeCrumb = crumbs.length === 0 || (crumbs.length === 1 && crumbs[0] === "");

    return (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
            {showWelcomeCrumb ? (
                <a href="#" className="current">
                    /
                </a>
            ) : (
                crumbs.map((b, i) => (
                    <a
                        key={i}
                        href="#"
                        className={i === crumbs.length - 1 ? "current" : "unavailable"}
                    >
                        {b}
                    </a>
                ))
            )}
        </nav>
    );
}

export function MetadataFooter() {
    const { t } = useTranslation();
    const { metaData } = useApp();
    if (!metaData) return null;

    return (
        <div className="footer-bottom">
            <div className="small-12 columns">
                <a href="http://jgiven.org">JGiven</a> {t("htmlAppVersion", { version: "0.1.0" })}{" "}
                {t("metadataFooter", { version: metaData.version, created: metaData.created })}
            </div>
        </div>
    );
}
