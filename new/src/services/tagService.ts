import type { JGivenTag, Scenario } from "../types/jgivenReport";
import { getTestCases, getTagFile } from "./dataService";
import { getScenarioId, getTagId, getTagKey, getTagName, tagToString } from "../util/format";

export interface TreeNode {
    nodeName: () => string;
    url: () => string;
    leafs: () => TreeNode[];
    childNodes: () => TreeNode[];
    hasChildren: () => boolean;
    expanded?: boolean;
    nameNode?: NameNode;
}

export interface TagTreeNode extends TreeNode {
    scenarios: () => Scenario[];
    tag: () => JGivenTag;
    addTagNode: (node: TagTreeNode) => void;
}

export interface NameNode extends TreeNode {
    subTags: () => TagTreeNode[];
    addTagNode: (node: TagTreeNode) => void;
    scenarios: () => Scenario[];
}

interface TagEntry {
    tag: JGivenTag;
    scenarios: Scenario[];
}

let tagScenarioMap: Record<string, TagEntry> = {};
let tagNodeMap: Record<string, TagTreeNode> = {};
let tagNameMap: Record<string, NameNode> = {};
let rootTags: TreeNode[] | null = null;

export function initTagService(): void {
    tagScenarioMap = getTagScenarioMap(getTestCases());
    tagNodeMap = {};
    tagNameMap = {};
    rootTags = null;
}

function getTagScenarioMap(testCases: ReturnType<typeof getTestCases>): Record<string, TagEntry> {
    const map: Record<string, TagEntry> = {};

    testCases.forEach(testCase => {
        testCase.scenarios.forEach(scenario => {
            scenario.tags = [];

            scenario.tagIds.forEach(tagId => {
                addEntry(tagId);
            });

            function addEntry(id: string) {
                const tag = getTagByTagId(id);
                const tagKey = getTagKey(tag);
                let tagEntry = map[tagKey];
                if (!tagEntry) {
                    tagEntry = { tag, scenarios: [] };
                    map[tagKey] = tagEntry;
                }

                if (!tagEntry.scenarios.includes(scenario)) {
                    tagEntry.scenarios.push(scenario);
                }
                scenario.tags.push(tag);

                tag.tags?.forEach(parentTagId => {
                    addEntry(parentTagId);
                });
            }
        });
    });

    return map;
}

function calculateRootTags(): TreeNode[] {
    Object.values(tagScenarioMap).forEach(tagEntry => {
        if (tagEntry.tag.hideInNav) return;

        const tagNode = getTagNode(tagEntry);
        const name = getTagName(tagEntry.tag);
        let nameNode = tagNameMap[name];
        if (!nameNode) {
            nameNode = createNameNode(name);
            tagNameMap[name] = nameNode;
        }
        nameNode.addTagNode(tagNode);
    });

    const nameNodesWithMultipleEntries = Object.values(tagNameMap).filter(
        nameNode => nameNode.subTags().length > 1
    );

    nameNodesWithMultipleEntries.forEach(nameNode => {
        nameNode.subTags().forEach(subTag => {
            subTag.nameNode = nameNode;
        });
    });

    const nodesWithoutParents = Object.values(tagNodeMap).filter(
        tagNode => (!tagNode.tag().tags || tagNode.tag().tags.length === 0) && !tagNode.nameNode
    );

    return [...nameNodesWithMultipleEntries, ...nodesWithoutParents].sort((a, b) =>
        a.nodeName().localeCompare(b.nodeName())
    );
}

function createTagNode(tagEntry: TagEntry): TagTreeNode {
    const tag = tagEntry.tag;
    const scenarios = tagEntry.scenarios;
    const subTags: TagTreeNode[] = [];

    const node: TagTreeNode = {
        nodeName: () => tagToString(tag),
        url: () =>
            "#tagid/" +
            encodeURIComponent(getTagId(tag)) +
            (tag.value ? "/" + encodeURIComponent(tag.value) : ""),
        scenarios: () => scenarios,
        tag: () => tag,
        leafs: () => subTags.filter(t => !t.hasChildren()),
        childNodes: () => subTags.filter(t => t.hasChildren()),
        hasChildren: () => subTags.length > 0,
        addTagNode: (child: TagTreeNode) => {
            subTags.push(child);
        },
        expanded: false
    };
    return node;
}

