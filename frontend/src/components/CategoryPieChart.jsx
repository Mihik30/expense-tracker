// src/components/CategoryPieChart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register( ArcElement, Tooltip, Legend, Title );

const CategoryPieChart = ({ chartData }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', },
            title: { display: true, text: 'Expenses by Category', font: { size: 16 } },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) { label += ': '; }
                        if (context.parsed !== null) {
                            label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
    };

    const defaultData = {
        labels: ['No Data'], datasets: [{ label: 'Expenses', data: [1], backgroundColor: ['#cccccc'], borderColor: ['#ffffff'], borderWidth: 1, }],
    };

    return (
        // This div wrapper is handled by the 'chart-card' class in DashboardPage now
        // Adjust height/width directly on the canvas container if needed, or use CSS
         <div className="pie-chart-container" style={{ position: 'relative', height: '100%', width: '100%', minHeight: '280px'}}> {/* Adjust height as needed */}
            <Pie data={chartData && chartData.labels ? chartData : defaultData} options={options} />
         </div>
    );
};

export default CategoryPieChart;