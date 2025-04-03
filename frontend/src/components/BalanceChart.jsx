// src/components/BalanceChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import './ChartCard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const BalanceChart = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Balance Over Time',
                font: { size: 16 }
            },
             filler: { // Optional: Fill area under line
                 propagate: false,
             },
             tooltip: { // Custom tooltip formatting
                 callbacks: {
                     label: function(context) {
                         let label = context.dataset.label || '';
                         if (label) { label += ': '; }
                         if (context.parsed.y !== null) {
                             label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                         }
                         return label;
                     }
                 }
             }
        },
        scales: {
            y: {
                beginAtZero: false, // Allow balance to go below zero
                 ticks: {
                    callback: function (value) { return '₹' + value/1000 + 'k'; } // Format as thousands
                }
            },
             x: {
                grid: { display: false }
            }
        },
         interaction: { // Improve hover/tooltip interaction
            intersect: false,
            mode: 'index',
         },
         elements: {
             line: {
                 tension: 0.3 // Slightly curve the line
             }
         }
    };

    const defaultData = {
        labels: ['No Data'],
        datasets: [{ label: 'Balance', data: [0], borderColor: '#cccccc', backgroundColor: '#cccccc33' }]
    };

    return (
        <div className="chart-card">
             <div className="chart-container large"> {/* Add class for sizing */}
                <Line options={options} data={data || defaultData} />
             </div>
        </div>
    );
};

export default BalanceChart;