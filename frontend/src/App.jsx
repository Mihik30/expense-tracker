import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Layout & Pages ---
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";

// --- Chart Utilities ---
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

// --- CSS ---
import "./App.css";
import "./components/Sidebar.css";
import "./components/Layout.css";
import "./pages/DashboardPage.css";
import "./components/MonthlySummaryChart.css"; // Ensure this is imported
import "./components/ChartCard.css"; // Ensure this is imported

// --- Date Helpers ---
const getMonthBoundaries = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return { startDate, endDate };
};

const formatDateLabel = (date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// --- Auth Form Component (Inline) ---
const AuthForm = ({ onLogin }) => {
    const [loginid, setLoginId] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (loginid && password) {
            onLogin(loginid, password);
        } else {
            alert('Please enter Login ID and Password');
        }
    };

    const handleRegisterClick = async () => {
        if (!loginid || !password) return alert("Please enter login ID and password!");
        try {
            await axios.post("http://localhost:5000/register", { loginid, password });
            alert("User registered successfully! Now login.");
            setLoginId('');
            setPassword('');
        } catch (error) {
            alert("Registration failed. User might already exist or server error.");
            console.error("Registration error:", error);
        }
    };

    return (
        <form onSubmit={handleLoginSubmit}>
            <input
                type="text"
                placeholder="Login ID"
                value={loginid}
                onChange={(e) => setLoginId(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" className="login">Login</button>
            <button type="button" onClick={handleRegisterClick} className="register">Register</button>
        </form>
    );
};


// --- Main App Component ---
function App() {
    // --- State ---
    const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [budgets, setBudgets] = useState([]);

    // Form State
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const [incomeTitle, setIncomeTitle] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [incomeDate, setIncomeDate] = useState("");
    const [incomeCategory, setIncomeCategory] = useState("");

    // --- Fetching Data ---
    const fetchData = useCallback(async () => {
        if (!userId) return;
        try {
            const [expRes, incRes, payRes, budRes] = await Promise.all([
                axios.get(`http://localhost:5000/expenses/${userId}`),
                axios.get(`http://localhost:5000/income/${userId}`),
                axios.get("http://localhost:5000/payment-methods"),
                axios.get(`http://localhost:5000/budgets/${userId}`) // Assuming budgets endpoint exists per user
            ]);
            setExpenses(expRes.data);
            setIncome(incRes.data);
            setPaymentMethods(payRes.data);
            setBudgets(budRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Event Handlers (Mutations) ---
    const addExpense = useCallback(async (e) => {
        e.preventDefault();
        if (!title || !amount || !date || !category || !paymentMethod || !userId) {
            alert("Missing fields or not logged in!"); return;
        }
        try {
            const newExpense = { title, amount: parseFloat(amount), date, category, userId, payment_method_id: parseInt(paymentMethod), is_recurring: false };
            await axios.post("http://localhost:5000/expenses", newExpense);
            fetchData(); // Re-fetch
            setTitle(""); setAmount(""); setDate(""); setCategory(""); setPaymentMethod("");
        } catch (error) { console.error("Error adding expense:", error); alert("Failed to add expense."); }
    }, [title, amount, date, category, paymentMethod, userId, fetchData]);

    const deleteExpense = useCallback(async (id) => {
        if (!userId) return;
        try {
            await axios.delete(`http://localhost:5000/expenses/${id}`);
            fetchData(); // Re-fetch
        } catch (error) { console.error("Error deleting expense:", error); alert("Failed to delete expense."); }
    }, [userId, fetchData]);

    const addIncome = useCallback(async (e) => {
        e.preventDefault();
        if (!incomeTitle || !incomeAmount || !incomeDate || !incomeCategory || !userId) {
            alert("Missing fields or not logged in!"); return;
        }
        try {
            const newIncome = { title: incomeTitle, amount: parseFloat(incomeAmount), date: incomeDate, category: incomeCategory, userId };
            await axios.post("http://localhost:5000/income", newIncome);
            fetchData(); // Re-fetch
            setIncomeTitle(""); setIncomeAmount(""); setIncomeDate(""); setIncomeCategory("");
        } catch (error) { console.error("Error adding income:", error); alert("Failed to add income."); }
    }, [incomeTitle, incomeAmount, incomeDate, incomeCategory, userId, fetchData]);

    // --- Authentication Handlers ---
    const handleLogin = useCallback(async (loginid, password) => {
        try {
            const response = await axios.post("http://localhost:5000/login", { loginid, password });
            localStorage.setItem("userId", response.data.userId);
            setUserId(response.data.userId);
        } catch (error) {
            console.error("Login error:", error);
            alert("Invalid credentials!");
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("userId");
        setUserId(null);
        setExpenses([]); setIncome([]); setPaymentMethods([]); setBudgets([]);
    }, []);

    // --- Utility Functions ---
    const getPaymentMethodName = useCallback((id) => {
        if (!id && id !== 0) return "N/A";
        const method = paymentMethods.find(method => String(method.id) === String(id));
        return method ? method.name : "Unknown";
    }, [paymentMethods]);

    // --- Chart Data Processing ---

    // Monthly Summaries
    const calculateMonthlyTotals = useCallback((monthOffset = 0) => {
        const now = new Date();
        const targetMonthDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
        const { startDate, endDate } = getMonthBoundaries(targetMonthDate);

        const monthlyExpenses = expenses
            .filter(exp => { const expDate = new Date(exp.date); return expDate >= startDate && expDate <= endDate; })
            .reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);

        const monthlyIncome = income
            .filter(inc => { const incDate = new Date(inc.date); return incDate >= startDate && incDate <= endDate; })
            .reduce((sum, inc) => sum + (parseFloat(inc.amount) || 0), 0);

        return { income: monthlyIncome, expenses: monthlyExpenses };
    }, [expenses, income]);

    const thisMonthTotals = useMemo(() => calculateMonthlyTotals(0), [calculateMonthlyTotals]);
    const lastMonthTotals = useMemo(() => calculateMonthlyTotals(-1), [calculateMonthlyTotals]);

    // Category Pie
    const categoryChartData = useMemo(() => {
        if (!expenses || expenses.length === 0) return null;
        const categoryTotals = {};
        expenses.forEach(expense => {
            const category = expense.category || 'Uncategorized';
            const amount = parseFloat(expense.amount) || 0;
            if (!categoryTotals[category]) { categoryTotals[category] = 0; }
            categoryTotals[category] += amount;
        });
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#C9CBCF', '#3C4043', '#4CAF50', '#FF5722', '#607D8B'];
        const chartBackgroundColors = labels.map((_, index) => backgroundColors[index % backgroundColors.length]);
        return { labels: labels, datasets: [{ label: 'Expenses', data: data, backgroundColor: chartBackgroundColors, borderColor: '#ffffff', borderWidth: 1, }], };
    }, [expenses]);

    // Last 7 Days Bar
    const last7DaysData = useMemo(() => {
        if (!expenses || expenses.length === 0) return null;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);

        const dailyTotals = {};
        const labels = [];

        for (let i = 0; i < 7; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            const label = formatDateLabel(day);
            labels.push(label);
            dailyTotals[day.toISOString().split('T')[0]] = 0;
        }

        expenses.forEach(expense => {
            const expDate = new Date(expense.date);
            const expDateOnly = new Date(Date.UTC(expDate.getUTCFullYear(), expDate.getUTCMonth(), expDate.getUTCDate()));
            const startDateOnly = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
            const endDateOnly = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));

            if (expDateOnly >= startDateOnly && expDateOnly <= endDateOnly) {
                const dateString = expDate.toISOString().split('T')[0];
                if (dailyTotals.hasOwnProperty(dateString)) {
                    dailyTotals[dateString] += parseFloat(expense.amount) || 0;
                }
            }
        });

        const data = labels.map((label, index) => {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + index);
            const dateString = day.toISOString().split('T')[0];
            return dailyTotals[dateString] || 0;
        });

        return {
           labels: labels,
           datasets: [{
               label: 'Daily Expenses',
               data: data,
               backgroundColor: 'rgba(220, 53, 69, 0.6)',
               borderColor: 'rgba(220, 53, 69, 1)',
               borderWidth: 1,
           }]
        };
    }, [expenses]);

    // Balance Line Chart
    const balanceData = useMemo(() => {
        if (expenses.length === 0 && income.length === 0) return null;

        const transactions = [
            ...expenses.map(e => ({ date: new Date(e.date), amount: -(parseFloat(e.amount) || 0) })),
            ...income.map(i => ({ date: new Date(i.date), amount: parseFloat(i.amount) || 0 }))
        ].sort((a, b) => a.date - b.date);

        if (transactions.length === 0) return null;

        const balancePoints = {};
        let currentBalance = 0;
        transactions.forEach(t => {
             const dateStr = t.date.toISOString().split('T')[0];
             currentBalance += t.amount;
             balancePoints[dateStr] = currentBalance;
        });

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 59); 
        const labels = [];
        const data = [];
        let lastKnownBalance = 0;

         // Find balance *before* the start date
         const firstTransactionDate = transactions[0].date;
         if(firstTransactionDate < startDate) {
            let balanceBeforeStartDate = 0;
            transactions.forEach(t => { if (t.date < startDate) { balanceBeforeStartDate += t.amount; }});
            lastKnownBalance = balanceBeforeStartDate;
         }

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            labels.push(formatDateLabel(d));
            if (balancePoints.hasOwnProperty(dateStr)) { lastKnownBalance = balancePoints[dateStr]; }
            data.push(lastKnownBalance);
        }

        return {
            labels: labels,
            datasets: [{
                label: 'Balance', data: data, fill: true,
                borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.2)',
                pointBackgroundColor: 'rgb(54, 162, 235)', pointRadius: 2, pointHoverRadius: 5,
                tension: 0.3
            }]
        };
    }, [expenses, income]);

    // --- Render Logic ---
    return (
        <Router>
            {!userId ? (
                <div className="auth-container">
                    <div className="auth-box">
                        <h2>Login or Register</h2>
                        <AuthForm onLogin={handleLogin} />
                    </div>
                </div>
            ) : (
                <Layout handleLogout={handleLogout}>
                    <Routes>
                        <Route index element={
                            <DashboardPage
                                thisMonthTotals={thisMonthTotals}
                                lastMonthTotals={lastMonthTotals}
                                categoryChartData={categoryChartData}
                                last7DaysData={last7DaysData}
                                balanceData={balanceData}
                            />
                        } />
                        <Route path="transactions" element={
                            <TransactionsPage
                                expenses={expenses} income={income} paymentMethods={paymentMethods}
                                title={title} setTitle={setTitle} amount={amount} setAmount={setAmount}
                                date={date} setDate={setDate} category={category} setCategory={setCategory}
                                paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                                addExpense={addExpense} deleteExpense={deleteExpense}
                                incomeTitle={incomeTitle} setIncomeTitle={setIncomeTitle}
                                incomeAmount={incomeAmount} setIncomeAmount={setIncomeAmount}
                                incomeDate={incomeDate} setIncomeDate={setIncomeDate}
                                incomeCategory={incomeCategory} setIncomeCategory={setIncomeCategory}
                                addIncome={addIncome}
                                getPaymentMethodName={getPaymentMethodName}
                             />
                        } />
                        <Route path="*" element={<Navigate to="/" replace />} />
                     </Routes>
                </Layout>
            )}
        </Router>
    );
}

export default App;