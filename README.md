# Expense Tracker

A simple expense tracker application built with React, Node.js, and MySQL.

## Features

- User authentication (Login/Register)
- Add, view, and delete expenses
- Income tracking
- Budget management
- Recurring payments support
- Different payment methods

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MySQL

---

## Installation

### 1. Clone the Repository

```sh
https://github.com/Mihik30/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup

#### Install Dependencies

```sh
cd backend
npm install
```

#### Configure Database

Update the `config.js` file with your MySQL credentials:

```js
module.exports = {
    host: 'localhost',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'expense_tracker'
};
```

#### Run Server

```sh
node server.js
```

### 3. Frontend Setup

#### Install Dependencies

```sh
cd frontend
npm install
```

#### Start React App

```sh
npm run dev
```

---

## Database Setup

### Create Database

Run the following SQL command in MySQL:

```sql
CREATE DATABASE expense_tracker;
USE expense_tracker;
```

### Create Tables

```sql
-- Database: expense_tracker

-- Users Table
-- Stores user login information.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loginid VARCHAR(50) UNIQUE NOT NULL, -- Unique identifier for login
    password VARCHAR(255) NOT NULL       -- Hashed password storage
);

-- Expenses Table
-- Records individual expense transactions.
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,                 -- Description of the expense
    amount DECIMAL(10,2) NOT NULL,               -- Monetary value of the expense
    date DATE NOT NULL,                          -- Date the expense occurred
    category ENUM('Food', 'Housing', 'Transportation', 'Entertainment', 'Miscellaneous') NOT NULL, -- Expense category
    user_id INT NOT NULL,                        -- Links expense to a user
    payment_method_id ENUM('Cash', 'Credit Card', 'Debit Card', 'UPI', 'Other') NOT NULL, -- Method used for payment
    is_recurring ENUM('Yes', 'No') NOT NULL,     -- Indicates if the expense repeats (final state is ENUM)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Ensures data integrity, deletes expenses if user is deleted
);

-- Income Table
-- Records individual income transactions.
CREATE TABLE income (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,     -- Description or source of income
    amount DECIMAL(10,2) NOT NULL,   -- Monetary value of the income
    date DATE NOT NULL,              -- Date the income was received
    category VARCHAR(100),           -- Optional category for income (e.g., Salary, Bonus)
    user_id INT,                     -- Links income to a user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Ensures data integrity, deletes income if user is deleted
);

-- Budgets Table
-- Stores budget limits per category for each user.
CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,            -- Links budget to a user
    category VARCHAR(100) NOT NULL,  -- Category the budget applies to (should ideally match expense categories)
    limit_amount DECIMAL(10,2) NOT NULL, -- The budget limit amount for the category
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Ensures data integrity, deletes budgets if user is deleted
);

-- Note: The script includes several ALTER TABLE statements modifying columns after initial creation.
-- The definitions above represent the FINAL state of the tables after all commands in the provided script were run.
-- Specifically, `expenses.payment_method_id` and `expenses.is_recurring` were ultimately defined as ENUM types.
-- The `expenses.user_id` column was added, removed, and then re-added as NOT NULL with a Foreign Key.
```

---

## API Endpoints

| Method | Endpoint       | Description                 |
| ------ | -------------- | --------------------------- |
| POST   | /register      | Register a new user         |
| POST   | /login         | Authenticate user           |
| GET    | /expenses      | Get user expenses           |
| POST   | /expenses/add  | Add a new expense           |
| DELETE | /expenses/\:id | Delete an expense           |
| GET    | /income        | Get user income             |
| POST   | /income/add    | Add new income              |
| GET    | /budgets       | Get user budgets            |
| POST   | /budgets/add   | Set a budget for a category |

---

## Future Improvements

- Expense reports & analytics
- Mobile-friendly UI
- Multi-user collaboration

---