import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";


const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState(""); // Missing state
    const [isRecurring, setIsRecurring] = useState(false); // Missing state

    const [incomeTitle, setIncomeTitle] = useState("");
    const [incomeAmount, setIncomeAmount] = useState("");
    const [incomeDate, setIncomeDate] = useState("");
    const [incomeCategory, setIncomeCategory] = useState("");
    const [income, setIncome] = useState([]);
    const [budgets, setBudgets] = useState([]);


    const [loginid, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("userId") || null);


    useEffect(() => {
        if (userId) {
            fetchExpenses();
            fetchIncome();
            fetchBudgets();
        }
    }, [userId]);
    

    const fetchExpenses = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                console.error("No user ID found!");
                return;
            }
    
            const response = await axios.get(`http://localhost:5000/expenses/${userId}`);
            console.log("Fetched Expenses Data:", response.data); // Debugging step
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };
    
    
    
    const addExpense = async (e) => {
        e.preventDefault();
        if (!title || !amount || !date || !category || !paymentMethod) {
            return alert("All fields are required!");
        }
    
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User not logged in!");
            return;
        }
    
        try {
            const newExpense = { 
                title, 
                amount, 
                date, 
                category, 
                userId, 
                payment_method_id: parseInt(paymentMethod), // Convert to integer
                is_recurring: isRecurring ? 'Yes' : 'No' 
            };
            
    
            await axios.post("http://localhost:5000/expenses", newExpense);
            fetchExpenses(); // Refresh list
            setTitle(""); 
            setAmount(""); 
            setDate(""); 
            setCategory(""); 
            setPaymentMethod(""); // Reset state
            setIsRecurring(false);
        } catch (error) {
            console.error("Error adding expense:", error);
        }
    };
    
    
    
    
    const addIncome = async (e) => {
        e.preventDefault();
        if (!incomeTitle || !incomeAmount || !incomeDate || !incomeCategory) return alert("All fields are required!");
    
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User not logged in!");
            return;
        }
    
        try {
            const newIncome = { title: incomeTitle, amount: incomeAmount, date: incomeDate, category: incomeCategory, userId };
            await axios.post("http://localhost:5000/income", newIncome);
            fetchIncome(); // Refresh income list
            setIncomeTitle(""); setIncomeAmount(""); setIncomeDate(""); setIncomeCategory("");
        } catch (error) {
            console.error("Error adding income:", error);
        }
    };
    
    const fetchIncome = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const response = await axios.get(`http://localhost:5000/income/${userId}`);
            setIncome(response.data);
        } catch (error) {
            console.error("Error fetching income:", error);
        }
    };
    
    const fetchBudgets = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) return;
            const response = await axios.get(`http://localhost:5000/budgets/${userId}`);
            setBudgets(response.data);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        }
    };
    
    

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/expenses/${id}`);
            fetchExpenses();
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/login", { loginid, password });
            localStorage.setItem("userId", response.data.userId); // Save userId
            setUserId(response.data.userId); // Update state
        } catch (error) {
            alert("Invalid credentials!");
            console.error("Login error:", error);
        }
    };
    
    

    const handleRegister = async () => {
        if (!loginid || !password) return alert("Please enter login ID and password!");
        try {
            await axios.post("http://localhost:5000/register", { loginid, password });
            alert("User registered successfully! Now login.");
        } catch (error) {
            alert("User already exists!");
        }
    };

    const getPaymentMethodName = (id) => {
        const methods = {
            "1": "Credit Card",
            "2": "Debit Card",
            "3": "Cash",
            "4": "UPI",
            "5": "Net Banking"
        };
        return methods[id] || "Other";
    };
    
    
    

    const handleLogout = () => {
        localStorage.removeItem("userId");
        setUserId(null);
    };

    return (
        <div className="container">
            {!userId ? (
                <div className="auth-container">
                    <h2>Login or Register</h2>
                    <input type="text" placeholder="Login ID" value={loginid} onChange={(e) => setLoginId(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={handleRegister}>Register</button>
                </div>
            ) : (
                <>
                    <h1>Expense Tracker</h1>
                    <button onClick={handleLogout}>Logout</button>

                    <form onSubmit={addExpense}>
                        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            <option value="Food">Food</option>
                            <option value="Housing">Housing</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Miscellaneous">Miscellaneous</option>
                        </select>

                        {/* Payment Method Dropdown */}
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                            <option value="">Select Payment Method</option>
                            <option value="1">Credit Card</option>
                            <option value="2">Debit Card</option>
                            <option value="3">Cash</option>
                            <option value="4">UPI</option>
                            <option value="5">Net Banking</option>
                        </select>





                        {/* Recurring Toggle */}
                        <label>
                            <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} />
                            Recurring Expense
                        </label>

                        <button type="submit">Add Expense</button>
                    </form>

                    <form onSubmit={addIncome}>
                        <input type="text" placeholder="Income Title" value={incomeTitle} onChange={(e) => setIncomeTitle(e.target.value)} />
                        <input type="number" placeholder="Amount" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} />
                        <input type="date" value={incomeDate} onChange={(e) => setIncomeDate(e.target.value)} />

                        <select value={incomeCategory} onChange={(e) => setIncomeCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            <option value="Salary">Salary</option>
                            <option value="Business">Business</option>
                            <option value="Freelance">Freelance</option>
                            <option value="Investment">Investment</option>
                            <option value="Other">Other</option>
                        </select>

                        <button type="submit">Add Income</button>
                    </form>

                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Payment Method</th>
                                <th>Recurring</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{new Date(expense.date).toLocaleDateString("en-GB")}</td>
                                    <td>{expense.title}</td>
                                    <td>₹{Math.floor(expense.amount)}</td>
                                    <td>{expense.category}</td>
                                    <td>{expense.payment_method_id || "N/A"}</td>
                                    <td>{expense.is_recurring ? "Yes" : "No"}</td>
                                    <td>
                                        <button onClick={() => deleteExpense(expense.id)}>❌</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {income.map((inc) => (
                                <tr key={inc.id}>
                                    <td>{new Date(inc.date).toLocaleDateString("en-GB")}</td>
                                    <td>{inc.title}</td>
                                    <td>₹{inc.amount}</td>
                                    <td>{inc.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Limit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets.map((budget) => (
                                <tr key={budget.id}>
                                    <td>{budget.category}</td>
                                    <td>₹{budget.limit_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table> */}

                </>
            )}
        </div>
    );
};

export default App;
