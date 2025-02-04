// import { useState, useEffect } from "react";
// import axios from "axios";

// const App = () => {
//     const [expenses, setExpenses] = useState([]);
//     const [title, setTitle] = useState("");
//     const [amount, setAmount] = useState("");
//     const [date, setDate] = useState("");
//     const [category, setCategory] = useState("");

//     useEffect(() => {
//         fetchExpenses();
//     }, []);

//     const fetchExpenses = async () => {
//         try {
//             const response = await axios.get("http://localhost:5000/expenses");
//             setExpenses(response.data);
//         } catch (error) {
//             console.error("Error fetching expenses:", error);
//         }
//     };

//     // const addExpense = async (e) => {
//     //     e.preventDefault();
//     //     if (!title || !amount || !date) return alert("All fields are required!");

//     //     try {
//     //         const newExpense = { title, amount, date };
//     //         await axios.post("http://localhost:5000/expenses", newExpense);
//     //         fetchExpenses();
//     //         setTitle("");
//     //         setAmount("");
//     //         setDate("");
//     //     } catch (error) {
//     //         console.error("Error adding expense:", error);
//     //     }
//     // };
//     const addExpense = async (e) => {
//       e.preventDefault();
//       if (!title || !amount || !date || !category) return alert("All fields are required!");
  
//       try {
//           const newExpense = { title, amount, date, category };
//           await axios.post("http://localhost:5000/expenses", newExpense);
//           fetchExpenses();
//           setTitle("");
//           setAmount("");
//           setDate("");
//           setCategory("");
//       } catch (error) {
//           console.error("Error adding expense:", error);
//       }
//   };
  

//     const deleteExpense = async (id) => {
//         try {
//             await axios.delete(`http://localhost:5000/expenses/${id}`);
//             fetchExpenses();
//         } catch (error) {
//             console.error("Error deleting expense:", error);
//         }
//     };

//     return (
//         <div className="container">
//             <h1>Expense Tracker</h1>
//             {/* <form onSubmit={addExpense}>
//                 <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
//                 <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
//                 <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
//                 <button type="submit" className="add-expense-btn">Add Expense</button>
//             </form> */}
//             <form onSubmit={addExpense}>
//                 <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
//                 <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
//                 <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                
//                 <select value={category} onChange={(e) => setCategory(e.target.value)}>
//                     <option value="">Select Category</option>
//                     <option value="Food">Food</option>
//                     <option value="Housing">Housing</option>
//                     <option value="Transportation">Transportation</option>
//                     <option value="Entertainment">Entertainment</option>
//                     <option value="Miscellaneous">Miscellaneous</option>
//                 </select>

//                 <button type="submit" className="add-expense-btn">Add Expense</button>
//             </form>


//             <table>
//             <thead>
//                 <tr>
//                     <th>Date</th>
//                     <th>Title</th>
//                     <th>Amount</th>
//                     {/* <th>Type</th> */}
//                     <th>Category</th>
//                     <th>Action</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {expenses.map((expense) => (
//                     <tr key={expense.id}>
//                         <td>{new Date(expense.date).toLocaleDateString("en-GB")}</td>
//                         <td>{expense.title}</td>
//                         <td>₹{Math.floor(expense.amount)}</td>
//                         {/* <td>{expense.type}</td> */}
//                         <td>{expense.category}</td>
//                         <td>
//                             <button onClick={() => deleteExpense(expense.id)}>❌</button>
//                         </td>
//                     </tr>
//                 ))}
//             </tbody>
//         </table>

//             {/* <ul>
//                 {expenses.map((expense) => (
//                     <li key={expense.id}>
//                         {expense.title} - ₹{Math.floor(expense.amount)}
//                         <button onClick={() => deleteExpense(expense.id)}>❌</button>
//                     </li>
//                 ))}
//             </ul> */}
//         </div>
//     );
// };

// export default App;

import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");

    const [loginid, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

    useEffect(() => {
        if (userId) fetchExpenses();
    }, [userId]);

    const fetchExpenses = async () => {
        try {
            const userId = localStorage.getItem("userId"); // Retrieve userId from local storage
            console.log("Fetching expenses for userId:", userId); // Debugging step
    
            if (!userId) {
                console.error("No user ID found!");
                return;
            }
    
            const response = await axios.get(`http://localhost:5000/expenses/${userId}`);
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error.response ? error.response.data : error.message);
        }
    };
    

    const addExpense = async (e) => {
        e.preventDefault();
        if (!title || !amount || !date || !category) return alert("All fields are required!");
    
        const userId = localStorage.getItem("userId"); // Get the logged-in user ID
        console.log("Adding expense for userId:", userId); // Debugging log
    
        if (!userId) {
            alert("User not logged in!");
            return;
        }
    
        try {
            const newExpense = { title, amount, date, category, userId: Number(userId) };

            console.log("Sending expense data:", newExpense); // Debugging log
            await axios.post("http://localhost:5000/expenses", newExpense);
            fetchExpenses();  // Refresh the expense list
            setTitle(""); setAmount(""); setDate(""); setCategory("");
        } catch (error) {
            console.error("Error adding expense:", error.response ? error.response.data : error.message);
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
            window.location.href = "/expenses"; // Redirect to expense tracker
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

                        <button type="submit">Add Expense</button>
                    </form>

                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Category</th>
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
                                    <td>
                                        <button onClick={() => deleteExpense(expense.id)}>❌</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default App;
