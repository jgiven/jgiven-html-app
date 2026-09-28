import type { MouseEvent, ReactNode } from "react";
import { useApp } from "../context/AppProvider";

/** Link with legacy hash href for golden tests; navigates via React Router. */
export function HashNavLink({
    hashHref,
    to,
    children,
    className,
    target,
    title,
    onClick
}: {
    hashHref: string;
    to: string;
    children: ReactNode;
    className?: string;
    target?: string;
    title?: string;
    onClick?: (e: MouseEvent) => void;
}) {
    const { navigateToPage } = useApp();

    return (
        <a
            href={hashHref}
            className={className}
            target={target}
            title={title}
            onClick={e => {
                if (!target) {
                    e.preventDefault();
                    navigateToPage(to);
                }
                onClick?.(e);
            }}
        >
            {children}
        </a>
    );
}

export function hashToPath(hashHref: string): string {
    if (hashHref.startsWith("#")) {
        const path = hashHref.slice(1);
        if (path.startsWith("/")) return path;
        return "/" + path;
    }
    return hashHref;
}

export function parseWildcardPath(prefix: string, pathname: string): string | null {
    if (!pathname.startsWith(prefix)) return null;
    return pathname.slice(prefix.length).replace(/^\//, "");
}