function getTagNode(tagEntry: TagEntry): TagTreeNode {
    const tag = tagEntry.tag;
    const key = getTagKey(tag);
    let tagNode = tagNodeMap[key];
    if (!tagNode) {
        tagNode = createTagNode(tagEntry);
        tagNodeMap[key] = tagNode;
        if (tag.tags && tag.tags.length > 0) {
            tag.tags.forEach(parentTagId => {
                const parentTag = getTagByTagId(parentTagId);
                const parentTagEntry = tagScenarioMap[getTagKey(parentTag)];
                getTagNode(parentTagEntry).addTagNode(tagNode);
            });
        }
    }
    return tagNode;
}

function createNameNode(name: string): NameNode {
    const subTagList: TagTreeNode[] = [];

    return {
        nodeName: () => name,
        url: () => "#tag/" + encodeURIComponent(name),
        leafs: () => subTagList.filter(t => !t.hasChildren()),
        childNodes: () => subTagList.filter(t => t.hasChildren()),
        hasChildren: () => subTagList.length > 0,
        expanded: false,
        subTags: () => subTagList,
        addTagNode: (tagNode: TagTreeNode) => {
            subTagList.push(tagNode);
        },
        scenarios: () => {
            const scenarioMap: Record<string, Scenario> = {};
            subTagList.forEach(subTag => {
                subTag.scenarios().forEach(scenario => {
                    scenarioMap[getScenarioId(scenario)] = scenario;
                });
            });
            return Object.values(scenarioMap);
        }
    };
}

export function getRootTags(): TreeNode[] {
    if (!rootTags) {
        rootTags = calculateRootTags();
    }
    return rootTags;
}

export function getScenariosByTag(tag: JGivenTag): Scenario[] {
    return tagScenarioMap[getTagKey(tag)]?.scenarios ?? [];
}

export function getTagByKey(tagKey: string): JGivenTag | undefined {
    return tagScenarioMap[tagKey]?.tag;
}

export function getTagNameNode(name: string): NameNode | undefined {
    return tagNameMap[name];
}

export function getTagByTagId(tagId: string): JGivenTag {
    const tagFile = getTagFile();
    if (!tagFile) throw new Error("Tag file not loaded");
    const tagInstance = tagFile.tags[tagId];
    const tagType = tagFile.tagTypeMap[tagInstance.tagType];
    const tag = Object.create(tagType) as JGivenTag;
    tag.value = tagInstance.value;
    if (tagInstance.description) tag.description = tagInstance.description;
    if (tagInstance.href) tag.href = tagInstance.href;
    return tag;
}

export function toggleTreeNode(
    node: TreeNode & { childNodes: () => TreeNode[]; leafs: () => TreeNode[] }
): void {
    node.expanded = !node.expanded;
    if (node.leafs().length === 0 && node.childNodes().length === 1) {
        toggleTreeNode(
            node.childNodes()[0] as TreeNode & {
                childNodes: () => TreeNode[];
                leafs: () => TreeNode[];
            }
        );
    }
}

export function getUrlFromTag(tag: JGivenTag): string {
    if (tag.href) return tag.href;
    return (
        "#tagid/" +
        encodeURIComponent(getTagId(tag)) +
        (tag.value ? "/" + encodeURIComponent(tag.value) : "")
    );
}

export function getCssClassOfTag(tag: JGivenTag): string {
    if (tag.cssClass) return tag.cssClass;
    return "tag-" + getTagName(tag);
}

export function getStyleOfTag(tag: JGivenTag): string {
    let style = tag.style ?? "";
    if (tag.color) {
        style += " background-color: " + tag.color;
    }
    return style;
}

export function tagIdToString(tagId: string): string {
    return tagToString(getTagByTagId(tagId));
}
