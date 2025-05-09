import { ReportStatistics } from "../../reportModel";
import { ArcElement, BubbleDataPoint, Chart as ChartJS, Legend, Point, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useRef } from "react";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { useFilters } from "../../hooks/useFilters";
import { ScenarioStatusFilter } from "./ScenarioCollectionHead";

export interface DonutChartProps {
    statistic: ReportStatistics;
}

export function DonutChart(props: DonutChartProps) {
    const successLabel = "Successful:";
    const failedLabel = "Failed:";
    ChartJS.register(ArcElement, Tooltip, Legend);

    const { statistic } = props;

    const { setUrlSearchParams } = useFilters();

    const chartRef =
        useRef<
            ChartJSOrUndefined<
                "doughnut",
                (number | [number, number] | Point | BubbleDataPoint | null)[],
                unknown
            >
        >(null);

    const width = 240; // set default width to 100 if none is provided via props
    const height = 120; // set default height to 100 if none is provided via props

    const data = {
        labels: [successLabel, failedLabel],
        datasets: [
            {
                data: [statistic.numSuccessfulScenarios, statistic.numFailedScenarios],
                backgroundColor: ["rgba(60, 179, 113)", "rgba(255, 0, 0)"],
                borderWidth: 1,
                hoverBackgroundColor: ["rgba(60,179,113,0.63)", "rgba(255,20,20,0.63)"]
            }
        ]
    };

    const options = {
        aspectRatio: 2,
        cutoutPercentage: 70,
        plugins: {
            legend: {
                display: false
            }
        },
        tooltips: {
            enabled: true,
            intersect: true,
            mode: "nearest",
            callbacks: {
                label: (
                    tooltipItem: { index: number; datasetIndex: number },
                    data: { labels: string[]; datasets: { data: number[] }[] }
                ) => {
                    const label = data.labels[tooltipItem.index];
                    const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return `${label}: ${value}`;
                }
            }
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const chart = chartRef.current;
        if (chart == null) {
            return;
        }

        const clickedElementIndex = chart.getElementsAtEventForMode(
            event.nativeEvent,
            "nearest",
            { intersect: true },
            false
        )[0].index;

        const label = chart.data.labels?.at(clickedElementIndex);

        if (label === successLabel) {
            setUrlSearchParams({ status: ScenarioStatusFilter.SUCCESS });
        } else if (label === failedLabel) {
            setUrlSearchParams({ status: ScenarioStatusFilter.FAILED });
        }
    };

    return (
        <Doughnut
            ref={chartRef}
            data={data}
            width={width}
            height={height}
            options={options}
            onClick={handleClick}
        />
    );
}
