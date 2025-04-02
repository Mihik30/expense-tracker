// src/components/MonthlySummaryChart.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './MonthlySummaryChart.css'; // We'll create this CSS file

ChartJS.register(ArcElement, Tooltip, Legend);

// Helper to format currency (adjust 'en-IN', 'INR' as needed)
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(value);
};

const MonthlySummaryChart = ({ title, income = 0, expenses = 0 }) => {
    const net = income - expenses;
    const total = income + expenses;
    const incomePercentage = total > 0 ? ((income / total) * 100).toFixed(1) : 0;
    const expensePercentage = total > 0 ? ((expenses / total) * 100).toFixed(1) : 0;

    const chartData = {
        labels: [`Expenses (${expensePercentage}%)`, `Income (${incomePercentage}%)`], // Order to match red/green
        datasets: [
            {
                label: 'Amount',
                data: [expenses, income], // Data order matches labels
                backgroundColor: [
                    '#dc3545', // Red for Expenses
                    '#28a745', // Green for Income
                ],
                borderColor: [
                    '#ffffff', // White border
                    '#ffffff',
                ],
                borderWidth: 2, // Make border visible
                circumference: 360, // Make it a full circle
                cutout: '70%', // Makes it a doughnut chart
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Hide default legend, we show percentages in labels
            },
            tooltip: {
                enabled: false, // Disable default tooltip, data is shown next to chart
            },
        },
        // Disable hover effects if not desired
        events: [],
    };

    return (
        <div className="summary-card">
            <h4>{title}</h4>
            <div className="summary-content">
                <div className="summary-chart-area">
                    {/* Conditionally render chart only if there's data */}
                    {(income > 0 || expenses > 0) ? (
                        <Doughnut data={chartData} options={options} />
                    ) : (
                        <div className="no-data-placeholder">No data</div>
                    )}
                </div>
                <div className="summary-details">
                    <div className="summary-item income">
                        <span className="arrow up">▲</span>
                        <span className="value">{formatCurrency(income)}</span>
                    </div>
                    <div className="summary-item expense">
                        <span className="arrow down">▼</span>
                        {/* Use parentheses or style differently for negative */}
                        <span className="value">{formatCurrency(expenses)}</span>
                    </div>
                    <hr className="summary-divider" />
                    <div className="summary-item net">
                        <span className="value strong">{formatCurrency(net)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlySummaryChart;