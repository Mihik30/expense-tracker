require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.message);
        return;
    }
    console.log("Connected to MySQL Database");
});

// **Register Route**
app.post("/register", (req, res) => {
    const { loginid, password } = req.body;

    // Check if user already exists
    db.query("SELECT * FROM users WHERE loginid = ?", [loginid], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Insert new user
        db.query("INSERT INTO users (loginid, password) VALUES (?, ?)", [loginid, password], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User registered successfully!" });
        });
    });
});

// **Login Route**
app.post("/login", (req, res) => {
    const { loginid, password } = req.body;

    db.query("SELECT id FROM users WHERE loginid = ? AND password = ?", [loginid, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({ userId: result[0].id });
    });
});

// **Get User-Specific Expenses**
app.get("/expenses/:userId", (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    // Use the correct column name from your DB schema
    db.query("SELECT * FROM expenses WHERE user_id = ?", [userId], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(result);
    });
});


// **Add Expense Linked to User**
app.post("/expenses", (req, res) => {
    const { title, amount, date, category, userId } = req.body;

    console.log("Received expense data:", req.body); // Debugging log

    if (!title || !amount || !date || !category || !userId) {
        console.error("Missing fields:", req.body);
        return res.status(400).json({ error: "All fields, including userId, are required" });
    }

    const sql = "INSERT INTO expenses (title, amount, date, category, user_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [title, amount, date, category, userId], (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.json({ message: "Expense added successfully", expenseId: result.insertId });
    });
});

app.post("/expenses", (req, res) => {
    const { title, amount, date, category, payment_method_id, is_recurring, userId } = req.body;

    if (!title || !amount || !date || !category || !payment_method_id || !userId) {
        return res.status(400).json({ error: "All fields, including payment method, are required" });
    }

    const sql = `INSERT INTO expenses (title, amount, date, category, payment_method_id, is_recurring, user_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [title, amount, date, category, payment_method_id, is_recurring, userId], (err, result) => {
        if (err) {
            console.error("Error inserting expense:", err);
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.json({ message: "Expense added successfully!", expenseId: result.insertId });
    });
});



// **Delete Expense**
app.delete("/expenses/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM expenses WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Expense deleted successfully" });
    });
});

// **Start Server**
app.listen(5000, () => {
    console.log("Server running on port 5000");
});

app.post("/income", (req, res) => {
    const { title, amount, date, category, userId } = req.body;
    
    if (!title || !amount || !date || !category || !userId) {
        return res.status(400).json({ error: "All fields must be filled" });
    }

    const sql = "INSERT INTO income (title, amount, date, category, user_id) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [title, amount, date, category, userId], (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.json({ message: "Income added successfully", incomeId: result.insertId });
    });
});

app.get("/income/:userId", (req, res) => {
    const { userId } = req.params;
    db.query("SELECT * FROM income WHERE user_id = ?", [userId], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(result);
    });
});

app.post("/budgets", (req, res) => {
    const { userId, category, limit_amount } = req.body;

    if (!userId || !category || !limit_amount) {
        return res.status(400).json({ error: "All fields must be filled" });
    }

    const sql = "INSERT INTO budgets (user_id, category, limit_amount) VALUES (?, ?, ?)";
    db.query(sql, [userId, category, limit_amount], (err, result) => {
        if (err) {
            console.error("Database insert error:", err);
            return res.status(500).json({ error: "Database insert failed" });
        }
        res.json({ message: "Budget added successfully", budgetId: result.insertId });
    });
});

app.get("/expenses/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const sql = `SELECT id, title, amount, date, category, payment_method_id, is_recurring FROM expenses WHERE user_id = ?`;

        const [rows] = await db.query(sql, [userId]);

        console.log("Fetched Expenses:", rows); // Debugging Step
        res.json(rows);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Error fetching expenses" });
    }
});

app.get("/budgets/:userId", (req, res) => {
    const { userId } = req.params;
    db.query("SELECT * FROM budgets WHERE user_id = ?", [userId], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(result);
    });
});

// Fetch available payment methods
app.get("/payment-methods", (req, res) => {
    db.query("SELECT * FROM payment_methods", (err, result) => {
        if (err) {
            console.error("Error fetching payment methods:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(result);
    });
});
