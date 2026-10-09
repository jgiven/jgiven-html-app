import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useCallback, type MouseEvent } from "react";
import { useApp } from "../../context/AppProvider";

ChartJS.register(ArcElement, Tooltip, Legend);

const LABELS = ["Successful", "Failed", "Pending", "Aborted"] as const;
const COLORS = ["#43AC6A", "#f04124", "#e7e7e7", "#008CBA"];

/** Match golden-test click positions when a segment has zero arc length. */
function labelFromClickPosition(
    native: MouseEvent,
    canvas: HTMLCanvasElement
): (typeof LABELS)[number] | undefined {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return undefined;
    const x = native.clientX - box.left;
    const y = native.clientY - box.top;
    const positions: Record<(typeof LABELS)[number], { x: number; y: number }> = {
        Successful: { x: box.width * 0.5, y: box.height * 0.12 },
        Failed: { x: box.width * 0.88, y: box.height * 0.5 },
        Pending: { x: box.width * 0.5, y: box.height * 0.88 },
        Aborted: { x: box.width * 0.12, y: box.height * 0.5 }
    };
    let closest: (typeof LABELS)[number] | undefined;
    let minDist = Infinity;
    for (const label of LABELS) {
        const pos = positions[label];
        const dist = (pos.x - x) ** 2 + (pos.y - y) ** 2;
        if (dist < minDist) {
            minDist = dist;
            closest = label;
        }
    }
    return closest;
}

export function DonutChart() {
    const { currentPage, showSuccessful, showFailed, showPending, showAborted } = useApp();
    const stats = currentPage.statistics;

    const activateSegment = useCallback(
        (label: (typeof LABELS)[number]) => {
            if (label === "Successful") showSuccessful();
            else if (label === "Failed") showFailed();
            else if (label === "Pending") showPending();
            else if (label === "Aborted") showAborted();
        },
        [showAborted, showFailed, showPending, showSuccessful]
    );

    const handleChartClick = useCallback(
        (event: MouseEvent<HTMLDivElement>) => {
            const target = event.target;
            if (
                !(target instanceof HTMLCanvasElement) ||
                !target.classList.contains("chart-doughnut")
            ) {
                return;
            }
            const label = labelFromClickPosition(event.nativeEvent, target);
            if (label) activateSegment(label);
        },
        [activateSegment]
    );

    if (!stats?.chartData) return null;

    return (
        <div className="statistics-chart right" onClick={handleChartClick}>
            <Doughnut
                className="chart chart-doughnut toggle"
                data={{
                    labels: [...LABELS],
                    datasets: [
                        {
                            data: stats.chartData,
                            backgroundColor: COLORS,
                            borderWidth: 0
                        }
                    ]
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false }, tooltip: { enabled: true } }
                }}
            />
        </div>
    );
}
