import {ReportStatistics} from "../../reportModel";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";
import {Doughnut} from "react-chartjs-2";

export function createReportCircle(props: { statistic: ReportStatistics }) {
    ChartJS.register(ArcElement, Tooltip, Legend);

    const width = 240; // set default width to 100 if none is provided via props
    const height = 120; // set default height to 100 if none is provided via props

    const data = {
        labels: ['Successful:', 'Failed:'],
        datasets: [
            {
                data: [props.statistic.numSuccessfulScenarios, props.statistic.numFailedScenarios],
                backgroundColor: [
                    'rgba(60, 179, 113)',
                    'rgba(255, 0, 0)',
                ],
                borderWidth: 1,
                onClick: (event: MouseEvent, elements: any[], chart: any) => {
                    if (elements.length === 0) {
                        return; // user did not click on a chart element
                    }
                    const label = chart.data.labels[elements[0].index];
                    if (label === 'Successful') {
                        window.location.href = '/successful';
                    } else if (label === 'Failed') {
                        window.location.href = '/failed';
                    }
                },
                hoverBackgroundColor: [
                    'rgba(60,179,113,0.63)',
                    'rgba(255,20,20,0.63)',
                ],
            },

        ],
    };

    const options = {
        aspectRatio: 2,
        cutoutPercentage: 70,
        plugins: {
            legend: {
                display: false,
            },
        },
        tooltips: {
            enabled: true,
            intersect: true,
            mode: "nearest",
            callbacks: {
                label: (tooltipItem: any, data: any) => {
                    const label = data.labels[tooltipItem.index];
                    const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return `${label}: ${value}`;
                },
            },
        },

    }

    return (
        <Doughnut data={data} width={width} height={height} options={options}/>
    );
}