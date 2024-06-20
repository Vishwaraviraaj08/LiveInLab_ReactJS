import React, {useRef, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const MatchPercentageChart = ({ matchPercentages, videoDuration, setBase64String }) => {

    const chartRef = useRef();
    let labels = [];
    for (let i = 0.0; i <= Math.ceil(videoDuration); i += 0.01) {
        labels.push(i);
    }
    const data = {
        labels: labels, 
        datasets: [{
            label: 'Match Percentage',
            data: matchPercentages.map((point) => {return {x: point.time.toFixed(2), y: point.percentage}}),
            borderColor: 'rgba(0, 123, 255, 1)', // Blue color for line
            backgroundColor: 'rgba(0, 123, 255, 0.5)', // Blue color for points
            borderWidth: 2,
            pointBackgroundColor: 'rgba(0, 123, 255, 1)',
            pointBorderColor: 'rgba(0, 123, 255, 1)',
            fill: false,
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    color: 'white', 
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)',
                },
                title: {
                    display: true,
                    text: 'Match %',
                    color: 'white',
                    orientation: 'vertical'

                }
            },
            x: {
                beginAtZero: true,
                max: Math.ceil(videoDuration),
                type: 'linear',
                ticks: {
                    color: 'white',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)',
                },
                title: {
                    display: true,
                    text: 'nth-second',
                    color: 'white'
                }
            }
        },
        plugins: {
            legend: {
                display: false,
                labels: {
                    color: 'white' 
                }
            }
        },
        animation: {
            onComplete: () => {
                const chart = chartRef.current;
                if (chart) {
                    const base64Image = chart.toBase64Image();
                    setBase64String(base64Image);
                }
            }
        },
        layout: {
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            }
        }

    };

    return <div style={{backgroundColor: 'black'}}>
        <Line ref={chartRef} data={data} options={options} />;
    </div>
};

export default MatchPercentageChart;

