// src/pages/DashboardPage.jsx
import React from 'react';
import MonthlySummaryChart from '../components/MonthlySummaryChart';
import CategoryPieChart from '../components/CategoryPieChart';
import Last7DaysChart from '../components/Last7DaysChart';
import BalanceChart from '../components/BalanceChart';
// import './DashboardPage.css'; // CSS should be imported in App.jsx or here

const DashboardPage = ({
    thisMonthTotals,
    lastMonthTotals,
    categoryChartData,
    last7DaysData,
    balanceData
 }) => {
    return (
        <div className="dashboard-page">
            {/* Row 1: Summaries & Pie */}
            <div className="dashboard-row">
                <MonthlySummaryChart
                    title="This Month"
                    income={thisMonthTotals.income}
                    expenses={thisMonthTotals.expenses}
                />
                <MonthlySummaryChart
                    title="Last Month"
                    income={lastMonthTotals.income}
                    expenses={lastMonthTotals.expenses}
                />
                {categoryChartData ? (
                    // Wrap pie chart in a standard chart-card for consistency
                    <div className="chart-card category-pie-card"> {/* Add specific class */}
                        <CategoryPieChart chartData={categoryChartData} />
                    </div>
                 ) : (
                     <div className="chart-card category-pie-card">
                        <p className="no-data-placeholder-chart">Add expenses for category chart.</p>
                     </div>
                 )}
            </div>

            {/* Row 2: Main Charts */}
            <div className="dashboard-row">
                {balanceData ? (
                    <BalanceChart data={balanceData} />
                ) : (
                     <div className="chart-card">
                        <p className="no-data-placeholder-chart">Awaiting data for balance chart.</p>
                     </div>
                )}
                 {last7DaysData ? (
                    <Last7DaysChart data={last7DaysData} />
                ) : (
                     <div className="chart-card">
                        <p className="no-data-placeholder-chart">Awaiting data for 7-day chart.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;