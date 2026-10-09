import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "../../context/AppProvider";

const DROPDOWNS = [
    { toggle: "Group By", id: "group-drop-down", type: "group" as const },
    { toggle: "Sort By", id: "sort-drop-down", type: "sort" as const },
    { toggle: "Status", id: "status-drop-down", type: "status" as const },
    { toggle: "Tags", id: "tag-drop-down", type: "tag" as const },
    { toggle: "Classes", id: "class-drop-down", type: "class" as const }
];

export function OptionDropdowns() {
    const { t } = useTranslation();
    const {
        currentPage,
        showOptions,
        sortOptionSelected,
        groupOptionSelected,
        filterOptionSelected
    } = useApp();
    const [openId, setOpenId] = useState<string | null>(null);

    if (!showOptions || !currentPage.options) return null;

    const labels: Record<string, string> = {
        "Group By": t("groupBy"),
        "Sort By": t("sortBy"),
        Status: t("status"),
        Tags: t("tagsDropdown"),
        Classes: t("classesDropdown")
    };

    return (
        <div className="small-12 large-6 columns">
            <ul className="button-group radius right">
                {DROPDOWNS.map(({ toggle, id, type }) => {
                    const options =
                        type === "group"
                            ? currentPage.options!.groupOptions
                            : type === "sort"
                              ? currentPage.options!.sortOptions
                              : type === "status"
                                ? currentPage.options!.statusOptions
                                : type === "tag"
                                  ? currentPage.options!.tagOptions
                                  : currentPage.options!.classOptions;

                    return (
                        <li key={id}>
                            <a
                                className="button dropdown small secondary"
                                onClick={() => setOpenId(openId === id ? null : id)}
                            >
                                {labels[toggle] ?? toggle}
                            </a>
                            <ul
                                id={id}
                                className="f-dropdown"
                                style={{ display: openId === id ? "block" : "none" }}
                            >
                                {options.map(option => (
                                    <li key={option.name}>
                                        <a
                                            onClick={() => {
                                                if (type === "sort") sortOptionSelected(option.id!);
                                                else if (type === "group")
                                                    groupOptionSelected(option.id!);
                                                else
                                                    filterOptionSelected(
                                                        type === "status"
                                                            ? "status"
                                                            : type === "tag"
                                                              ? "tag"
                                                              : "class",
                                                        option.id ?? option.name
                                                    );
                                                setOpenId(null);
                                            }}
                                        >
                                            <i
                                                className={`fa fa-check ${option.selected ? "selected" : ""}`}
                                            />{" "}
                                            {option.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
