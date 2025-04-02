// src/components/CategoryPieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title // Import Title
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title // Register Title
);

const CategoryPieChart = ({ chartData }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allows controlling size via container
        plugins: {
            legend: {
                position: 'top', // Or 'bottom', 'left', 'right'
            },
            title: {
                display: true,
                text: 'Expenses by Category', // Chart title
                font: {
                    size: 16 // Adjust title font size
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            // Format as currency (e.g., ₹) - adjust symbol if needed
                            label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
    };

    // Provide default data structure if chartData is not ready
    const defaultData = {
        labels: ['No Data'],
        datasets: [{
            label: 'Expenses',
            data: [1],
            backgroundColor: ['#cccccc'], // Default grey color
            borderColor: ['#ffffff'],
            borderWidth: 1,
        }],
    };

    return (
        // Container to control chart size
        <div style={{ position: 'relative', height: '350px', width: '100%', maxWidth: '450px', margin: 'auto' }}>
            <Pie data={chartData && chartData.labels ? chartData : defaultData} options={options} />
        </div>
    );
};

export default CategoryPieChart;