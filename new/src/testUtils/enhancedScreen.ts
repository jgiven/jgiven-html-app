import { buildQueries, screen as classicScreen } from "@testing-library/react";
function queryAllIcons(container: HTMLElement): HTMLElement[] {
    const svgElements: NodeListOf<HTMLElement> =
        container.querySelectorAll<HTMLElement>("svg.MuiSvgIcon-root");
    return Array.from(svgElements);
}

function getMultipleIconsErrorText(iconDescription: string): string {
    return `Found multiple ${iconDescription}`;
}

function getMissingIconsErrorText(iconDescription: string): string {
    return `Found no ${iconDescription}`;
}

const [, getAllIcons] = buildQueries<[]>(
    queryAllIcons,
    () => getMultipleIconsErrorText("icons"),
    () => getMissingIconsErrorText("icons")
);

const iconQueries = {
    getAllIcons: () => getAllIcons(document.body)
};

function queryAllCheckboxIcons(container: HTMLElement): HTMLElement[] {
    const svgElements: NodeListOf<HTMLElement> = container.querySelectorAll<HTMLElement>(
        `svg.MuiSvgIcon-root[data-testid="CheckBoxIcon"]`
    );
    return Array.from(svgElements);
}

const [, , getCheckboxIcon] = buildQueries<[]>(
    queryAllCheckboxIcons,
    () => getMultipleIconsErrorText("CheckBox icons"),
    () => getMissingIconsErrorText("CheckBox icons")
);

const checkboxIconQueries = {
    getCheckboxIcon: () => getCheckboxIcon(document.body)
};

function queryAllErrorIcons(container: HTMLElement): HTMLElement[] {
    const svgElements: NodeListOf<HTMLElement> = container.querySelectorAll<HTMLElement>(
        `svg.MuiSvgIcon-root[data-testid="ErrorIcon"]`
    );
    return Array.from(svgElements);
}

const [, , getErrorIcon] = buildQueries<[]>(
    queryAllErrorIcons,
    () => getMultipleIconsErrorText("Error icons"),
    () => getMissingIconsErrorText("Error icons")
);

const errorIconQueries = {
    getErrorIcon: () => getErrorIcon(document.body)
};

function queryAllPendingIcons(container: HTMLElement): HTMLElement[] {
    const svgElements: NodeListOf<HTMLElement> = container.querySelectorAll<HTMLElement>(
        `svg.MuiSvgIcon-root[data-testid="DoNotDisturbAltIcon"]`
    );
    return Array.from(svgElements);
}

const [, , getPendingIcon] = buildQueries<[]>(
    queryAllPendingIcons,
    () => getMultipleIconsErrorText("Pending icons"),
    () => getMissingIconsErrorText("Pending icons")
);

const pendingIconQueries = {
    getPendingIcon: () => getPendingIcon(document.body)
};

export const screen = {
    ...classicScreen,
    ...iconQueries,
    ...checkboxIconQueries,
    ...errorIconQueries,
    ...pendingIconQueries
};
