import type { TreeNode } from "../../services/tagService";
import { toggleTreeNode } from "../../services/tagService";
import { HashNavLink, hashToPath } from "../../routing/hashNav";
import { orderNodes } from "../../services/classService";
import type { PackageNode } from "../../services/classService";
import { useApp } from "../../context/AppProvider";

export function TreeNodeView({ node }: { node: TreeNode }) {
    const { bumpRender } = useApp();
    if (!node.hasChildren()) {
        return (
            <div>
                <HashNavLink hashHref={node.url()} to={hashToPath(node.url())}>
                    <i className="fa fa-caret-right transparent" />
                    &nbsp;{node.nodeName()}
                </HashNavLink>
            </div>
        );
    }

    return (
        <>
            <div className="tree-node">
                <a
                    onClick={() => {
                        toggleTreeNode(
                            node as TreeNode & {
                                childNodes: () => TreeNode[];
                                leafs: () => TreeNode[];
                            }
                        );
                        bumpRender();
                    }}
                >
                    <i
                        className={`fa fa-caret-right toggle ${node.expanded ? "fa-rotate-90" : ""}`}
                    />
                    &nbsp;{node.nodeName()}
                </a>
                <HashNavLink
                    hashHref={node.url()}
                    to={hashToPath(node.url())}
                    className="show-tree-node-link"
                >
                    <i className="fa fa-chevron-circle-right open-tree-node-icon" />
                </HashNavLink>
            </div>
            {node.expanded && (
                <ul>
                    {[...node.leafs()]
                        .sort((a, b) => orderNodes(a).localeCompare(orderNodes(b)))
                        .map(leaf => (
                            <li key={leaf.nodeName()}>
                                <HashNavLink hashHref={leaf.url()} to={hashToPath(leaf.url())}>
                                    <i className="fa fa-caret-right transparent" />
                                    &nbsp;{leaf.nodeName()}
                                </HashNavLink>
                            </li>
                        ))}
                    {[...node.childNodes()]
                        .sort((a, b) => orderNodes(a).localeCompare(orderNodes(b)))
                        .map(child => (
                            <li key={child.nodeName()}>
                                <TreeNodeView node={child} />
                            </li>
                        ))}
                </ul>
            )}
        </>
    );
}

export function PackageTreeView({ node }: { node: PackageNode }) {
    const { bumpRender } = useApp();

    const togglePackageNode = (pkg: PackageNode) => {
        pkg.expanded = !pkg.expanded;
        if (pkg.leafs().length === 0 && pkg.childNodes().length === 1) {
            togglePackageNode(pkg.childNodes()[0]);
        }
    };

    if (!node.hasChildren()) return null;
    return (
        <>
            <div className="tree-node">
                <a
                    onClick={() => {
                        togglePackageNode(node);
                        bumpRender();
                    }}
                >
                    <i
                        className={`fa fa-caret-right toggle ${node.expanded ? "fa-rotate-90" : ""}`}
                    />
                    &nbsp;{node.nodeName()}
                </a>
                <HashNavLink
                    hashHref={node.url()}
                    to={hashToPath(node.url())}
                    className="show-tree-node-link"
                >
                    <i className="fa fa-chevron-circle-right open-tree-node-icon" />
                </HashNavLink>
            </div>
            {node.expanded && (
                <ul>
                    {[...node.leafs()]
                        .sort((a, b) => orderNodes(a).localeCompare(orderNodes(b)))
                        .map(leaf => (
                            <li key={leaf.fullQualifiedName()}>
                                <HashNavLink hashHref={leaf.url()} to={hashToPath(leaf.url())}>
                                    <i className="fa fa-caret-right transparent" />
                                    &nbsp;{leaf.nodeName()}
                                </HashNavLink>
                            </li>
                        ))}
                    {[...node.childNodes()]
                        .sort((a, b) => orderNodes(a).localeCompare(orderNodes(b)))
                        .map(child => (
                            <li key={child.nodeName()}>
                                <PackageTreeView node={child} />
                            </li>
                        ))}
                </ul>
            )}
        </>
    );
}
