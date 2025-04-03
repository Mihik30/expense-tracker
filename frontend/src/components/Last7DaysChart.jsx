// src/components/Last7DaysChart.jsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './ChartCard.css'; // Use common chart card styling

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Last7DaysChart = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, // Usually not needed for single dataset bar
            title: {
                display: true,
                text: 'Last 7 Days Expenses',
                font: { size: 16 }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    // Optional: Format ticks as currency
                    callback: function (value) {
                         return '₹' + value; // Adjust currency symbol if needed
                    }
                }
            },
            x: {
                grid: { display: false } // Hide vertical grid lines
            }
        },
    };

    // Default data structure
    const defaultData = {
        labels: ['No Data'],
        datasets: [{ data: [0], backgroundColor: '#cccccc' }]
    };

    return (
        <div className="chart-card">
            <div className="chart-container large"> {/* Add class for sizing */}
                <Bar options={options} data={data || defaultData} />
            </div>
        </div>
    );
};

export default Last7DaysChart;