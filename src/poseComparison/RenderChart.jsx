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

    useEffect(() => {
        const chart = chartRef.current;
        if (chart) {
            const base64Image = chart.canvas.toDataURL();
            setBase64String(base64Image);
        }
    }, []);

    return <div styles={{display: 'none'}}>
        <Line ref={chartRef} data={data} options={options} />;
    </div>
};

export default MatchPercentageChart;

