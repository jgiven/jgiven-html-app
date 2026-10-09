import { useApp } from "../../context/AppProvider";

export function PaginationBar({ position }: { position: "top" | "bottom" }) {
    const { pagination, totalItems, itemsPerPage, currentPageNr, setPage } = useApp();
    if (!pagination) return null;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className={`pagination-centered pagination-${position}`}>
            <ul className="pagination pagination-sm">
                <li>
                    <a onClick={() => setPage(1)}>&laquo;</a>
                </li>
                <li>
                    <a onClick={() => setPage(Math.max(1, currentPageNr - 1))}>&lsaquo;</a>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <li key={p} className={p === currentPageNr ? "current" : ""}>
                        <a onClick={() => setPage(p)}>{p}</a>
                    </li>
                ))}
                <li>
                    <a onClick={() => setPage(Math.min(totalPages, currentPageNr + 1))}>&rsaquo;</a>
                </li>
                <li>
                    <a onClick={() => setPage(totalPages)}>&raquo;</a>
                </li>
            </ul>
        </div>
    );
}
