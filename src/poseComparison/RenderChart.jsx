import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const MatchPercentageChart = ({ matchPercentages }) => {
    const data = {
        labels: matchPercentages.map((_, index) => index + 1), // assuming one match percentage per second
        datasets: [{
            label: 'Match Percentage',
            data: matchPercentages,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
            x: {
                title: {
                    display: true,
                    text: 'Time (s)'
                }
            }
        }
    };

    return <Line data={data} options={options} />;
};

export default MatchPercentageChart;

