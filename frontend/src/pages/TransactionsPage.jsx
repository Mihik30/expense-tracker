// src/pages/TransactionsPage.jsx
import React from 'react';

const TransactionsPage = ({
    expenses, income, paymentMethods,
    title, setTitle, amount, setAmount, date, setDate, category, setCategory,
    paymentMethod, setPaymentMethod, addExpense, deleteExpense,
    incomeTitle, setIncomeTitle, incomeAmount, setIncomeAmount, incomeDate, setIncomeDate,
    incomeCategory, setIncomeCategory, addIncome,
    getPaymentMethodName
}) => {
    return (
        <div className="transactions-page"> {/* Optional wrapper */}
            {/* --- Add Expense Form Section --- */}
            <section className="section">
                <h2>Add New Expense</h2>
                <form onSubmit={addExpense}>
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

             {/* --- Expenses List Section --- */}
            <section className="section">
                <h2>Expenses</h2>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Payment</th>
                                <th className="amount-col">Amount</th>
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
                 <div className="table-responsive">
                    <table>
                         <thead>
                             <tr>
                                 <th>Date</th>
                                 <th>Title</th>
                                 <th>Category</th>
                                 <th className="amount-col">Amount</th>
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

            {/* --- Add Income Form Section --- */}
            <section className="section">
                 <h2>Add New Income</h2>
                  <form onSubmit={addIncome}>
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
        </div>
    );
};

export default TransactionsPage;