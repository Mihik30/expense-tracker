// App.jsx
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

// Import Chart Components
import CategoryPieChart from "./components/CategoryPieChart";
import MonthlySummaryChart from "./components/MonthlySummaryChart"; // <-- Import new component

import "./App.css";

// --- Chart.js specific imports ---
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement,
    LineElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';

// --- Register Chart.js components ---
ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
    ArcElement, Title, Tooltip, Legend
);

// --- Helper Function for Date Calculations ---
const getMonthBoundaries = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 = January)
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Day 0 of next month = last day of current month
    return { startDate, endDate };
};

const App = () => {
    // ... (keep all existing states)
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isRecurring, setIsRecurring] = useState(false);

    const [incomeTitle, setIncomeTitle] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [incomeDate, setIncomeDate] = useState("");
    const [incomeCategory, setIncomeCategory] = useState("");
    const [income, setIncome] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);


    const [loginid, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

    // --- Keep all existing functions ---
    // useEffect, fetchExpenses, addExpense, fetchIncome, addIncome, etc.
     useEffect(() => {
        if (userId) {
            fetchExpenses();
            fetchIncome();
            fetchBudgets();
            fetchPaymentMethods();
        }
    }, [userId]);


    const fetchExpenses = async () => { /* ... no change ... */
         try {
            const userId = localStorage.getItem("userId");
            if (!userId) { console.error("No user ID found!"); return; }
            const response = await axios.get(`http://localhost:5000/expenses/${userId}`);
            setExpenses(response.data);
        } catch (error) { console.error("Error fetching expenses:", error); }
    };
    const fetchPaymentMethods = async () => { /* ... no change ... */
        try {
            const response = await axios.get("http://localhost:5000/payment-methods");
            setPaymentMethods(response.data);
        } catch (error) { console.error("Error fetching payment methods:", error); }
    };
    const addExpense = async (e) => { /* ... no change ... */
        e.preventDefault();
        if (!title || !amount || !date || !category || !paymentMethod) { return alert("All fields are required!"); }
        const userId = localStorage.getItem("userId");
        if (!userId) { alert("User not logged in!"); return; }
        try {
            const newExpense = { title, amount: parseFloat(amount), date, category, userId, payment_method_id: parseInt(paymentMethod), is_recurring: isRecurring ? 'Yes' : 'No' };
            await axios.post("http://localhost:5000/expenses", newExpense);
            fetchExpenses();
            setTitle(""); setAmount(""); setDate(""); setCategory(""); setPaymentMethod(""); setIsRecurring(false);
        } catch (error) { console.error("Error adding expense:", error); }
     };
    const addIncome = async (e) => { /* ... no change ... */
         e.preventDefault();
        if (!incomeTitle || !incomeAmount || !incomeDate || !incomeCategory) return alert("All fields are required!");
        const userId = localStorage.getItem("userId");
        if (!userId) { alert("User not logged in!"); return; }
        try {
            const newIncome = { title: incomeTitle, amount: parseFloat(incomeAmount), date: incomeDate, category: incomeCategory, userId };
            await axios.post("http://localhost:5000/income", newIncome);
            fetchIncome();
            setIncomeTitle(""); setIncomeAmount(""); setIncomeDate(""); setIncomeCategory("");
        } catch (error) { console.error("Error adding income:", error); }
    };
    const fetchIncome = async () => { /* ... no change ... */
         try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const response = await axios.get(`http://localhost:5000/income/${userId}`);
            setIncome(response.data);
        } catch (error) { console.error("Error fetching income:", error); }
    };
    const fetchBudgets = async () => { /* ... no change ... */
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const response = await axios.get(`http://localhost:5000/budgets/${userId}`);
            setBudgets(response.data);
        } catch (error) { console.error("Error fetching budgets:", error); }
    };
    const deleteExpense = async (id) => { /* ... no change ... */
         try {
            await axios.delete(`http://localhost:5000/expenses/${id}`);
            fetchExpenses();
        } catch (error) { console.error("Error deleting expense:", error); }
    };
    const handleLogin = async (e) => { /* ... no change ... */
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/login", { loginid, password });
            localStorage.setItem("userId", response.data.userId);
            setUserId(response.data.userId);
        } catch (error) { alert("Invalid credentials!"); console.error("Login error:", error); }
    };
    const handleRegister = async () => { /* ... no change ... */
         if (!loginid || !password) return alert("Please enter login ID and password!");
        try {
            await axios.post("http://localhost:5000/register", { loginid, password });
            alert("User registered successfully! Now login.");
        } catch (error) { alert("Registration failed. User might already exist or server error."); console.error("Registration error:", error); }
    };
    const getPaymentMethodName = (id) => { /* ... no change ... */
         if (!id && id !== 0) return "N/A";
        const method = paymentMethods.find(method => String(method.id) === String(id));
        return method ? method.name : "Unknown";
    };
    const handleLogout = () => { /* ... no change ... */
         localStorage.removeItem("userId");
        setUserId(null);
        setExpenses([]); setIncome([]); setBudgets([]); setPaymentMethods([]);
        setLoginId(""); setPassword("");
    };

    // --- Data Processing for Category Pie Chart ---
    const getCategoryChartData = (expensesData) => { /* ... no change ... */
        const categoryTotals = {};
        expensesData.forEach(expense => {
            const category = expense.category || 'Uncategorized';
            const amount = parseFloat(expense.amount) || 0;
            if (!categoryTotals[category]) { categoryTotals[category] = 0; }
            categoryTotals[category] += amount;
        });
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#C9CBCF', '#3C4043', '#4CAF50', '#FF5722', '#607D8B'];
        const chartBackgroundColors = labels.map((_, index) => backgroundColors[index % backgroundColors.length]);
        const chartBorderColors = chartBackgroundColors.map(color => `${color}B3`);
        return { labels: labels, datasets: [{ label: 'Expenses by Category', data: data, backgroundColor: chartBackgroundColors, borderColor: chartBorderColors, borderWidth: 1, }], };
    };

    const categoryChartData = useMemo(() => {
        if (!expenses || expenses.length === 0) return null;
        return getCategoryChartData(expenses);
    }, [expenses]);


    // --- Data Processing for Monthly Summary Charts ---
    const calculateMonthlyTotals = (monthOffset = 0) => {
        const now = new Date();
        const targetMonthDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1); // 1st day of target month
        const { startDate, endDate } = getMonthBoundaries(targetMonthDate);

        // console.log(`Calculating for ${monthOffset === 0 ? 'This Month' : 'Last Month'}: ${startDate.toDateString()} - ${endDate.toDateString()}`); // Debugging

        const monthlyExpenses = expenses
            .filter(exp => {
                const expDate = new Date(exp.date);
                return expDate >= startDate && expDate <= endDate;
            })
            .reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);

        const monthlyIncome = income
            .filter(inc => {
                const incDate = new Date(inc.date);
                return incDate >= startDate && incDate <= endDate;
            })
            .reduce((sum, inc) => sum + (parseFloat(inc.amount) || 0), 0);

        // console.log("Monthly Income:", monthlyIncome, "Monthly Expenses:", monthlyExpenses); // Debugging
        return { income: monthlyIncome, expenses: monthlyExpenses };
    };

    const thisMonthTotals = useMemo(() => calculateMonthlyTotals(0), [expenses, income]);
    const lastMonthTotals = useMemo(() => calculateMonthlyTotals(-1), [expenses, income]); // -1 for last month


    return (
        <div className="container">
            {!userId ? (
                 <div className="auth-container">
                     <div className="auth-box">
                         {/* ... Auth form ... */}
                         <h2>Login or Register</h2>
                        <form onSubmit={handleLogin}>
                            <input type="text" placeholder="Login ID" value={loginid} onChange={(e) => setLoginId(e.target.value)} required />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <button type="submit" className="login">Login</button>
                        </form>
                        <button onClick={handleRegister} className="register">Register</button>
                     </div>
                 </div>
            ) : (
                <>
                    <header className="header">
                        <h1>Expense Tracker</h1>
                        <button onClick={handleLogout} className="logout">Logout</button>
                    </header>

                    <main className="main-content">

                        {/* --- NEW: Monthly Summary Section --- */}
                        <section className="section summary-section">
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
                        </section>

                        {/* --- Add Expense Form Section --- */}
                        <section className="section">
                            <h2>Add New Expense</h2>
                             <form onSubmit={addExpense}>
                                {/* ... Expense form inputs ... */}
                                 <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} required step="0.01" min="0"/>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                    <option value="">Category</option>
                                    <option value="Food">Food</option>
                                    <option value="Housing">Housing</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Health">Health</option>
                                    <option value="Miscellaneous">Miscellaneous</option>
                                </select>
                                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
                                    <option value="">Payment Method</option>
                                    {paymentMethods.map((method) => (<option key={method.id} value={method.id}>{method.name}</option>))}
                                </select>
                                <button type="submit">Add Expense</button>
                            </form>
                        </section>

                        {/* --- Category Pie Chart Section --- */}
                        <section className="section chart-section">
                            {categoryChartData ? (
                                <CategoryPieChart chartData={categoryChartData} />
                            ) : (
                                <p className="no-data-text">Add expenses to see category distribution.</p>
                            )}
                        </section>

                        {/* --- Expenses List Section --- */}
                        <section className="section">
                            <h2>Expenses</h2>
                            <div className="table-responsive"> {/* Wrapper for responsiveness */}
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th>Payment</th>
                                            <th className="amount-col">Amount</th> {/* Align amount right */}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.length > 0 ? expenses.map((expense) => (
                                            <tr key={expense.id}>
                                                <td>{new Date(expense.date).toLocaleDateString("en-GB")}</td>
                                                <td>{expense.title}</td>
                                                <td>{expense.category}</td>
                                                <td>{getPaymentMethodName(expense.payment_method_id)}</td>
                                                <td className="amount-col expense-amount">₹{parseFloat(expense.amount).toFixed(2)}</td>
                                                <td>
                                                    <button onClick={() => deleteExpense(expense.id)} title="Delete Expense" className="delete-button">❌</button>
                                                </td>
                                            </tr>
                                        )) : (
                                             <tr><td colSpan="6" className="no-data-text">No expenses recorded yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* --- Income List Section --- */}
                        <section className="section">
                             <h2>Income</h2>
                             <div className="table-responsive"> {/* Wrapper for responsiveness */}
                                <table>
                                     <thead>
                                         <tr>
                                             <th>Date</th>
                                             <th>Title</th>
                                             <th>Category</th>
                                             <th className="amount-col">Amount</th> {/* Align amount right */}
                                         </tr>
                                     </thead>
                                     <tbody>
                                         {income.length > 0 ? income.map((inc) => (
                                             <tr key={inc.id}>
                                                 <td>{new Date(inc.date).toLocaleDateString("en-GB")}</td>
                                                 <td>{inc.title}</td>
                                                 <td>{inc.category}</td>
                                                 <td className="amount-col income-amount">₹{parseFloat(inc.amount).toFixed(2)}</td>
                                             </tr>
                                         )) : (
                                              <tr><td colSpan="4" className="no-data-text">No income recorded yet.</td></tr>
                                         )}
                                     </tbody>
                                 </table>
                             </div>
                         </section>

                        {/* --- MOVED: Add Income Form Section --- */}
                        <section className="section">
                             <h2>Add New Income</h2>
                              <form onSubmit={addIncome}>
                                {/* ... Income form inputs ... */}
                                <input type="text" placeholder="Income Title" value={incomeTitle} onChange={(e) => setIncomeTitle(e.target.value)} required />
                                <input type="number" placeholder="Amount (₹)" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} required step="0.01" min="0"/>
                                <input type="date" value={incomeDate} onChange={(e) => setIncomeDate(e.target.value)} required />
                                <select value={incomeCategory} onChange={(e) => setIncomeCategory(e.target.value)} required>
                                     <option value="">Category</option>
                                     <option value="Salary">Salary</option>
                                     <option value="Business">Business</option>
                                     <option value="Freelance">Freelance</option>
                                     <option value="Investment">Investment</option>
                                     <option value="Other">Other</option>
                                 </select>
                                 <button type="submit">Add Income</button>
                             </form>
                         </section>


                        {/* Keep Budgets section if needed */}

                    </main>
                </>
            )}
        </div>
    );
};

export default App;