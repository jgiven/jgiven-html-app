import type { JGivenTag, Scenario, StepWord } from "../types/jgivenReport";

const ONE_HOUR_IN_MS = 3600000;
const ONE_MINUTE_IN_MS = 60000;
const ONE_SECOND_IN_MS = 1000;

export function capitalize(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function nanosToReadableUnit(nanos: number): string {
    const msNum = nanos / 1000000;

    if (msNum < ONE_SECOND_IN_MS) {
        return Math.floor(msNum) + "ms";
    }

    if (msNum < ONE_MINUTE_IN_MS) {
        return parseFloat(String(msNum / 1000)).toFixed(3) + "s";
    }

    const hours = Math.floor(msNum / ONE_HOUR_IN_MS);
    const mins = Math.floor((msNum - hours * ONE_HOUR_IN_MS) / ONE_MINUTE_IN_MS);
    const secs = Math.floor(
        (msNum - (hours * ONE_HOUR_IN_MS + mins * ONE_MINUTE_IN_MS)) / ONE_SECOND_IN_MS
    );

    let time: string | number = secs;
    let unit = "min";

    if (mins > 0) {
        time = mins + ":" + (secs < 10 ? "0" + secs : secs);
    }

    if (hours > 0) {
        time = hours + ":" + (mins < 10 ? "0" + mins : mins);
        unit = "h";
    }
    return time + unit;
}

export function getWordValue(word: StepWord): string {
    return word.argumentInfo?.formattedValue ?? word.value;
}

export function getTagName(tag: JGivenTag): string {
    return tag.name ? tag.name : tag.type;
}

export function getTagId(tag: JGivenTag): string {
    return tag.fullType ? tag.fullType : tag.type;
}

export function getTagKey(tag: JGivenTag): string {
    return getTagId(tag) + (tag.value ? "-" + tag.value : "");
}

export function tagToString(tag: JGivenTag): string {
    let res = "";

    if (!tag.value || tag.prependType) {
        res = getTagName(tag);
    }

    if (tag.value) {
        if (res) {
            res += "-";
        }
        res += tag.value;
    }

    return res;
}

export function splitClassName(fullQualifiedClassName: string): {
    className: string;
    packageName: string;
} {
    const index = fullQualifiedClassName.lastIndexOf(".");
    const className = fullQualifiedClassName.substr(index + 1);
    const packageName = fullQualifiedClassName.substr(0, index);
    return { className, packageName };
}

export function getScenarioId(scenario: Scenario): string {
    return scenario.className + "." + scenario.testMethodName;
}

export function sortByDescription<T extends { description: string; expanded?: boolean }>(
    scenarios: T[]
): T[] {
    const sorted = [...scenarios].sort((a, b) =>
        a.description.toLowerCase().localeCompare(b.description.toLowerCase())
    );
    sorted.forEach(x => {
        x.expanded = false;
    });
    if (sorted.length === 1) {
        sorted[0].expanded = true;
    }
    return sorted;
}

export function getReadableExecutionStatus(status: string): string {
    switch (status) {
        case "SUCCESS":
            return "Successful";
        case "FAILED":
            return "Failed";
        case "ABORTED":
            return "Aborted";
        default:
            return "Pending";
    }
}

export function ownProperties(obj: Record<string, unknown>): string[] {
    return Object.keys(obj).filter(p => Object.prototype.hasOwnProperty.call(obj, p));
}

export function deselectAll<T extends { selected?: boolean }>(options: T[]): void {
    options.forEach(option => {
        option.selected = false;
    });
}

export function getThumbnailPath(path: string): string {
    const dot = path.lastIndexOf(".");
    if (dot === -1) return path + ".thumb.png";
    return path.substring(0, dot) + ".thumb" + path.substring(dot);
}

export function isImageType(mimeType: string | undefined): boolean {
    return mimeType?.startsWith("image/") ?? false;
}
