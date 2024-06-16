import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const MatchPercentageChart = ({ matchPercentages, videoDuration }) => {
    let labels = [];
    for (let i = 0.0; i <= Math.ceil(videoDuration); i += 0.01) {
        labels.push(i);
    }
    console.log(matchPercentages.map((point) => {return {x: point.time.toFixed(2), y: point.percentage}}));
    const data = {
        labels: labels, 
        datasets: [{
            label: 'Match Percentage',
            data: matchPercentages.map((point) => {return {x: point.time.toFixed(2), y: point.percentage}}),
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
                beginAtZero: true,
                max: Math.ceil(videoDuration),
                type: 'linear'
            }
        }
    };

    return <Line data={data} options={options} />;
};

export default MatchPercentageChart;

