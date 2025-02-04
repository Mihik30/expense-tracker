// // require("dotenv").config();
// // const express = require("express");
// // const mysql = require("mysql2");
// // const cors = require("cors");
// // const bcrypt = require("bcryptjs");

// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // // MySQL Connection
// // const db = mysql.createConnection({
// //     host: process.env.DB_HOST,
// //     user: process.env.DB_USER,
// //     password: process.env.DB_PASSWORD,
// //     database: process.env.DB_NAME,
// // });

// // db.connect((err) => {
// //     if (err) {
// //         console.error("Database connection failed: " + err.message);
// //         return;
// //     }
// //     console.log("Connected to MySQL Database");
// // });

// // // ** Register User**
// // app.post("/register", async (req, res) => {
// //     const { loginid, password } = req.body;
// //     if (!loginid || !password) return res.status(400).json({ error: "All fields are required!" });

// //     try {
// //         const hashedPassword = await bcrypt.hash(password, 10);
// //         db.query("INSERT INTO users (loginid, password) VALUES (?, ?)", [loginid, hashedPassword], (err) => {
// //             if (err) return res.status(500).json({ error: "User already exists or database error" });
// //             res.json({ message: "User registered successfully!" });
// //         });
// //     } catch (error) {
// //         res.status(500).json({ error: "Error hashing password" });
// //     }
// // });

// // // ** Login User**
// // app.post("/login", (req, res) => {
// //     const { loginid, password } = req.body;
// //     db.query("SELECT * FROM users WHERE loginid = ?", [loginid], async (err, results) => {
// //         if (err || results.length === 0) return res.status(401).json({ error: "Invalid login ID or password" });

// //         const user = results[0];
// //         const passwordMatch = await bcrypt.compare(password, user.password);
// //         if (!passwordMatch) return res.status(401).json({ error: "Invalid login ID or password" });

// //         res.json({ message: "Login successful!", userId: user.id });
// //     });
// // });

// // // ** Get Expenses for Logged-in User**
// // app.get("/expenses/:userId", (req, res) => {
// //     const { userId } = req.params;
// //     db.query("SELECT * FROM expenses WHERE user_id = ?", [userId], (err, result) => {
// //         if (err) return res.status(500).json({ error: err.message });
// //         res.json(result);
// //     });
// // });

// // // ** Add Expense (For Logged-in User)**
// // app.post("/expenses", (req, res) => {
// //     const { title, amount, date, userId } = req.body;
// //     db.query("INSERT INTO expenses (title, amount, date, user_id) VALUES (?, ?, ?, ?)", [title, amount, date, userId], (err, result) => {
// //         if (err) return res.status(500).json({ error: err.message });
// //         res.json({ id: result.insertId, title, amount, date, userId });
// //     });
// // });

// // // ** Delete Expense**
// // app.delete("/expenses/:id", (req, res) => {
// //     const { id } = req.params;
// //     db.query("DELETE FROM expenses WHERE id = ?", [id], (err) => {
// //         if (err) return res.status(500).json({ error: err.message });
// //         res.json({ message: "Expense deleted successfully" });
// //     });
// // });

// // // **Start Server**
// // app.listen(5000, () => {
// //     console.log("Server running on port 5000");
// // });


// require("dotenv").config(); 
// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MySQL Connection
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// db.connect((err) => {
//     if (err) {
//         console.error("Database connection failed: " + err.message);
//         return;
//     }
//     console.log("Connected to MySQL Database");
// });

// // API Routes
// app.get("/expenses", (req, res) => {
//     db.query("SELECT * FROM expenses", (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(result);
//     });
// });

// app.post("/expenses", (req, res) => {
//     const { title, amount, date } = req.body;
//     db.query("INSERT INTO expenses (title, amount, date) VALUES (?, ?, ?)", [title, amount, date], (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ id: result.insertId, title, amount, date });
//     });
// });

// app.delete("/expenses/:id", (req, res) => {
//     const { id } = req.params;
//     db.query("DELETE FROM expenses WHERE id = ?", [id], (err) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json({ message: "Expense deleted successfully" });
//     });
// });

// // Start Server
// app.listen(5000, () => {
//     console.log("Server running on port 5000");
// });

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
